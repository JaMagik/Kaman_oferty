// src/App.jsx
import React, { useState, useEffect } from "react";
import UnifiedOfferForm from "./components/UnifiedOfferForm";
import PhotovoltaicsOfferForm from "./components/PhotovoltaicsOfferForm";
import OknaNestOfferForm from "./components/OknaNestOfferForm"; // Import nowego komponentu
import './assets/style.css'; // Główne style formularzy
import "./App.css";        // Style dla layoutu aplikacji i przełącznika

// Zaimportuj swoje logo - zmień ścieżkę, jeśli jest inna
import kamanLogo from './assets/logo_kaman.png'; // Załóżmy, że logo jest tutaj

// Import obrazów tła
import heatingBg from './assets/backgrounds/heating-background.jpg';
import pvBg from './assets/backgrounds/pv-background.jpg';
import oknaBg from './assets/backgrounds/okna-background.jpg';

const backgroundMap = {
  heating: heatingBg,
  pv: pvBg,
  okna: oknaBg,
};

function App() {
  const [activeForm, setActiveForm] = useState("heating"); // 'heating', 'pv', lub 'okna'
  const [appBackground, setAppBackground] = useState(backgroundMap.heating);

  useEffect(() => {
    setAppBackground(backgroundMap[activeForm]);
  }, [activeForm]);

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
            Generator Ogrzewanie
          </button>
          <button
            onClick={() => setActiveForm("pv")}
            className={`switcher-button ${activeForm === "pv" ? "active" : ""}`}
          >
            Generator Fotowoltaika
          </button>
          <button
            onClick={() => setActiveForm("okna")}
            className={`switcher-button ${activeForm === "okna" ? "active" : ""}`}
          >
            Generator Okna Nest
          </button>
        </nav>
      </header>

      <main className="form-content">
        {activeForm === "heating" && <UnifiedOfferForm />}
        {activeForm === "pv" && <PhotovoltaicsOfferForm />}
        {activeForm === "okna" && <OknaNestOfferForm />}
      </main>
    </div>
  );
}

export default App;