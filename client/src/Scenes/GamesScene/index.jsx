import React from 'react';
import GameDataGrid from './GameDataGrid';
import PlayerDataGrid from './PlayerDataGrid';
import VoteCount from './VoteCount';
import { Row, Col } from 'antd';

const GamesScene = () => (
  <Row gutter={8}>
    <Col style={{ width: '33%', minWidth: '450px' }}>
      <GameDataGrid />
    </Col>
    <Col style={{ width: '67%', minWidth: '500px' }} >
      <PlayerDataGrid />
    </Col>
  </Row>
);

export default GamesScene;