import React from 'react';
import {
  PageHeader,
  Button,
  Divider,
  Descriptions,
  Tag
} from 'antd';

import 'styles/UserDashboardOverview.css';

import UserDashboardCharts from 'components/UserDashboardCharts';
import UserDashboardTable from 'components/UserDashboardTable';

class UserDashboardOverview extends React.Component {
  render() {
    return (
      <div className="UserDashboardOverview">
        <PageHeader
          ghost={false}
          title="Overview"
          tags={<Tag color="orange">Admin</Tag>}
          subTitle="Manage all upload items"
          extra={[
            <Button key="upload-button" type="primary">
              Create New Project
            </Button>,
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
        <UserDashboardCharts />
        <Divider orientation="left">Manage Uploads</Divider>
        <UserDashboardTable />
      </div>
    );
  }
}

export default UserDashboardOverview;