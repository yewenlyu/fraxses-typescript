import React from 'react';
import AWS from 'aws-sdk';
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

class AWSUploadController extends React.Component<PropsType, StateType> {

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

    // Step 2 - Initialize S3 Client
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

    let awsMetaData = (response as APIUtils.SuccessResponseDataType).data;
    console.log("AWS metadata acquired", awsMetaData);

    let s3Client = this.getS3Client(awsMetaData.authorization);

    // Step 3 - Upload file
    let millisToMinAndSec = (millis: number): string => {
      let min = Math.floor(millis / 60000);
      let sec = ((millis % 60000) / 1000).toFixed(0);
      return min + "m" + sec + "s";
    }

    try {
      let startTime = performance.now();
      if (this.props.parallelUpload) {
        await this.parallelUploadFile(s3Client, awsMetaData, file, fileMD5);
      } else {
        await this.uploadFile(s3Client, awsMetaData, file, fileMD5)
      }
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

  getS3Client = (cognitoIdentityCredentials: any): AWS.S3 => {
    // let identity_provider = cognitoIdentityCredentials.identity_provider;
    let credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: cognitoIdentityCredentials.identity_pool_id,
      IdentityId: cognitoIdentityCredentials.identity_id,
      Logins: {
        // identity_provider: cognitoIdentityCredentials.token
        'cognito-identity.amazonaws.com': cognitoIdentityCredentials.token
      },
    })

    AWS.config.update({
      credentials: credentials,
      region: cognitoIdentityCredentials.region,
    })

