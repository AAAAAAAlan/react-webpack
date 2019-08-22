import React from 'react';
import styles from './styles.css';

const App = () => {
  const text = 'React and Webpack';
  return (
    <div className={styles.text}>
      <h1>{text}</h1>
    </div>
  );
};

export default App;
