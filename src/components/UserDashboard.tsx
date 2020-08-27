import React from 'react';

import { Layout, Menu, Breadcrumb, } from 'antd';
import {
  AppstoreOutlined,
  ProjectOutlined,
  SisternodeOutlined,
  LockOutlined,
  SubnodeOutlined,
  ExperimentOutlined
} from '@ant-design/icons';

import 'styles/UserDashboard.css';

import UserDashboardOverview from 'components/UserDashboardOverview';

const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

type PropsType = {
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  tab: string;
}

class UserDashboard extends React.Component<PropsType, StateType> {

  state: StateType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      tab: 'Overview'
    }
  }

  handleSelect = (event: any) => {
    this.setState({
      tab: event.key
    })
  }

  render() {
    return (
      <div className="UserDashboard">
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.tab}</Breadcrumb.Item>
          </Breadcrumb>
          <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
            <Sider className="site-layout-background" width={220}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['Overview']}
                defaultOpenKeys={['EVL Management', 'ESS Management', 'RandD Management']}
                onSelect={this.handleSelect}
                style={{ height: "100%" }}
              >
                <Menu.Item
                  key="Overview"
                  icon={<AppstoreOutlined />}
                >
                  Overview
                </Menu.Item>

                <Menu.Item
                  key="Project Management"
                  icon={<ProjectOutlined />}
                >
                  Project Management
                </Menu.Item>

                <SubMenu key="EVL Management" icon={<SisternodeOutlined />} title="EVL Management">
                  <Menu.Item key="EVL Session 1" icon={<LockOutlined />}>EVL Session 1</Menu.Item>
                  <Menu.Item key="EVL Session 2" icon={<LockOutlined />}>EVL Session 2</Menu.Item>
                  <Menu.Item key="EVL Session 3" icon={<LockOutlined />}>EVL Session 3</Menu.Item>
                </SubMenu>

                <SubMenu key="ESS Management" icon={<SubnodeOutlined />} title="ESS Management">
                  <Menu.Item key="ESS Session 1" icon={<LockOutlined />}>ESS Session 1</Menu.Item>
                  <Menu.Item key="ESS Session 2" icon={<LockOutlined />}>ESS Session 2</Menu.Item>
                  <Menu.Item key="ESS Session 3" icon={<LockOutlined />}>ESS Session 3</Menu.Item>
                </SubMenu>

                <SubMenu key="RandD Management" icon={<ExperimentOutlined />} title="R&amp;D Management">
                  <Menu.Item key="RandD Session 1" icon={<LockOutlined />}>R&amp;D Session 1</Menu.Item>
                  <Menu.Item key="RandD Session 2" icon={<LockOutlined />}>R&amp;D Session 2</Menu.Item>
                  <Menu.Item key="RandD Session 3" icon={<LockOutlined />}>R&amp;D Session 3</Menu.Item>
                </SubMenu>

              </Menu>
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <UserDashboardOverview />
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>{"Fova Energy ©2020"}</Footer>
      </div>
    );
  }
}

export default UserDashboard;
