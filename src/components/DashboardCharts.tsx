import React from 'react';
import { Row, Col } from 'antd';

import 'styles/DashboardCharts.css';

class DashboardCharts extends React.Component {
  render() {
    return (
      <div className="DashboardCharts">
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <div className="chart-box">
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="chart-box">
              
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="chart-box"></div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="chart-box">
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DashboardCharts;
