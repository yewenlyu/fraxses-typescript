import React from 'react';
import AWS from 'aws-sdk';
import SparkMD5 from 'spark-md5';
import { Modal, Steps } from 'antd';

import * as APIUtils from 'utils/api-utils';

const { Step } = Steps;

type PropsType = {
  file: File;
  uploadName: string;
  product: string;
  uploadControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  modalVisible: boolean;
  step: number;
  progress: number;
  err: boolean;
}

class UploadController extends React.Component<PropsType, StateType> {

  constructor(props: PropsType) {
    super(props);
    this.state = {
      modalVisible: false,
      step: 0,
      progress: 0,
      err: false
    };
  }

  componentDidMount = () => {
    let file = this.props.file;
    console.log("File recieved", file)

    this.setState({
      modalVisible: true
    });

    this.getFileMD5(file).then(fileMD5 => {
      let fileKey = fileMD5;
      console.log("MD5 hash complete", fileMD5)
      let file_info = {
        file_key: fileKey,
        file_name: file.name,
        file_size: file.size,
        upload_name: this.props.uploadName,
        product: this.props.product
      }

      APIUtils.post('/api/data/multipart_upload/init', JSON.stringify(file_info))
        .then(response => {
          if (response.code !== 'OK') {
            this.setState({
              err: true
            })
            APIUtils.handleError(response.code, this.props.language);
          } 
          else {
            let awsMetaData = (response as APIUtils.SuccessResponseDataType).data;
            console.log("AWS metadata acquired", awsMetaData)

            let s3Client = this.getS3Client(awsMetaData.authorization);

            this.setState({
              step: 1,
              progress: 0
            });

            try {
              this.uploadFile(s3Client, awsMetaData, file, fileMD5)
            } catch (err) {
              this.setState({ err: true });
              console.warn(err);
            }
          }
        });
    });
  }

  getFileMD5 = async (file: File) => {
    try {
      return await this.md5Hash(file);
    } catch (err) {
      this.setState({ err: true });
      console.log(err);
    }
  }

  md5Hash = (file: File) => {
    return new Promise((resolve, reject) => {
      var blobSlice = File.prototype.slice,
        chunkSize = 5 * 1024 * 1024,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        spark.append(e.target.result);
        currentChunk++;

        this.setState({
          progress: parseFloat((currentChunk / chunks * 100).toFixed(2))
        })

        if (currentChunk < chunks) {
          loadNext();
        } else {
          console.log('finished loading');
          resolve(spark.end());
        }
      };

      fileReader.onerror = () => {
        this.setState({ err: true });
        console.warn('oops, something went wrong.');
      };

      fileReader.onabort = () => {
        console.warn('abort.');
      };

      function loadNext() {
        let start = currentChunk * chunkSize,
          end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
    })
  }

