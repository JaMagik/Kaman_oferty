// Pełna, zaktualizowana zawartość pliku: src/components/UnifiedOfferForm.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import TrelloActions from './TrelloActions';
import { reserveOfferNumber } from '../utils/offerNumbering';

import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";
import { lazarBaseTables } from "../data/tables/lazarTables";
import { viessmannBaseTables } from "../data/tables/viessmannTables";
import { nibeBaseTables } from "../data/tables/nibeTables";
import { kotlospawSlimkoPlusBaseTables } from "../data/tables/kotlospawSlimkoPlusTable";
import { kotlospawSlimkoPlusNiskiBaseTables } from "../data/tables/kotlospawSlimkoPlusNiskiTable";
import { qmpellBaseTables } from "../data/tables/qmpellEvoTables";
import { kotlospawDrewkoPlusBaseTables } from "../data/tables/kotlospawDrewkoPlusTable";
import { kotlospawDrewkoHybridBaseTables } from "../data/tables/kotlospawDrewkoHybridTable";
import { toshiba1fBaseTables } from '../data/tables/toshiba1fTable';
import { kaisaiHydroboxBaseTables } from '../data/tables/kaisaiTable';

import { panasonicBaseTables } from '../data/tables/panasonicTables';
import { kotlospawduOKOBaseTables } from '../data/tables/kotlospawDuoko';
import { viessmannEasypellBaseTables } from '../data/tables/viessmannEasypellTables';
import { clientAdvisorOptions } from '../data/clientAdvisorOptions';

const DEVICE_CATEGORY = {
  HEAT_PUMP: "heat-pump",
  BOILER: "boiler",
};

const HEAT_PUMP_DEFAULT_DEVICE = "Mitsubishi-cylinder-PUZ";
const BOILER_DEFAULT_DEVICE = "LAZAR SmartFire";

const allDevicesData = {
  ...mitsubishiBaseTables,
  ...atlanticBaseTables,
  ...lazarBaseTables,
  ...viessmannBaseTables,
  ...nibeBaseTables,
  ...kotlospawSlimkoPlusBaseTables,
  ...kotlospawSlimkoPlusNiskiBaseTables,
  ...qmpellBaseTables,
  ...kotlospawDrewkoPlusBaseTables,
  ...kotlospawDrewkoHybridBaseTables,
  ...toshiba1fBaseTables,
  ...kaisaiHydroboxBaseTables,
  ...panasonicBaseTables,
  ...kotlospawduOKOBaseTables,
  ...viessmannEasypellBaseTables,
};

const boilerDeviceTypes = [
  "LAZAR SmartFire",
  "LAZAR DSPELL",
  "LAZAR PelletFOCUS",
  "Kotlospaw Slimko Plus",
  "Kotlospaw slimko plus niski",
  "QMPELL",
  "Kotlospaw drewko plus",
  "Kotlospaw drewko hybrid",
  "Kotlospaw duoko",
  "Viessmann Easypell",
];
const hybridBoilerDeviceTypes = ["Kotlospaw drewko hybrid"];

const heatPumpBufferOptions = [
  { value: "sprzeglo", label: "Sprzęgło hydrauliczne z osprzętem" },
  { value: "none", label: "Bufor niewymagany" },
  { value: "40-100L", label: "Bufor 40-100 L + osprzęt" },
  { value: "200L", label: "Bufor 200 L + osprzęt" },
  { value: "300L", label: "Bufor 300 L + osprzęt" },
];
const boilerBufferOptions = [
  { value: "zawor-4d", label: "Zawór czterodrogowy z siłownikiem" },
  { value: "sprzeglo", label: "Sprzęgło hydrauliczne z osprzętem" },
  { value: "none", label: "Bufor niewymagany" },
  { value: "100L", label: "Bufor 100 L + osprzęt" },
  { value: "120L", label: "Bufor 120 L + osprzęt" },
  { value: "140L", label: "Bufor 140 L + osprzęt" },
  { value: "200L", label: "Bufor 200 L + osprzęt" },
  { value: "300L", label: "Bufor 300 L + osprzęt" },
  { value: "500L", label: "Bufor 500 L + osprzęt" },
  { value: "800L", label: "Bufor 800 L + osprzęt" },
  { value: "1000L", label: "Bufor 1000 L + osprzęt" },
];
const hybridBoilerBufferOptions = [
  { value: "500L", label: "Bufor 500 L + osprzęt" },
  { value: "800L", label: "Bufor 800 L + osprzęt" },
  { value: "1000L", label: "Bufor 1000 L + osprzęt" },
];
const hybridBufferDefaults = {
  "12 kW": "500L",
  "18 kW": "800L",
  "24 kW": "1000L",
};
const acDeviceTypes = ['MITSUBISHI AY', 'MITSUBISHI HR', 'VIVAX Y-Design', 'VIVAX H-Design', 'VIVAX M-Design', 'VIVAX Q-Design', 'VIVAX N-Design'];
const HEAT_PUMP_COUNTER_STORAGE_KEY = 'heatPumpOfferCounters';

