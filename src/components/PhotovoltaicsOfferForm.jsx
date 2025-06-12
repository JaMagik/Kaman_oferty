import React, { useState, useEffect } from 'react';
import { generatePhotovoltaicsOfferPDF } from '../utils/pvPdfGenerator'; 
import { panelTypesData, inverterTypesData, storageTypesData } from '../data/tables/photovoltaicsData';

export default function PhotovoltaicsOfferForm() {
  const [userName, setUserName] = useState('');
  const [pricePV, setPricePV] = useState('');
  const [installationType, setInstallationType] = useState('dach'); 
  
  const [panelTypeKey, setPanelTypeKey] = useState('CANADIAN_SOLAR_455');
  const [powerInput, setPowerInput] = useState('4.550');
  const [numberOfPanels, setNumberOfPanels] = useState(10);
  
  const [inverterTypeKey, setInverterTypeKey] = useState(Object.keys(inverterTypesData)[0]);
  
  // ZMIANA: Dodano stany do obsługi niestandardowej liczby falowników
  const [isCustomInverterQuantity, setIsCustomInverterQuantity] = useState(false);
  const [inverterQuantity, setInverterQuantity] = useState(1);
  
  const [storageTypeKey, setStorageTypeKey] = useState('DEYE_STORAGE_LV');
  const [includeStorage, setIncludeStorage] = useState(false);
  const [storageModules, setStorageModules] = useState(1);

  const [isNettoPrice, setIsNettoPrice] = useState(false);

  useEffect(() => {
    const isStorageOnly = installationType === 'only-storage';
    setIncludeStorage(isStorageOnly);

    if (isStorageOnly) {
      const firstRetrofitKey = Object.keys(inverterTypesData).find(key => inverterTypesData[key].type === 'AC Charger');
      setInverterTypeKey(firstRetrofitKey || '');
    }
  }, [installationType]);

  useEffect(() => {
    if (installationType !== 'only-storage') {
      const selectedPanelData = panelTypesData[panelTypeKey];
      if (selectedPanelData && powerInput) {
        const calculatedPanels = Math.ceil(parseFloat(powerInput) / selectedPanelData.power);
        setNumberOfPanels(isNaN(calculatedPanels) || calculatedPanels < 0 ? 0 : calculatedPanels);
      }
    }
  }, [powerInput, panelTypeKey, installationType]);

  const handleGeneratePVPDF = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !pricePV.trim()) {
      alert('Uzupełnij Imię i Nazwisko oraz Cenę!');
      return;
    }
    
    const formData = {
      userName,
      price: pricePV,
      isNetto: isNettoPrice,
      installationType,
      panelDetails: installationType !== 'only-storage' ? { ...panelTypesData[panelTypeKey], count: numberOfPanels, totalPower: parseFloat(powerInput) } : null,
      inverterDetails: inverterTypesData[inverterTypeKey],
      inverterQuantity: isCustomInverterQuantity ? inverterQuantity : 1, // ZMIANA: Przekazanie liczby falowników
      storageDetails: includeStorage ? storageTypesData[storageTypeKey] : null,
      storageModules: includeStorage ? storageModules : 0,
    };
    
    const pdfBlob = await generatePhotovoltaicsOfferPDF(formData); 
    
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.download = `Oferta_PV_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
      a.href = url;
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
        <input type="text" id="pv_pricePV" value={pricePV} onChange={(e) => setPricePV(e.target.value)} placeholder="Podaj cenę" required />
      </div>

      <div className="input-group-inline">
        <input type="checkbox" id="isNettoPricePV" checked={isNettoPrice} onChange={(e) => setIsNettoPrice(e.target.checked)} />
        <label htmlFor="isNettoPricePV">Pokaż cenę jako netto</label>
      </div>

      <div className="input-group">
        <label htmlFor="pv_installationType">Typ oferty:</label>
        <select id="pv_installationType" value={installationType} onChange={(e) => setInstallationType(e.target.value)}>
          <option value="dach">Nowa instalacja - Dach</option>
          <option value="grunt">Nowa instalacja - Grunt</option>
          <option value="only-storage">Modernizacja o magazyn energii</option>
        </select>
      </div>

      {installationType !== 'only-storage' && (
        <>
          <div className="input-group">
            <label htmlFor="pv_panelType">Rodzaj paneli:</label>
            <select id="pv_panelType" value={panelTypeKey} onChange={(e) => setPanelTypeKey(e.target.value)}>
              {Object.keys(panelTypesData).map(key => (<option key={key} value={key}>{panelTypesData[key].name}</option>))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="pv_powerInput">Moc instalacji (kWp):</label>
            <input type="number" id="pv_powerInput" value={powerInput} onChange={(e) => setPowerInput(e.target.value)} step="0.001" />
          </div>
          <div id="pv_panelCountMessage" className="input-group">Liczba paneli: {numberOfPanels}</div>
        </>
      )}

      <div className="input-group">
        <label htmlFor="pv_inverterType">Falownik / Ładowarka AC:</label>
        <select id="pv_inverterType" value={inverterTypeKey} onChange={(e) => setInverterTypeKey(e.target.value)}>
          {Object.keys(inverterTypesData).map(key => (<option key={key} value={key}>{inverterTypesData[key].name}</option>))}
        </select>
      </div>
      
      {/* ZMIANA: Dodano sekcję dla niestandardowej liczby falowników */}
      <div className="options-box">
          <div className="option-row">
            <input type="checkbox" id="isCustomInverterQuantity" checked={isCustomInverterQuantity} onChange={(e) => setIsCustomInverterQuantity(e.target.checked)} />
            <label htmlFor="isCustomInverterQuantity">Niestandardowa ilość falowników</label>
          </div>
          {isCustomInverterQuantity && (
            <div className="custom-quantity-inputs">
                <div className="input-group">
                    <label htmlFor="inverterQty">Ilość falowników:</label>
                    <input id="inverterQty" type="number" value={inverterQuantity} onChange={e => setInverterQuantity(Number(e.target.value))} min="1" step="1" />
                </div>
            </div>
          )}
      </div>
      
      <div className="options-box">
          <div className="option-row">
            <input type="checkbox" id="pv_includeStorage" checked={includeStorage} onChange={(e) => setIncludeStorage(e.target.checked)} />
            <label htmlFor="pv_includeStorage">Dołącz magazyn energii</label>
          </div>
          {includeStorage && (
            <div className="input-group" style={{paddingLeft: '15px', marginTop: '10px'}}>
                <label htmlFor="storageModules">Ilość modułów magazynu (1-4):</label>
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

      <button type="submit">Generuj PDF</button>
    </form>
  );
}