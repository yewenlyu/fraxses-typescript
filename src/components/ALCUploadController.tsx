import React from 'react';
import OSS from 'ali-oss';
import SparkMD5 from 'spark-md5';
import {
  Button,
  Modal,
  Progress
} from 'antd';
import { UploadStateType } from "components/Dashboard";

import * as APIUtils from 'utils/api-utils';
import { MinusOutlined } from '@ant-design/icons';

type PropsType = {
  file: File;
  uploadName: string;
  product: string;
  uploadModal: boolean;
  uploadModalControl: (on: boolean) => void;
  uploadStateControl: (property: keyof UploadStateType, value: UploadStateType[typeof property]) => void;
  resumeUpload: boolean;
  parallelUpload: boolean;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  step: number;
  progress: number;
  err: boolean;
  errMessage: string;
}

class ALCUploadController extends React.Component<PropsType, StateType> {

  rawProgress: {
    completed: number;
    total: number;
  }

  constructor(props: PropsType) {
    super(props);
    this.state = {
      step: 0,
      progress: 0,
      err: false,
      errMessage: ""
    };

    this.rawProgress = {
      completed: 0,
      total: 0
    }
  }

  componentDidMount = async () => {

    // Step 1 - MD5 Hash
    let file = this.props.file;
    console.log("File recieved", file)

    this.props.uploadModalControl(true);

    let fileMD5 = await this.md5Hash(file);
    console.log("MD5 hash complete", fileMD5);

    // Step 2 - Initialize OSS Client
    let file_info = {
      file_key: fileMD5,
      file_name: file.name,
      file_size: file.size,
      upload_name: this.props.uploadName,
      product: this.props.product
    }

    let response = await APIUtils.post('/api/data/multipart_upload/init', JSON.stringify(file_info));
    if (response.code !== 'OK') {
      this.setState({
        err: true,
        errMessage: APIUtils.promptError(response.code, this.props.language)
      });
      return;
    }
    let ossMetaData = (response as APIUtils.SuccessResponseDataType).data;
    console.log("ossMetaData retrieved", ossMetaData);
    const ossClient = this.initializeOSSClient(ossMetaData);

    // Step 3 - Upload file
    let millisToMinAndSec = (millis: number): string => {
      let min = Math.floor(millis / 60000);
      let sec = ((millis % 60000) / 1000).toFixed(0);
      return min + "m" + sec + "s";
    }

    try {
      let startTime = performance.now();
      await this.parallelUploadFile(ossClient, ossMetaData, file, fileMD5);
      let endTime = performance.now();
      console.warn("Elapsed time: " + millisToMinAndSec(endTime - startTime));
    } catch (err) {
      this.setState({ err: true });
      console.warn(err);
    }
  }

  componentDidUpdate = (prevProps: PropsType, prevState: StateType) => {
    if (this.state.step !== prevState.step) {
      this.props.uploadStateControl("step", this.state.step);
      this.props.uploadStateControl("progress", this.state.progress);
    }
    if (this.state.step === 1 && this.state.progress !== prevState.progress) {
      this.props.uploadStateControl("progress", this.state.progress);
    }
    if (this.state.err !== prevState.err) {
      this.props.uploadStateControl("error", this.state.err);
    }
  }

  componentWillUnmount = () => {
    this.props.uploadStateControl("fileName", "");
    this.props.uploadStateControl("step", 0);
    this.props.uploadStateControl("progress", 0);
    this.props.uploadStateControl("error", false);
  }

  md5Hash = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      let blobSlice = File.prototype.slice,
        chunkSize = 5 * 1024 * 1024,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

