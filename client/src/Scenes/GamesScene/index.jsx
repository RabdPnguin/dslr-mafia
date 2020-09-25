import React from 'react';
import Games from './Games';
import Votes from './Votes';
import { Row, Col } from 'antd';

const GamesScene = () => (
  <Row gutter={8}>
    <Col style={{ width: '33%', minWidth: '450px' }}>
      <Games />
    </Col>
    <Col style={{ width: '67%', minWidth: '500px' }} >
      <Votes />
    </Col>
  </Row>
);

export default GamesScene;