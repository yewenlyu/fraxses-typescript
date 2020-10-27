import React from 'react';
import { Tabs } from 'antd';

import 'styles/dashboardTable.css';

import { UploadStateType } from 'components/Dashboard';

import UploadTable from 'components/UploadTable';
import ItemTable from 'components/ItemTable';

const { TabPane } = Tabs;

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
}

class DashboardTables extends React.Component<PropsType, StateType> {

  state: StateType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      tableTab: 'item',
    }
  }

  tableTabControl = (key: string) => this.setState({ tableTab: (key as 'item' | 'file') });

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {
    return (
      <div className="DashboardTables">
        <Tabs defaultActiveKey="item" activeKey={this.state.tableTab} onChange={this.tableTabControl}>
          <TabPane tab={this.enzh("EV Management", "车辆分析管理")} key="item">
            <ItemTable
              uploadDrawerControl={this.props.uploadDrawerControl}
              language={this.props.language}
            />
          </TabPane>

          <TabPane tab={this.enzh("Dataset Management", "批次数据管理")} key="file">
            <UploadTable
              tab={this.props.tab}
              uploadDrawerControl={this.props.uploadDrawerControl}
              uploadState={this.props.uploadState}
              uploadModal={this.props.uploadModal}
              uploadModalControl={this.props.uploadModalControl}
              language={this.props.language}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default DashboardTables;
