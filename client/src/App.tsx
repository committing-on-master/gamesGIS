import React from 'react';
import { Navbar } from './components/navbar/Navbar';
import { LicenseAgreement } from './components/registration/LicenseAgreement';

function App() {
  return (
    <div className="App">
      <Navbar/>
      {/* <LicenseAgreement endPoint="http://localhost:3000/agreement" /> */}
    </div>
  );
}

export default App;