// Pełna, zaktualizowana zawartość pliku: src/App.jsx

import React, { useState } from "react";
import UnifiedOfferForm from "./components/UnifiedOfferForm";
import PhotovoltaicsOfferForm from "./components/PhotovoltaicsOfferForm";
import OknaNestOfferForm from "./components/OknaNestOfferForm";
import RadiatorsOfferForm from "./components/RadiatorsOfferForm";
import InsulationOfferForm from "./components/InsulationOfferForm";
import RecuperationOfferForm from "./components/RecuperationOfferForm"; // Import nowego formularza

import './assets/style.css'; 
import "./App.css";        

import kamanLogo from './assets/logo_kaman.png';

// Import teł, jeśli chcesz dodać dedykowane tło dla rekuperacji
// import rekuperacjaBg from './assets/backgrounds/rekuperacja-background.jpg';

function App() {
  const [activeForm, setActiveForm] = useState("heating"); 

  const getBackgroundClass = () => {
    switch(activeForm) {
      case 'heating':
      case 'radiators':
        return 'bg-heating';
      case 'pv':
      case 'rekuperacja': // Używamy tła PV dla rekuperacji dla spójności
        return 'bg-pv';
      case 'okna':
      case 'insulation':
        return 'bg-okna';
      default:
        return 'bg-heating';
    }
  };

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'heating':
        return <UnifiedOfferForm />;
      case 'pv':
        return <PhotovoltaicsOfferForm />;
      case 'radiators':
        return <RadiatorsOfferForm />;
      case 'insulation':
        return <InsulationOfferForm />;
      case 'rekuperacja':
        return <RecuperationOfferForm />;
      case 'okna':
        return <OknaNestOfferForm />;
      default:
        return <UnifiedOfferForm />;
    }
  };

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <header className="app-header">
        <img src={kamanLogo} alt="KAMAN Logo" className="app-logo" />
        <nav className="form-switcher">
          <button onClick={() => setActiveForm("heating")} className={`switcher-button ${activeForm === "heating" ? "active" : ""}`}>Ogrzewanie</button>
          <button onClick={() => setActiveForm("pv")} className={`switcher-button ${activeForm === "pv" ? "active" : ""}`}>Fotowoltaika</button>
          <button onClick={() => setActiveForm("rekuperacja")} className={`switcher-button ${activeForm === "rekuperacja" ? "active" : ""}`}>Rekuperacja</button>
          <button onClick={() => setActiveForm("radiators")} className={`switcher-button ${activeForm === "radiators" ? "active" : ""}`}>Grzejniki</button>
          <button onClick={() => setActiveForm("insulation")} className={`switcher-button ${activeForm === "insulation" ? "active" : ""}`}>Elewacje</button>
          <button onClick={() => setActiveForm("okna")} className={`switcher-button ${activeForm === "okna" ? "active" : ""}`}>Okna Nest</button>
        </nav>
      </header>

      <main className="form-content">
        {renderActiveForm()}
      </main>
    </div>
  );
}

export default App;
