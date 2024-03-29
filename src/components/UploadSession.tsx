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
  Upload,
  Modal,
  // Tooltip
} from "antd";
import { FormInstance } from 'antd/lib/form';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import {
  InboxOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  // QuestionCircleOutlined
} from "@ant-design/icons";

import 'styles/uploadSession.css';

import { UploadStateType } from "components/Dashboard";
import AWSUploadController from "components/AWSUploadController";

import * as APIUtils from 'utils/api-utils';

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

type PropsType = {
  uploadDrawer: boolean;
  uploadDrawerControl: (on: boolean) => void;
  uploadInProgress: boolean;
  uploadStateControl: (property: keyof UploadStateType, value: UploadStateType[typeof property]) => void;
  uploadModal: boolean;
  uploadModalControl: (on: boolean) => void;
  tab: string;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  fileData: any;
  fileList: UploadFile<any>[];
  uploadName: string;
  serviceType: string;
  isAccident: boolean;
  unfinishedUpload: boolean;
  unfinishedUploadName: string;
  parallelUpload: boolean;
}

class UploadSession extends React.Component<PropsType, StateType> {

  state: StateType;
  formItemLayout: any;
  formRef: React.RefObject<FormInstance<any>>;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      fileData: null,
      fileList: [],
      uploadName: "",
      serviceType: "ev",
      isAccident: false,
      unfinishedUpload: false,
      unfinishedUploadName: "",
      parallelUpload: true
    };

    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };

    this.formRef = React.createRef<FormInstance>();
  }

  componentDidMount() {
    APIUtils.get('/api/data/upload/list', { product: this.state.serviceType })
      .then(response => {
        if (response.code === 'OK') {
          let uploadList: any[] = (response as APIUtils.SuccessResponseDataType).data.items;
          if (uploadList.length !== 0 && (uploadList[0].state === 'uploading' || uploadList[0].state === 'init')) {
            this.setState({
              unfinishedUpload: true,
              unfinishedUploadName: (uploadList[0].upload_name)
            });

            confirm({
              title: this.enzh(
                `Unfinished upload detected: ${this.state.unfinishedUploadName}`,
                `检测到尚未完成的上传: ${this.state.unfinishedUploadName}`
              ),
              icon: <ExclamationCircleOutlined />,
              content: this.enzh(
                "If you wish to resume the unfinished upload, select the same file and upload again. ",
                "如果您想要继续未完成的上传，请在您的设备上选择该文件并再次点击上传。"
              ),
              onOk: () => {
                this.formRef.current?.setFieldsValue({
                  uploadName: this.state.unfinishedUploadName
                });
              },
              onCancel: () => {
                this.setState({
                  unfinishedUpload: false
                });
              },
              okText: this.enzh("OK", "确定"),
              cancelText: this.enzh("Cancel", "取消"),
              width: 500
            });
          }
        } else {
          APIUtils.promptError(response.code, this.props.language)
        }
      })
  }

  componentDidUpdate(prevProps: PropsType) {
    if (this.props.tab !== prevProps.tab) {
      switch (this.props.tab) {
        case "EV Management":
          this.setState({ serviceType: "ev" });
          break;
        case "ESS Management":
          this.setState({ serviceType: "ess" });
          break;
        case "R&D Management":
          this.setState({ serviceType: "rd" });
          break;
      }
    }
    if (prevProps.uploadInProgress && !this.props.uploadInProgress) {
      this.formRef.current?.resetFields();
      this.setState({
        fileData: null,
        fileList: []
      })
    }
  }

  /** Controller Functions */
  inputUploadName = (e: any) => this.setState({ uploadName: e.target.value });
  selectService = (value: string) => this.setState({ serviceType: value });
  setAccident = (checked: boolean) => this.setState({ isAccident: checked });
  setParallelUpload = (checked: boolean) => this.setState({ parallelUpload: checked });

  beforeUpload = (file: RcFile): boolean => {
    if (this.state.fileList.length >= 1) {
      Modal.info({
        title: this.enzh("Please upload a single dataset", "请上传单个数据包"),
        content: this.enzh("If you would like to upload multiple files or a folder, please compress them to a zip file. ",
          "如果您需要上传多个文件或文件夹，请先将它们压缩为单个文件。"),
        width: 400
      });
    } else {
      this.setState(prevState => ({
        fileList: [...prevState.fileList, file]
      }));
    }
    return false;
  }

  onRemove = (file: UploadFile<any>) => {
    this.setState(prevState => {
      let index = prevState.fileList.indexOf(file);
      let newFileList = prevState.fileList.slice();
      newFileList.splice(index, 1);
      return ({
        fileList: newFileList
      });
    });
  }

  onSubmit = (values: any) => {
    console.log("Recieved values from form:", values);
    this.setState(prevState => ({
      fileData: prevState.fileList[0] as RcFile,
      uploadName: values.uploadName,
      serviceType: values.service
    }));
    this.props.uploadStateControl("inProgress", true);
    this.props.uploadStateControl("fileName", this.state.uploadName);
    this.props.uploadDrawerControl(false);
  }

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {

    let uploadTagOptions = [];
    for (let i = 1; i <= 3; i++) {
      let value = this.state.serviceType.split(' ')[0] + i;
      uploadTagOptions.push(<Option key={value} value={value}>{value}</Option>)
    }

    return (
      <div className="UploadSession">
        <div className="upload-drawer">
          <Drawer
            forceRender={true}
            title={this.enzh("Start New Upload Session", "上传数据")}
            width={720}
            visible={this.props.uploadDrawer}
            onClose={() => this.props.uploadDrawerControl(false)}
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
                  disabled={this.state.fileList.length === 0}
                >
                  {this.enzh("Start Upload", "开始上传")}
                </Button>
                <Button onClick={() => this.props.uploadDrawerControl(false)}>
                  {this.enzh("Cancel", "取消")}
                </Button>
              </div>
            }
          >

            <div className="upload-form">
              <Form name="upload-form"
                ref={this.formRef}
                {...this.formItemLayout}
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

                <Form.Item label={this.enzh("Upload Remarks", "上传备注")} name="note">
                  <TextArea rows={3} placeholder={this.enzh("Description and remarks of this dataset (Optional)", "请提供上传备注（可选）")} />
                </Form.Item>

                <Form.Item
                  label={this.enzh("Select Service", "选择数据类型")}
                  initialValue={APIUtils.ProductsInfo[this.props.tab].productName}
                  name="service"
                >
                  <Select onChange={this.selectService}>
                    <Option value="ev">{this.enzh("EV Operation", "电动汽车运行数据")}</Option>
                    <Option value="ess">{this.enzh("ESS Operation", "储能系统分析平台")}</Option>
                    <Option value="rd">{this.enzh("Cell Long-term Performance Testing", "电芯循环测试数据")}</Option>
                  </Select>
                </Form.Item>

                <Form.Item label={this.enzh("Upload ID Tag", "上传标签")} name="idtag">
                  <Select mode="tags" style={{ width: '100%' }} placeholder={this.enzh("Upload Tag (Optional)", "请为上传数据提供标签（可选）")}>
                    {uploadTagOptions}
                  </Select>
                </Form.Item>

                <Form.Item label={this.enzh("Accident Data", "添加事故数据")} name="isAccident" valuePropName="checked">
                  <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={this.setAccident} />
                </Form.Item>

                <Form.Item label={this.enzh("Accident Date", "事故日期")} name="accidentDate">
                  <DatePicker
                    disabled={!this.state.isAccident}
                    placeholder={this.enzh("Select Date", "选择日期")}
                    disabledDate={current => current.isAfter(moment())} />
                </Form.Item>

                <Form.Item label={this.enzh("Accident Description", "事故描述")} name="accidentNote">
                  <TextArea
                    rows={3}
                    style={{ width: '100%' }}
                    disabled={!this.state.isAccident}
                    placeholder={this.enzh("Relevant infomations about this accident. (Optional)", "请提供相关信息（可选）")} />
                </Form.Item>

                <Form.Item
                  label={this.enzh("Upload File", "上传数据")}
                  rules={[
                    { required: true, message: this.enzh("Please upload dataset to continue. ", "请添加数据文件") }
                  ]}
                >
                  <Form.Item
                    name="dragger"
                    noStyle
                  >
                    <Upload.Dragger
                      name="files"
                      fileList={this.state.fileList}
                      beforeUpload={this.beforeUpload}
                      onRemove={this.onRemove}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        {this.enzh("Click or drag a file to this area to upload", "点击或拖拽单个文件至此区域")}
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Form.Item>
                {/* <Form.Item
                  name="parallel"
                  label={
                    <span>
                      {this.enzh("Parallel Upload ", "多线程上传 ")}
                      <Tooltip
                        placement="bottom"
                        title={
                          this.enzh(`Parallel upload MAY increase your upload speed, if you have enough bandwidth.`,
                            `如果您的网速足够，勾选多线程上传将提升上传速度。`)}
                      >
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  valuePropName="checked"
                >
                  <Switch defaultChecked onChange={this.setParallelUpload} />
                </Form.Item> */}
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
          <AWSUploadController
            file={this.state.fileData}
            uploadName={this.state.uploadName}
            product={this.state.serviceType}
            uploadModal={this.props.uploadModal}
            uploadModalControl={this.props.uploadModalControl}
            uploadStateControl={this.props.uploadStateControl}
            resumeUpload={this.state.unfinishedUpload}
            parallelUpload={this.state.parallelUpload}
            language={this.props.language}
          /> : null
        }

      </div>
    );
  }
}

export default UploadSession;
