import React from 'react';
import {
  message,
  Modal,
  Button,
  Select
} from 'antd';

import * as APIUtils from 'utils/api-utils';

const { Option } = Select;

type PropsType = {
  fileId: string;
  algorithmControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  algorithmList: any[];
  selectedAlgoId: string;
}

class AlgorithmController extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      algorithmList: [],
      selectedAlgoId: ""
    };
  }

  componentDidMount() {
    let requestParams = {
      upload_id: this.props.fileId
    }
    APIUtils.get('/api/data/algorithm/list', requestParams)
      .then(response => {
        if (response.code === 'OK') {
          this.setState({
            algorithmList: (response as APIUtils.SuccessResponseDataType).data.items
          });
        } else {
          APIUtils.promptError(response.code, this.props.language);
        }
      });
  }

  handleSelectAlgo = (value: string) => {
    let selectedAlgo = this.state.algorithmList.find(algo => algo.algo_name === value);
    if (selectedAlgo === undefined) {
      console.warn("Cannot find ", value, "in", this.state.algorithmList)
      return;
    }
    this.setState({
      selectedAlgoId: selectedAlgo.id
    })
    console.log("Algorithm selected", selectedAlgo.id);
  }

  handleStartAnalyze = () => {
    if (this.state.selectedAlgoId === "") {
      message.warn("Please select an algorithm!");
      return;
    }
    let requestBody = {
      upload_id: this.props.fileId,
      algo_id: this.state.selectedAlgoId
    }
    APIUtils.post('/api/data/analysis/start', JSON.stringify(requestBody))
      .then(response => {
        if (response.code !== 'OK') {
          APIUtils.promptError(response.code, this.props.language);
        }
        this.props.algorithmControl(false);
      })
  }

  handleCancel = () => {
    this.props.algorithmControl(false);
  }

  enzh = (english: string, chinese: string): string =>
    this.props.language === 'en-us' ? english : chinese;

  render() {
    return (
      <div className="AlgorithmController">
        <Modal
          title={this.enzh("Select Algorithm", "算法选择")}
          visible={true}
          centered
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              {this.enzh("Cancel", "取消")}
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleStartAnalyze}>
              {this.enzh("Start Analyzing", "开始分析")}
            </Button>,
          ]}
        >
          <Select
            placeholder={this.enzh("Please select an Algorithm", "请选择算法")}
            style={{ margin: "auto" }}
            onChange={this.handleSelectAlgo}
          >
            {this.state.algorithmList.map((algo =>
              (<Option key={algo.algo_name} value={algo.algo_name}>{algo.algo_name}</Option>)))}
          </Select>
        </Modal>
      </div>
    );
  }
}

export default AlgorithmController;
