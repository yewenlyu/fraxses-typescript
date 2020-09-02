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
  targetFileId: string;
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
      upload_id: this.props.targetFileId
    }
    APIUtils.get('/api/data/algorithm/list', requestParams)
      .then(response => {
        if (response.code === 'OK') {
          this.setState({
            algorithmList: (response as APIUtils.SuccessResponseDataType).data.items
          });
        } else {
          APIUtils.handleError(response.code, this.props.language);
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
      upload_id: this.props.targetFileId,
      algo_id: this.state.selectedAlgoId
    }
    APIUtils.post('/api/data/analysis/start', JSON.stringify(requestBody))
    .then(response => {
      if (response.code !== 'OK') {
        APIUtils.handleError(response.code, this.props.language);
      }
      this.props.algorithmControl(false);
    })
  }

  handleCancel = () => {
    this.props.algorithmControl(false);
  }

  render() {
    return (
      <div className="AlgorithmController">
        <Modal
          title="Select Algorithm"
          visible={true}
          centered
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleStartAnalyze}>
              Start Analyzing
            </Button>,
          ]}
        >
          <Select
            placeholder="Please select an Algorithm"
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