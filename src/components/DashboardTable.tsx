import React from 'react';
import moment from 'moment';
import {
  Button,
  Table,
  Tag,
  Input,
  Popover,
  Dropdown,
  Menu,
  DatePicker,
  Tooltip,
  Progress,
  Tabs
} from 'antd';

import {
  CloudUploadOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';

import 'styles/dashboardTable.css';

import { UploadStateType } from 'components/Dashboard';
import AlgorithmController from 'components/AlgorithmController';
import EVHistoryTable from 'components/EVHistoryTable';

import * as APIUtils from 'utils/api-utils';

const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;

type PropsType = {
  tab: string;
  uploadDrawerControl: (on: boolean) => void;
  uploadState: UploadStateType;
  uploadModal: boolean;
  uploadModalControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  tableTab: 'item' | 'file';
  fileList: any[];
  filteredFileList: any[];
  algorithmModal: boolean;
  historyTableModal: boolean;
  refresh: boolean;
}

type TimeRangeType = [moment.Moment, moment.Moment]

class DashboardTable extends React.Component<PropsType, StateType> {

  state: StateType;
  targetFileId: string;
  targetItemId: string;
  timeRange: TimeRangeType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      tableTab: 'item',
      fileList: [],
      filteredFileList: [],
      algorithmModal: false,
      historyTableModal: false,
      refresh: false
    }

    this.targetFileId = "";
    this.targetItemId = "";
    this.timeRange = [moment(0), moment(0)];
  }

  componentDidMount() {
    this.getFileList();
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    if (
      this.props.tab !== prevProps.tab ||
      this.state.refresh !== prevState.refresh ||
      this.state.algorithmModal !== prevState.algorithmModal
    ) {
      this.getFileList();
    }

    if (this.props.uploadModal !== prevProps.uploadModal && this.props.uploadModal) {
      this.setState({
        tableTab: 'file'
      });
      this.getFileList();
    }
  }

  algorithmControl = (on: boolean) => this.setState({ algorithmModal: on });
  tableTabControl = (key: string) => this.setState({ tableTab: (key as 'item' | 'file') });
  historyModalControl = (on: boolean) => this.setState({ historyTableModal: on });


  getFileList = () => {
    let requestParams = {
      product: APIUtils.ProductsInfo[this.props.tab].productName
    }

    APIUtils.get('/api/data/upload/list', requestParams)
      .then(response => {
        if (response.code === 'OK') {
          // assign a unique key for each row of the table
          let uploadList: any[] = (response as APIUtils.SuccessResponseDataType).data.items;
          uploadList.forEach((uploadItem: any) => {
            uploadItem.key = uploadItem.id;
          });
          this.setState({
            fileList: uploadList,
            filteredFileList: uploadList
          })
        } else {
          APIUtils.promptError(response.code, this.props.language);
        }
      })
  }

  refresh = () => {
    this.setState((state, props) => ({
      refresh: !state.refresh
    }));
  }

  onSearch = (value: string) => {
    if (value === "") {
      this.setState({
        filteredFileList: this.state.fileList
      })
    }
    this.setState(state => ({
      filteredFileList: state.filteredFileList.filter(record => record.upload_name.includes(value))
    }));
  }

  handleSelectFile = (e: any, fileName: string) => {
    e.preventDefault();
    let selectedFile = this.state.fileList.find(file => file.file_name === fileName);
    if (selectedFile === undefined) {
      console.warn("Cannot find ", fileName, "in", this.state.fileList);
      return;
    }
    this.targetFileId = selectedFile.id;
    console.log("File selected", this.targetFileId)
    this.setState({
      algorithmModal: true
    })
  }

  handleSelectItem = (e: any, itemId: string) => {
    e.preventDefault();
    this.targetItemId = itemId;
    this.setState({
      historyTableModal: true
    });
  }

  selectTimeRange = (value: any) => {
    this.timeRange = value;
  }

  applyTimeRange = () => {
    console.log("Time range selected: ", this.timeRange);
    this.setState(state => ({
      filteredFileList: state.filteredFileList.filter(record =>
        moment.unix(record.created_at).isBetween(this.timeRange[0], this.timeRange[1]))
    }));
  }

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {

    let bulkActionMenu = (
      <Menu>
        <Menu.Item key="bulk-choose-algo">{this.enzh("Choose Algorithm", "选择算法")}</Menu.Item>
        <Menu.Item key="bulk-view-result">{this.enzh("View Result", "查看结果")}</Menu.Item>
      </Menu>
    );

    let filterPopup = (
      <div>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          ranges={{
            'Today': [moment(), moment()],
            'This Month': [moment().startOf('month'), moment()],
            'This Year': [moment().startOf('year'), moment()]
          }}
          allowClear={true}
          disabledDate={(current: moment.Moment) => current > moment().endOf('day')}
          onChange={this.selectTimeRange}
          onOk={this.applyTimeRange}
        />
      </div>
    );

    let itemTableColumns = [
      {
        title: this.enzh("EV VIN #", "车辆编号"),
        dataIndex: 'ev_name',
        key: 'ev_name',
      },
      {
        title: this.enzh("Upload Time", "最新上传时间"),
        dataIndex: 'ev_time',
        key: 'ev_time',
      },
      {
        title: this.enzh("Status", "最新上传状态"),
        dataIndex: 'ev_status',
        key: 'ev_status',
        render: (text: string, record: any) => {
          switch (text) {
            case 'uploaded':
              return (
                <Tag color="orange">
                  {this.enzh("Pending Analyze", "待分析")}
                </Tag>
              );
            case 'analyzing':
              return (
                <Tag color="cyan">
                  {this.enzh("Analyzing", "分析中")}
                </Tag>
              );
            case 'complete':
              return (
                <Tag color="green">
                  {this.enzh("Result Delivered", "分析完成")}
                </Tag>
              );
          }
        }
      },
      {
        title: this.enzh("Action", "可选操作"),
        dataIndex: '',
        key: 'x',
        render: (text: any, record: any) => {
          switch (record["ev_status"]) {
            case 'complete':
              return (<a href="/#" onClick={e => { this.handleSelectItem(e, record["ev_name"]) }}>{this.enzh("View Result", "查看结果")}</a>);
          }
        }
      },
    ];

    let fileTableColumns = [
      {
        title: this.enzh('File Name', '数据名'),
        dataIndex: 'upload_name',
        key: 'file_name',
      },
      {
        title: this.enzh('File Key', '数据编码'),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: this.enzh('Upload Time', '上传时间'),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 400,
        render: (text: number) => {
          let current = new Date(text * 1000);
          return <div>{current.toString().split(' ').splice(0, 6).join(' ')}</div>
        }
      },
      {
        title: this.enzh('Status', '状态'),
        dataIndex: 'state',
        key: 'state',
        width: 275,
        render: (text: string, record: any) => {
          switch (text) {
            case 'uploaded-raw':
              return (
                <Tag color="cyan">
                  {this.enzh("Uploaded", "上传完成")}
                </Tag>
              );
            case 'init':
            case 'uploading':
              if (this.props.uploadState.inProgress && record.upload_name === this.props.uploadState.fileName) {
                return (
                  <Tooltip title={
                    this.enzh("View upload status", "查看详情")
                  }>
                    <div className="table-progress" onClick={() => this.props.uploadModalControl(true)}>
                      <Progress
                        percent={this.props.uploadState.progress}
                        showInfo={!(this.props.uploadState.step === 1 && this.props.uploadState.progress === 100)}
                        strokeColor={this.props.uploadState.step === 1 && this.props.uploadState.progress === 100 ? "#90ee90" : undefined}
                        size="small"
                        status={this.props.uploadState.error ? "exception" :
                          (this.props.uploadState.step === 2 && this.props.uploadState.progress === 100 ? "success" : "active")}
                      />
                    </div>
                  </Tooltip>
                );
              } else {
                return (
                  <Tooltip title={
                    this.enzh(
                      "To continue an unfinished upload, upload it again",
                      "如果您想要继续未完成的上传，请再次上传该文件"
                    )
                  }>
                    <Tag color="orange">
                      {this.enzh("Upload Cancelled", "上传未完成")}
                    </Tag>
                  </Tooltip>
                );
              }
            default:
              return (
                <Tag color="blue">
                  {this.enzh("Complete", "分析完成")}
                </Tag>
              );
          }
        },
      },
      {
        title: this.enzh('Action', '可选操作'),
        dataIndex: '',
        key: 'x',
        render: (text: any, record: any) => {
          if (record.state === 'uploaded-raw') {
            return (<a href="/#" onClick={e => { this.handleSelectFile(e, record.file_name) }}>{this.enzh("Select Algorithm", "选择算法")}</a>);
          } else if (record.state === 'uploading' || record.state === 'init') {
            return (<span style={{ color: "#00000040" }}>-</span>);
          } else {
            return (<a href="/#" onClick={e => { e.preventDefault() }}>{this.enzh("View Result", "查看结果")}</a>);
          }
        },
      },
    ];

    return (
      <div className="DashboardTable">
        <Tabs defaultActiveKey="item" activeKey={this.state.tableTab} onChange={this.tableTabControl}>
          <TabPane tab={this.enzh("EV Management", "车辆分析管理")} key="item">
            <Button
              className="table-button"
              type="primary"
              shape="round"
              icon={<CloudUploadOutlined />}
              onClick={() => this.props.uploadDrawerControl(true)}
            >
              {
                this.state.fileList[0]?.state !== 'uploading' ?
                  this.enzh("New Upload", "上传数据") :
                  this.enzh("Resume / New Upload", "新建/继续上传")
              }
            </Button>

            <Dropdown overlay={bulkActionMenu} trigger={['click']}>
              <Button
                className="table-button"
                shape="round"
                icon={<UnorderedListOutlined />}
              >
                {this.enzh("Bulk Action", "多选操作")}
              </Button>
            </Dropdown>

            <Popover
              placement="bottomLeft"
              content={filterPopup}
              trigger="click"
            >
              <Button
                className="table-button"
                shape="round"
                icon={<FilterOutlined />}
              >
                {this.enzh("Filter", "筛选")}
              </Button>
            </Popover>

            <Search
              key={this.state.refresh.toString()}
              onSearch={this.onSearch}
              size="small"
              style={{
                width: 200,
                padding: "5px",
              }}
            />

            <Button
              className="table-button refresh"
              shape="round"
              type="link"
              icon={<ReloadOutlined />}
              onClick={this.refresh}
            >
              {this.enzh("Refresh / Clear Filter", "重置")}
            </Button>

            <Table
              size="middle"
              rowSelection={{}}
              pagination={{ pageSize: 7 }}
              columns={itemTableColumns}
              dataSource={itemStaticSource}
            />
          </TabPane>

          <TabPane tab={this.enzh("Upload Management", "上传数据管理")} key="file">
            <Button
              className="table-button"
              type="primary"
              shape="round"
              icon={<CloudUploadOutlined />}
              onClick={() => this.props.uploadDrawerControl(true)}
            >
              {
                this.state.fileList[0]?.state !== 'uploading' ?
                  this.enzh("New Upload", "上传数据") :
                  this.enzh("Resume / New Upload", "新建/继续上传")
              }
            </Button>

            <Dropdown overlay={bulkActionMenu} trigger={['click']}>
              <Button
                className="table-button"
                shape="round"
                icon={<UnorderedListOutlined />}
              >
                {this.enzh("Bulk Action", "多选操作")}
              </Button>
            </Dropdown>

            <Popover
              placement="bottomLeft"
              content={filterPopup}
              trigger="click"
            >
              <Button
                className="table-button"
                shape="round"
                icon={<FilterOutlined />}
              >
                {this.enzh("Filter", "筛选")}
              </Button>
            </Popover>

            <Search
              key={this.state.refresh.toString()}
              onSearch={this.onSearch}
              size="small"
              style={{
                width: 200,
                padding: "5px",
              }}
            />

            <Button
              className="table-button refresh"
              shape="round"
              type="link"
              icon={<ReloadOutlined />}
              onClick={this.refresh}
            >
              {this.enzh("Refresh / Clear Filter", "重置")}
            </Button>

            <Table
              size="middle"
              rowSelection={{}}
              pagination={{ pageSize: 7 }}
              columns={fileTableColumns}
              dataSource={this.state.filteredFileList}
            />
          </TabPane>
        </Tabs>
        {
          this.state.algorithmModal ?
            <AlgorithmController
              targetFileId={this.targetFileId}
              algorithmControl={this.algorithmControl}
              language={this.props.language}
            /> : null
        }
        {
          this.state.historyTableModal ?
            <EVHistoryTable
              itemName={this.targetItemId}
              historyModalControl={this.historyModalControl}
              language={this.props.language}
            /> : null
        }
      </div >
    );
  }
}

const itemStaticSource = [
  {
    key: 1,
    ev_name: 'LNBSCU3H3JG358441',
    ev_time: '2020/10/21 22:24:20',
    ev_status: 'complete',
  },
]

export default DashboardTable;
