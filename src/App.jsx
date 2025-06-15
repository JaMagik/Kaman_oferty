// src/App.jsx
import React, { useState, useEffect } from "react";
import UnifiedOfferForm from "./components/UnifiedOfferForm";
import PhotovoltaicsOfferForm from "./components/PhotovoltaicsOfferForm";
import OknaNestOfferForm from "./components/OknaNestOfferForm";
import RadiatorsOfferForm from "./components/RadiatorsOfferForm"; // Import nowego komponentu
import './assets/style.css'; 
import "./App.css";        

import kamanLogo from './assets/logo_kaman.png';

import heatingBg from './assets/backgrounds/heating-background.jpg';
import pvBg from './assets/backgrounds/pv-background.jpg';
import oknaBg from './assets/backgrounds/okna-background.jpg';
// Możesz dodać osobne tło dla grzejników lub użyć istniejącego
import radiatorsBg from './assets/backgrounds/heating-background.jpg'; 

const backgroundMap = {
  heating: heatingBg,
  pv: pvBg,
  okna: oknaBg,
  radiators: radiatorsBg, // Dodane tło
};

function App() {
  const [activeForm, setActiveForm] = useState("heating"); 

  // Zamiast dynamicznie zmieniać styl inline, będziemy zmieniać klasę
  // aby style tła były zarządzane przez CSS dla lepszej organizacji.

  return (
    <div className={`app-container bg-${activeForm}`}>
      <header className="app-header">
        <img src={kamanLogo} alt="KAMAN Logo" className="app-logo" />
        <nav className="form-switcher">
          <button
            onClick={() => setActiveForm("heating")}
            className={`switcher-button ${activeForm === "heating" ? "active" : ""}`}
          >
            Ogrzewanie
          </button>
          <button
            onClick={() => setActiveForm("pv")}
            className={`switcher-button ${activeForm === "pv" ? "active" : ""}`}
          >
            Fotowoltaika
          </button>
          <button
            onClick={() => setActiveForm("radiators")}
            className={`switcher-button ${activeForm === "radiators" ? "active" : ""}`}
          >
            Grzejniki
          </button>
          <button
            onClick={() => setActiveForm("okna")}
            className={`switcher-button ${activeForm === "okna" ? "active" : ""}`}
          >
            Okna Nest
          </button>
        </nav>
      </header>

      <main className="form-content">
        {activeForm === "heating" && <UnifiedOfferForm />}
        {activeForm === "pv" && <PhotovoltaicsOfferForm />}
        {activeForm === "radiators" && <RadiatorsOfferForm />}
        {activeForm === "okna" && <OknaNestOfferForm />}
      </main>
    </div>
  );
}

export default App;