// src/App.jsx
import React, { useState } from "react";
import UnifiedOfferForm from "./components/UnifiedOfferForm";
import PhotovoltaicsOfferForm from "./components/PhotovoltaicsOfferForm";
import OknaNestOfferForm from "./components/OknaNestOfferForm";
import RadiatorsOfferForm from "./components/RadiatorsOfferForm";
import InsulationOfferForm from "./components/InsulationOfferForm"; // Import nowego komponentu
import './assets/style.css'; 
import "./App.css";        

import kamanLogo from './assets/logo_kaman.png';

import heatingBg from './assets/backgrounds/heating-background.jpg';
import pvBg from './assets/backgrounds/pv-background.jpg';
import oknaBg from './assets/backgrounds/okna-background.jpg';

function App() {
  const [activeForm, setActiveForm] = useState("heating"); 

  const getBackgroundClass = () => {
    switch(activeForm) {
      case 'heating':
      case 'radiators':
        return 'bg-heating';
      case 'pv':
        return 'bg-pv';
      case 'okna':
      case 'insulation': // Użyj tła od okien dla elewacji
        return 'bg-okna';
      default:
        return 'bg-heating';
    }
  };

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <header className="app-header">
        <img src={kamanLogo} alt="KAMAN Logo" className="app-logo" />
        <nav className="form-switcher">
          <button onClick={() => setActiveForm("heating")} className={`switcher-button ${activeForm === "heating" ? "active" : ""}`}>Ogrzewanie</button>
          <button onClick={() => setActiveForm("pv")} className={`switcher-button ${activeForm === "pv" ? "active" : ""}`}>Fotowoltaika</button>
          <button onClick={() => setActiveForm("radiators")} className={`switcher-button ${activeForm === "radiators" ? "active" : ""}`}>Grzejniki</button>
          <button onClick={() => setActiveForm("insulation")} className={`switcher-button ${activeForm === "insulation" ? "active" : ""}`}>Elewacje</button>
          <button onClick={() => setActiveForm("okna")} className={`switcher-button ${activeForm === "okna" ? "active" : ""}`}>Okna Nest</button>
        </nav>
      </header>

      <main className="form-content">
        {activeForm === "heating" && <UnifiedOfferForm />}
        {activeForm === "pv" && <PhotovoltaicsOfferForm />}
        {activeForm === "radiators" && <RadiatorsOfferForm />}
        {activeForm === "insulation" && <InsulationOfferForm />}
        {activeForm === "okna" && <OknaNestOfferForm />}
      </main>
    </div>
  );
}

export default App;