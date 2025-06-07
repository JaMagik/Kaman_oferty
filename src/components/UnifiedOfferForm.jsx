// ścieżka: src/components/UnifiedOfferForm.jsx

import React, { useState, useEffect } from "react";
// generateOfferPDF będzie teraz prawdopodobnie zwracać dane PDF
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";
import { lazarBaseTables } from "../data/tables/lazarTables";
import { viessmannBaseTables } from "../data/tables/viessmannTables";
import { kotlospawSlimkoPlusBaseTables } from "../data/tables/kotlospawSlimkoPlusTable"; // <-- POPRAWIONY IMPORT

const allDevicesData = {
  ...mitsubishiBaseTables,
  ...atlanticBaseTables,
  ...lazarBaseTables,
  ...viessmannBaseTables,
  ...kotlospawSlimkoPlusBaseTables
};

// Klucz API Trello (ten jest publiczny i używany do inicjalizacji OAuth)
const TRELLO_API_KEY = '0f932c28c8d97d03741c8863c2ff4afb';
// Nazwa Twojej aplikacji, jak zarejestrowana w Trello
const TRELLO_APP_NAME = 'KamanOfertyPowerUp'; // Lub inna nazwa, którą nadałeś

// Definicja typów urządzeń będących kotłami na pellet
const pelletBoilerDeviceTypes = ["LAZAR", "Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "QMPELL", "DREWKO-HYBRID", "Kotlospaw drewko plus palnik easy ROT"];

// Opcje buforów dla pomp ciepła
const heatPumpBufferOptions = [
  { value: "sprzeglo", label: "Sprzęgło hydrauliczne z osprzętem" },
  { value: "none", label: "Brak bufora" },
  { value: "40-120L", label: "Bufor 40-120 L + osprzęt" },
  { value: "40L", label: "Bufor 40 L + osprzęt" },
  { value: "60L", label: "Bufor 60 L + osprzęt" },
  { value: "80L", label: "Bufor 80 L + osprzęt" },
  { value: "100L", label: "Bufor 100 L + osprzęt" },
  { value: "120L", label: "Bufor 120 L + osprzęt" },
  { value: "140L", label: "Bufor 140 L + osprzęt" },
];

// Opcje buforów dla kotłów na pellet
const pelletBoilerBufferOptions = [
  { value: "sprzeglo", label: "Sprzęgło hydrauliczne z osprzętem" },
  { value: "none", label: "Brak bufora" },
  { value: "100L", label: "Bufor 100 L + osprzęt" },
  { value: "120L", label: "Bufor 120 L + osprzęt" },
  { value: "140L", label: "Bufor 140 L + osprzęt" },
  { value: "200L", label: "Bufor 200 L + osprzęt" },
  { value: "300L", label: "Bufor 300 L + osprzęt" },
  { value: "500L", label: "Bufor 500 L + osprzęt" },
  { value: "800L", label: "Bufor 800 L + osprzęt" },
  { value: "1000L", label: "Bufor 1000 L + osprzęt" },
];


export default function UnifiedOfferForm() {
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  const [deviceType, setDeviceType] = useState("Mitsubishi-cylinder-PUZ");
  const [model, setModel] = useState("12 kW");
  const [availableModels, setAvailableModels] = useState([]);
  const [tank, setTank] = useState("200 L STAL NIERDZEWNA");
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem");
  const [currentBufferOptions, setCurrentBufferOptions] = useState(heatPumpBufferOptions);


  // Stany dla integracji z Trello
  const [trelloCardId, setTrelloCardId] = useState(null);
  const [trelloUserToken, setTrelloUserToken] = useState(null);
  const [isSavingToTrello, setIsSavingToTrello] = useState(false);
  const [generatedPdfData, setGeneratedPdfData] = useState(null); // Do przechowywania wygenerowanego PDF

  // Efekt do odczytu trelloCardId i tokena (jeśli wraca z autoryzacji)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardIdFromUrl = urlParams.get('trelloCardId');
    if (cardIdFromUrl) {
      setTrelloCardId(cardIdFromUrl);
      console.log("Odczytano trelloCardId z URL:", cardIdFromUrl);
    }

    if (window.location.hash.includes("#token=")) {
      const token = window.location.hash.substring(window.location.hash.indexOf('=') + 1);
      setTrelloUserToken(token);
      console.log("Odczytano token Trello z URL hash:", token);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
  }, []);


  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType]
      ? Object.keys(allDevicesData[deviceType])
      : [];
    setAvailableModels(modelsForDevice);
    if (modelsForDevice.length > 0 && !modelsForDevice.includes(model)) {
      setModel(modelsForDevice[0]);
    } else if (modelsForDevice.length === 0) {
      setModel("");
    }

    // Aktualizacja opcji bufora na podstawie deviceType
    const isPelletBoiler = pelletBoilerDeviceTypes.includes(deviceType);
    const newBufferOptions = isPelletBoiler ? pelletBoilerBufferOptions : heatPumpBufferOptions;
    setCurrentBufferOptions(newBufferOptions);

    // Sprawdzenie, czy aktualnie wybrany bufor jest dostępny w nowych opcjach
    // Jeśli nie, ustaw domyślną wartość
    if (!newBufferOptions.find(option => option.value === buffer)) {
      setBuffer(newBufferOptions[0]?.value || "none"); // Ustaw na pierwszą opcję lub "none"
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType, model]); // Dodano 'model' do zależności, chociaż logika bufora zależy głównie od 'deviceType'

  const handleGenerateAndSetPdf = async (e) => {
    if (e) e.preventDefault();

    const pdfData = await generateOfferPDF(price, userName, deviceType, model, tank, buffer);
    if (pdfData) {
      setGeneratedPdfData(pdfData);
      console.log("PDF wygenerowany i zapisany w stanie.");
    }
  };

  const handleDownloadPdf = () => {
    if (generatedPdfData) {
      const url = URL.createObjectURL(generatedPdfData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert("Najpierw wygeneruj PDF!");
    }
  };


  const handleTrelloAuth = () => {
    const returnUrl = window.location.href.split('#')[0];
    const authUrl = `https://trello.com/1/authorize?expiration=1day&name=${encodeURIComponent(TRELLO_APP_NAME)}&scope=read,write&response_type=token&key=${TRELLO_API_KEY}&return_url=${encodeURIComponent(returnUrl)}`;
    window.location.href = authUrl;
  };

  const handleSaveToTrello = async () => {
    if (!generatedPdfData) {
      alert("Najpierw wygeneruj PDF!");
      return;
    }
    if (!trelloCardId) {
      alert("Brak ID karty Trello. Otwórz aplikację z Power-Upa.");
      return;
    }
    if (!trelloUserToken) {
      alert("Brak autoryzacji Trello. Kliknij 'Autoryzuj Trello'.");
      return;
    }

    setIsSavingToTrello(true);

    const reader = new FileReader();
    reader.readAsDataURL(generatedPdfData);
    reader.onloadend = async () => {
      const base64Pdf = reader.result;

      try {
        const response = await fetch('/api/saveToTrello', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: trelloCardId,
            token: trelloUserToken,
            fileDataUrl: base64Pdf,
            fileName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`
          })
        });

        if (response.ok) {
          alert("Sukces! Oferta została zapisana na karcie Trello.");
        } else {
          const error = await response.json();
          alert("Błąd zapisu do Trello: " + (error.message || response.statusText));
        }
      } catch (err) {
        console.error("Błąd sieciowy przy zapisie do Trello:", err);
        alert("Wystąpił błąd sieciowy podczas zapisu do Trello.");
      } finally {
        setIsSavingToTrello(false);
      }
    };
    reader.onerror = () => {
      console.error("Błąd odczytu pliku PDF");
      alert("Błąd odczytu pliku PDF.");
      setIsSavingToTrello(false);
    };
  };

  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert KAMAN</h2>

      <label htmlFor="userName">Imię i Nazwisko Klienta:</label>
      <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />

      <label htmlFor="price">Cena Końcowa (PLN):</label>
      <input id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Podaj cenę" required />

      <label htmlFor="deviceType">Typ Urządzenia/Oferty:</label>
      <select id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
        <optgroup label="Mitsubishi (Pompy Ciepła)">
          <option value="Mitsubishi-cylinder">Mitsubishi Cylinder (Standard PUD)</option>
          <option value="Mitsubishi-cylinder-PUZ">Mitsubishi Cylinder (Zubadan PUZ)</option>
          <option value="Mitsubishi-cylinder-PUZ-1F">Mitsubishi Cylinder (Zubadan PUZ 1-faz.)</option>
          <option value="Mitsubishi-hydrobox">Mitsubishi Hydrobox (Standard PUD)</option>
          <option value="Mitsubishi-hydrobox-PUZ">Mitsubishi Hydrobox (Zubadan PUZ)</option>
          <option value="Mitsubishi-hydrobox-PUZ-1F">Mitsubishi Hydrobox (Zubadan PUZ 1-faz.)</option>
          <option value="Mitsubishi-ecoinverter">Mitsubishi Ecoinverter (Cylinder)</option>
          <option value="Mitsubishi-ecoinverter-hydrobox">Mitsubishi Ecoinverter (Hydrobox)</option>
          <option value="Mitsubishi-hp">Mitsubishi Hyper Heating</option>
        </optgroup>
        <optgroup label="Mitsubishi (Klimatyzatory)">
          <option value="MITSUBISHI AY">Klimatyzator Mitsubishi AY</option>
          <option value="MITSUBISHI HR">Klimatyzator Mitsubishi HR</option>
        </optgroup>
        <optgroup label="Toshiba">
          <option value="Toshiba 3F">Toshiba (3-fazowe)</option>
          <option value="Toshiba 1F">Toshiba (1-fazowe)</option>
        </optgroup>
        <optgroup label="Atlantic (Pompy Ciepła)">
          <option value="ATLANTIC-M-DUO">Atlantic S-TRI hydrobox</option>
          <option value="ATLANTIC-S">Atlantic S-TRI-Duo cylinder</option>
        </optgroup>
        <optgroup label="Kotły na Pellet">
          <option value="LAZAR">Lazar</option>
          {/* Możesz dodać tutaj inne typy kotłów, jeśli zostaną zdefiniowane w pelletBoilerDeviceTypes */}
          <option value="QMPELL">QMPell EVO</option>
          <option value="Kotlospaw Slimko Plus">Kotlospaw Slimko Plus</option>
          <option value="Kotlospaw slimko plus niski">Kotlospaw slimko plus niski</option>
        </optgroup>
        <optgroup label="Kotły Hybrydowe (traktowane jak na pellet dla bufora)">
             <option value="DREWKO-HYBRID">Kotłospaw Drewko Hybrid</option>
             <option value="Kotlospaw drewko plus palnik easy ROT">Kotłospaw Drewko Plus + Palnik Easy Rot</option>
        </optgroup>
        <optgroup label="Viessmann (Pompy Ciepła)">
          <option value="VIESSMANN">Viessmann Vitocal 150-A</option>
        </optgroup>
      </select>

      <label htmlFor="model">Model (Moc):</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={availableModels.length === 0}>
        {availableModels.length > 0 ? (
          availableModels.map((modelName) => (
            <option key={modelName} value={modelName}>
              {modelName}
            </option>
          ))
        ) : (
          <option value="">Brak dostępnych modeli</option>
        )}
      </select>

      <label htmlFor="tank">Pojemność zasobnika CWU:</label>
      <select id="tank" value={tank} onChange={(e) => setTank(e.target.value)}>
        <option value="none">Brak zasobnika CWU / Zintegrowany</option>
        <option value="200L">200 L</option>
        <option value="300L">300 L</option>
        <option value="400L">400 L</option>
         <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
        <option value="250 L STAL NIERDZEWNA">250 L STAL NIERDZEWNA</option>
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
      </select>

      <label htmlFor="buffer">Bufor/Sprzęgło:</label>
      <select id="buffer" value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        {currentBufferOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button type="submit">
        Generuj PDF
      </button>

      {generatedPdfData && (
        <button type="button" onClick={handleDownloadPdf} style={{ marginTop: '10px', background: '#555' }}>
          Pobierz wygenerowany PDF
        </button>
      )}

      {trelloCardId && !trelloUserToken && (
        <button type="button" onClick={handleTrelloAuth} style={{ marginTop: '20px', background: '#0079BF' }}>
          Autoryzuj Trello
        </button>
      )}

      {trelloCardId && trelloUserToken && generatedPdfData && (
        <button
          type="button"
          onClick={handleSaveToTrello}
          disabled={isSavingToTrello}
          style={{ marginTop: '10px', background: isSavingToTrello ? '#ccc' : '#0079BF' }}
        >
          {isSavingToTrello ? "Zapisywanie..." : "Zapisz ofertę w Trello"}
        </button>
      )}
    </form>
  );
}