import React from 'react';

import { Layout, Menu, Breadcrumb, } from 'antd';
import {
  SisternodeOutlined,
  ExperimentOutlined,
  NodeIndexOutlined
} from '@ant-design/icons';

import 'styles/Dashboard.css';

import DashboardMain from 'components/DashboardMain';
import UploadSession from 'components/UploadSession';

import * as APIUtils from 'utils/api-utils';

// const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

type PropsType = {
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  userInfo: any;
  tab: string;
  drawerVisible: boolean;
  uploadInProgress: boolean;
}

class Dashboard extends React.Component<PropsType, StateType> {

  state: StateType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      userInfo: {
        name: '-',
        id: '-',
        remark: '-'
      },
      tab: 'EV Management',
      drawerVisible: false,
      uploadInProgress: false
    }
  }

  /**
   * Log userInfo into state
   */
  componentDidMount() {
    APIUtils.get('/api/account/user/info')
    .then(response => {
      if (response.code === 'OK') {
        this.setState({
          userInfo: (response as APIUtils.SuccessResponseDataType).data,
        })
      } else {
        APIUtils.handleError(response.code, this.props.language);
      }
    })
  }

  // controller methods
  handleSelect = (event: any) => this.setState({ tab: event.key });
  drawerControl = (on: boolean) => this.setState({ drawerVisible: on });
  uploadControl = (on: boolean) => this.setState({ uploadInProgress: on });

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
      <div className="Dashboard">
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>{this.enzh('Home', '主页')}</Breadcrumb.Item>
            <Breadcrumb.Item>{this.enzh(this.state.tab, this.zhtab(this.state.tab))}</Breadcrumb.Item>
          </Breadcrumb>
          <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
            <Sider className="site-layout-background" width={220}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['EV Management']}
                onSelect={this.handleSelect}
                style={{ height: "100%" }}
              >
                <Menu.Item
                  key="EV Management"
                  icon={<SisternodeOutlined />}
                >
                  {this.enzh("EV Management", "电动汽车分析平台")}
                </Menu.Item>

                <Menu.Item
                  key="ESS Management"
                  icon={<NodeIndexOutlined />}
                >
                  {this.enzh("ESS Management", "储能系统分析平台")}
                </Menu.Item>

                <Menu.Item
                  key="R&amp;D Management"
                  icon={<ExperimentOutlined />}
                >
                  {this.enzh("R&D Management", "电池研发测试分析平台")}
                </Menu.Item>
              </Menu>
            </Sider>

            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <DashboardMain
                tab={this.state.tab}
                userInfo={this.state.userInfo}
                uploadInProgress={this.state.uploadInProgress}
                drawerControl={this.drawerControl}
                language={this.props.language}
              />
            </Content>

          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>{"Fova Energy ©2020"}</Footer>
        <UploadSession
          drawerVisible={this.state.drawerVisible}
          uploadInProgress={this.state.uploadInProgress}
          drawerControl={this.drawerControl}
          uploadControl={this.uploadControl}
          tab={this.state.tab}
          language={this.props.language}
        />
      </div>
    );
  }
}

export default Dashboard;
