import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { writeStorage } from '@rehooks/local-storage';

const OkButton = ({ disabled, onClick }) => (
  <Button key='submit' type='primary' disabled={disabled} onClick={onClick}>OK</Button>
);

const UsernameModal = ({ visible }) => {
  const [username, setUsername] = useState('');

  const okButtonClicked = () => {
    writeStorage('username', username);
  }

  return (
    <Modal
      title='DSLR Username'
      closable={false}
      visible={visible}
      footer={<OkButton disabled={!username} onClick={okButtonClicked} />}>
      <Input value={username} onChange={e => setUsername(e.target.value)} />
    </Modal>
  );
};

export default UsernameModal;