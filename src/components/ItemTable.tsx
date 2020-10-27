import React from 'react';
import {
  Table,
  Button
} from 'antd';
import {
  CloudUploadOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';

import EVHistoryTable from 'components/EVHistoryTable';

type PropsType = {
  uploadDrawerControl: (on: boolean) => void;
  language: 'en-us' | 'zh-hans';
}

class ItemTable extends React.Component<PropsType, {}> {

}

export default ItemTable;