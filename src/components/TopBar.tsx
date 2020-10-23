import React from 'react';
import { Layout, Menu } from 'antd';
import {
  GlobalOutlined,
  LogoutOutlined
} from '@ant-design/icons';

import 'styles/topBar.css';

import LogoLight from 'assets/fova-logo-light.png';

import * as APIUtils from 'utils/api-utils';

const { Header } = Layout;
const { SubMenu } = Menu;

type PropsType = {
  authorized: boolean;
  language: 'en-us' | 'zh-hans';
  handleSignout: () => void;
  switchLanguage: (inputLanguage: PropsType['language']) => void;
}

class TopBar extends React.Component<PropsType> {

  handleSelectLanguage = (event: any) => {
    this.props.switchLanguage(event.key);
  }

  handleClickLogout = () => {
    APIUtils.post('/api/account/logout')
      .then(response => {
        if (response.code === 'OK') {
          this.props.handleSignout();
        } else {
          APIUtils.promptError(response.code, this.props.language);
        }
      });
  }

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {

    const userMenu = (
      <Menu.Item
        key="menu-signout"
        icon={<LogoutOutlined height="3em" />}
        style={{ float: "right" }}
        onClick={this.handleClickLogout}
      >
        {this.enzh('Sign Out', '退出登录')}
      </Menu.Item>
    )

    return (
      <div className="TopBar">
        <Header className="header">
          <img src={LogoLight} alt="logo-light" className="logo-light" />
          <Menu theme="dark" mode="horizontal">
            {this.props.authorized ? userMenu : null}
            <SubMenu
              key="menu-language"
              icon={<GlobalOutlined height="3em" />}
              title={this.enzh('Intl-English', 'Intl-简体中文')}
              style={{ float: "right" }}
            >
              <Menu.Item key="zh-hans" onClick={this.handleSelectLanguage}>简体中文</Menu.Item>
              <Menu.Item key="en-us" onClick={this.handleSelectLanguage}>English - US</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
      </div>
    );
  }
}

export default TopBar;
