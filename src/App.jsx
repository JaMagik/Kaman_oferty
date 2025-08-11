
import React, { useState } from "react";
import UnifiedOfferForm from "./components/UnifiedOfferForm";
import PhotovoltaicsOfferForm from "./components/PhotovoltaicsOfferForm";
import OknaNestOfferForm from "./components/OknaNestOfferForm";
import RadiatorsOfferForm from "./components/RadiatorsOfferForm";
import InsulationOfferForm from "./components/InsulationOfferForm";
import RecuperationOfferForm from "./components/RecuperationOfferForm";
import ACOfferForm from "./components/ACOfferForm";

import "./assets/style.css";
import "./App.css";

import kamanLogo from "./assets/logo_kaman.png";

function App() {
  const [activeForm, setActiveForm] = useState("heating");

  const getBackgroundClass = () => {
    switch (activeForm) {
      case "heating":
        return "bg-heating";
      case "pv":
        return "bg-pv";
      case "okna":
        return "bg-okna";
      case "radiators":
        return "bg-radiators";
      default:
        return "bg-custom";
    }
  };

  const renderActiveForm = () => {
    switch (activeForm) {
      case "heating":
        return <UnifiedOfferForm />;
      case "pv":
        return <PhotovoltaicsOfferForm />;
      case "rekuperacja":
        return <RecuperationOfferForm />;
      case "radiators":
        return <RadiatorsOfferForm />;
      case "insulation":
        return <InsulationOfferForm />;
      case "okna":
        return <OknaNestOfferForm />;
      case "ac":
        return <ACOfferForm />;
      default:
        return <UnifiedOfferForm />;
    }
  };

  const tabButton = (key, label) => (
    <button
      onClick={() => setActiveForm(key)}
      className={`switcher-button ${activeForm === key ? "active" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <header className="app-header">
        <img src={kamanLogo} alt="KAMAN Logo" className="app-logo" />
        <nav className="form-switcher">
          {tabButton("heating", "Ogrzewanie")}
          {tabButton("ac", "Klimatyzacja")}
          {tabButton("pv", "Fotowoltaika")}
          {tabButton("rekuperacja", "Rekuperacja")}
          {tabButton("radiators", "Grzejniki")}
          {tabButton("insulation", "Elewacje")}
          {tabButton("okna", "Okna Nest")}
        </nav>
      </header>

      <main className="form-content">{renderActiveForm()}</main>
    </div>
  );
}

export default App;
