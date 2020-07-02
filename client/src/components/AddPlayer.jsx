import React, { useState } from 'react';
import { Input, Button, Row, Col } from 'antd';

const AddPlayer = ({ onAdd, ...props }) => {
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');

  return (
    <Row>
      <Col flex='300px'>
        <Input placeholder='Player Name' onChange={e => setName(e.target.value)} />
      </Col>
      <Col flex='auto'>
        <Input placeholder='Aliases' onChange={e => setAliases(e.target.value)} />
      </Col>
      <Col>
        <Button
          type='primary'
          disabled={!name}
          style={{ marginBottom: 16 }}
          onClick={() => onAdd({ name, aliases })}
          {...props}>
          Add Player
      </Button>
      </Col>
    </Row>
  );
};

export default AddPlayer;