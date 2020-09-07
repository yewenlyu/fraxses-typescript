import React from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Upload
} from 'antd';
import {
  InboxOutlined,
  CloudUploadOutlined
} from "@ant-design/icons";

import 'styles/UploadPortal.css';

import UploadController from 'components/UploadController';

const { Option } = Select;

type PropsType = {
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  fileData: File | null;
  uploadName: string;
  serviceType: string;
  uploadInProgress: boolean;
}

class UploadPortal extends React.Component<PropsType, StateType> {

  state: StateType;
  formItemLayout: any;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      fileData: null,
      uploadName: "",
      serviceType: "ev",
      uploadInProgress: false
    };

    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
  }

  uploadControl = (on: boolean) => this.setState({ uploadInProgress: on });
  inputUploadName = (e: any) => this.setState({ uploadName: e.target.value });
  selectService = (value: string) => this.setState({ serviceType: value });
  onSubmit = (values: any) => {
    this.setState({
      uploadName: values.uploadName,
      serviceType: values.service,
      uploadInProgress: true
    });
  };

  loadFile = (e: any) => {
    this.setState({
      fileData: e.file
    });

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {
    return (
      <div className="UploadPortal">
        <Form
          className="upload-portal-form"
          name="upload-portal-form"
          {...this.formItemLayout}
          onFinish={this.onSubmit}
        >
          <Form.Item
            label={this.enzh("Upload Name", "数据名")}
            name="uploadName"
            rules={[
              { required: true, message: this.enzh("An upload name is required to continue", "请输入数据名") }
            ]}
          >
            <Input onChange={this.inputUploadName} placeholder={this.enzh("Custom name for this dataset.", "请自定义数据名")} />
          </Form.Item>

          <Form.Item
            label={this.enzh("Select Service", "选择数据类型")}
            initialValue="ev"
            name="service"
          >
            <Select onChange={this.selectService}>
              <Option value="ev">{this.enzh("EV Operation", "电动汽车运行数据")}</Option>
              <Option value="ess">{this.enzh("ESS Operation", "储能系统分析平台")}</Option>
              <Option value="rd">{this.enzh("Cell Long-term Performance Testing", "电芯循环测试数据")}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={this.enzh("Upload File", "上传数据")}
            rules={[
              { required: true, message: this.enzh("Please upload dataset to continue. ", "请添加数据文件") }
            ]}
          >
            <Form.Item
              name="dragger"
              valuePropName="fileList"
              getValueFromEvent={this.loadFile}
              noStyle
            >
              <Upload.Dragger
                name="files"
                beforeUpload={(file, fileList) => false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  {this.enzh("Click or drag file to this area to upload", "点击或拖拽文件至此区域")}
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6
            }}
          >
            <Button
              className="upload-portal-button"
              type="primary"
              htmlType="submit"
              icon={<CloudUploadOutlined />}
              disabled={
                this.state.fileData === null ? true : false
              }
              loading={
                this.state.uploadInProgress ? true : false
              }
            >
              { this.state.uploadInProgress ?
                this.enzh("Upload In Progress", "上传中") :
                this.enzh("Start Upload", "开始上传")
              }
            </Button>
          </Form.Item>
        </Form>

        { this.state.uploadInProgress ?
          <UploadController
            file={this.state.fileData as File}
            uploadName={this.state.uploadName}
            product={this.state.serviceType}
            uploadControl={this.uploadControl}
            language={this.props.language}
          /> : null
        }
      </div>
    );
  }
}

export default UploadPortal;
