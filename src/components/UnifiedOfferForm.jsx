import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";
import { lazarBaseTables } from "../data/tables/lazarTables";
import { viessmannBaseTables } from "../data/tables/viessmannTables";
import { kotlospawSlimkoPlusBaseTables } from "../data/tables/kotlospawSlimkoPlusTable";
import { kotlospawSlimkoPlusNiskiBaseTables } from "../data/tables/kotlospawSlimkoPlusNiskiTable";
import { qmpellBaseTables } from "../data/tables/qmpellEvoTables";
import { kotlospawDrewkoPlusBaseTables } from "../data/tables/kotlospawDrewkoPlusTable";
import { kotlospawDrewkoHybridBaseTables } from "../data/tables/kotlospawDrewkoHybridTable";
import { toshiba1fBaseTables } from '../data/tables/toshiba1fTable';
import { kaisaiHydroboxBaseTables } from '../data/tables/kaisaiTable';

const allDevicesData = {
  ...mitsubishiBaseTables,
  ...atlanticBaseTables,
  ...lazarBaseTables,
  ...viessmannBaseTables,
  ...kotlospawSlimkoPlusBaseTables,
  ...kotlospawSlimkoPlusNiskiBaseTables,
  ...qmpellBaseTables,
  ...kotlospawDrewkoPlusBaseTables,
  ...kotlospawDrewkoHybridBaseTables,
  ...toshiba1fBaseTables,
  ...kaisaiHydroboxBaseTables,
};

const TRELLO_API_KEY = '0f932c28c8d97d03741c8863c2ff4afb';
const TRELLO_APP_NAME = 'KamanOfertyPowerUp';

// Definicja typów urządzeń będących kotłami
const boilerDeviceTypes = [
    "LAZAR", 
    "Kotlospaw Slimko Plus", 
    "Kotlospaw slimko plus niski", 
    "QMPELL", 
    "Kotlospaw drewko plus",
    "Kotlospaw drewko hybrid"
];

// Opcje buforów dla pomp ciepła
const heatPumpBufferOptions = [
  { value: "sprzeglo", label: "Sprzęgło hydrauliczne z osprzętem" },
  { value: "none", label: "Bufor niewymagany" },
  { value: "40-100L", label: "Bufor 40-100 L + osprzęt" },
  { value: "200L", label: "Bufor 200 L + osprzęt" },
  { value: "300L", label: "Bufor 300 L + osprzęt" },
];

