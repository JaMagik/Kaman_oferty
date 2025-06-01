// src/components/PhotovoltaicsOfferForm.jsx
import React, { useState, useEffect } from 'react';
// Załóżmy, że stworzysz ten plik do generowania PDF dla PV
import { generatePhotovoltaicsOfferPDF } from '../utils/pvPdfGenerator'; 
// Import danych PV
import { panelTypesData, inverterTypesData, storageTypesData } from '../data/tables/photovoltaicsData';

export default function PhotovoltaicsOfferForm() {
  const [userName, setUserName] = useState('');
  const [pricePV, setPricePV] = useState('');
  const [installationType, setInstallationType] = useState('dach'); // 'dach', 'grunt', 'only-storage'
  
  // Ustawiamy domyślny panel na Canadian Solar 460W
  const defaultPanelKey = 'CANADIAN_SOLAR_460';
  const [panelTypeKey, setPanelTypeKey] = useState(defaultPanelKey);
  
  const [powerInput, setPowerInput] = useState(
    panelTypesData[defaultPanelKey] ? (panelTypesData[defaultPanelKey].power * 10).toFixed(3) : '4.600' // Domyślnie np. 10 paneli
  );
  const [numberOfPanels, setNumberOfPanels] = useState(10);
  
  const [inverterTypeKey, setInverterTypeKey] = useState(Object.keys(inverterTypesData)[0]); // Domyślnie pierwszy falownik z listy
  
  // Stan dla wyboru magazynu energii - domyślnie Deye, jeśli falownik jest hybrydowy
  const [storageTypeKey, setStorageTypeKey] = useState(''); // Pusty string oznacza brak wybranego magazynu lub nie jest potrzebny
  const [includeStorage, setIncludeStorage] = useState(false);


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
    // Automatyczny wybór magazynu Deye, jeśli falownik jest hybrydowy i wybrano opcję z magazynem
    const currentInverter = inverterTypesData[inverterTypeKey];
    if (currentInverter?.isHybrid && includeStorage) {
        // Sprawdź, czy Deye jest dostępny w storageTypesData
        if (storageTypesData['DEYE_STORAGE_LV']) {
            setStorageTypeKey('DEYE_STORAGE_LV');
        } else {
            console.warn("Domyślny magazyn DEYE_STORAGE_LV nie znaleziony w storageTypesData.");
            setStorageTypeKey(''); // Wyczyść, jeśli nie ma
        }
    } else if (!includeStorage) {
      setStorageTypeKey(''); // Wyczyść wybór magazynu, jeśli nie jest zaznaczony
    }
  }, [inverterTypeKey, includeStorage]);


  const handlePanelTypeChange = (e) => {
    const newPanelKey = e.target.value;
    setPanelTypeKey(newPanelKey);
    const selectedPanelData = panelTypesData[newPanelKey];
    if (selectedPanelData) {
      // Możesz zaktualizować powerInput do domyślnej wartości dla nowego panelu, np. dla 10 paneli
      setPowerInput((selectedPanelData.power * 10).toFixed(3));
    }
  };

  const handleGeneratePVPDF = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !pricePV.trim() || (installationType !== 'only-storage' && !powerInput)) {
      alert('Uzupełnij wszystkie wymagane pola: Imię i nazwisko, Cena oraz Moc instalacji (chyba że to tylko magazyn energii)!');
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
    };

    console.log("Dane do PDF PV:", formData);
    const pdfBlob = await generatePhotovoltaicsOfferPDF(formData); // Ta funkcja musi być zdefiniowana w pvPdfGenerator.jsx
    
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
        <label htmlFor="pv_inverterType">Rodzaj falownika:</label>
        <select id="pv_inverterType" value={inverterTypeKey} onChange={(e) => setInverterTypeKey(e.target.value)}>
          {Object.keys(inverterTypesData).map(key => (
            <option key={key} value={key}>{inverterTypesData[key].name}</option>
          ))}
        </select>
      </div>
      
      {/* Opcja dodania magazynu energii, jeśli falownik jest hybrydowy LUB wybrano "only-storage" */}
      {(inverterTypesData[inverterTypeKey]?.isHybrid || installationType === 'only-storage') && (
        <div className="input-group">
          <label htmlFor="pv_includeStorage">
            <input 
              type="checkbox" 
              id="pv_includeStorage" 
              checked={includeStorage} 
              onChange={(e) => setIncludeStorage(e.target.checked)} 
            />
            Dodaj magazyn energii DEYE
          </label>
        </div>
      )}
      
      {/* Można by dodać pole wyboru konkretnego modelu magazynu Deye, jeśli jest ich więcej */}
      {/* Na razie zakładamy, że jest jeden domyślny magazyn Deye, jeśli 'includeStorage' jest zaznaczone */}

      <button type="submit">Generuj PDF Fotowoltaika</button>
    </form>
  );
}