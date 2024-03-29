import React from 'react';
import {
  Modal,
  Table,
  Tag
} from 'antd';

import {
  CheckCircleTwoTone,
  RightSquareTwoTone,
  WarningTwoTone
} from '@ant-design/icons';

type PropsType = {
  itemId: string;
  historyModalControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

class EVHistoryTable extends React.Component<PropsType, {}> {

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  riskSummaryToEnzh = (input: string) => {
    switch (input) {
      case "low":
        return this.enzh("Low Risk", "低风险");
      case "mid":
        return this.enzh("Potential Risk", "中风险");
      case "high":
        return this.enzh("High Risk", "高风险");
    }
  }

  render() {

    let evHistoryTableColumns = [
      {
        title: this.enzh("Result Number", "分析序号"),
        dataIndex: 'key',
        key: 'result_number',
      },
      {
        title: this.enzh("Upload Time", "数据上传时间"),
        dataIndex: 'upload_time',
        key: 'upload_time',
      },
      {
        title: this.enzh("Deliver Time", "分析完成时间"),
        dataIndex: 'deliver_time',
        key: 'deliver_time',
      },
      {
        title: this.enzh("EV Analyze Summary", "车辆分析结果"),
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
        title: this.enzh("EV Risk Details", "车辆风险说明"),
        dataIndex: 'ev_details',
        key: 'ev_details',
        render: (text: any, record: any) => {
          if (record['ev_details'].length === 0) {
            return (<span>-</span>);
          }
          let evDetailsList = record['ev_details'].map((item: any) => (
            <li key={item['key']}>{this.props.language === 'en-us' ? item.detail : item.description}</li>
          ));
          return (<ul style={{ listStyle: "none", paddingLeft: 0 }}>{evDetailsList}</ul>);
        }
      },
      {
        title: this.enzh("Battery Analyze Summary", "电芯分析结果"),
        dataIndex: 'battery_summary',
        key: 'battery_summary',
        render: (text: any, record: any) => {
          if (record['battery_summary'].length === 0) {
            return (<span>-</span>);
          }
          let batterySummaryList = record['battery_summary'].map((item: any) => (
            <li key={item['battery_num'].toString()}>
              {this.enzh(`Battery #${item['battery_num'].toString()} - ${this.riskSummaryToEnzh(item['summary'])}`,
                `${item['battery_num'].toString()}号电芯 - ${this.riskSummaryToEnzh(item['summary'])}`)}
            </li>
          ));
          return (<ul style={{ listStyle: "none", paddingLeft: 0 }}>{batterySummaryList}</ul>);
        }
      },
      {
        title: this.enzh("Batttery Risk Details", "电芯风险说明"),
        dataIndex: 'battery_details',
        key: 'battery_details',
        render: (text: any, record: any) => {
          if (record['battery_details'].length === 0) {
            return (<span>-</span>);
          }
          let batterydetailsList = record['battery_details'].map((item: any) => (
            <li key={item['battery_num'].toString()}>
              {this.enzh(`Battery #${item['battery_num'].toString()}`, `${item['battery_num'].toString()}号电芯`)
                + ' - ' + (this.props.language === 'en-us' ? item.detail : item.description)}
            </li>
          ));
          return (<ul style={{ listStyle: "none", paddingLeft: 0 }}>{batterydetailsList}</ul>);
        }
      },
      {
        title: this.enzh("Attachments", "附件"),
        dataIndex: '',
        key: 'attachments',
        render: (text: any, record: any) => {
          if (record['ev_details'].length === 0) {
            return (<span>-</span>);
          } else {
            return (<a href="/#" onClick={e => e.preventDefault()}>
              {this.enzh("Download Problematic Segment", "问题片段下载")}
            </a>);
          }
        }
      },
      {
        title: this.enzh("Risk Management", "风险处理状态"),
        dataIndex: 'ev_risk_management',
        key: 'ev_risk_management',
        render: (text: any) => {
          switch (text) {
            case 'none':
              return (<span><CheckCircleTwoTone twoToneColor="#bababa"/>{this.enzh(" No Action Required", " 无需处理")}</span>);
            case 'pending':
              return (<span><WarningTwoTone twoToneColor="#fa9629"/>{this.enzh(" Requires Attention", " 待处理")}</span>);
            case 'resolving':
              return (<span><RightSquareTwoTone twoToneColor="#1890ff"/>{this.enzh(" Resolve in Progress", " 处理中")}</span>);
            case 'resolved':
              return (<span><CheckCircleTwoTone twoToneColor="#52c41a"/>{this.enzh(" Issue Resolved", " 已处理")}</span>);
          }
        }
      },
    ];

    return (
      <div className="EVHistoryTable">
        <Modal
          visible={true}
          centered
          width={window.innerWidth * 0.8}
          title={this.enzh(`EV - ${this.props.itemId} Analyze History`, `车辆 - ${this.props.itemId} 分析历史`)}
          onCancel={() => this.props.historyModalControl(false)}
          footer={null}
        >
          <Table
            dataSource={evHistoryTableStaticData}
            columns={evHistoryTableColumns}
            pagination={{ pageSize: 15 }}
          />
        </Modal>
      </div>
    );
  }
}

export default EVHistoryTable;

const evHistoryTableStaticData = [
  {
    key: 5,
    upload_time: "2020/08/03 10:08:08",
    deliver_time: "2020/08/05 10:08:08",
    ev_summary: "high",
    ev_details: [
      {
        key: "isc",
        detail: "Internal short curcuit",
        description: "内短路",
      },
      {
        key: "ce",
        detail: "Contact error",
        description: "接触不良",
      }
    ],
    battery_summary: [
      {
        battery_num: 8,
        summary: "high",
      },
      {
        battery_num: 9,
        summary: "mid",
      }
    ],
    battery_details: [
      {
        battery_num: 8,
        detail: "Lithium plating",
        description: "析锂",
      },
      {
        battery_num: 9,
        detail: "Mechanical degradation",
        description: "机械衰老",
      },
    ],
    ev_risk_management: "resolved",
  },
  {
    key: 4,
    upload_time: "2020/06/01 09:28:08",
    deliver_time: "2020/06/03 23:01:19",
    ev_summary: "mid",
    ev_details: [
      {
        key: "acd",
        detail: "Abnormal capacity degradation",
        description: "容量异常",
      }
    ],
    battery_summary: [
      {
        battery_num: 13,
        summary: "mid",
      }
    ],
    battery_details: [
      {
        battery_num: 13,
        detail: "SEI layer growth",
        description: "SEI膜增厚",
      }
    ],
    ev_risk_management: "resolved",
  },
  {
    key: 3,
    upload_time: "2019/12/15 10:08:08",
    deliver_time: "2019/12/18 08:18:47",
    ev_summary: "low",
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: "none",
  },
  {
    key: 2,
    upload_time: "2019/08/08 14:34:32",
    deliver_time: "2019/08/10 18:28:38",
    ev_summary: "low",
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: "none",
  },
  {
    key: 1,
    upload_time: "2019/03/14 17:27:19",
    deliver_time: "2019/08/10 18:28:38",
    ev_summary: "low",
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: "none",
  },
]
