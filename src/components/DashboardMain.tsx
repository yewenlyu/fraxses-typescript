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
  language: 'en-us' | 'zh-hans';
}

class DashboardMain extends React.Component<PropsType> {

  render() {
    return (
      <div className="DashboardMain">
        <PageHeader
          ghost={false}
          title={this.props.tab}
          tags={<Tag color="orange">Admin</Tag>}
          subTitle={`Manage ${this.props.tab.split(' ')[0]} upload items`}
          extra={[
            <Button
              key="upload-button"
              type="primary"
              shape="round"
              icon={<ExportOutlined />}
            >
              Export
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
            <Descriptions.Item label="Owner">Test User</Descriptions.Item>
            <Descriptions.Item label="Association">
              421421
            </Descriptions.Item>
            <Descriptions.Item label="Remarks">
              Admin permission
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <DashboardCharts />
        <Divider orientation="left">Manage Uploads</Divider>
        <DashboardTable
          tab={this.props.tab}
          language={this.props.language}
        />
      </div>
    );
  }
}

export default DashboardMain;
