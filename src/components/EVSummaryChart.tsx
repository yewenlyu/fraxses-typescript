import React from 'react';
import { Pie } from '@ant-design/charts';

type PropsType = {
  language: 'en-us' | 'zh-hans';
}
const EVSummaryChart = ({ language }: PropsType) => {

  const enzh = (english: string, chinese: string): string =>
    language === 'en-us' ? english : chinese;

  const data = [
    {
      type: enzh("High Risk", "高风险"),
      value: 2,
      color: "#f7414a"
    },
    {
      type: enzh("Mid Risk", "中风险"),
      value: 4,
    },
    {
      type: enzh("Low Risk", "低风险"),
      value: 20,
    },
    {
      type: enzh("Analyzing", "待分析"),
      value: 4,
    },
  ]

  return (<Pie
    appendPadding={10}
    data={data}
    angleField='value'
    colorField='type'
    color={["#f62e38", "#fa8c16", "#2cc5cd", "#657798"]}
    radius={1}
    innerRadius={0.75}
    statistic={{
      title: false,
      content: {
        formatter: () => enzh('EV\nSummary', "电动汽车\n风险分布")
      }
    }}
  />);
}

export default EVSummaryChart;
