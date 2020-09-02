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
} from 'antd';

import {
  CloudUploadOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';

import 'styles/DashboardTable.css';

import AlgorithmController from 'components/AlgorithmController';

import * as APIUtils from 'utils/api-utils';

const { Search } = Input;
const { RangePicker } = DatePicker;

type PropsType = {
  tab: string;
  uploadInProgress: boolean;
  drawerControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  fileList: any[];
  filteredFileList: any[];
  algoList: any[];
  algorithmControl: boolean;
  refresh: boolean;
}

type TimeRangeType = [moment.Moment, moment.Moment]

class DashboardTable extends React.Component<PropsType, StateType> {

  state: StateType;
  targetFileId: string;
  timeRange: TimeRangeType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      fileList: [],
      filteredFileList: [],
      algoList: [],
      algorithmControl: false,
      refresh: false
    }

    this.targetFileId = "";
    this.timeRange = [moment(0), moment(0)];
  }

  componentDidMount() {
    this.getFileList();
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    if (this.props.tab !== prevProps.tab ||
      this.props.uploadInProgress !== prevProps.uploadInProgress ||
      this.state.refresh !== prevState.refresh ||
      this.state.algorithmControl !== prevState.algorithmControl
    ) {
      this.getFileList();
    }
  }

  algorithmControl = (on: boolean) => this.setState({ algorithmControl: on });

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
          APIUtils.handleError(response.code, this.props.language);
        }
      })
  }

  refresh = () => {
    this.setState((state, props) => ({
      refresh: !state.refresh
    }));
  }

  onSearch = (value: string) => {
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
      algorithmControl: true
    })
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

  formColumns = [
    {
      title: 'File Name',
      dataIndex: 'upload_name',
      key: 'file_name',
    },
    {
      title: 'File Key',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Upload Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: number) => {
        let current = new Date(text * 1000);
        return <div>{current.toString().split(' ').splice(0, 6).join(' ')}</div>
      }
    },
    {
      title: 'Status',
      dataIndex: 'state',
      key: 'state',
      render: (text: string) => {
        switch (text) {
          case 'uploaded-raw':
            return (<Tag color="cyan">Uploaded</Tag>);
          case 'init':
            return (<Tag color="green">Analyzing</Tag>);
          default:
            return (<Tag color="blue">Complete</Tag>);
        }
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text: any, record: any) => {
        if (record.state === 'uploaded-raw') {
          return (<a href="/#" onClick={e => { this.handleSelectFile(e, record.file_name) }}>Select Algorithm</a>);
        } else if (record.state === 'init') {
          return (<span style={{ color: "#00000040" }}>Analyze in Progress</span>);
        } else {
          return (<a href="/#" onClick={e => { e.preventDefault() }}>View Result</a>);
        }
      },
    },
  ];

  bulkActionMenu = (
    <Menu>
      <Menu.Item key="bulk-choose-algo">Choose Algorithm</Menu.Item>
      <Menu.Item key="bulk-view-result">View Result</Menu.Item>
    </Menu>
  )

  filterPopup = (
    <div>
      <RangePicker
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        allowClear={true}
        disabledDate={(current: moment.Moment) => current > moment().endOf('day')}
        onChange={this.selectTimeRange}
        onOk={this.applyTimeRange}
      />
    </div>
  )

  render() {
    return (
      <div className="DashboardTable">
        <Button
          className="table-button"
          type="primary"
          shape="round"
          icon={<CloudUploadOutlined />}
          onClick={() => this.props.drawerControl(true)}
        >
          New Upload
        </Button>

        <Dropdown overlay={this.bulkActionMenu} trigger={['click']}>
          <Button
            className="table-button"
            shape="round"
            icon={<UnorderedListOutlined />}
          >
            Bulk Action
        </Button>
        </Dropdown>

        <Popover
          placement="bottomLeft"
          content={this.filterPopup}
          destroyTooltipOnHide={true}
          trigger="click"
        >
          <Button
            className="table-button"
            shape="round"
            icon={<FilterOutlined />}
          >
            Filter
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
          Refresh
        </Button>

        <Table
          size="middle"
          rowSelection={{}}
          pagination={{ pageSize: 7 }}
          columns={this.formColumns}
          dataSource={this.state.filteredFileList}
        />
        { this.state.algorithmControl ?
          <AlgorithmController
            targetFileId={this.targetFileId}
            algorithmControl={this.algorithmControl}
            language={this.props.language}
          /> : null
        }
      </div>
    );
  }
}

export default DashboardTable;
