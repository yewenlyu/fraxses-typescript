import React from 'react';
import {
  Table,
  Button,
  Badge,
  Tag,
  Input
} from 'antd';
import {
  CloudUploadOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';

import EVHistoryTable from 'components/EVHistoryTable';

const { Search } = Input;

type PropsType = {
  uploadDrawerControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  historyTableModal: boolean;
}

class ItemTable extends React.Component<PropsType, StateType> {

  targetItemId: string;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      historyTableModal: false
    }

    this.targetItemId = "";
  }

  historyModalControl = (on: boolean) => this.setState({ historyTableModal: on });

  handleSelectItem = (e: any, itemId: string) => {
    e.preventDefault();
    this.targetItemId = itemId;
    this.setState({
      historyTableModal: true
    });
  }

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {

    let itemTableColumns = [
      {
        title: this.enzh("EV VIN #", "车辆编号"),
        dataIndex: 'ev_id',
        key: 'ev_id',
      },
      {
        title: this.enzh("Upload Time", "上传时间"),
        dataIndex: 'ev_time',
        key: 'ev_time',
      },
      {
        title: this.enzh("Analyze Status", "分析状态"),
        dataIndex: 'ev_status',
        key: 'ev_status',
        render: (text: string, record: any) => {
          switch (text) {
            case 'uploaded':
              return (
                <Badge status="default" text={this.enzh("Pending Analyze", "待分析")} />
              );
            case 'analyzing':
              return (
                <Badge status="processing" text={this.enzh("Analyzing", "分析中")} />
              );
            case 'complete':
              return (
                <Badge status="success" text={this.enzh("Result Delivered", "分析完成")} />
              );
          }
        }
      },
      {
        title: this.enzh("Analyze Summary", "风险状态"),
        dataIndex: 'ev_summary',
        key: 'ev_summary',
        render: (text: any, record: any) => {
          switch (text) {
            case 'low':
              return (<Tag color="green">{this.enzh("Low Risk", "低风险")}</Tag>);
            case 'mid':
              return (<Tag color="orange">{this.enzh("Potential Risk", "中风险")}</Tag>);
            case 'high':
              return (<Tag color="red">{this.enzh("High Risk", "高风险")}</Tag>);
          }
        }
      },
      {
        title: this.enzh("Action", "可选操作"),
        dataIndex: '',
        key: 'x',
        render: (text: any, record: any) => {
          switch (record["ev_status"]) {
            case 'uploaded':
              return [
                (<a href="/#" onClick={e => { this.handleSelectItem(e, record["ev_id"]) }}>{this.enzh("View Result", "查看详情")}</a>),
                (<span>&nbsp;&nbsp;</span>),
                (<a href="/#" onClick={e => e.preventDefault()}>{this.enzh("Start Analyze", "开始分析")}</a>),
              ];
            case 'analyzing':
              return [
                (<a href="/#" onClick={e => { this.handleSelectItem(e, record["ev_id"]) }}>{this.enzh("View Result", "查看详情")}</a>),
                (<span>&nbsp;&nbsp;</span>),
                (<a href="/#" onClick={e => e.preventDefault()}>{this.enzh("Pause Analyze", "停止分析")}</a>),
              ];
            case 'complete':
              return (<a href="/#" onClick={e => { this.handleSelectItem(e, record["ev_id"]) }}>{this.enzh("View Result", "查看详情")}</a>);
          }
        }
      },
    ];

    return (
      <div className="ItemTable">
        <Button
          className="table-button"
          type="primary"
          shape="round"
          icon={<CloudUploadOutlined />}
          onClick={() => this.props.uploadDrawerControl(true)}
        >
          {this.enzh("New Upload", "上传数据")}
        </Button>

        <Button
          className="table-button"
          shape="round"
          icon={<UnorderedListOutlined />}
        >
          {this.enzh("Bulk Action", "多选操作")}
        </Button>

        <Button
          className="table-button"
          shape="round"
          icon={<FilterOutlined />}
        >
          {this.enzh("Filter", "筛选")}
        </Button>

        <Search
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
        >
          {this.enzh("Refresh / Clear Filter", "重置")}
        </Button>

        <Table
          size="middle"
          rowSelection={{}}
          pagination={{ pageSize: 8 }}
          columns={itemTableColumns}
          dataSource={itemStaticSource}
        />
        {
          this.state.historyTableModal ?
            <EVHistoryTable
              itemId={this.targetItemId}
              historyModalControl={this.historyModalControl}
              language={this.props.language}
            /> : null
        }
      </div>
    );
  }
}

export default ItemTable;

const itemStaticSource = [
  {
    key: 1,
    ev_id: 'LNBSCU3H3JG358441',
    ev_time: '2020/10/21 22:24:20',
    ev_status: 'uploaded',
    ev_summary: 'mid',
  },
  {
    key: 2,
    ev_id: 'LNBSCU3H5JR053043',
    ev_time: '2020/10/19 12:16:09',
    ev_status: 'analyzing',
    ev_summary: 'high',
  },
  {
    key: 3,
    ev_id: 'LNBSCU3H7JR883782',
    ev_time: '2020/10/19 12:16:09',
    ev_status: 'analyzing',
    ev_summary: 'high',
  },
  {
    key: 4,
    ev_id: 'LNBSCU3H5JG304574',
    ev_time: '2020/10/19 12:16:09',
    ev_status: 'analyzing',
    ev_summary: 'low',
  },
  {
    key: 5,
    ev_id: 'LNBSCU3H8JR052114',
    ev_time: '2020/10/18 20:16:11',
    ev_status: 'analyzing',
    ev_summary: 'low',
  },
  {
    key: 6,
    ev_id: 'LNBSCU3H2JR884774',
    ev_time: '2019/11/13 22:24:20',
    ev_status: 'complete',
    ev_summary: 'low',
  },
  {
    key: 7,
    ev_id: 'LNBSCU3H8JR052114',
    ev_time: '2019/10/23 22:24:20',
    ev_status: 'complete',
    ev_summary: 'low',
  },
  {
    key: 8,
    ev_id: 'LNBSCU3H2JG353098',
    ev_time: '2019/10/10 22:24:20',
    ev_status: 'complete',
    ev_summary: 'low',
  },
  {
    key: 9,
    ev_id: 'LNBSCU3H8JR884729',
    ev_time: '2019/10/10 22:24:20',
    ev_status: 'complete',
    ev_summary: 'low',
  },
  {
    key: 9,
    ev_id: 'LNBSCU3H8JR884729',
    ev_time: '2019/10/10 22:24:20',
    ev_status: 'complete',
    ev_summary: 'low',
  },
  {
    key: 9,
    ev_id: 'LNBSCU3H8JR884729',
    ev_time: '2019/10/10 22:24:20',
    ev_status: 'complete',
    ev_summary: 'low',
  },
]
