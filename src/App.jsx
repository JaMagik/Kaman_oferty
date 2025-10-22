
import React, { useState } from "react";
import UnifiedOfferForm from "./components/UnifiedOfferForm";
import PhotovoltaicsOfferForm from "./components/PhotovoltaicsOfferForm";
import OknaNestOfferForm from "./components/OknaNestOfferForm";
import RadiatorsOfferForm from "./components/RadiatorsOfferForm";
import InsulationOfferForm from "./components/InsulationOfferForm";
import RecuperationOfferForm from "./components/RecuperationOfferForm";
import ACOfferForm from "./components/ACOfferForm";
import DoorsOfferForm from "./components/DoorsOfferForm";
import GarageDoorsOfferForm from "./components/GarageDoorsOfferForm";

import "./assets/style.css";
import "./App.css";

import kamanLogo from "./assets/logo_kaman.png";

function App() {
  const [activeForm, setActiveForm] = useState("heat-pumps");

  const getBackgroundClass = () => {
    switch (activeForm) {
      case "heat-pumps":
      case "boilers":
        return "bg-heating";
      case "pv":
        return "bg-pv";
      case "okna":
        return "bg-okna";
      case "doors":
      case "garage-doors":
        return "bg-okna";
      case "radiators":
        return "bg-radiators";
      default:
        return "bg-custom";
    }
  };

  const renderActiveForm = () => {
    switch (activeForm) {
      case "heat-pumps":
        return <UnifiedOfferForm key="heat-pumps" deviceCategory="heat-pump" />;
      case "boilers":
        return <UnifiedOfferForm key="boilers" deviceCategory="boiler" />;
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
      case "doors":
        return <DoorsOfferForm />;
      case "garage-doors":
        return <GarageDoorsOfferForm />;
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
          {tabButton("heat-pumps", "Pompy ciepła")}
          {tabButton("boilers", "Piece")}
          {tabButton("ac", "Klimatyzacja")}
          {tabButton("pv", "Fotowoltaika")}
          {tabButton("rekuperacja", "Rekuperacja")}
          {tabButton("radiators", "Grzejniki")}
          {tabButton("insulation", "Elewacje")}
          {tabButton("okna", "Okna Nest")}
          {tabButton("doors", "Drzwi")}
          {tabButton("garage-doors", "Bramy garażowe")}
        </nav>
      </header>

      <main className="form-content">{renderActiveForm()}</main>
    </div>
  );
}

export default App;
