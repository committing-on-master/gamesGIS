import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/navbar/Navbar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
      <Navbar/>
    </div>
  );
}

export default App;
