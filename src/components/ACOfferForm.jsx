import React, { useEffect, useMemo, useState } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import TrelloActions from "./TrelloActions";
import { acModels, acScopeTemplate } from "../data/tables/acData";
import { clientAdvisorOptions } from "../data/clientAdvisorOptions";

export default function ACOfferForm() {
  const [userName, setUserName] = useState("");
  const [investmentStreet, setInvestmentStreet] = useState("");
  const [investmentTown, setInvestmentTown] = useState("");
  const [investmentPostalCode, setInvestmentPostalCode] = useState("");
  const [investmentCity, setInvestmentCity] = useState("");
  const [advisorId, setAdvisorId] = useState(clientAdvisorOptions[0]?.value || "");
  const selectedAdvisor = useMemo(
    () => clientAdvisorOptions.find((item) => item.value === advisorId) || clientAdvisorOptions[0] || {},
    [advisorId]
  );

  const [deviceType, setDeviceType] = useState(Object.keys(acModels)[0] || "");
  const [availableModels, setAvailableModels] = useState([]);
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [showPrice, setShowPrice] = useState(true);
  const [isNettoPrice, setIsNettoPrice] = useState(true);
  const [scopeSelections, setScopeSelections] = useState(acScopeTemplate.map(() => true));
  const [generatedPdfData, setGeneratedPdfData] = useState(null);

  // Ustaw dostępne modele po zmianie serii
  useEffect(() => {
    const models = deviceType ? Object.keys(acModels[deviceType] || {}) : [];
    setAvailableModels(models);
    setModel(models[0] || "");
  }, [deviceType]);

  const formatPriceForDisplay = (value) => {
    if (!value) return "";
    const [integer, decimal] = String(value).split(".");
    const normalizedInteger = integer.replace(/\s/g, "").replace(",", ".");
    const formattedInteger = Number(normalizedInteger || 0).toLocaleString("pl-PL");
    return decimal !== undefined ? `${formattedInteger},${decimal}` : formattedInteger;
  };

  const toggleScopeSelection = (index) => {
    setScopeSelections((prev) => prev.map((isChecked, idx) => (idx === index ? !isChecked : isChecked)));
  };

  const resolvedScopeSelection = scopeSelections.some(Boolean)
    ? scopeSelections
    : acScopeTemplate.map(() => true);

  const handleGenerate = async (e) => {
    e?.preventDefault?.();
    if (showPrice && !price.trim()) {
      alert("Uzupełnij pole Ceny lub odznacz opcję pokazywania jej w ofercie.");
      return;
    }
    setGeneratedPdfData(null);

    // Minimalny zestaw opcji dla AC
    const offerOptions = { demontaz: false, podbudowa: false, dotacja: false };
    const quantityOptions = { isCustom: false };

    const pdfData = await generateOfferPDF(
      price,
      userName,
      deviceType,
      model,
      "none", // tankCapacity (dla AC nie dotyczy)
      "none", // bufferCapacity (dla AC nie dotyczy)
      "zamkniety", // systemType (bez znaczenia dla AC)
      offerOptions,
      isNettoPrice,
      quantityOptions,
      showPrice,
      {
        street: investmentStreet,
        town: investmentTown,
        postalCode: investmentPostalCode,
        city: investmentCity,
      },
      selectedAdvisor,
      resolvedScopeSelection
    );

    setGeneratedPdfData(pdfData);
  };

  const handleDownload = () => {
    if (!generatedPdfData) {
      alert("Najpierw wygeneruj PDF!");
      return;
    }
    const url = URL.createObjectURL(generatedPdfData);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Oferta_Klimatyzacja_${userName.replace(/ /g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <form className="form-container" onSubmit={handleGenerate}>
      <h2>Oferta – Klimatyzacja</h2>

      <label htmlFor="userName">Imię i nazwisko klienta:</label>
      <input
        id="userName"
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Podaj imię i nazwisko"
        required
      />

      <fieldset className="component-fieldset">
        <legend>Dane inwestycji i doradcy</legend>
        <div
          className="input-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}
        >
          <div className="input-group">
            <label htmlFor="investment_town">Miejscowość</label>
            <input
              id="investment_town"
              type="text"
              value={investmentTown}
              onChange={(event) => setInvestmentTown(event.target.value)}
              placeholder="np. Kraków"
            />
          </div>
          <div className="input-group">
            <label htmlFor="investment_street">Ulica i numer</label>
            <input
              id="investment_street"
              type="text"
              value={investmentStreet}
              onChange={(event) => setInvestmentStreet(event.target.value)}
              placeholder="np. ul. Przykładowa 12"
            />
          </div>
          <div className="input-group">
            <label htmlFor="investment_postal">Kod pocztowy</label>
            <input
              id="investment_postal"
              type="text"
              value={investmentPostalCode}
              onChange={(event) => setInvestmentPostalCode(event.target.value)}
              placeholder="np. 30-001"
            />
          </div>
          <div className="input-group">
            <label htmlFor="investment_city">Miasto</label>
            <input
              id="investment_city"
              type="text"
              value={investmentCity}
              onChange={(event) => setInvestmentCity(event.target.value)}
              placeholder="np. Kraków"
            />
          </div>
          <div className="input-group">
            <label htmlFor="offer_advisor">Ofertę sporządził</label>
            <select id="offer_advisor" value={advisorId} onChange={(event) => setAdvisorId(event.target.value)}>
              {clientAdvisorOptions.map((advisor) => (
                <option key={advisor.value} value={advisor.value}>
                  {advisor.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <label htmlFor="deviceType">Seria / Producent:</label>
      <select id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)} required>
        {Object.keys(acModels).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <label htmlFor="model">Model / Moc:</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)} required>
        {availableModels.length > 0 ? (
          availableModels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))
        ) : (
          <option value="">Brak dostępnych modeli</option>
        )}
      </select>

      <fieldset className="component-fieldset">
        <legend>Zakres montażu</legend>
        <p style={{ marginTop: 0, marginBottom: 8, color: "#5c5c5c", fontSize: "0.9rem" }}>
          Odznacz elementy, które mają zostać usunięte z zakresu montażu w ofercie.
        </p>
        <div className="options-box" style={{ marginTop: 10 }}>
          {acScopeTemplate.map((row, index) => (
            <div key={row[0]} className="option-row" style={{ alignItems: "flex-start" }}>
              <input
                type="checkbox"
                id={`scope-${index}`}
                checked={scopeSelections[index]}
                onChange={() => toggleScopeSelection(index)}
              />
              <label htmlFor={`scope-${index}`} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontWeight: 600 }}>{row[1]}</span>
                <span style={{ fontSize: "0.85rem", color: "#606060", lineHeight: 1.35 }}>{row[4]}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <label htmlFor="price">Cena końcowa (PLN):</label>
      <input
        id="price"
        type="text"
        inputMode="decimal"
        placeholder="np. 12 999,00"
        value={formatPriceForDisplay(price)}
        onChange={(e) => setPrice(e.target.value.replace(/[^\d,.\s]/g, ""))}
        disabled={!showPrice}
      />

      <div className="input-group-inline">
        <input type="checkbox" id="showPrice" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} />
        <label htmlFor="showPrice">Pokazuj cenę w ofercie</label>
      </div>

      <div className="input-group-inline">
        <input
          type="checkbox"
          id="isNettoPrice"
          checked={isNettoPrice}
          onChange={(e) => setIsNettoPrice(e.target.checked)}
        />
        <label htmlFor="isNettoPrice">Cena netto</label>
      </div>

      <button type="submit" className="primary-button">
        Generuj PDF
      </button>
      <button type="button" onClick={handleDownload} className="secondary-button">
        Pobierz PDF
      </button>

      <TrelloActions generatedPdfData={generatedPdfData} userName={userName || "Klient"} />
    </form>
  );
}
