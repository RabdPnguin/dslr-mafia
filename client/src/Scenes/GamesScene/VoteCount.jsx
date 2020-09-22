import React from 'react';
import {Input} from 'antd';

const {TextArea} = Input;

const VoteCount = () => (
  <TextArea autoSize={{minRows: 5}} />
);

export default VoteCount;