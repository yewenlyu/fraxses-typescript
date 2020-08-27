import React from 'react';
import { Button, Table, Tag } from 'antd';
import {
  CloudUploadOutlined,
  UnorderedListOutlined,
  ExportOutlined
} from '@ant-design/icons';

import 'styles/UserDashboardTable.css';

class UserDashboardTable extends React.Component {
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
      render: () => <a href="/" onClick={e => e.preventDefault()}>Choose Action</a>
    },
  ];

  mockFormData = [
    {
      key: 100,
      name: "EVL Projects",
      fileID: "-",
      uploadTime: "-",
      status: "",
      children: [
        {
          key: 1,
          name: 'data05.csv',
          fileID: "202008UD425690411",
          uploadTime: '16 July 2020, 03:21:48 PST',
          status: 'Completed',
        },
        {
          key: 2,
          name: 'data04.tar.gz',
          fileID: "200723UD425697810",
          uploadTime: '11 May 2020, 14:26:03 PST',
          status: 'Completed',
        },
      ]
    },
    {
      key: 200,
      name: "ESS Projects",
      fileID: "-",
      uploadTime: "-",
      status: "",
      children: [
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
        }
      ]
    },
    {
      key: 300,
      name: "R&D Projects",
      fileID: "-",
      uploadTime: "-",
      status: "",
      children: [
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
      ]
    }
  ];

  render() {
    return (
      <div className="UserDashboardTable">
        <Button
          className="table-button"
          type="primary"
          shape="round"
          icon={<CloudUploadOutlined />}
        >
          New Upload
        </Button>
        <Button
          className="table-button"
          shape="round"
          icon={<UnorderedListOutlined />
          }>
          Bulk Action
        </Button>
        <Button
          className="table-button export"
          shape="round"
          icon={<ExportOutlined />}
        >
          Export
        </Button>
        <Table
          size="middle"
          defaultExpandedRowKeys={[100, 200]}
          rowSelection={{
            checkStrictly: false
          }}
          pagination={{ pageSize: 7 }}
          columns={this.mockFormColumns}
          dataSource={this.mockFormData}
        />
      </div>
    );
  }
}

export default UserDashboardTable;