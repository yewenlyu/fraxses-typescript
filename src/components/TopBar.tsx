import React from 'react';
import { Layout, Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

import 'styles/TopBar.css';

import Logo from 'components/miscellaneus/Logo';

const { Header } = Layout;
const { SubMenu } = Menu;

type PropsType = {
  authorizedUser: boolean;
  authorizedAdmin: boolean;
  language: 'en-us' | 'zh-hans';
  switchLanguage: (inputLanguage: 'en-us' | 'zh-hans') => void;
}

class TopBar extends React.Component<PropsType> {

  handleSelect = (event: any) => {
    console.log(event);
  }

  render() {
    return (
      <div className="TopBar">
        <Header className="header">
          <Logo />
          <Menu theme="dark" mode="horizontal" onSelect={this.handleSelect}>
            <SubMenu
              key="menu-language"
              icon={<GlobalOutlined />}
              title={
                this.props.language === 'en-us' ? 'English' : '中文'
              }
              style={{ float: "right" }}
            >
              <Menu.Item key="zh-hans">中文</Menu.Item>
              <Menu.Item key="en-us">English - US</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
      </div>
    );
  }
}

export default TopBar;