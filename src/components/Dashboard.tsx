import React from 'react';

import { Layout, Menu, Breadcrumb, } from 'antd';
import {
  SisternodeOutlined,
  ExperimentOutlined,
  NodeIndexOutlined
} from '@ant-design/icons';

import 'styles/Dashboard.css';

import DashboardMain from 'components/DashboardMain';

// const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

type PropsType = {
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  tab: string;
}

class Dashboard extends React.Component<PropsType, StateType> {

  state: StateType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      tab: 'EVL Management'
    }
  }

  handleSelect = (event: any) => {
    this.setState({
      tab: event.key
    })
  }

  render() {
    return (
      <div className="Dashboard">
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.tab}</Breadcrumb.Item>
          </Breadcrumb>
          <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
            <Sider className="site-layout-background" width={220}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['EVL Management']}
                onSelect={this.handleSelect}
                style={{ height: "100%" }}
              >
                <Menu.Item
                  key="EVL Management"
                  icon={<SisternodeOutlined />}
                >
                  EVL Management
                </Menu.Item>

                <Menu.Item
                  key="ESS Management"
                  icon={<NodeIndexOutlined />}
                >
                  ESS Management
                </Menu.Item>

                <Menu.Item
                  key="R&amp;D Management"
                  icon={<ExperimentOutlined />}
                >
                  R&amp;D Management
                </Menu.Item>
              </Menu>
            </Sider>

            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <DashboardMain
                tab={this.state.tab}
                language={this.props.language}
              />
            </Content>

          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>{"Fova Energy ©2020"}</Footer>
      </div>
    );
  }
}

export default Dashboard;
