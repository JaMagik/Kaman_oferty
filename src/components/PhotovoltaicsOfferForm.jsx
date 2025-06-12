import React, { useState, useEffect } from 'react';
import { generatePhotovoltaicsOfferPDF } from '../utils/pvPdfGenerator'; 
import { generateCustomOfferPDF } from '../utils/customPdfGenerator';
import { panelTypesData, inverterTypesData, storageTypesData } from '../data/tables/photovoltaicsData';

export default function PhotovoltaicsOfferForm() {
  const [offerMode, setOfferMode] = useState('standard'); // 'standard' or 'custom'
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Stany dla oferty standardowej ---
  const [userName, setUserName] = useState('');
  const [price, setPrice] = useState('');
  const [isNetto, setIsNetto] = useState(false);
  const [installationType, setInstallationType] = useState('dach');
  const [panelTypeKey, setPanelTypeKey] = useState('CANADIAN_SOLAR_455');
  const [powerInput, setPowerInput] = useState('4.550');
  const [numberOfPanels, setNumberOfPanels] = useState(10);
  const [inverterTypeKey, setInverterTypeKey] = useState(Object.keys(inverterTypesData)[0]);
  const [isCustomInverterQuantity, setIsCustomInverterQuantity] = useState(false);
  const [inverterQuantity, setInverterQuantity] = useState(1);
  const [includeStorage, setIncludeStorage] = useState(false);
  const [storageTypeKey, setStorageTypeKey] = useState('DEYE_STORAGE_LV');
  const [storageModules, setStorageModules] = useState(1);
  
  // --- Stany dla oferty niestandardowej ---
  const [customPanelName, setCustomPanelName] = useState('');
  const [customPanelQuantity, setCustomPanelQuantity] = useState(10);
  const [customPanelPower, setCustomPanelPower] = useState(455);
  const [customPanelDatasheet, setCustomPanelDatasheet] = useState(null);
  const [customInverterName, setCustomInverterName] = useState('');
  const [customInverterQuantity, setCustomInverterQuantity] = useState(1);
  const [customInverterDatasheet, setCustomInverterDatasheet] = useState(null);
  const [customIncludeStorage, setCustomIncludeStorage] = useState(false);
  const [customStorageName, setCustomStorageName] = useState('');
  const [customStorageQuantity, setCustomStorageQuantity] = useState(1);
  const [customStorageDatasheet, setCustomStorageDatasheet] = useState(null);

  useEffect(() => {
    if (offerMode === 'standard') {
      const isStorageOnly = installationType === 'only-storage';
      setIncludeStorage(isStorageOnly);
      if (isStorageOnly) {
        const firstRetrofitKey = Object.keys(inverterTypesData).find(key => inverterTypesData[key].type === 'AC Charger');
        setInverterTypeKey(firstRetrofitKey || '');
      }
    }
  }, [installationType, offerMode]);

  useEffect(() => {
    if (offerMode === 'standard' && installationType !== 'only-storage') {
      const selectedPanelData = panelTypesData[panelTypeKey];
      if (selectedPanelData && powerInput) {
        const calculatedPanels = Math.ceil(parseFloat(powerInput) / selectedPanelData.power);
        setNumberOfPanels(isNaN(calculatedPanels) || calculatedPanels < 0 ? 0 : calculatedPanels);
      }
    }
  }, [powerInput, panelTypeKey, installationType, offerMode]);

  const handleFileChange = (setter) => (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === "application/pdf") {
        setter(event.target.files[0]);
      } else {
        alert("Proszę wybrać plik PDF.");
        event.target.value = null;
        setter(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    let pdfBlob;
    let finalUserName = userName;

    if (offerMode === 'standard') {
        if (!userName.trim() || !price.trim()) {
            alert('Uzupełnij Imię i Nazwisko oraz Cenę!');
            setIsProcessing(false);
            return;
        }
        const formData = {
            userName, price, isNetto, installationType,
            panelDetails: installationType !== 'only-storage' ? { ...panelTypesData[panelTypeKey], count: numberOfPanels, totalPower: parseFloat(powerInput) } : null,
            inverterDetails: inverterTypesData[inverterTypeKey],
            inverterQuantity: isCustomInverterQuantity ? inverterQuantity : 1,
            storageDetails: includeStorage ? storageTypesData[storageTypeKey] : null,
            storageModules: includeStorage ? storageModules : 0,
        };
        pdfBlob = await generatePhotovoltaicsOfferPDF(formData);

    } else { // tryb niestandardowy
        if (!userName.trim() || !price.trim() || !customPanelName.trim() || !customInverterName.trim()) {
            alert('Uzupełnij wymagane pola: Klient, Cena, Nazwa Paneli i Nazwa Falownika!');
            setIsProcessing(false);
            return;
        }
        const formData = {
            clientName: userName, price, isNetto, installationType,
            panel: { name: customPanelName, quantity: customPanelQuantity, power: customPanelPower, datasheet: customPanelDatasheet },
            inverter: { name: customInverterName, quantity: customInverterQuantity, datasheet: customInverterDatasheet },
            storage: customIncludeStorage ? { name: customStorageName, quantity: customStorageQuantity, datasheet: customStorageDatasheet } : null,
        };
        pdfBlob = await generateCustomOfferPDF(formData);
    }
    
    if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.download = `Oferta_PV_KAMAN_${finalUserName.replace(/ /g, '_')}.pdf`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    setIsProcessing(false);
  };
  
  return (
    <form className="form-container photovoltaics-generator" onSubmit={handleSubmit}>
        <div className="form-mode-switcher">
            <button type="button" className={offerMode === 'standard' ? 'active' : ''} onClick={() => setOfferMode('standard')}>
                Oferta Standardowa
            </button>
            <button type="button" className={offerMode === 'custom' ? 'active' : ''} onClick={() => setOfferMode('custom')}>
                Oferta Niestandardowa
            </button>
        </div>
      
        <h2>Generator Fotowoltaika</h2>

        {/* --- Pola wspólne --- */}
        <div className="input-group">
            <label htmlFor="pv_userName">Imię i Nazwisko Klienta:</label>
            <input type="text" id="pv_userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />
        </div>
        <div className="input-group">
            <label htmlFor="pv_pricePV">Cena Końcowa (PLN):</label>
            <input type="text" id="pv_pricePV" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Podaj cenę" required />
        </div>
        <div className="input-group-inline">
            <input type="checkbox" id="isNettoPricePV" checked={isNetto} onChange={(e) => setIsNetto(e.target.checked)} />
            <label htmlFor="isNettoPricePV">Pokaż cenę jako netto</label>
        </div>

        {/* --- Tryb Standardowy --- */}
        {offerMode === 'standard' && (
            <>
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
                    <div id="pv_panelCountMessage" className="input-group">Sugerowana liczba paneli: {numberOfPanels}</div>
                </>
                )}
                <div className="input-group">
                    <label htmlFor="pv_inverterType">Falownik / Ładowarka AC:</label>
                    <select id="pv_inverterType" value={inverterTypeKey} onChange={(e) => setInverterTypeKey(e.target.value)}>
                    {Object.keys(inverterTypesData).map(key => (<option key={key} value={key}>{inverterTypesData[key].name}</option>))}
                    </select>
                </div>
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
                            </select>
                        </div>
                    )}
                </div>
            </>
        )}

        {/* --- Tryb Niestandardowy --- */}
        {offerMode === 'custom' && (
             <>
                <div className="input-group">
                    <label>Typ instalacji (wpływa na zakres prac w tabeli)</label>
                    <select value={installationType} onChange={e => setInstallationType(e.target.value)}>
                        <option value="dach">Dachowa</option>
                        <option value="grunt">Gruntowa</option>
                    </select>
                </div>
                <fieldset className="component-fieldset">
                    <legend>Panele Fotowoltaiczne</legend>
                    <label htmlFor="customPanelName">Nazwa i model paneli</label>
                    <input id="customPanelName" type="text" placeholder="np. Jinko Solar 470Wp" value={customPanelName} onChange={e => setCustomPanelName(e.target.value)} required />
                    <div className="inline-inputs">
                        <div className="input-group">
                            <label htmlFor="customPanelQuantity">Ilość (szt.)</label>
                            <input id="customPanelQuantity" type="number" value={customPanelQuantity} onChange={e => setCustomPanelQuantity(Number(e.target.value))} required />
                        </div>
                        <div className="input-group">
                           <label htmlFor="customPanelPower">Moc 1 szt. (Wp)</label>
                           <input id="customPanelPower" type="number" value={customPanelPower} onChange={e => setCustomPanelPower(Number(e.target.value))} required/>
                        </div>
                    </div>
                    <label htmlFor="customPanelDatasheet">Karta katalogowa paneli (PDF)</label>
                    <input id="customPanelDatasheet" type="file" accept=".pdf" onChange={handleFileChange(setCustomPanelDatasheet)} />
                </fieldset>

                <fieldset className="component-fieldset">
                    <legend>Falownik / Inwerter</legend>
                    <label htmlFor="customInverterName">Nazwa i model falownika</label>
                    <input id="customInverterName" type="text" placeholder="np. Falownik hybrydowy DEYE 10kW" value={customInverterName} onChange={e => setCustomInverterName(e.target.value)} required />
                     <div className="input-group">
                        <label htmlFor="customInverterQuantity">Ilość (szt.)</label>
                        <input id="customInverterQuantity" type="number" placeholder="1" value={customInverterQuantity} onChange={e => setCustomInverterQuantity(Number(e.target.value))} required />
                    </div>
                    <label htmlFor="customInverterDatasheet">Karta katalogowa falownika (PDF)</label>
                    <input id="customInverterDatasheet" type="file" accept=".pdf" onChange={handleFileChange(setCustomInverterDatasheet)} />
                </fieldset>

                <div className="options-box">
                    <div className="option-row">
                        <input type="checkbox" id="customIncludeStorage" checked={customIncludeStorage} onChange={e => setCustomIncludeStorage(e.target.checked)} />
                        <label htmlFor="customIncludeStorage">Dodaj magazyn energii (opcjonalnie)</label>
                    </div>
                    {customIncludeStorage && (
                        <fieldset className="component-fieldset nested">
                            <legend>Magazyn Energii</legend>
                            <label htmlFor="customStorageName">Nazwa i model magazynu</label>
                            <input id="customStorageName" type="text" placeholder="np. DEYE 5.12kWh" value={customStorageName} onChange={e => setCustomStorageName(e.target.value)} required={customIncludeStorage}/>
                            <div className="input-group">
                                <label htmlFor="customStorageQuantity">Ilość modułów/sztuk</label>
                                <input id="customStorageQuantity" type="number" value={customStorageQuantity} onChange={e => setCustomStorageQuantity(Number(e.target.value))} required={customIncludeStorage}/>
                            </div>
                            <label htmlFor="customStorageDatasheet">Karta katalogowa magazynu (PDF)</label>
                            <input id="customStorageDatasheet" type="file" accept=".pdf" onChange={handleFileChange(setCustomStorageDatasheet)} />
                        </fieldset>
                    )}
                </div>
            </>
        )}

      <button type="submit" disabled={isProcessing}>{isProcessing ? 'Przetwarzanie...' : 'Generuj PDF'}</button>
    </form>
  );
}