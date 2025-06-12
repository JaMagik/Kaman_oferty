import React, { useState, useEffect } from 'react';
import { generatePhotovoltaicsOfferPDF } from '../utils/pvPdfGenerator'; 
import { panelTypesData, inverterTypesData, storageTypesData } from '../data/tables/photovoltaicsData';

export default function PhotovoltaicsOfferForm() {
  const [userName, setUserName] = useState('');
  const [pricePV, setPricePV] = useState('');
  const [installationType, setInstallationType] = useState('dach'); 
  
  const defaultPanelKey = 'CANADIAN_SOLAR_460';
  const [panelTypeKey, setPanelTypeKey] = useState(defaultPanelKey);
  
  const [powerInput, setPowerInput] = useState(
    panelTypesData[defaultPanelKey] ? (panelTypesData[defaultPanelKey].power * 10).toFixed(3) : '4.600'
  );
  const [numberOfPanels, setNumberOfPanels] = useState(10);
  
  const [inverterTypeKey, setInverterTypeKey] = useState(Object.keys(inverterTypesData)[0]);
  
  const [storageTypeKey, setStorageTypeKey] = useState('');
  const [includeStorage, setIncludeStorage] = useState(false);
  const [storageModules, setStorageModules] = useState(1); // <-- NOWY STAN

  useEffect(() => {
    const selectedPanelData = panelTypesData[panelTypeKey];
    if (selectedPanelData && powerInput) {
      const calculatedPanels = Math.ceil(parseFloat(powerInput) / selectedPanelData.power);
      setNumberOfPanels(isNaN(calculatedPanels) || calculatedPanels < 0 ? 0 : calculatedPanels);
    } else {
      setNumberOfPanels(0);
    }
  }, [powerInput, panelTypeKey]);

  useEffect(() => {
    const currentInverter = inverterTypesData[inverterTypeKey];
    const canHaveStorage = currentInverter?.isHybrid || currentInverter?.type === 'AC Charger' || installationType === 'only-storage';
    if (canHaveStorage && includeStorage) {
        if (storageTypesData['DEYE_STORAGE_LV']) {
            setStorageTypeKey('DEYE_STORAGE_LV');
        }
    } else if (!includeStorage) {
      setStorageTypeKey('');
    }
  }, [inverterTypeKey, includeStorage, installationType]);


  const handlePanelTypeChange = (e) => {
    const newPanelKey = e.target.value;
    setPanelTypeKey(newPanelKey);
    const selectedPanelData = panelTypesData[newPanelKey];
    if (selectedPanelData) {
      setPowerInput((selectedPanelData.power * 10).toFixed(3));
    }
  };

  const handleGeneratePVPDF = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !pricePV.trim()) {
      alert('Uzupełnij wszystkie wymagane pola: Imię i nazwisko oraz Cena!');
      return;
    }

    const selectedPanel = installationType !== 'only-storage' ? panelTypesData[panelTypeKey] : null;
    const selectedInverter = inverterTypesData[inverterTypeKey];
    const selectedStorage = includeStorage && storageTypeKey ? storageTypesData[storageTypeKey] : null;

    const formData = {
      userName,
      price: parseFloat(pricePV),
      installationType,
      panelDetails: selectedPanel ? { 
        ...selectedPanel, 
        count: numberOfPanels, 
        totalPower: parseFloat(powerInput) 
      } : null,
      inverterDetails: selectedInverter,
      storageDetails: selectedStorage,
      storageModules: includeStorage ? storageModules : 0, // <-- Przekazanie liczby modułów
    };

    const pdfBlob = await generatePhotovoltaicsOfferPDF(formData); 
    
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Oferta_PV_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  const currentDevice = inverterTypesData[inverterTypeKey];
  const canHaveStorage = currentDevice?.isHybrid || currentDevice?.type === 'AC Charger' || installationType === 'only-storage';

  return (
    <form className="form-container photovoltaics-generator" onSubmit={handleGeneratePVPDF}>
      <h2>Generator Fotowoltaika</h2>
      
      <div className="input-group">
        <label htmlFor="pv_userName">Imię i Nazwisko Klienta:</label>
        <input type="text" id="pv_userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />
      </div>

      <div className="input-group">
        <label htmlFor="pv_pricePV">Cena Końcowa (PLN):</label>
        <input type="number" id="pv_pricePV" value={pricePV} onChange={(e) => setPricePV(e.target.value)} placeholder="Podaj cenę" required />
      </div>

      <div className="input-group">
        <label htmlFor="pv_installationType">Typ instalacji:</label>
        <select id="pv_installationType" value={installationType} onChange={(e) => setInstallationType(e.target.value)}>
          <option value="dach">Dach</option>
          <option value="grunt">Grunt</option>
          <option value="only-storage">Tylko magazyn energii</option>
        </select>
      </div>

      {installationType !== 'only-storage' && (
        <>
          <div className="input-group">
            <label htmlFor="pv_panelType">Rodzaj paneli:</label>
            <select id="pv_panelType" value={panelTypeKey} onChange={handlePanelTypeChange}>
              {Object.keys(panelTypesData).map(key => (
                <option key={key} value={key}>{panelTypesData[key].name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="pv_powerInput">Moc instalacji (kWp):</label>
            <input type="number" id="pv_powerInput" value={powerInput} onChange={(e) => setPowerInput(e.target.value)} step="0.001" required={installationType !== 'only-storage'} />
          </div>

          <div id="pv_panelCountMessage" className="input-group">
            Sugerowana liczba paneli: {numberOfPanels}
          </div>
        </>
      )}

      <div className="input-group">
        <label htmlFor="pv_inverterType">Rodzaj falownika / ładowarki AC:</label>
        <select id="pv_inverterType" value={inverterTypeKey} onChange={(e) => setInverterTypeKey(e.target.value)}>
          {Object.keys(inverterTypesData).map(key => (
            <option key={key} value={key}>{inverterTypesData[key].name}</option>
          ))}
        </select>
      </div>
      
      {/* ZMIANA: Dodanie pola wyboru liczby modułów */}
      {canHaveStorage && (
        <div className="options-box">
          <div className="option-row">
            <input type="checkbox" id="pv_includeStorage" checked={includeStorage} onChange={(e) => setIncludeStorage(e.target.checked)} />
            <label htmlFor="pv_includeStorage">Dodaj magazyn energii</label>
          </div>
          {includeStorage && (
            <div className="input-group" style={{paddingLeft: '15px', marginTop: '10px'}}>
              <label htmlFor="storageModules">Ilość modułów magazynu (1-8):</label>
              <select id="storageModules" value={storageModules} onChange={e => setStorageModules(Number(e.target.value))}>
                <option value={1}>1 moduł</option>
                <option value={2}>2 moduły</option>
                <option value={3}>3 moduły</option>
                <option value={4}>4 moduły</option>
                <option value={5}>5 modułów</option>
                <option value={6}>6 modułów</option>
                <option value={7}>7 modułów</option>
                <option value={8}>8 modułów</option>
              </select>
            </div>
          )}
        </div>
      )}

      <button type="submit">Generuj PDF Fotowoltaika</button>
    </form>
  );
}