import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Layout } from 'antd';

import 'styles/app.css';

import Signin from 'components/Signin';
import Dashboard from 'components/Dashboard';
import UploadPortal from 'components/UploadPortal';
import TopBar from 'components/TopBar';

import * as APIUtils from 'utils/api-utils';

type StateType = {
  authorized: boolean;
  language: 'en-us' | 'zh-hans';
}

class App extends React.Component<{}, StateType> {

  state: StateType;
  constructor(props: never) {
    super(props);
    this.state = {
      authorized: false,
      language: 'en-us' as const
    }

    this.handleSignout = this.handleSignout.bind(this);
    this.switchLanguage = this.switchLanguage.bind(this);
  }

  /**
   * Check if a user is logged in
   */
  componentDidMount = () => {
    APIUtils.get('/api/account/user/info')
    .then(responseData => {
      if (responseData.code === 'OK') {
        this.setState({
          authorized: true
        });
      }
    })
    .catch(() => {
      this.setState({
        authorized: false
      })
    })
  }

  handleSignin = () => { this.setState({ authorized: true }); }
  handleSignout = () => { this.setState({ authorized: false }); }
  switchLanguage = (inputLanguage: StateType["language"]) => { this.setState({ language: inputLanguage });}

  mountSignin = () => {
    return this.state.authorized ?
      /** Upload Portal MOUNT_FLAG */
      <Redirect to="/app" /> :
      <Signin
        handleSignin={this.handleSignin}
        language={this.state.language}
      />
  }

  mountDashboard = () => {
    return this.state.authorized ?
    <Dashboard
      language={this.state.language} /> :
    <Redirect to="/signin" />
  }

  mountUploadPortal = () => {
    return this.state.authorized ?
    <UploadPortal language={this.state.language} /> :
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
          <Route path="/signin" render={this.mountSignin} />
          <Route path="/home" render={this.mountDashboard} />
          <Route path="/upload-portal" render={this.mountUploadPortal} />
          <Route render={this.mountSignin} />
        </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
