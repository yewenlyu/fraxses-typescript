import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Layout } from 'antd';

import 'styles/App.css';

import TopBar from 'components/TopBar';
import Signin from 'components/Signin';
import Dashboard from 'components/Dashboard';

import * as APIUtils from 'utils/api-utils';

type StateType = {
  authorized: boolean;
  userInfo: any;
  language: 'en-us' | 'zh-hans';
}

class App extends React.Component<{}, StateType> {

  state: StateType;
  constructor(props: never) {
    super(props);
    this.state = {
      authorized: false,
      userInfo: null,
      language: 'en-us' as const
    }

    this.logUser = this.logUser.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
    this.switchLanguage = this.switchLanguage.bind(this);
  }

  componentDidMount = () => {
    this.logUser();
  }

  logUser = () => {
    APIUtils.get('/api/account/user/info')
    .then(response => {
      if (response.code === 'OK') {
        this.setState({
          userInfo: (response as APIUtils.SuccessResponseDataType).data,
          authorized: true
        })
      }
    })
    .catch(() => {
      this.setState({
        authorized: false
      })
    })
  }

  handleSignout = () => {
    this.setState({
      authorized: false
    });
  }


  switchLanguage = (inputLanguage: StateType["language"]) => {
    this.setState({
      language: inputLanguage
    });
  }

  mountSignin = () => {
    return this.state.authorized ?
      <Redirect to="/home" /> :
      <Signin
        handleSignin={this.logUser}
        language={this.state.language}
      />
  }

  mountDashboard = () => {
    return this.state.authorized ?
    <Dashboard
      userInfo={this.state.userInfo}
      language={this.state.language} /> :
    <Redirect to="/signin" />
  }

  render() {
    return (
      <div className="App">
        <Layout>
          <TopBar
            authorized={this.state.authorized}
            language={this.state.language}
            handleSignout={this.handleSignout}
            switchLanguage={this.switchLanguage}
          />
        <Switch>
          <Route exact path="/" render={this.mountSignin} />
          {/* <Route exact path="/" render={this.mountDashboard} /> */}
          <Route path="/signin" render={this.mountSignin} />
          <Route path="/home" render={this.mountDashboard} />
          <Route render={this.mountSignin} />
        </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
