import React from 'react';
import moment from 'moment';
import {
  Drawer,
  DatePicker,
  Form,
  Input,
  Button,
  Select,
  Switch,
  Upload
} from "antd";
import { FormInstance } from 'antd/lib/form';
import {
  InboxOutlined,
  CloudUploadOutlined
} from "@ant-design/icons";

import 'styles/Upload.css';

import UploadController from "components/UploadController";

import * as APIUtils from 'utils/api-utils';

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};

type PropsType = {
  drawerVisible: boolean;
  uploadInProgress: boolean;
  drawerControl: (on: boolean) => void;
  uploadControl: (on: boolean) => void;
  tab: string;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  fileData: any;
  uploadName: string;
  serviceType: string;
  isAccident: boolean;
}

class UploadSession extends React.Component<PropsType, StateType> {

  state: StateType;
  constructor(props: any) {
    super(props);
    this.state = {
      fileData: null,
      uploadName: "",
      serviceType: this.props.tab,
      isAccident: false
    };
  }

  inputUploadName = (e: any) => this.setState({ uploadName: e.target.value });
  setAccident = (checked: boolean) => this.setState({ isAccident: checked });
  onSubmit = (values: any) => {
    console.log("Recieved values from form:", values);
    this.setState({
      uploadName: values.uploadName,
      serviceType: values.service
    })
    this.props.uploadControl(true);
    this.props.drawerControl(false);
  }

  loadFile = (e: any) => {
    this.setState({
      fileData: e.file
    });

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  formRef = React.createRef<FormInstance>();

  render() {
    return (
      <div className="Upload">
        <div className="upload-drawer">
          <Drawer
            title="Start New Upload Session"
            width={720}
            visible={this.props.drawerVisible}
            onClose={() => this.props.drawerControl(false)}
            destroyOnClose={true}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
              <div
                style={{
                  textAlign: 'left',
                }}
              >
                <Button
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    this.formRef.current?.validateFields()
                    .then(this.onSubmit)
                    .catch(errorInfo => {
                      console.warn("Form validation error: ", errorInfo);
                    })
                  }}
                  disabled={
                    !this.state.fileData || this.state.uploadName === ""
                  }
                >
                  Start Upload
                </Button>
                <Button onClick={() => this.props.drawerControl(false)}>
                  Cancel
                </Button>
              </div>
            }
          >

            <div className="upload-form">
              <Form name="validate_other"
                {...formItemLayout}
                ref={this.formRef}
              >

                <Form.Item
                  label="Upload Name"
                  name="uploadName"
                  rules={[
                    { required: true, message: "An upload name is required to continue" }
                  ]}
                >
                  <Input onChange={this.inputUploadName} placeholder="Custom name for this dataset. " />
                </Form.Item>

                <Form.Item label="Upload Remarks" name="note">
                  <TextArea rows={3} placeholder="Description and remarks of this dataset (Optional)" />
                </Form.Item>

                <Form.Item
                  label="Select Service"
                  initialValue={APIUtils.ProductsInfo[this.props.tab].productName}
                  name="service"
                >
                  <Select>
                    <Option value="ev">EV Operation</Option>
                    <Option value="ess">ESS Operation</Option>
                    <Option value="rd">Cell Long-term Performance Testing</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Upload ID Tag" name="idtag">
                  <Select mode="tags" style={{ width: '100%' }} placeholder="Upload Tag (Optional)">
                    <Option key="ev1" value="EV1">EV1</Option>
                    <Option key="ess1" value="ESS1">ESS1</Option>
                    <Option key="cb1" value="Cell Batch 1">Cell Batch 1</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Accident Data" name="isAccident" valuePropName="checked">
                  <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={this.setAccident} />
                </Form.Item>

                <Form.Item label="Accident Date" name="accidentDate">
                  <DatePicker
                    disabled={!this.state.isAccident}
                    disabledDate={current => current.isAfter(moment())} />
                </Form.Item>

                <Form.Item label="Accident Description" name="accidentNote">
                  <TextArea
                    rows={3}
                    style={{ width: '100%' }}
                    disabled={!this.state.isAccident}
                    placeholder="Relevant infomations about this accident. (Optional)" />
                </Form.Item>

                <Form.Item
                  label="Upload File"
                  rules={[
                    { required: true, message: "Please upload dataset to continue. " }
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
                        Click or drag file to this area to upload
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
                </Form.Item>
              </Form>
            </div>
          </Drawer>
        </div>

        { this.props.uploadInProgress ?
          <UploadController
            file={this.state.fileData}
            uploadName={this.state.uploadName}
            product={this.state.serviceType}
            uploadControl={this.props.uploadControl}
            language={this.props.language}
          /> : null
        }

      </div>
    );
  }
}

export default UploadSession;