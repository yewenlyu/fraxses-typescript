import React from 'react';
import {
  Modal,
  Table
} from 'antd';

type PropsType = {
  itemName: string;
  historyModalControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

class EVHistoryTable extends React.Component<PropsType, {}> {

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {

    let evHistoryTableColumns = [
      {
        title: this.enzh("Result Number", "分析序号"),
        dataIndex: 'result_number',
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
      },
      {
        title: this.enzh("EV Risk Details", "车辆风险说明"),
        dataIndex: 'ev_details',
        key: 'ev_details',
      },
      {
        title: this.enzh("Battery Analyze Summary", "电芯分析结果"),
        dataIndex: 'battery_summary',
        key: 'battery_summary',
      },
      {
        title: this.enzh("Batttery Risk Details", "电芯风险说明"),
        dataIndex: 'buttery_details',
        key: 'buttery_details',
      },
    ];

    return (
      <div className="EVHistoryTable">
        <Modal
          visible={true}
          centered
          width={window.innerWidth * 0.8}
          title={this.enzh(`EV - ${this.props.itemName} Analyze History`, `车辆 - ${this.props.itemName} 分析历史`)}
          onCancel={() => this.props.historyModalControl(false)}
          footer={null}
        >
          <Table
            dataSource={undefined}
            columns={evHistoryTableColumns}
            pagination={{ pageSize: 15 }}
          />
        </Modal>
      </div>
    );
  }
}

export default EVHistoryTable;
