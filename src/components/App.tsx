import React from 'react';
import { Layout } from 'antd';

import 'styles/App.css';

import TopBar from 'components/TopBar';
import UserSignin from 'components/UserSignin';
import UserDashboard from 'components/UserDashboard';

type StateType = {
  authorizedUser: boolean;
  authorizedAdmin: boolean;
  language: 'en-us' | 'zh-hans';
}

class App extends React.Component<{}, StateType> {

  state = {
    authorizedUser: false,
    authorizedAdmin: false,
    language: 'en-us' as const
  }

  switchLanguage = (inputLanguage: StateType["language"]) => {
    this.setState({
      language: inputLanguage
    });
  }

  render() {
    return (
      <div className="App">
        <Layout>
          <TopBar
            authorizedUser={this.state.authorizedUser}
            authorizedAdmin={this.state.authorizedAdmin}
            language={this.state.language}
            switchLanguage={this.switchLanguage}
          />
          {/* <UserSignin language={this.state.language} /> */}
          <UserDashboard language={this.state.language} />
        </Layout>
      </div>
    );
  }
}

export default App;
