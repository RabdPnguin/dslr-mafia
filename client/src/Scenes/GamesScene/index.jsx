import React from 'react';
import GameDataGrid from './GameDataGrid';
import PlayerDataGrid from './PlayerDataGrid';
import { Row, Col } from 'antd';

const GamesScene = () => (
  <Row gutter={8}>
    <Col style={{ width: '50%', minWidth: '550px' }}>
      <GameDataGrid />
    </Col>
    <Col style={{ width: '50%', minWidth: '550px' }} >
      <PlayerDataGrid />
    </Col>
  </Row>
);

export default GamesScene;