    let s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      maxRetries: 3,
      httpOptions: {
        connectTimeout: 1000 * 10,
        timeout: 1000 * 60 * 10,
      }
    });

    return s3;
  }

  uploadFile = async (s3Client: AWS.S3, awsMetaData: any, file: File, fileKey: string) => {

    this.setState({ step: 1 });

    let uploadConfig = {
      Key: fileKey,
      Bucket: awsMetaData.bucket,
      UploadId: awsMetaData.remote_upload_id
    }
    console.log("Upload configuration generated", uploadConfig);

    let fullPartInfo = await this.uploadPart(s3Client, uploadConfig, awsMetaData.id, file, awsMetaData.parts);
    console.log("Full part infomation generated", fullPartInfo);

    let params = Object.assign({ 'MultipartUpload': fullPartInfo }, uploadConfig);
    let result = await this.asyncS3Fetch(s3Client, 'completeMultipartUpload', params);
    await this.completeUpload(awsMetaData.id, fileKey, result['ETag'], result['Location']);
  }

  uploadPart = async (s3: AWS.S3, config: any, fileId: string, file: File, uploadedParts: Array<any>) => {
    return new Promise((resolve, reject) => {

      let blobSlice = File.prototype.slice,
        chunkSize = 5 * 1024 * 1024,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = uploadedParts.length > 0 ? uploadedParts[uploadedParts.length - 1]['part_number'] : 0,
        fileReader = new FileReader(),
        completePartsInfo: { 'Parts': Array<any> } = {
          'Parts': []
        };

      let loadNext = () => {
        let start = currentChunk * chunkSize,
          end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      for (let part of uploadedParts) {
        completePartsInfo['Parts'].push({
          PartNumber: part['part_number'],
          ETag: part['etag']
        });
      }

      fileReader.onload = async (e: any) => {
        if (currentChunk < chunks) {
          let params = Object.assign({
            Body: new Uint8Array(e.target.result),
            PartNumber: currentChunk + 1,
          }, config);

          let response = await this.asyncS3Fetch(s3, 'uploadPart', params);

          completePartsInfo['Parts'].push({
            PartNumber: params['PartNumber'],
            ETag: response.ETag
          })

          await this.recordPart(fileId, params['PartNumber'], response.ETag, params['Body'].length);

          currentChunk++;
          this.setState({
            progress: parseFloat((currentChunk / chunks * 100).toFixed(2))
          });

          loadNext();
        } else {
          console.log('fileReader: Finished loading');
          resolve(completePartsInfo)
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

      loadNext();
    })
  }

  recordPart = async (fileId: string, partNumber: number, partETag: string, partSize: number, retries = 3) => {
    let requestData = {
      upload_id: fileId,
      part_number: partNumber,
      part_etag: partETag,
      part_size: partSize
    }

    APIUtils.post('/api/data/multipart_upload/add_part', JSON.stringify(requestData))
      .then(response => {
        if (response.code === 'OK') {
          return;
        } else {
          if (retries > 0) {
            return this.recordPart(fileId, partNumber, partETag, partSize, retries - 1);
          } else {
            this.setState({
              err: true,
              errMessage: APIUtils.promptError(response.code, this.props.language)
            });
            throw new Error();
          }
        }
      });
  }

  completeUpload = async (uploadId: string, fileKey: string, etag: string, location: string) => {
    let requestData = {
      upload_id: uploadId,
      file_key: fileKey,
      etag: etag,
      location: location
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

  asyncS3Fetch = (s3: any, functionName: string, params: any, retries = 3): any => {
    return new Promise((resolve, reject) => {
      s3[functionName](params, (err: any, data: any) => {
        if (err) {
          console.warn("S3." + functionName, params, "error: ", err, "retries remain: " + retries);
          if (retries > 0) {
            resolve(this.asyncS3Fetch(s3, functionName, params, retries - 1));
          } else {
            this.setState({ err: true });
            resolve(err);
          }
        }
        else {
          console.log("S3." + functionName, params, "data: ", data);
          resolve(data);
        }
      })
    });
  }

  /**
   * The main routine of uploading a single file with multipart upload, Promise.all(promiseQueue)
   * waits for all upload part promise to resolve before calling the complete upload API. 
   * 
   * @param s3Client    The AWS S3 client metadata
   * @param awsMetaData The upload data returned by AWS
   * @param file        File to be uploaded
   * @param fileKey     File key returned by MD5 hash
   */
  parallelUploadFile = async (s3Client: AWS.S3, awsMetaData: any, file: File, fileKey: string) => {

    this.setState({ step: 1 });

    let uploadConfig = {
      Key: fileKey,
      Bucket: awsMetaData.bucket,
      UploadId: awsMetaData.remote_upload_id
    }
    console.log("Upload configuration generated", uploadConfig);

    let completePartsInfo: { Parts: { PartNumber: number; ETag: string; }[] } = { 'Parts': [] };
    try {
      let promiseQueue = await this.parallelUploadQueue(s3Client, uploadConfig, awsMetaData.id, file,
        awsMetaData.parts, completePartsInfo);
      let newPartsInfo = await Promise.all(promiseQueue);
      newPartsInfo.forEach(partInfo => { completePartsInfo['Parts'].push(partInfo) });
    } catch (err) {
      this.setState({ err: true });
      console.warn(err);
      throw new Error(err);
    }
    completePartsInfo.Parts.sort((a, b) => a.PartNumber - b.PartNumber);
    console.log("Upload complete, complete part infomarions available: ", completePartsInfo);

    let params = Object.assign({ 'MultipartUpload': completePartsInfo }, uploadConfig);
    let result = await this.asyncS3Fetch(s3Client, 'completeMultipartUpload', params);
    await this.completeUpload(awsMetaData.id, fileKey, result['ETag'], result['Location']);
  }

  /**
   * This function devides the file into chunk, calls uploadpart on each chunck asynchronously, 
   * while pushing the returned unresolved promise into an array, returns a promise wrapping that array.
   * 
   * @param s3Client            The AWS S3 client metadata
   * @param uploadConfig        The base configuration for uploading part
   * @param fileId              File Id returned by AWS
   * @param file                File to be uploaded
   * @param uploadedParts       The uploaded part in previous upload sessions returned by AWS client
   * @param completePartsInfo   The complete part info to be passed to complete upload API
   * @returns                   A promise which resolves to an array of pending promises
   */
  parallelUploadQueue = async (s3Client: AWS.S3, uploadConfig: any, fileId: string, file: File,
    uploadedParts: Array<any>, completePartsInfo: { 'Parts': Array<any> }):
    Promise<Array<Promise<{ PartNumber: number; ETag: string; }>>> => {
    return new Promise((resolve, reject) => {
      let blobSlice = File.prototype.slice,
        chunkSize = 5 * 1024 * 1024,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        fileReader = new FileReader();

      let uploadedPartsSet: Set<number> = new Set();

      let promiseQueue: Array<Promise<{
        PartNumber: number;
        ETag: string;
      }>> = [];

      for (let part of uploadedParts) {
        completePartsInfo['Parts'].push({
          PartNumber: part['part_number'],
          ETag: part['etag']
        });
        uploadedPartsSet.add(part['part_number'] - 1);
      }

      this.rawProgress.completed = uploadedParts.length;
      this.rawProgress.total = chunks;

      let loadNext = () => {
        while (uploadedPartsSet.has(currentChunk)) {
          currentChunk++;
        }
        let start = currentChunk * chunkSize,
          end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      loadNext();

      fileReader.onload = (e: any) => {
        if (currentChunk < chunks) {
          let uploadPartConfig = Object.assign({
            Body: new Uint8Array(e.target.result),
            PartNumber: currentChunk + 1,
          }, uploadConfig);

          promiseQueue.push(this.parallelUploadPart(s3Client, fileId, uploadPartConfig));

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
   * This function takes a part of file, call s3.uploadPart and add_part API sequentially, then returns
   * a promise containing part infomations, this promise is pushed to the promise array immediately,
   * when called by this.parallelUploadQueue.
   * 
   * @param s3Client          The AWS S3 client metadata
   * @param fileId            File Id returned by AWS, used for add_part API
   * @param uploadPartConfig  Part upload configurations contains the file data of the current part
   * @returns                 A promise resolves to part infomations
   */
  parallelUploadPart = async (s3Client: AWS.S3, fileId: string, uploadPartConfig: any) => {
    try {
      let response = await this.asyncS3Fetch(s3Client, 'uploadPart', uploadPartConfig);
      await this.recordPart(fileId, uploadPartConfig['PartNumber'], response.ETag, uploadPartConfig['Body'].length);

      this.rawProgress.completed++;
      this.setState({ progress: parseFloat((this.rawProgress.completed / this.rawProgress.total * 100).toFixed(2)) })

      return { PartNumber: uploadPartConfig['PartNumber'], ETag: response.ETag }
    } catch (err) {
      throw new Error(err);
    }
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
        return (<p>{this.enzh(`Processing File... ${this.state.progress}%`, `正在读取文件... ${this.state.progress}%`)}</p>);
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
      <div className="AWSUploadController">
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

export default AWSUploadController;
