import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { HomePage } from './view/HomePage';
import { MapPage } from './view/MapPage';
import { NoMatchPage } from './view/NoMatchPage';
import { RegistrationPage } from './view/RegistrationPage';

import "./App.scss"
import MyMapsPage from './view/MyMapsPage';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/map/:profileName" element={<MapPage />} />
        <Route path="/" element={<MainTemplate />}>
          <Route path="/" element={<HomePage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="mymaps" element={<MyMapsPage />} />
          <Route path="*" element={<NoMatchPage />} />
        </Route>
      </Routes>
    </div>
  );
}

function MainTemplate() {
  return (
    <div className="content">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;