export default function UnifiedOfferForm({ deviceCategory = DEVICE_CATEGORY.HEAT_PUMP }) {
  const initialDeviceType = deviceCategory === DEVICE_CATEGORY.BOILER ? BOILER_DEFAULT_DEVICE : HEAT_PUMP_DEFAULT_DEVICE;
  const initialBufferOptions = boilerDeviceTypes.includes(initialDeviceType) ? boilerBufferOptions : heatPumpBufferOptions;
  const initialBufferValue = initialBufferOptions[0]?.value || "";

  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  const [investmentStreet, setInvestmentStreet] = useState('');
  const [investmentTown, setInvestmentTown] = useState('');
  const [investmentPostalCode, setInvestmentPostalCode] = useState('');
  const [investmentCity, setInvestmentCity] = useState('');
  const [advisorId, setAdvisorId] = useState(clientAdvisorOptions[0]?.value || '');
  const selectedAdvisor = useMemo(
    () => clientAdvisorOptions.find((item) => item.value === advisorId) || clientAdvisorOptions[0] || {},
    [advisorId],
  );
  const [deviceType, setDeviceType] = useState(initialDeviceType);
  const [model, setModel] = useState("12 kW");
  const [availableModels, setAvailableModels] = useState([]);
  const [tank, setTank] = useState("200L");
  const [buffer, setBuffer] = useState(initialBufferValue);
  const [currentBufferOptions, setCurrentBufferOptions] = useState(initialBufferOptions);
  const [includeDemontaz, setIncludeDemontaz] = useState(true);
  const [includePodbudowa, setIncludePodbudowa] = useState(true);
  const [includeMagneticSeparator, setIncludeMagneticSeparator] = useState(false);
  const [vatRate, setVatRate] = useState('8');
  const [isNettoPrice, setIsNettoPrice] = useState(false);
  const [includeDotacja, setIncludeDotacja] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [isCustomQuantity, setIsCustomQuantity] = useState(false);
  const [outdoorUnitQty, setOutdoorUnitQty] = useState(1);
  const [indoorUnitQty, setIndoorUnitQty] = useState(1);
  const [heatingCircuitQty, setHeatingCircuitQty] = useState(1);
  const [boilerCirculationPumpQty, setBoilerCirculationPumpQty] = useState(1);
  const [boilerControllerQty, setBoilerControllerQty] = useState(1);
  const [boilerHeatingCircuitQty, setBoilerHeatingCircuitQty] = useState(1);
  const [heatPumpControllerQty, setHeatPumpControllerQty] = useState(1);
  const [generatedPdfData, setGeneratedPdfData] = useState(null);
  const [systemType, setSystemType] = useState('zamkniety');
  const [includeExhaustFan, setIncludeExhaustFan] = useState(false);
  const [includeReturnProtection, setIncludeReturnProtection] = useState(true);

  const prevDeviceTypeRef = useRef(initialDeviceType);
  const prevModelRef = useRef(model);

  const isBoiler = boilerDeviceTypes.includes(deviceType);
  const isAcDevice = acDeviceTypes.includes(deviceType);
  const isHybridBoiler = hybridBoilerDeviceTypes.includes(deviceType);
  const isLazar = deviceType.startsWith("LAZAR");

  const isKotlospaw = deviceType.toLowerCase().includes('kotlospaw');
  const isHeatPumpCategory = deviceCategory === DEVICE_CATEGORY.HEAT_PUMP;
  const isBoilerCategory = deviceCategory === DEVICE_CATEGORY.BOILER;


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

  const getPositiveInt = (value, fallback = 1) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) return fallback;
    return parsed;
  };

  const heatPumpQuantityFields = [
    {
      id: "outdoorUnitQty",
      label: "Jednostki zewnętrzne",
      value: outdoorUnitQty,
      onChange: (nextValue) => setOutdoorUnitQty(getPositiveInt(nextValue, 1)),
    },
    {
      id: "indoorUnitQty",
      label: "Jednostki wewnętrzne",
      value: indoorUnitQty,
      onChange: (nextValue) => setIndoorUnitQty(getPositiveInt(nextValue, 1)),
    },
    {
      id: "heatingCircuitQty",
      label: "Obiegi grzewcze",
      value: heatingCircuitQty,
      onChange: (nextValue) => setHeatingCircuitQty(getPositiveInt(nextValue, 1)),
    },
    {
      id: "heatPumpControllerQty",
      label: "Sterowniki/regulatory",
      value: heatPumpControllerQty,
      onChange: (nextValue) => setHeatPumpControllerQty(getPositiveInt(nextValue, 1)),
    },
  ];

  useEffect(() => {
    if (!isBoiler) {
      setBoilerCirculationPumpQty(1);
      setBoilerControllerQty(1);
      setBoilerHeatingCircuitQty(1);
    }
  }, [isBoiler]);

  useEffect(() => {
    if (deviceCategory === DEVICE_CATEGORY.BOILER && !boilerDeviceTypes.includes(deviceType)) {
      setDeviceType(BOILER_DEFAULT_DEVICE);
    } else if (deviceCategory === DEVICE_CATEGORY.HEAT_PUMP && boilerDeviceTypes.includes(deviceType)) {
      setDeviceType(HEAT_PUMP_DEFAULT_DEVICE);
    }
  }, [deviceCategory, deviceType]);

  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : [];
    setAvailableModels(modelsForDevice);
    if (modelsForDevice.length > 0 && !modelsForDevice.includes(model)) {
      setModel(modelsForDevice[0]);
    } else if (modelsForDevice.length === 0) {
      setModel("");
    }

    const nextBufferOptions = isHybridBoiler
      ? hybridBoilerBufferOptions
      : isBoiler
      ? boilerBufferOptions
      : heatPumpBufferOptions;

    setCurrentBufferOptions(nextBufferOptions);

    const deviceTypeChanged = prevDeviceTypeRef.current !== deviceType;
    const modelChanged = prevModelRef.current !== model;

    let nextBufferValue = buffer;
    if (!nextBufferOptions.some((option) => option.value === nextBufferValue)) {
      nextBufferValue = nextBufferOptions[0]?.value || "";
    }

    if (isHybridBoiler && modelChanged) {
      const preferred = hybridBufferDefaults[model] || hybridBufferDefaults["12 kW"];
      if (preferred && nextBufferOptions.some((option) => option.value === preferred)) {
        nextBufferValue = preferred;
      }
    } else if (isBoiler && deviceTypeChanged) {
      if (nextBufferOptions.some((option) => option.value === "zawor-4d")) {
        nextBufferValue = "zawor-4d";
      }
    }

    if (nextBufferValue !== buffer) {
      setBuffer(nextBufferValue);
    }

    if (!isBoiler) {
      setSystemType("zamkniety");
    }
    if (isBoiler || isAcDevice) {
      setIsCustomQuantity(false);
      setOutdoorUnitQty(1);
      setIndoorUnitQty(1);
      setHeatingCircuitQty(1);
      setHeatPumpControllerQty(1);
    }

    prevDeviceTypeRef.current = deviceType;
    prevModelRef.current = model;
  }, [deviceType, model, buffer, isBoiler, isHybridBoiler, isAcDevice]);


  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    if (showPrice && !price.trim()) {
      alert('Uzupełnij pole Ceny lub odznacz opcję pokazywania jej w ofercie.');
      return;
    }
    setGeneratedPdfData(null);
    
    // ZMIANA: Logika warunkowa dla opcji
    const offerOptions = {
      demontaz: !isAcDevice && includeDemontaz,
      podbudowa: !isAcDevice && includePodbudowa,
      magneticSeparator: !isBoiler && !isAcDevice && includeMagneticSeparator,
      dotacja: includeDotacja,
      exhaustFan: isKotlospaw && includeExhaustFan,
      returnProtection: isBoiler && !isLazar && includeReturnProtection,
    };

    const investmentAddress = {
      street: investmentStreet,
      town: investmentTown,
      postalCode: investmentPostalCode,
      city: investmentCity,
    };

    const advisorSummary = {
      label: selectedAdvisor?.label || '',
      phone: selectedAdvisor?.phone || '',
      email: selectedAdvisor?.email || '',
    };

    const shouldAssignOfferNumber = isHeatPumpCategory && !isBoiler && !isAcDevice;
    const advisorNameForNumber = advisorSummary.label || selectedAdvisor?.value || userName;
    const { offerNumber: generatedOfferNumber } = shouldAssignOfferNumber
      ? reserveOfferNumber(advisorNameForNumber || userName, {
          storageKey: HEAT_PUMP_COUNTER_STORAGE_KEY,
          fallbackInitials: 'HP',
          categoryCode: 'PC',
        })
      : { offerNumber: '' };

    const pdfData = await generateOfferPDF(
      price,
      userName,
      deviceType,
      model,
      tank,
      buffer,
      systemType,
      offerOptions,
      isNettoPrice,
      {
        isCustom: isCustomQuantity,
        outdoor: outdoorUnitQty,
        indoor: indoorUnitQty,
        heatingCircuits: heatingCircuitQty,
        boilerCirculationPumps: boilerCirculationPumpQty,
        boilerControllers: boilerControllerQty,
        boilerHeatingCircuits: boilerHeatingCircuitQty,
        heatPumpControllers: heatPumpControllerQty,
      },
      showPrice,
      investmentAddress,
      advisorSummary,
      generatedOfferNumber,
      parseFloat(vatRate)
    );
    if (pdfData) {
      setGeneratedPdfData(pdfData);
    }
  };

  const handleDownloadPdf = () => {
    if (!generatedPdfData) {
        alert("Najpierw wygeneruj PDF!");
        return;
    }
    const url = URL.createObjectURL(generatedPdfData);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert KAMAN</h2>
      
      <label htmlFor="userName">Imię i Nazwisko Klienta:</label>
      <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />

      <fieldset className="component-fieldset" style={{ marginTop: '20px' }}>
        <legend>Dane inwestycji i doradcy</legend>
        <div className="input-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
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
            <label htmlFor="offer_advisor">Oferte sporządził</label>
            <select
              id="offer_advisor"
              value={advisorId}
              onChange={(event) => setAdvisorId(event.target.value)}
            >
              {clientAdvisorOptions.map((advisor) => (
                <option key={advisor.value} value={advisor.value}>
                  {advisor.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <label htmlFor="price">Cena Końcowa (PLN):</label>
      <input id="price" type="text" inputMode="decimal" value={formatPriceForDisplay(price)} onChange={handlePriceChange} placeholder="Podaj cenę" />

      <label htmlFor="vatRate">Stawka VAT:</label>
      <select
        id="vatRate"
        value={vatRate}
        onChange={(e) => setVatRate(e.target.value)}
        disabled={!showPrice}
      >
        <option value="8">8%</option>
        <option value="23">23%</option>
      </select>

      <div className="input-group-inline">
        <input type="checkbox" id="isNettoPrice" checked={isNettoPrice} onChange={(e) => setIsNettoPrice(e.target.checked)} />
        <label htmlFor="isNettoPrice">Pokaż cenę jako netto</label>
      </div>
      <div className="input-group-inline">
        <input type="checkbox" id="showPrice" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} />
        <label htmlFor="showPrice">Dołącz cenę do oferty</label>
      </div>

      <label htmlFor="deviceType">Typ Urządzenia/Oferty:</label>
      <select id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
        {!isBoilerCategory && (
          <>
            <optgroup label="Pompy Ciepła Mitsubishi">
              <option value="Mitsubishi-hydrobox">Mitsubishi Hydrobox (Standard PUD)</option>
              <option value="Mitsubishi-cylinder-PUZ">Mitsubishi Cylinder (Zubadan PUZ)</option>
              <option value="Mitsubishi-cylinder-PUZ-1F">Mitsubishi Cylinder (Zubadan PUZ 1-faz.)</option>
              <option value="Mitsubishi-hydrobox-PUZ">Mitsubishi Hydrobox (Zubadan PUZ)</option>
              <option value="Mitsubishi-hydrobox-PUZ-1F">Mitsubishi Hydrobox (Zubadan PUZ 1-faz.)</option>
              <option value="Mitsubishi-ecoinverter">Mitsubishi Ecoinverter (Cylinder)</option>
              <option value="Mitsubishi-ecoinverter-hydrobox">Mitsubishi Ecoinverter (Hydrobox)</option>
              <option value="Mitsubishi-hp">Mitsubishi Hyper Heating</option>
            </optgroup>
            <optgroup label="Pompy Ciepła Toshiba">
              <option value="Toshiba 1F">Toshiba (1-fazowe)</option>
            </optgroup>
            <optgroup label="Pompy Ciepła Atlantic">
              <option value="ATLANTIC-M-DUO">Atlantic S-TRI hydrobox</option>
              <option value="ATLANTIC-S">Atlantic S-TRI-Duo cylinder</option>
              <option value="ATLANTIC-EXCELIA">Atlantic EXCELIA AI TRI hydrobox</option>
              <option value="ATLANTIC-EXTENSA">Atlantic EXTENSA hydrobox</option>
              <option value="ATLANTIC-EXTENSA-S">Atlantic EXTENSA S hydrobox (bez zbiornika)</option>
              <option value="ATLANTIC-EXTENSA-S-DUO">Atlantic EXTENSA S Duo cylinder</option>
              <option value="ATLANTIC-EXTENSA-CYLINDER">Atlantic EXTENSA cylinder</option>
            </optgroup>
            <optgroup label="Pompy Ciepła Viessmann">
              <option value="VIESSMANN">Viessmann Vitocal 150-A</option>
            </optgroup>
            <optgroup label="Pompy Ciepla NIBE">
              <option value="NIBE F2120">NIBE F2120</option>
            </optgroup>
            <optgroup label="Pompy Ciepła Kaisai">
              <option value="Kaisai">Kaisai</option>
            </optgroup>
            <optgroup label="Pompy Ciepła Panasonic-Seria HP">
              <option value="Panasonic-HP-cylinder-1f">Panasonic Aquarea (HP) cylinder 1F</option>
              <option value="Panasonic-HP-cylinder-3f">Panasonic Aquarea (HP) cylinder 3F</option>
              <option value="Panasonic-HP-hydrobox-1f">Panasonic Aquarea (HP) hydrobox 1F</option>
              <option value="Panasonic-HP-hydrobox-3f">Panasonic Aquarea (HP) hydrobox 3F</option>
            </optgroup>
            <optgroup label="Pompy Ciepła Panasonic-Seria T-CAP">
              <option value="Panasonic-K-cylinder-1f">Panasonic Aquarea T-CAP cylinder 1F</option>
              <option value="Panasonic-K-cylinder-3f">Panasonic Aquarea T-CAP cylinder 3F</option>
              <option value="Panasonic-K-hydrobox-1f">Panasonic Aquarea T-CAP hydrobox 1F</option>
              <option value="Panasonic-K-hydrobox-3f">Panasonic Aquarea T-CAP hydrobox 3F</option>
            </optgroup>
          </>
        )}
        {!isHeatPumpCategory && (
          <>
            <optgroup label="Kotły na Pellet">
              <option value="LAZAR SmartFire">Lazar SmartFire</option>
              <option value="LAZAR PelletFOCUS">Lazar PelletFOCUS</option>
              <option value="LAZAR DSPELL">Lazar DSPELL</option>
              <option value="QMPELL">QMPell EVO</option>
              <option value="Kotlospaw Slimko Plus">Kotłospaw Slimko Plus</option>
              <option value="Kotlospaw slimko plus niski">Kotłospaw Slimko Plus niski</option>
              <option value="Kotlospaw duoko">Kotłospaw Duoko</option>
              <option value="Viessmann Easypell">Viessmann Easypell</option>
            </optgroup>
            <optgroup label="Kotły na Drewno / Hybrydowe">
              <option value="Kotlospaw drewko plus">Kotłospaw Drewko Plus</option>
              <option value="Kotlospaw drewko hybrid">Kotłospaw Drewko Hybrid</option>
            </optgroup>
          </>
        )}
      </select>

      <label htmlFor="model">Model (Moc):</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={availableModels.length === 0}>
        {availableModels.length > 0 ? ( availableModels.map((modelName) => <option key={modelName} value={modelName}>{modelName}</option>) ) : ( <option value="">Brak dostępnych modeli</option> )}
      </select>

      {!isAcDevice && (
        <>
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

          {!isBoiler && !isAcDevice && (
            <div className="custom-quantity-box">
              <div className="option-row">
                <input
                  type="checkbox"
                  id="customQuantityToggle"
                  checked={isCustomQuantity}
                  onChange={(e) => {
                  const nextChecked = e.target.checked;
                  setIsCustomQuantity(nextChecked);
                  if (!nextChecked) {
                    setOutdoorUnitQty(1);
                    setIndoorUnitQty(1);
                    setHeatingCircuitQty(1);
                    setHeatPumpControllerQty(1);
                  }
                }}
              />
              <label htmlFor="customQuantityToggle">Dostosuj ilości jednostek, obiegów i sterowników</label>
            </div>
            {isCustomQuantity && (
              <div className="quantity-grid">
                {heatPumpQuantityFields.map(({ id, label, value, onChange }) => (
                  <React.Fragment key={id}>
                    <label htmlFor={id}>{label}</label>
                    <input
                      id={id}
                      type="number"
                      min="1"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}


          {isBoiler && (
            <div className="custom-quantity-box">
              <div className="quantity-grid">
                <label htmlFor="boilerCirculationPumpQty">Ilosc pomp obiegowych</label>
                <input
                  id="boilerCirculationPumpQty"
                  type="number"
                  min="1"
                  value={boilerCirculationPumpQty}
                  onChange={(e) => setBoilerCirculationPumpQty(getPositiveInt(e.target.value, 1))}
                />

                <label htmlFor="boilerControllerQty">Ilosc sterownikow/regulatorow</label>
                <input
                  id="boilerControllerQty"
                  type="number"
                  min="1"
                  value={boilerControllerQty}
                  onChange={(e) => setBoilerControllerQty(getPositiveInt(e.target.value, 1))}
                />

                <label htmlFor="boilerHeatingCircuitQty">Ilosc obiegow grzewczych</label>
                <input
                  id="boilerHeatingCircuitQty"
                  type="number"
                  min="1"
                  value={boilerHeatingCircuitQty}
                  onChange={(e) => setBoilerHeatingCircuitQty(getPositiveInt(e.target.value, 1))}
                />
              </div>
            </div>
          )}


          <div className="options-box">
            <div className="option-row">
              <input type="checkbox" id="includeDotacja" checked={includeDotacja} onChange={(e) => setIncludeDotacja(e.target.checked)} />
              <label htmlFor="includeDotacja">Uwzględnij pomoc w uzyskaniu dotacji w ofercie</label>
            </div>
            <div className="option-row">
              <input type="checkbox" id="includeDemontaz" checked={includeDemontaz} onChange={(e) => setIncludeDemontaz(e.target.checked)} />
              <label htmlFor="includeDemontaz">Uwzględnij demontaż starego źródła ciepła w ofercie</label>
            </div>
            {!isBoiler && (
              <>
                <div className="option-row">
                  <input
                    type="checkbox"
                    id="includePodbudowa"
                    checked={includePodbudowa}
                    onChange={(e) => setIncludePodbudowa(e.target.checked)}
                  />
                  <label htmlFor="includePodbudowa">Uwzglednij podbudowe pod pompe ciepla w ofercie</label>
                </div>
                {!isAcDevice && (
                  <div className="option-row">
                    <input
                      type="checkbox"
                      id="includeMagneticSeparator"
                      checked={includeMagneticSeparator}
                      onChange={(e) => setIncludeMagneticSeparator(e.target.checked)}
                    />
                    <label htmlFor="includeMagneticSeparator">Uwzglednij separator magnetyczny w glownej tabeli</label>
                  </div>
                )}
              </>
            )}
            {isBoiler && !isLazar && (
              <div className="option-row">
                <input
                  type="checkbox"
                  id="includeReturnProtection"
                  checked={includeReturnProtection}
                  onChange={(e) => setIncludeReturnProtection(e.target.checked)}
                />
                <label htmlFor="includeReturnProtection">Zastosowanie termostatycznej ochrony powrotu</label>
              </div>
            )}
            {isKotlospaw && (
              <div className="option-row">
                <input
                  type="checkbox"
                  id="includeExhaustFan"
                  checked={includeExhaustFan}
                  onChange={(e) => setIncludeExhaustFan(e.target.checked)}
                />
                <label htmlFor="includeExhaustFan">Uwzględnij wentylator wyciągowy w ofercie</label>
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
        </>
      )}

      <button type="submit">Generuj PDF</button>

      {generatedPdfData && (
        <button type="button" onClick={handleDownloadPdf} style={{ marginTop: '10px', background: '#555' }}>Pobierz wygenerowany PDF</button>
      )}

      <TrelloActions 
        generatedPdfData={generatedPdfData}
        userName={userName}
      />
    </form>
  );
}
