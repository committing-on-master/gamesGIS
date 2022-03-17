import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { HomePage } from './view/HomePage';
import { MapPage } from './view/MapPage';
import { NoMatchPage } from './view/NoMatchPage';
import { RegistrationPage } from './view/RegistrationPage';

import styles from './App.module.scss';
import MyMapsPage from './view/MyMapsPage';
import { withAuth } from './hocs/withAuth';

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/map/:profileName" element={<MapPage />} />
        <Route path="/" element={<MainTemplate />}>
          <Route path="/" element={<HomePage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="mymaps" element={ withAuth(MyMapsPage, '/')({})} />
          <Route path="*" element={<NoMatchPage />} />
        </Route>
      </Routes>
    </div>
  );
}

function MainTemplate() {
  return (
    <div className={styles.content}>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;