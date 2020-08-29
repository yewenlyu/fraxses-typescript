import React from 'react';
import {
  Button,
  Drawer,
  Table,
  Tag,
  Input,
  Popover,
  Dropdown,
  Menu,
  DatePicker,
} from 'antd';

import {
  CloudUploadOutlined,
  UnorderedListOutlined,
  FilterOutlined
} from '@ant-design/icons';

import 'styles/DashboardTable.css';

import UploadForm from 'components/UploadForm';

const { Search } = Input;
const { RangePicker } = DatePicker;

type PropsType = {
  tab: string;
  language: 'en-us' | 'zh-hans';
}

type StateType = {
  drawerVisible: boolean
}

class DashboardTable extends React.Component<PropsType, StateType> {

  state: StateType;
  constructor(props: PropsType) {
    super(props);
    this.state = {
      drawerVisible: false
    }
  }

  openDrawer = () => {
    this.setState({
      drawerVisible: true
    });
  }

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false
    });
  }

  mockFormColumns = [
    { title: 'File Name', dataIndex: 'name', key: 'name' },
    { title: 'File ID', dataIndex: 'fileID', key: 'fileID' },
    { title: 'Upload Time', dataIndex: 'uploadTime', key: 'uploadTime' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status.length === 0) {
          return "";
        } else {
          return <Tag color="green">{status}</Tag>
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'x',
      render: () => (
        <Dropdown overlay={this.bulkActionMenu}>
          <a href="/" onClick={e => e.preventDefault()}>Choose Action</a>
        </Dropdown>
      )
    },
  ];

  mockFormData = [
    {
      key: 1,
      name: 'data05.csv',
      fileID: "202008UD425690411",
      uploadTime: '16 July 2020, 03:21:48 PST',
      status: 'Completed',
      action: <a href="/#">Select Algorithm</a>,
    },
    {
      key: 2,
      name: 'data04.tar.gz',
      fileID: "200723UD425697810",
      uploadTime: '11 May 2020, 14:26:03 PST',
      status: 'Completed',
    },
    {
      key: 3,
      name: 'randfilegen.py',
      fileID: "200808UD425693511",
      uploadTime: '29 Feb 2020, 20:11:23 PST',
      status: 'Completed',
    },
    {
      key: 4,
      name: 'data-depricated.tar.gz',
      fileID: "2012723UD42569045",
      uploadTime: '14 Feb 2020, 21:00:23 PST',
      status: 'Completed',
    },
    {
      key: 5,
      name: 'data03.csv',
      fileID: "2008UD42569081564",
      uploadTime: '25 Jan 2020, 09:15:02 PST',
      status: 'Completed',
    },
    {
      key: 6,
      name: 'data01.csv',
      fileID: "200536UD425690763",
      uploadTime: '14 Jan 2020, 12:59:40 PST',
      status: 'Completed',
    },
    {
      key: 7,
      name: 'data01.csv',
      fileID: "200458UD425690885",
      uploadTime: '02 Jan 2020, 20:07:23 PST',
      status: 'Completed',
    },
    {
      key: 8,
      name: 'deprecated_bat.csv',
      fileID: "200458UD425690885",
      uploadTime: '15 Dec 2019, 21:51:09 PST',
      status: 'Completed',
    },
    {
      key: 9,
      name: 'accident_report.csv',
      fileID: "200458UD425690885",
      uploadTime: '11 Nov 2019, 04:22:15 PST',
      status: 'Completed',
    }
  ];

  bulkActionMenu = (
    <Menu>
      <Menu.Item key="bulk-choose-algo">Choose Algorithm</Menu.Item>
      <Menu.Item key="bulk-view-result">View Result</Menu.Item>
    </Menu>
  )

  filterPopup = (
    <div>
      <RangePicker />
    </div>
  )

  render() {
    return (
      <div className="DashboardTable">
        <Button
          className="table-button"
          type="primary"
          shape="round"
          icon={<CloudUploadOutlined />}
          onClick={this.openDrawer}
        >
          New Upload
        </Button>

        <Dropdown overlay={this.bulkActionMenu} trigger={['click']}>
          <Button
            className="table-button"
            shape="round"
            icon={<UnorderedListOutlined />}
          >
            Bulk Action
        </Button>
        </Dropdown>

        <Popover
          placement="bottomLeft"
          content={this.filterPopup}
          trigger="click"
        >
          <Button
            className="table-button"
            shape="round"
            icon={<FilterOutlined />}
          >
            Filter
          </Button>
        </Popover>

        <Search
          onSearch={value => console.log(value)}
          size="small"
          style={{
            width: 200,
            padding: "5px",
          }}
        />
        <Table
          size="middle"
          rowSelection={{}}
          pagination={{ pageSize: 7 }}
          columns={this.mockFormColumns}
          dataSource={this.mockFormData}
        />
        <Drawer
          title="Start New Upload Session"
          width={720}
          onClose={this.onDrawerClose}
          visible={this.state.drawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
          // footer={
          //   <div
          //     style={{
          //       textAlign: 'right',
          //     }}
          //   >
          //     <Button onClick={this.onDrawerClose} style={{ marginRight: 8 }}>
          //       Cancel
          //     </Button>
          //     <Button onClick={this.onDrawerClose} type="primary">
          //       Submit
          //     </Button>
          //   </div>
          // }
        >
          <UploadForm
            tab={this.props.tab}
            language={this.props.language}
          />
        </Drawer>
      </div>
    );
  }
}

export default DashboardTable;
