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

const boilerDeviceTypes = [
    "LAZAR", 
    "Kotlospaw Slimko Plus", 
    "Kotlospaw slimko plus niski", 
    "QMPELL", 
    "Kotlospaw drewko plus",
    "Kotlospaw drewko hybrid"
];

const heatPumpBufferOptions = [
  { value: "sprzeglo", label: "Sprzęgło hydrauliczne z osprzętem" },
  { value: "none", label: "Bufor niewymagany" },
  { value: "40-100L", label: "Bufor 40-100 L + osprzęt" },
  { value: "200L", label: "Bufor 200 L + osprzęt" },
  { value: "300L", label: "Bufor 300 L + osprzęt" },
];

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
  
  const [includeDemontaz, setIncludeDemontaz] = useState(true);
  const [includePodbudowa, setIncludePodbudowa] = useState(true);
  const [isNettoPrice, setIsNettoPrice] = useState(false);

  // NOWE STANY DO ZARZĄDZANIA ILOŚCIĄ
  const [isCustomQuantity, setIsCustomQuantity] = useState(false);
  const [outdoorUnitQty, setOutdoorUnitQty] = useState(1);
  const [indoorUnitQty, setIndoorUnitQty] = useState(1);

  const [trelloCardId, setTrelloCardId] = useState(null);
  const [trelloUserToken, setTrelloUserToken] = useState(null);
  const [isSavingToTrello, setIsSavingToTrello] = useState(false);
  const [generatedPdfData, setGeneratedPdfData] = useState(null);
  
  const [systemType, setSystemType] = useState('zamkniety');

  const isBoiler = boilerDeviceTypes.includes(deviceType);

  const formatPriceForDisplay = (value) => {
    if (!value) return '';
    const [integer, decimal] = String(value).split('.');
    const formattedInteger = Number(integer).toLocaleString('pl-PL');
    if (decimal !== undefined) return `${formattedInteger},${decimal}`;
    if(String(value).slice(-1) === '.') return `${formattedInteger},`;
    return formattedInteger;
  };

  const handlePriceChange = (e) => {
    let cleanedValue = e.target.value.replace(/[^0-9,.]/g, '').replace(/\s/g, '');
    cleanedValue = cleanedValue.replace(',', '.');
    const parts = cleanedValue.split('.');
    if (parts.length > 2) cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      cleanedValue = parts.join('.');
    }
    setPrice(cleanedValue);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardIdFromUrl = urlParams.get('trelloCardId');
    if (cardIdFromUrl) setTrelloCardId(cardIdFromUrl);
    if (window.location.hash.includes("#token=")) {
      const token = window.location.hash.substring(window.location.hash.indexOf('=') + 1);
      setTrelloUserToken(token);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : [];
    setAvailableModels(modelsForDevice);
    if (modelsForDevice.length > 0 && !modelsForDevice.includes(model)) {
      setModel(modelsForDevice[0]);
    } else if (modelsForDevice.length === 0) {
      setModel("");
    }
    setCurrentBufferOptions(isBoiler ? boilerBufferOptions : heatPumpBufferOptions);
    if (!isBoiler) setSystemType('zamkniety');
    if(isBoiler) setIsCustomQuantity(false); // Ukryj opcję dla kotłów
  }, [deviceType, model, isBoiler]);

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    const pdfData = await generateOfferPDF(
        price, userName, deviceType, model, tank, buffer, systemType, 
        { demontaz: includeDemontaz, podbudowa: includePodbudowa },
        isNettoPrice,
        { isCustom: isCustomQuantity, outdoor: outdoorUnitQty, indoor: indoorUnitQty } // Przekazanie nowych danych
    );
    if (pdfData) {
      setGeneratedPdfData(pdfData);
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
  
  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert KAMAN</h2>
      <label htmlFor="userName">Imię i Nazwisko Klienta:</label>
      <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />

      <label htmlFor="price">Cena Końcowa (PLN):</label>
      <input id="price" type="text" inputMode="decimal" value={formatPriceForDisplay(price)} onChange={handlePriceChange} placeholder="Podaj cenę" required />
      
      <div className="input-group-inline">
        <input type="checkbox" id="isNettoPrice" checked={isNettoPrice} onChange={(e) => setIsNettoPrice(e.target.checked)} />
        <label htmlFor="isNettoPrice">Pokaż cenę jako netto</label>
      </div>

      <label htmlFor="deviceType">Typ Urządzenia/Oferty:</label>
      <select id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
        {/* Opcje urządzeń */}
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
          <option value="ATLANTIC-EXCELIA">Atlantic EXCELIA AI TRI hydrobox</option>

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
          availableModels.map((modelName) => <option key={modelName} value={modelName}>{modelName}</option>)
        ) : (
          <option value="">Brak dostępnych modeli</option>
        )}
      </select>

      {/* SEKCJA Z ILOŚCIĄ JEDNOSTEK (TYLKO DLA POMP CIEPŁA) */}
      {!isBoiler && (
        <div className="options-box">
            <div className="option-row">
                <input type="checkbox" id="isCustomQuantity" checked={isCustomQuantity} onChange={(e) => setIsCustomQuantity(e.target.checked)} />
                <label htmlFor="isCustomQuantity">Niestandardowa ilość jednostek</label>
            </div>
            {isCustomQuantity && (
                <div className="custom-quantity-inputs">
                    <div className="input-group">
                        <label htmlFor="outdoorUnitQty">Ilość jedn. zewnętrznych:</label>
                        <input id="outdoorUnitQty" type="number" value={outdoorUnitQty} onChange={e => setOutdoorUnitQty(e.target.value)} min="1" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="indoorUnitQty">Ilość jedn. wewnętrznych:</label>
                        <input id="indoorUnitQty" type="number" value={indoorUnitQty} onChange={e => setIndoorUnitQty(e.target.value)} min="1" />
                    </div>
                </div>
            )}
        </div>
      )}

      <label htmlFor="tank">Pojemność zasobnika CWU:</label>
      <select id="tank" value={tank} onChange={(e) => setTank(e.target.value)}>
          <option value="140L">140 L</option>
          <option value="200L">200 L</option>
          <option value="none">Zasobnik CWU nie wymagany/ Zintegrowany</option>
          <option value="300L">300 L</option>
          <option value="400L">400 L</option>
          <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
          <option value="250 L STAL NIERDZEWNA">250 L STAL NIERDZEWNA</option>
          <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
      </select>
      <label htmlFor="buffer">Bufor/Sprzęgło:</label>
      <select id="buffer" value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        {currentBufferOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>

      <div className="options-box">
        <div className="option-row">
          <input type="checkbox" id="includeDemontaz" checked={includeDemontaz} onChange={(e) => setIncludeDemontaz(e.target.checked)} />
          <label htmlFor="includeDemontaz">Uwzględnij demontaż starego źródła ciepła w ofercie</label>
        </div>
        {!isBoiler && (
          <div className="option-row">
            <input type="checkbox" id="includePodbudowa" checked={includePodbudowa} onChange={(e) => setIncludePodbudowa(e.target.checked)} />
            <label htmlFor="includePodbudowa">Uwzględnij podbudowę pod pompę ciepła w ofercie</label>
          </div>
        )}
      </div>

      {isBoiler && (
        <div className="input-group" style={{marginTop: '10px'}}>
          <label htmlFor="systemType">Typ układu hydraulicznego:</label>
          <select id="systemType" value={systemType} onChange={(e) => setSystemType(e.target.value)}>
              <option value="zamkniety">Układ zamknięty</option>
              <option value="otwarty">Układ otwarty</option>
              <option value="brak">Brak (tylko grupa bezp. bez naczynia)</option>
          </select>
        </div>
      )}

      <button type="submit">Generuj PDF</button>

      {generatedPdfData && (
        <button type="button" onClick={handleDownloadPdf} style={{ marginTop: '10px', background: '#555' }}>Pobierz wygenerowany PDF</button>
      )}
    </form>
  );
}