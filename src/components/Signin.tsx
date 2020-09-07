import React from 'react';

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import 'styles/signin.css';

import * as APIUtils from 'utils/api-utils';

type PropsType = {
  handleSignin: () => void;
  language: 'en-us' | 'zh-hans';
}

class Signin extends React.Component<PropsType> {

  onFinish = (values: any) => {
    let signinData = {
      name: values.username,
      password: values.password
    }

    APIUtils.post('/api/account/login', JSON.stringify(signinData))
      .then(response => {
        if (response.code === 'OK') {
          this.props.handleSignin();
        } else {
          APIUtils.handleError(response.code, this.props.language);
        }
      })
  }

  render() {
    return (
      <div className="Signin">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="username"
            rules={[{
              required: true,
              message: this.props.language === 'en-us' ?
                "Please input your name" :
                "请输入用户名"
            }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={
                this.props.language === 'en-us' ?
                  "Name" : "用户名"
              }
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{
              required: true,
              message: this.props.language === 'en-us' ?
                "Please input your Password" :
                "请输入登录口令"
            }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={
                this.props.language === 'en-us' ?
                  "Password" : "登录口令"
              }
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="unchecked" noStyle>
              <Checkbox>
                {this.props.language === 'en-us' ? 'Remember me' : '保存登录信息'}
              </Checkbox>
            </Form.Item>
            <a href="/" onClick={e => e.preventDefault()} className="login-form-portal">
              {this.props.language === 'en-us' ? 'Administartor Portal' : '管理员通道'}
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              {this.props.language === 'en-us' ? "Log in" : "登录"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Signin;
