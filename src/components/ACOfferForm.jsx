
import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import TrelloActions from "./TrelloActions";
import { acModels } from "../data/tables/acData";

export default function ACOfferForm() {
  const [userName, setUserName] = useState("");
  const [deviceType, setDeviceType] = useState(Object.keys(acModels)[0] || "");
  const [availableModels, setAvailableModels] = useState([]);
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [showPrice, setShowPrice] = useState(true);
  const [isNettoPrice, setIsNettoPrice] = useState(true);
  const [generatedPdfData, setGeneratedPdfData] = useState(null);
  const [trelloParams, setTrelloParams] = useState({
    boardId: "",
    listId: "",
    cardName: "",
    cardDesc: ""
  });

  // Ustaw dostępne modele po zmianie serii
  useEffect(() => {
    const models = deviceType ? Object.keys(acModels[deviceType] || {}) : [];
    setAvailableModels(models);
    if (models.length > 0) {
      setModel(models[0]);
    } else {
      setModel("");
    }
  }, [deviceType]);

  const formatPriceForDisplay = (value) => {
    if (!value) return "";
    const [integer, decimal] = String(value).split(".");
    const formattedInteger = Number(integer.replace(/\s/g, "").replace(",", ".")).toLocaleString("pl-PL");
    return decimal !== undefined ? `${formattedInteger},${decimal}` : formattedInteger;
  };

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
      "none",           // tankCapacity (dla AC nie dotyczy)
      "none",           // bufferCapacity (dla AC nie dotyczy)
      "zamkniety",      // systemType (bez znaczenia dla AC)
      offerOptions,
      isNettoPrice,
      quantityOptions,
      showPrice
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

      <label htmlFor="deviceType">Seria / Producent:</label>
      <select
        id="deviceType"
        value={deviceType}
        onChange={(e) => setDeviceType(e.target.value)}
        required
      >
        {Object.keys(acModels).map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <label htmlFor="model">Model / Moc:</label>
      <select
        id="model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      >
        {availableModels.length > 0 ? (
          availableModels.map((m) => <option key={m} value={m}>{m}</option>)
        ) : (
          <option value="">Brak dostępnych modeli</option>
        )}
      </select>

      <div className="checkbox-group">
        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={showPrice}
            onChange={(e) => setShowPrice(e.target.checked)}
          />
          Pokazuj cenę w ofercie
        </label>
      </div>

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

      <div className="checkbox-group">
        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={isNettoPrice}
            onChange={(e) => setIsNettoPrice(e.target.checked)}
          />
          Cena netto
        </label>
      </div>

      <button type="submit" className="primary-button">Generuj PDF</button>
      <button type="button" onClick={handleDownload} className="secondary-button">Pobierz PDF</button>

      <TrelloActions
        pdfData={generatedPdfData}
        cardName={trelloParams.cardName}
        setCardName={(v) => setTrelloParams((s) => ({ ...s, cardName: v }))}
        cardDesc={trelloParams.cardDesc}
        setCardDesc={(v) => setTrelloParams((s) => ({ ...s, cardDesc: v }))}
        boardId={trelloParams.boardId}
        setBoardId={(v) => setTrelloParams((s) => ({ ...s, boardId: v }))}
        listId={trelloParams.listId}
        setListId={(v) => setTrelloParams((s) => ({ ...s, listId: v }))}
      />
    </form>
  );
}
