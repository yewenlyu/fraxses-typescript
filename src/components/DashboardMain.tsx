import React from 'react';
import {
  PageHeader,
  Button,
  Descriptions,
  Tag,
  Badge,
} from 'antd';
import {
  ExportOutlined,
  BellOutlined
} from '@ant-design/icons';

import 'styles/dashboardMain.css';

import { UploadStateType } from 'components/Dashboard';
import DashboardCharts from 'components/DashboardCharts';
import DashboardTables from 'components/DashboardTables';

type PropsType = {
  tab: string;
  userInfo: any;
  uploadDrawerControl: (on: boolean) => void;
  uploadState: UploadStateType;
  uploadModal: boolean;
  uploadModalControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

class DashboardMain extends React.Component<PropsType> {

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  zhtab = (english: string): string => {
    switch (english) {
      case "EV Management":
        return "电动汽车分析平台";
      case "ESS Management":
        return "储能系统分析平台";
      case "R&D Management":
        return "电池研发测试分析平台";
      default:
        return "";
    }
  }

  render() {
    return (
      <div className="DashboardMain">
        <PageHeader
          ghost={false}
          title={this.enzh(this.props.tab, this.zhtab(this.props.tab))}
          tags={<Tag color="orange">Admin</Tag>}
          subTitle={
            this.enzh(`Manage ${this.props.tab.split(' ')[0]} upload items`,
              `管理${this.zhtab(this.props.tab).slice(0, this.zhtab(this.props.tab).length - 2)}数据`)
          }
          extra={[
            <Button
              key="upload-button"
              type="primary"
              shape="round"
              icon={<ExportOutlined />}
            >
              {this.enzh("Export", "导出结果")}
            </Button>,
            <Badge dot
              key="notification-badge">
              <Button
                key="notification-button"
                shape="circle"
                icon={<BellOutlined />}
              />
            </Badge>
          ]}
          style={{
            padding: '0px 5px 15px'
          }}
        >
          <Descriptions size="small" column={3} style={{ paddingTop: "3px" }}>
            <Descriptions.Item label={this.enzh("Owner", "用户")}>
              {this.props.userInfo.name}
            </Descriptions.Item>
            <Descriptions.Item label={this.enzh("Affiliation", "编号")}>
              {this.props.userInfo.id}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <DashboardCharts
          language={this.props.language}
        />
        <DashboardTables
          tab={this.props.tab}
          uploadDrawerControl={this.props.uploadDrawerControl}
          uploadState={this.props.uploadState}
          uploadModal={this.props.uploadModal}
          uploadModalControl={this.props.uploadModalControl}
          language={this.props.language}
        />
      </div>
    );
  }
}

export default DashboardMain;
