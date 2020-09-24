import React, { useState } from 'react';
import { Input, Button, Row, Col } from 'antd';

const AddPlayer = ({ onAdd, ...props }) => {
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');

  const playerAdded = () => {
    onAdd({ name, aliases });
    clearState();
  }

  const clearState = () => {
    setName('');
    setAliases('');
  }

  return (
    <Row {...props}>
      <Col flex='250px'>
        <Input
          placeholder='Player Name'
          value={name}
          onChange={e => setName(e.target.value)} />
      </Col>
      <Col flex='auto'>
        <Input
          placeholder='Aliases'
          value={aliases}
          onChange={e => setAliases(e.target.value)} />
      </Col>
      <Col>
        <Button
          type='primary'
          disabled={!name}
          onClick={playerAdded}>
          Add Player
      </Button>
      </Col>
    </Row>
  );
};

export default AddPlayer;