import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import recoilPersist from 'recoil-persist';
import App from './App';
import './index.less';
import * as serviceWorker from './serviceWorker';

const { RecoilPersist, updateState } = recoilPersist();

ReactDOM.render(
  <RecoilRoot initializeState={updateState}>
    <RecoilPersist />
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);

serviceWorker.unregister();
