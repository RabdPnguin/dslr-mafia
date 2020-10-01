import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import recoilPersist from 'recoil-persist';
import App from './App';
import './index.less';
import * as serviceWorker from './serviceWorker';
import RecoilLogger from 'recoil-logger';

const { RecoilPersist, updateState } = recoilPersist();

ReactDOM.render(
  <RecoilRoot initializeState={updateState}>
    <RecoilPersist />
    <RecoilLogger />
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);

serviceWorker.unregister();
