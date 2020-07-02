import React from 'react';
import UsernameModal from './components/UsernameModal';
import { useLocalStorage } from '@rehooks/local-storage';

const App = () => {
  const [username] = useLocalStorage('username');

  return (
    <div>
      <UsernameModal visible={!username} />
    </div>
  );
};

export default App;
