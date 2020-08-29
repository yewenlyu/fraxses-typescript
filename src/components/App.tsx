import React from 'react';
import { Layout } from 'antd';

import 'styles/App.css';

import TopBar from 'components/TopBar';
import Signin from 'components/Signin';
import Dashboard from 'components/Dashboard';

type StateType = {
  authorized: boolean;
  language: 'en-us' | 'zh-hans';
}

class App extends React.Component<{}, StateType> {

  state = {
    authorized: false,
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
            authorized={this.state.authorized}
            language={this.state.language}
            switchLanguage={this.switchLanguage}
          />
          {/* <Signin language={this.state.language} /> */}
          <Dashboard language={this.state.language} />
        </Layout>
      </div>
    );
  }
}

export default App;
