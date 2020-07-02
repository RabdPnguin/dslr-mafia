import { Popconfirm } from 'antd';
import React from 'react';
import DataGrid from './DataGrid';

const PlayerList = ({ dataSource, ...props }) => {
  const recordDeleted = key => {
    alert(`delete: ${key}`);
  };

  const recordChanged = record => {
    alert(`saved: ${record.id}:${record.name}`)
  };

  let columns = [{
    title: 'Player Name',
    dataIndex: 'name',
    key: 'name',
    editable: true,
    width: 300
  }, {
    title: 'Aliases',
    dataIndex: 'aliases',
    key: 'aliases',
    editable: true
  }, {
    title: '',
    dataIndex: '',
    key: 'x',
    align: 'right',
    render: (text, record) =>
      dataSource.length >= 1 ? (
        <Popconfirm title={`Delete ${record.name}?`} onConfirm={() => recordDeleted(record.id)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null
  }];

  return (
    <DataGrid
      columns={columns}
      dataSource={dataSource}
      onChange={recordChanged}
      {...props} />
  );
};

export default PlayerList;