// Opcje buforów dla kotłów ("pieców")
const boilerBufferOptions = [
   { value: "sprzeglo", label: "Sprzęgło hydrauliczne z osprzętem" },
  { value: "none", label: "Bufor niewymagany" },
  { value: "zawor-4d", label: "Zawór czterodrożny z siłownikiem" },
  { value: "100L", label: "Bufor 100 L + osprzęt" },
  { value: "120L", label: "Bufor 120 L + osprzęt" },
  { value: "140L", label: "Bufor 140 L + osprzęt" },
  { value: "200L", label: "Bufor 200 L + osprzęt" },
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

  const [trelloCardId, setTrelloCardId] = useState(null);
  const [trelloUserToken, setTrelloUserToken] = useState(null);
  const [isSavingToTrello, setIsSavingToTrello] = useState(false);
  const [generatedPdfData, setGeneratedPdfData] = useState(null);
  
  const [systemType, setSystemType] = useState('zamkniety');

  // Funkcja do formatowania ceny do wyświetlenia w polu input
  const formatPriceForDisplay = (value) => {
    if (!value) return '';
    const [integer, decimal] = String(value).split('.');
    
    // Używamy toLocaleString do automatycznego dodania separatorów tysięcy
    const formattedInteger = Number(integer).toLocaleString('pl-PL');
    
    // Jeśli jest część dziesiętna, dołączamy ją z przecinkiem
    if (decimal !== undefined) {
      return `${formattedInteger},${decimal}`;
    }
    // Jeśli użytkownik właśnie wpisał przecinek/kropkę, zostawiamy ją
    if(String(value).slice(-1) === '.') {
      return `${formattedInteger},`;
    }

    return formattedInteger;
  };

  // Funkcja obsługująca zmiany w polu ceny
  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    
    // 1. Usuwamy spacje i wszystko, co nie jest cyfrą, kropką lub przecinkiem
    let cleanedValue = rawValue.replace(/[^0-9,.]/g, '').replace(/\s/g, '');
    
    // 2. Zamieniamy przecinek na kropkę
    cleanedValue = cleanedValue.replace(',', '.');

    // 3. Zapewniamy, że jest tylko jedna kropka
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
        cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // 4. Ograniczamy do dwóch miejsc po przecinku
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      cleanedValue = parts.join('.');
    }

    setPrice(cleanedValue);
  };

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
    const isBoiler = boilerDeviceTypes.includes(deviceType);
    setCurrentBufferOptions(isBoiler ? boilerBufferOptions : heatPumpBufferOptions);

    if (!isBoiler) {
        setSystemType('zamkniety'); // Reset dla pomp ciepła
    }

  }, [deviceType, model]);

  const handleGenerateAndSetPdf = async (e) => {
    if (e) e.preventDefault();
    const pdfData = await generateOfferPDF(price, userName, deviceType, model, tank, buffer, systemType);
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
  
  const isBoiler = boilerDeviceTypes.includes(deviceType);

  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert KAMAN</h2>
      <label htmlFor="userName">Imię i Nazwisko Klienta:</label>
      <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />

      <label htmlFor="price">Cena Końcowa (PLN):</label>
      <input
        id="price"
        type="text"
        inputMode="decimal"
        value={formatPriceForDisplay(price)}
        onChange={handlePriceChange}
        placeholder="Podaj cenę"
        required
      />

      <label htmlFor="deviceType">Typ Urządzenia/Oferty:</label>
      <select id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
        <optgroup label="Mitsubishi (Pompy Ciepła)">
          <option value="Mitsubishi-hydrobox">Mitsubishi Hydrobox (Standard PUD)</option>
          <option value="Mitsubishi-cylinder-PUZ">Mitsubishi Cylinder (Zubadan PUZ)</option>
          <option value="Mitsubishi-cylinder-PUZ-1F">Mitsubishi Cylinder (Zubadan PUZ 1-faz.)</option>
          <option value="Mitsubishi-hydrobox-PUZ">Mitsubishi Hydrobox (Zubadan PUZ)</option>
          <option value="Mitsubishi-hydrobox-PUZ-1F">Mitsubishi Hydrobox (Zubadan PUZ 1-faz.)</option>
          <option value="Mitsubishi-ecoinverter">Mitsubishi Ecoinverter (Cylinder)</option>
          <option value="Mitsubishi-ecoinverter-hydrobox">Mitsubishi Ecoinverter (Hydrobox)</option>
        </optgroup>
        <optgroup label="Toshiba ( Pompy Ciepła)">
          <option value="Toshiba 1F">Toshiba (1-fazowe)</option>
        </optgroup>
        <optgroup label="Atlantic (Pompy Ciepła)">
          <option value="ATLANTIC-M-DUO">Atlantic S-TRI hydrobox</option>
          <option value="ATLANTIC-S">Atlantic S-TRI-Duo cylinder</option>
        </optgroup>
        <optgroup label="Kotły na Pellet">
          <option value="LAZAR">Lazar</option>
          <option value="QMPELL">QMPell EVO</option>
          <option value="Kotlospaw Slimko Plus">Kotłospaw Slimko Plus</option>
          <option value="Kotlospaw slimko plus niski">Kotłospaw Slimko Plus niski</option>
        </optgroup>
        <optgroup label="Kotły na Drewno / Hybrydowe">
            <option value="Kotlospaw drewko plus">Kotłospaw Drewko Plus</option>
            <option value="Kotlospaw drewko hybrid">Kotłospaw Drewko Hybrid</option>
        </optgroup>
        <optgroup label="Viessmann (Pompy Ciepła)">
            <option value="VIESSMANN">Viessmann Vitocal 150-A</option>
        </optgroup>
        <optgroup label="Kaisai ( Pompy Ciepła)">
            <option value="Kaisai">Kaisai</option>
        </optgroup>
        <optgroup label="Mitsubishi (Klimatyzatory)">
            <option value="MITSUBISHI AY">Klimatyzator Mitsubishi AY</option>
            <option value="MITSUBISHI HR">Klimatyzator Mitsubishi HR</option>
        </optgroup>
      </select>
      <label htmlFor="model">Model (Moc):</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={availableModels.length === 0}>
        {availableModels.length > 0 ? (
          availableModels.map((modelName) => (
            <option key={modelName} value={modelName}>{modelName}</option>
          ))
        ) : (
          <option value="">Brak dostępnych modeli</option>
        )}
      </select>
      <label htmlFor="tank">Pojemność zasobnika CWU:</label>
      <select id="tank" value={tank} onChange={(e) => setTank(e.target.value)}>
          <option value="140L">140 L</option>
          <option value="200L">200 L</option>
          <option value="none">Zasobnik CWU nie wymagany/ Zintegrowany</option>
          <option value="integrated">Zasobnik CWU zintegrowany</option>
          <option value="300L">300 L</option>
          <option value="400L">400 L</option>
          <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
          <option value="250 L STAL NIERDZEWNA">250 L STAL NIERDZEWNA</option>
          <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
      </select>
      <label htmlFor="buffer">Bufor/Sprzęgło:</label>
      <select id="buffer" value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        {currentBufferOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      {isBoiler && (
        <div className="input-group" style={{marginTop: '10px'}}>
            <label htmlFor="systemType">Typ układu hydraulicznego:</label>
            <select id="systemType" value={systemType} onChange={(e) => setSystemType(e.target.value)}>
                <option value="zamkniety">Układ zamknięty</option>
                <option value="otwarty">Układ otwarty</option>
            </select>
        </div>
      )}

      <button type="submit">Generuj PDF</button>

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
        <button type="button" onClick={handleSaveToTrello} disabled={isSavingToTrello} style={{ marginTop: '10px', background: isSavingToTrello ? '#ccc' : '#0079BF' }}>
          {isSavingToTrello ? "Zapisywanie..." : "Zapisz ofertę w Trello"}
        </button>
      )}
    </form>
  );
}