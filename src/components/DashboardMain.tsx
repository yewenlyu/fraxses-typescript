import React from 'react';
import {
  PageHeader,
  Button,
  Divider,
  Descriptions,
  Tag,
  Badge,
} from 'antd';
import {
  ExportOutlined,
  BellOutlined
} from '@ant-design/icons';

import 'styles/DashboardMain.css';

import DashboardCharts from 'components/DashboardCharts';
import DashboardTable from 'components/DashboardTable';

type PropsType = {
  tab: string;
  userInfo: any;
  uploadInProgress: boolean;
  drawerControl: (on: boolean) => void;
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
              {this.enzh("Export", "下载结果")}
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
            <Descriptions.Item label={this.enzh("Remarks", "备注")}>
              {this.props.userInfo.remark}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <DashboardCharts />
        <Divider orientation="left">{this.enzh("Manage Uploads", "项目管理")}</Divider>
        <DashboardTable
          tab={this.props.tab}
          uploadInProgress={this.props.uploadInProgress}
          drawerControl={this.props.drawerControl}
          language={this.props.language}
        />
      </div>
    );
  }
}

export default DashboardMain;
