import React from 'react';

import {
  Layout,
  Menu,
  Breadcrumb
} from 'antd';
import {
  SisternodeOutlined,
  ExperimentOutlined,
  NodeIndexOutlined
} from '@ant-design/icons';

import 'styles/dashboard.css';

import DashboardMain from 'components/DashboardMain';
import UploadSession from 'components/UploadSession';

import * as APIUtils from 'utils/api-utils';

// const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

export type UploadStateType = {
  inProgress: boolean;
  fileName: string;
  step: number;
  progress: number;
  error: boolean;
}

type PropsType = {
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  userInfo: any;
  tab: string;
  uploadDrawer: boolean;
  uploadModal: boolean;
  uploadState: UploadStateType;
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
      uploadDrawer: false,
      uploadModal: false,
      uploadState: {
        inProgress: false,
        fileName: "",
        step: 0,
        progress: 0,
        error: false
      }
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
          APIUtils.promptError(response.code, this.props.language);
        }
      })
  }

  // controller methods
  handleSelect = (event: any) => this.setState({ tab: event.key });
  uploadDrawerControl = (on: boolean) => this.setState({ uploadDrawer: on });
  uploadModalControl = (on: boolean) => this.setState({ uploadModal: on });
  uploadStateControl = (property: keyof UploadStateType, value: UploadStateType[typeof property]) => {
    this.setState(({uploadState}) => ({uploadState: {
      ...uploadState,
      [property]: value
    }}));
  }

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
                uploadDrawerControl={this.uploadDrawerControl}
                uploadState={this.state.uploadState}
                uploadModal={this.state.uploadModal}
                uploadModalControl={this.uploadModalControl}
                language={this.props.language}
              />
            </Content>

          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>{"Fova Energy ©2020"}</Footer>
        
        <UploadSession
          uploadDrawer={this.state.uploadDrawer}
          uploadDrawerControl={this.uploadDrawerControl}
          uploadInProgress={this.state.uploadState.inProgress}
          uploadStateControl={this.uploadStateControl}
          uploadModal={this.state.uploadModal}
          uploadModalControl={this.uploadModalControl}
          tab={this.state.tab}
          language={this.props.language}
        />

      </div>
    );
  }
}

export default Dashboard;
