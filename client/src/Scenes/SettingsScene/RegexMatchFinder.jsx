import { LinkOutlined } from '@ant-design/icons';
import { Button, Col, Input, Popconfirm, Row } from 'antd';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import DataGrid from '../../components/DataGrid';

const AddPattern = ({onAdd, onChange, pattern, ...props}) => (
  <Row {...props}>
    <Button type='link' href='https://regex101.com/' icon={<LinkOutlined />} />
    <Col flex='auto'>
      <Input
        addonBefore='/'
        addonAfter="/gmi"
        placeholder='Regex Pattern'
        value={pattern}
        onChange={e => onChange(e.target.value)} />
    </Col>
    <Col style={{marginLeft: '5px'}}>
      <Button
        type='primary'
        disabled={!pattern}
        onClick={onAdd}>
        Add Pattern
    </Button>
    </Col>
  </Row>
);

const RegexMatchFinder = ({patternState}) => {
  const [patterns, setPatterns] = useRecoilState(patternState);
  const [pattern, setPattern] = useState('');

  const patternAdded = () => {
    setPattern('');
    const newPattern = {key: uuid(), pattern};
    setPatterns([...patterns, newPattern]);
  };

  const patternUpdated = updatedPattern => {
    setPatterns(
      patterns.map(a => a.key === updatedPattern.key ? { ...a, ...updatedPattern } : a)
    );
  };

  const patternDeleted = key => {
    setPatterns(patterns.filter(p => p.key !== key));
  };

  const columns = [{
    title: 'Regex Pattern',
    dataIndex: 'pattern',
    editable: true,
    width: '100%'
  }, {
    key: 'x',
    align: 'right',
    render: (text, record) => (
        <Popconfirm title={`Delete ${record.pattern}?`} onConfirm={() => patternDeleted(record.key)}>
          <a>Delete</a>
        </Popconfirm>
      )
  }];

  return (
    <Row>
      <Col style={{width: '50%', minWidth: '550px'}}>
        <AddPattern
          style={{ marginBottom: 16 }}
          pattern={pattern}
          onChange={setPattern}
          onAdd={patternAdded} />
        <DataGrid
          columns={columns}
          dataSource={patterns}
          onChange={patternUpdated} />
      </Col>
    </Row>
  );
};

export default RegexMatchFinder;