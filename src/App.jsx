import React, { useState } from "react";
import UnifiedOfferForm from "./components/UnifiedOfferForm";
import PhotovoltaicsOfferForm from "./components/PhotovoltaicsOfferForm";
import './assets/style.css'; // Główne style formularzy
import "./App.css";        // Style dla layoutu aplikacji i przełącznika

// Zaimportuj swoje logo - zmień ścieżkę, jeśli jest inna
import kamanLogo from './assets/logo_kaman.png'; // Załóżmy, że logo jest tutaj

function App() {
  const [activeForm, setActiveForm] = useState("heating"); // 'heating' lub 'pv'

  return (
    <div className="app-container">
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
        </nav>
      </header>

      <main className="form-content">
        {activeForm === "heating" && <UnifiedOfferForm />}
        {activeForm === "pv" && <PhotovoltaicsOfferForm />}
      </main>
    </div>
  );
}

export default App;