      let loadNext = () => {
        let start = currentChunk * chunkSize,
          end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      fileReader.onload = (e: any) => {
        spark.append(e.target.result);

        currentChunk++;
        this.setState({
          progress: parseFloat((currentChunk / chunks * 100).toFixed(2))
        })

        if (currentChunk < chunks) {
          loadNext();
        } else {
          console.log('MD5Hash: Finished loading');
          resolve(spark.end());
        }
      };

      fileReader.onerror = () => {
        console.warn('MD5Hash: Something went wrong.');
        this.setState({ err: true });
        reject();
      };

      fileReader.onabort = () => {
        console.warn('MD5Hash: Abort.');
        this.setState({ err: true });
        reject();
      };

      loadNext();
    })
  }

  initializeOSSClient = (ossMetaData: any): OSS => {
    let ossConfig = {
      region: ossMetaData['region'],
      //region: 'oss-cn-hangzhou',
      accessKeyId: ossMetaData['authorization']['access_key_id'],
      accessKeySecret: ossMetaData['authorization']['access_key_secret'],
      stsToken: ossMetaData['authorization']['security_token'],
      bucket: ossMetaData['bucket']
    }
    console.log("OSS config generated", ossConfig);
    return new OSS(ossConfig);
  }

  /**
   * The main routine of uploading a single file with multipart upload, Promise.all(promiseQueue)
   * waits for all upload part promise to resolve before calling the complete upload API. 
   * 
   * @param ossClient   The Alibaba Cloud OSS Client
   * @param ossMetaData The OSS Metadata returned from the server
   * @param file        File to be uploaded
   * @param fileKey     File key returned by MD5 hash
   */
  parallelUploadFile = async (ossClient: OSS, ossMetaData: any, file: File, fileKey: string) => {
    this.setState({ step: 1 });

    let uploadConfig = {
      Key: fileKey,
      Bucket: ossMetaData['bucket'],
      UploadId: ossMetaData['id'],                        // file id in fova
      OutFileKey: ossMetaData['out_file_key'],            // file name in oss
      RemoteUploadId: ossMetaData['remote_upload_id']     // file id in oss
    }
    console.log("Upload configuration generated", uploadConfig);

    let completePartsInfo: { number: number; etag: string; }[] = [];
    try {
      let promiseQueue = await this.parallelUploadQueue(ossClient, file, uploadConfig, ossMetaData.parts, completePartsInfo);
      let newPartsInfo = await Promise.all(promiseQueue);
      newPartsInfo.forEach(partInfo => { completePartsInfo.push(partInfo) });
    } catch (err) {
      this.setState({ err: true });
      console.warn(err);
      throw new Error(err);
    }
    completePartsInfo.sort((a, b) => a.number - b.number);
    console.log("Upload complete, complete part infomarions available: ", completePartsInfo);

    try {
      let response = await ossClient.completeMultipartUpload(
        ossMetaData['out_file_key'],
        ossMetaData['remote_upload_id'],
        completePartsInfo
      );
      await this.completeUpload(ossMetaData['id'], fileKey, response.etag);
    } catch (err) {
      this.setState({ err: true });
      console.warn(err);
      throw new Error(err);
    }
  }

  /**
   * This function devides the file into chunk, calls uploadpart on each chunck asynchronously, 
   * while pushing the returned unresolved promise into an array, returns a promise wrapping that array.
   * 
   * @param ossClient           The Alibaba Cloud OSS Client
   * @param uploadConfig        The base configuration for uploading part
   * @param file                File to be uploaded
   * @param uploadedParts       The uploaded part in previous upload sessions returned by OSS client
   * @param completePartsInfo   The complete part info to be passed to complete upload API
   * @returns                   A promise which resolves to an array of pending promises
   */
  parallelUploadQueue = async (
    ossClient: OSS,
    file: File,
    uploadConfig: { Key: string; Bucket: string; OutFileKey: string; UploadId: string; RemoteUploadId: string; },
    uploadedParts: Array<{ part_number: number; etag: string; }>,
    completePartsInfo: Array<{ number: number; etag: string; }>
  ): Promise<Array<Promise<{ number: number, etag: string; }>>> => {

    return new Promise((resolve, reject) => {

      let blobSlice = File.prototype.slice,
        chunkSize = 5 * 1024 * 1024,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        fileReader = new FileReader(),
        start = 0,
        end = 0;

      let uploadedPartsSet: Set<number> = new Set();

      let promiseQueue: Array<Promise<{
        number: number;
        etag: string;
      }>> = [];

      for (let part of uploadedParts) {
        completePartsInfo.push({
          number: part['part_number'],
          etag: part['etag']
        });
        uploadedPartsSet.add(part['part_number'] - 1);
      }

      this.rawProgress.completed = uploadedParts.length;
      this.rawProgress.total = chunks;

      let loadNext = () => {
        while (uploadedPartsSet.has(currentChunk)) {
          currentChunk++;
        }
        start = currentChunk * chunkSize;
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      loadNext();

      fileReader.onload = (e: any) => {
        if (currentChunk < chunks) {
          let uploadPartConfig = {
            PartNumber: currentChunk + 1,
            Start: start,
            End: end,
            Bucket: uploadConfig.Bucket,
            OutFileKey: uploadConfig.OutFileKey,
            RemoteUploadId: uploadConfig.RemoteUploadId
          }
          promiseQueue.push(this.parallelUploadPart(ossClient, file, uploadConfig.UploadId, uploadPartConfig));

          currentChunk++;
          loadNext();
        } else {
          console.log('fileReader: Finished loading');
          console.log("Returning promise queue: ", promiseQueue);
          resolve(promiseQueue);
        }
      };

      fileReader.onerror = () => {
        console.warn('fileReader: Something went wrong.');
        this.setState({
          err: true
        });
        reject();
      };

      fileReader.onabort = () => {
        console.warn('fileReader: Abort.');
        this.setState({
          err: true
        });
        reject();
      };
    });
  }

  /**
   * This function takes a part of file, call ossClient.uploadPart and add_part API sequentially,
   * then returnsa promise containing part infomations, this promise is pushed to the promise array immediately,
   * when called by this.parallelUploadQueue.
   * 
   * @param ossClient         The Alibaba Cloud OSS Client
   * @param outFileKey        File name show in oss
   * @param uploadId          File id in fova
   * @param file              The complete file to be uploaded
   * @param uploadPartConfig  Part upload configurations contains the file data of the current part
   * @returns                 A promise resolves to part infomations
   */
  parallelUploadPart = async (
    ossClient: OSS,
    file: File,
    uploadId: string,
    uploadPartConfig: {
      PartNumber: number;
      Start: number;
      End: number;
      Bucket: string;
      OutFileKey: string;
      RemoteUploadId: string;
    }
  ): Promise<{ number: number, etag: string; }> => {

    try {
      let response = await ossClient.uploadPart(
        uploadPartConfig.OutFileKey,
        uploadPartConfig.RemoteUploadId,
        uploadPartConfig.PartNumber,
        file,
        uploadPartConfig.Start,
        uploadPartConfig.End,
      );
      await this.recordPart(
        uploadId,
        uploadPartConfig.PartNumber,
        response.etag,
        uploadPartConfig.End - uploadPartConfig.Start
      );

      this.rawProgress.completed++;
      this.setState({ progress: parseFloat((this.rawProgress.completed / this.rawProgress.total * 100).toFixed(2)) })

      return { number: uploadPartConfig.PartNumber, etag: response.etag };
    } catch (err) {
      console.warn(err);
      throw new Error(err);
    }
  }

  recordPart = async (fileId: string, partNumber: number, partETag: string, partSize: number) => {
    let requestData = {
      upload_id: fileId,
      part_number: partNumber,
      part_etag: partETag,
      part_size: partSize
    }

    APIUtils.post('/api/data/multipart_upload/add_part', JSON.stringify(requestData))
      .then(response => {
        if (response.code !== 'OK') {
          this.setState({
            err: true,
            errMessage: APIUtils.promptError(response.code, this.props.language)
          });
          throw new Error();
        }
      });
  }

  completeUpload = async (uploadId: string, fileKey: string, etag: string) => {
    let requestData = {
      upload_id: uploadId,
      file_key: fileKey,
      etag: etag
    }

    return APIUtils.post('/api/data/multipart_upload/complete', JSON.stringify(requestData))
      .then(response => {
        if (response.code === 'OK') {
          this.setState({
            step: 2
          });
        } else {
          this.setState({
            err: true,
            errMessage: APIUtils.promptError(response.code, this.props.language)
          })
        }
      })
  }

  handleClose = () => {
    if (this.state.step <= 1) {
      window.location.reload();
      return;
    }
    this.props.uploadModalControl(false);
    this.props.uploadStateControl("inProgress", false);
  }

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {

    let progressDescription = () => {
      if (this.state.err) {
        return (<p>{this.enzh("Upload Error, please retry or contact us. ", "上传失败，请重试或联系管理员。")}</p>);
      }
      if (this.state.step === 0) {
        return (<p>{this.enzh(`Encoding File... ${this.state.progress}%`, `正在加密文件... ${this.state.progress}%`)}</p>);
      }
      if (this.state.step === 1) {
        if (this.state.progress === 100) {
          return (<p>{this.enzh("Uploading File, please wait...", "正在上传文件，请稍候...")}</p>);
        } else {
          return (<p>{this.enzh(`Uploading File... ${this.state.progress}%`, `正在上传文件... ${this.state.progress}%`)}</p>);
        }
      }
      if (this.state.step === 2) {
        return (<p>{this.enzh("Upload Finished.", "上传完成。")}</p>);
      }
      return (<p>{""}</p>);
    }

    let progressSubDescription = () => {
      if (this.state.err) {
        if (this.state.errMessage !== "") {
          return (<p>{this.state.errMessage}</p>)
        }
        return (<p>{this.enzh("Please close this modal and try again.", "请关闭对话框并重试。")}</p>)
      }
      if (this.state.step === 2) {
        return (<p>{this.enzh("You may now leave this page.", "您现在可以安全地离开此页。")}</p>);
      }
      return (<p>{""}</p>);
    }

    let progressStrokeColor = () => {
      if (this.state.err) {
        return "#ffa500";
      }
      if (this.state.step === 0) {
        return "#52c41a";
      } else if (this.state.step === 1) {
        if (this.state.progress === 100) {
          return "#90ee90";
        } else {
          return "#52c41a";
        }
      }
    }

    let progressStatus = () => {
      if (this.state.err) {
        return "exception";
      }
      if (this.state.step <= 1) {
        return "active";
      } else {
        return "success";
      }
    }

    return (
      <div className="ALCUploadController">
        <Modal
          visible={this.props.uploadModal}
          centered
          title={this.enzh("Upload Data", "上传数据文件")}
          maskClosable={false}
          closable={this.state.step === 1 && !this.state.err}
          closeIcon={<MinusOutlined />}
          onCancel={() => this.props.uploadModalControl(false)}
          footer={[
            <Button
              key="primary"
              type={(!this.state.err && this.state.step <= 1) ? "default" : "primary"}
              onClick={this.handleClose}
            >
              {
                (!this.state.err && this.state.step <= 1) ? this.enzh("Cancel", "取消") : this.enzh("Return", "返回")
              }
            </Button>,
            this.state.step === 1 && !this.state.err ?
              <Button
                key="default"
                type="primary"
                onClick={() => this.props.uploadModalControl(false)}
              >
                {this.enzh("Upload in Background", "后台上传")}
              </Button> : null
          ]}
        >
          {progressDescription()}
          <Progress
            status={progressStatus()}
            percent={this.state.progress}
            strokeColor={progressStrokeColor()}
            showInfo={false}
          />
          {progressSubDescription()}

        </Modal>
      </div>
    );
  }
}

export default ALCUploadController;