  getS3Client = (cognitoIdentityCredentials: any) => {
    // var identity_provider = cognitoIdentityCredentials.identity_provider;
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

  uploadFile = async (s3Client: any, awsMetaData: any, file: any, fileKey: any) => {
    let uploadConfig = {
      Key: fileKey,
      Bucket: awsMetaData.bucket,
      UploadId: awsMetaData.remote_upload_id
    }

    console.log("Upload configuration generated", uploadConfig);

    let fullPartInfo = await this.uploadPart(s3Client, uploadConfig, awsMetaData.id, file, awsMetaData.parts);
    console.log("Full part infomation generated", fullPartInfo);
    let params = Object.assign({ 'MultipartUpload': fullPartInfo }, uploadConfig);
    console.log("Params genterated", params);
    let result = await this.asyncS3Fetch(s3Client, 'completeMultipartUpload', params);
    console.log("Result params returned", result);
    this.completeUpload(awsMetaData.id, fileKey, result['ETag'], result['Location']);
  }

  uploadPart = async (s3: any, config: any, fileId: any, file: any, parts: any) => {
    return new Promise((resolve, reject) => {

      var blobSlice = File.prototype.slice,
        chunkSize = 5 * 1024 * 1024,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = parts.length > 0 ? parts[parts.length - 1]['part_number'] : 0,
        fileReader = new FileReader(),
        partInfo: any = {
          'Parts': []
        };

      for (var i of parts) {
        partInfo['Parts'].push({
          PartNumber: i['part_number'],
          ETag: i['etag']
        })
      }

      fileReader.onload = async (e: any) => {

        if (currentChunk < chunks) {
          var params = Object.assign({
            Body: new Uint8Array(e.target.result),
            PartNumber: currentChunk + 1,
          }, config);
          let response = await this.asyncS3Fetch(s3, 'uploadPart', params);
          partInfo['Parts'].push({
            PartNumber: params['PartNumber'],
            ETag: response.ETag
          })

          this.recordPart(fileId, params['PartNumber'], response.ETag, params['Body'].length);

          currentChunk++;
          this.setState({
            progress: parseFloat((currentChunk / chunks * 100).toFixed(2))
          });

          loadNext();
        } else {
          console.log('finished loading');
          resolve(partInfo)
        }
      };

      fileReader.onerror = () => {
        this.setState({ err: true });
        console.warn('oops, something went wrong.');
      };

      fileReader.onabort = () => {
        console.warn('abort.');
      };

      function loadNext() {
        var start = currentChunk * chunkSize,
          end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
    })
  }

  recordPart = (fileId: string, partNumber: number, partETag: string, partSize: number) => {
    var requestData = {
      upload_id: fileId,
      part_number: partNumber,
      part_etag: partETag,
      part_size: partSize
    }

    APIUtils.post('/api/data/multipart_upload/add_part', JSON.stringify(requestData))
      .then(response => {
        if (response.code !== 'OK') {
          this.setState({
            err: true
          })
          APIUtils.handleError(response.code, this.props.language);
        }
      })
  }

  completeUpload = (uploadId: string, fileKey: string, etag: string, location: string) => {
    let requestData = {
      upload_id: uploadId,
      file_key: fileKey,
      etag: etag,
      location: location
    }

    APIUtils.post('/api/data/multipart_upload/complete', JSON.stringify(requestData))
      .then(response => {
        if (response.code === 'OK') {
          this.setState({
            step: 3
          });
        } else {
          this.setState({
            err: true
          })
          APIUtils.handleError(response.code, this.props.language);
        }
      })
  }

  asyncS3Fetch = (s3: any, functionName: string, params: any): any => {
    return new Promise((resolve, reject) => {
      s3[functionName](params, (err: any, data: any) => {
        if (err) {
          this.setState({ err: true });
          console.log('error: ', err);
          resolve(err);
        }
        else {
          console.log('data: ', data);
          resolve(data);
        }
      })
    });
  }

  stepDescription = (currentStep: number) => {
    if (this.state.step < currentStep) {
      return this.enzh("Waiting", "等待中...");
    } else if (this.state.step > currentStep) {
      return this.enzh("Finished", "已完成");
    } else {
      return this.enzh("Current Progress: ", "当前进度：") + this.state.progress + "%";
    }
  }

  handleClose = () => {
    this.setState({
      modalVisible: false
    });
    if (this.state.step >= 2) {
      this.props.uploadControl(false);
    }
  }

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {
    return (
      <div className="UploadController">
        <Modal
          visible={this.state.modalVisible}
          centered
          title={this.enzh("Upload Data", "上传数据文件")}
          footer={null}
          onCancel={this.handleClose}
        >
          <Steps
            direction="vertical"
            current={this.state.step}
            percent={this.state.progress}
            status={this.state.err ? "error" : "process"}
          >
            <Step
              title={this.enzh("Processing File", "处理文件")}
              description={this.stepDescription(0)}
            />
            <Step
              title={this.enzh("Uploading File", "上传文件")}
              description={this.stepDescription(1)}
            />
            <Step
              title={this.enzh("Upload Finished", "上传完成")}
              description={this.state.step >= 2 ? this.enzh("You may now close the window.", "您可以关闭此对话框") : this.enzh("Waiting", "等待中...")}
            />
          </Steps>
        </Modal>
      </div>
    );
  }
}

export default UploadController;