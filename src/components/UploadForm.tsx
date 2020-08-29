import React from 'react';
import moment from 'moment';
import {
  DatePicker,
  Form,
  Input,
  Radio,
  Button,
  Select,
  Switch,
  Upload
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

// import UploadController from "./UploadController";
import 'styles/UploadForm.css';

// Ant Design Form Components API: ant.design/components/form/#header

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};

const { TextArea } = Input;
const { Option } = Select;


// function UploadControllerWrapper(props) {
//   if (!props.begin) {
//     return null;
//   }

//   if (!props.file === null) {
//     alert("Please select a file to continue.");
//     return null;
//   }

//   return (
//     <UploadController file={props.file} />
//   );
// }

type PropsType = {
  tab: string;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  isAccident: boolean;
  uploadInProgress: boolean;
  fileData: any;
}

class UploadForm extends React.Component<PropsType, StateType> {

  state: StateType;
  constructor(props: any) {
    super(props);
    this.state = {
      isAccident: false,
      uploadInProgress: false,
      fileData: null
    };
  }

  setAccident = (checked: boolean) => {
    this.setState({ isAccident: checked });
  }

  onSubmit = () => {
    this.setState({
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

  render() {
    return (
      <div className="Upload">
          <div className="upload-form">
            <Form name="validate_other" {...formItemLayout} onFinish={this.onSubmit}>

              <Form.Item label="Upload Name" name="name">
                <Input placeholder="Custom name for this dataset (Optional)" />
              </Form.Item>

              <Form.Item label="Upload Remarks" name="note">
                <TextArea rows={3} placeholder="Description and remarks of this dataset (Optional)" />
              </Form.Item>

              {/* <Form.Item
                label="Select Service"
                name="service"
              // rules={[
              //   { required: true, message: "Please select a service to continue." }
              // ]}
              >
                <Radio.Group>
                  <Radio.Button value="ev">EV Operation</Radio.Button>
                  <Radio.Button value="ess">ESS Operation</Radio.Button>
                  <Radio.Button value="cell">Cell Long-term Performance Testing</Radio.Button>
                </Radio.Group>
              </Form.Item> */}

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

              <Form.Item label="Data Format" name="format">
                <Radio.Group>
                  <Radio.Button value="ev">csv</Radio.Button>
                  <Radio.Button value="ess">mat</Radio.Button>
                </Radio.Group>
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
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    this.state.fileData === null ? true : false
                  }
                  loading={
                    this.state.uploadInProgress ? true : false
                  }
                >
                  {this.state.uploadInProgress ? "Upload In Progress" : "Start Upload"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        {/* <UploadControllerWrapper
          begin={this.state.uploadInProgress}
          file={this.state.fileData}
        /> */}
      </div>
    );
  }
}

export default UploadForm;