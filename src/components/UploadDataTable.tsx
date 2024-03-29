import React from 'react';
import {
  Modal,
  Table,
  Tag,
  Badge
} from 'antd';

import {
  CheckCircleTwoTone,
  RightSquareTwoTone,
  WarningTwoTone
} from '@ant-design/icons';

type PropsType = {
  fileId: string;
  uploadDataModalControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

class UploadDataTable extends React.Component<PropsType, {}> {

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

    let uploadDataTableColumns = [
      {
        title: this.enzh("EV VIN #", "车辆编号"),
        dataIndex: 'ev_id',
        key: 'ev_id',
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
        title: this.enzh("Analyze Summary", "车辆分析结果"),
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
      <div className="UploadDataTable">
        <Modal
          visible={true}
          centered
          width={window.innerWidth * 0.8}
          title={this.props.fileId}
          onCancel={() => this.props.uploadDataModalControl(false)}
          footer={null}
        >
          <Table
            dataSource={uploadDataTableStaticData}
            columns={uploadDataTableColumns}
            pagination={{ pageSize: 10 }}
          />
        </Modal>
      </div>
    );
  }
}

export default UploadDataTable;

const uploadDataTableStaticData = [
  {
    key: 1,
    ev_id: 'LNBSCU3H3JG358441',
    ev_status: 'complete',
    ev_summary: 'high',
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
      },
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
    ev_risk_management: 'resolved',
  },
  {
    key: 2,
    ev_id: 'LNBSCU3H5JR053043',
    ev_status: 'complete',
    ev_summary: 'high',
    ev_details: [
      {
        key: "air",
        detail: "Abnormal internal resistance",
        description: "内阻异常",
      },
    ],
    battery_summary: [
      {
        battery_num: 13,
        summary: "high",
      },
    ],
    battery_details: [
      {
        battery_num: 13,
        detail: "SEI layer growth",
        description: "SEI膜增厚",
      },
    ],
    ev_risk_management: 'resolved',
  },
  {
    key: 3,
    ev_id: 'LNBSCU3H7JR883782',
    ev_status: 'complete',
    ev_summary: 'mid',
    ev_details: [
      {
        key: "acd",
        detail: "Abnormal capacity degradation",
        description: "容量异常",
      },
    ],
    battery_summary: [
      {
        battery_num: 6,
        summary: "mid",
      },
    ],
    battery_details: [
      {
        battery_num: 6,
        detail: "Lithium plating",
        description: "析锂",
      },
    ],
    ev_risk_management: 'pending',
  },
  {
    key: 4,
    ev_id: 'LNBSCU3H5JG304574',
    ev_status: 'complete',
    ev_summary: 'mid',
    ev_details: [
      {
        key: "isc",
        detail: "Internal short circuit",
        description: "内短路",
      },
    ],
    battery_summary: [
      {
        battery_num: 10,
        summary: "mid",
      },
    ],
    battery_details: [
      {
        battery_num: 10,
        detail: "SEI layer growth",
        description: "SEI膜增厚",
      },
    ],
    ev_risk_management: 'pending',
  },
  {
    key: 5,
    ev_id: 'LNBSCU3H8JR052114',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 6,
    ev_id: 'LNBSCU3H2JR884774',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 7,
    ev_id: 'LNBSCU3H5JR053044',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 8,
    ev_id: 'LNBSCU3H2JR874778',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 9,
    ev_id: 'LNBSCU3H9JR054258',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 10,
    ev_id: 'LNBSCU3H2JG353098',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 11,
    ev_id: 'LNBSCU3H8JR884729',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 12,
    ev_id: 'LNBSCU3H8JR884729',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 13,
    ev_id: 'LNBSCU3H8JR884729',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 14,
    ev_id: 'LNBSCU3H5JG352043',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  },
  {
    key: 15,
    ev_id: 'LNBSCU3H2JR884774',
    ev_status: 'complete',
    ev_summary: 'low',
    ev_details: [],
    battery_summary: [],
    battery_details: [],
    ev_risk_management: 'none',
  }
];