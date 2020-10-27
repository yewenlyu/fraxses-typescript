import React from 'react';
import {
  Row,
  Col,
  Statistic
} from 'antd';

import EVSummaryChart from 'components/EVSummaryChart';

import 'styles/dashboardCharts.css';

type PropsType = {
  language: 'en-us' | 'zh-hans';
}

class DashboardCharts extends React.Component<PropsType, {}> {

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;
  
  render() {
    return (
      <div className="DashboardCharts">
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <div className="chart-box">
              <EVSummaryChart language={this.props.language} />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="chart-box">
              <Statistic
                title={this.enzh("EV Analyzed", "累计分析车辆")}
                value={30}
                suffix={this.enzh("vehicles", "辆")}
                valueStyle={{ color: "#1890ff" }}
              />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="chart-box">
            <Statistic
                title={this.enzh("Analyze Result Delivered", "累计分析次数")}
                value={1127}
                suffix={this.enzh("tasks", "次")}
                valueStyle={{ color: "#3f8600" }}
              />
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="chart-box">
            <Statistic
                title={this.enzh("Risks Discovered", "累计暴露风险")}
                value={27}
                suffix={this.enzh("potential risks", "个")}
                valueStyle={{ color: "#f5222d" }}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DashboardCharts;
