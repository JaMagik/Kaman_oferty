// Pełna, zaktualizowana zawartość pliku: src/components/PhotovoltaicsOfferForm.jsx

import React, { useState, useEffect } from 'react';
import { generatePhotovoltaicsOfferPDF } from '../utils/pvPdfGenerator';
import { generateCustomOfferPDF } from '../utils/customPdfGenerator';
import { panelTypesData, inverterTypesData, storageTypesData } from '../data/tables/photovoltaicsData';
import TrelloActions from './TrelloActions';

export default function PhotovoltaicsOfferForm() {
  /* ---------- STANY GŁÓWNE ---------- */
  const [offerMode, setOfferMode] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  /* Dane klienta i ceny */
  const [userName, setUserName] = useState('');
  const [price, setPrice] = useState('');
  const [isNetto, setIsNetto] = useState(false);
  const [showPrice, setShowPrice] = useState(true);

  /* Typ instalacji */
  const [installationType, setInstallationType] = useState('dach');
  const [isBracketMount, setIsBracketMount] = useState(false);

  /* Panele */
  const [panelTypeKey, setPanelTypeKey] = useState('CANADIAN_SOLAR_455');
  const [powerInput, setPowerInput] = useState('4.550');
  const [numberOfPanels, setNumberOfPanels] = useState(10);

  /* Falownik / ładowarka AC */
  const [inverterTypeKey, setInverterTypeKey] = useState(Object.keys(inverterTypesData)[0]);
  const [isCustomInverterQuantity, setIsCustomInverterQuantity] = useState(false);
  const [inverterQuantity, setInverterQuantity] = useState(1);

  /* Magazyn energii */
  const [includeStorage, setIncludeStorage] = useState(false);
  const [storageTypeKey, setStorageTypeKey] = useState(Object.keys(storageTypesData)[0]);
  const [storageModules, setStorageModules] = useState(1);

  /* ---------- STANY OFERTY NIESTANDARDOWEJ ---------- */
  const [selectCustomPanels, setSelectCustomPanels] = useState(true);
  const [selectCustomInverter, setSelectCustomInverter] = useState(true);
  const [selectCustomStorage, setSelectCustomStorage] = useState(false);

  const [customPanelName, setCustomPanelName] = useState('');
  const [customPanelQuantity, setCustomPanelQuantity] = useState(10);
  const [customPanelPower, setCustomPanelPower] = useState(455);
  const [customPanelDatasheet, setCustomPanelDatasheet] = useState(null);

  const [customInverterName, setCustomInverterName] = useState('');
  const [customInverterQuantity, setCustomInverterQuantity] = useState(1);
  const [customInverterDatasheet, setCustomInverterDatasheet] = useState(null);

  const [customStorageName, setCustomStorageName] = useState('');
  const [customStorageQuantity, setCustomStorageQuantity] = useState(1);
  const [customStorageDatasheet, setCustomStorageDatasheet] = useState(null);

  /* ---------- PLIK PDF ---------- */
  const [generatedPdfData, setGeneratedPdfData] = useState(null);

  /* ---------- EFFECTS ---------- */
  /* 1. Modernizacja („only-storage”) automatycznie zaznacza magazyn i wybiera AC-charger */
  useEffect(() => {
    if (offerMode === 'standard') {
      const isStorageOnly = installationType === 'only-storage';
      setIncludeStorage(isStorageOnly);
      if (isStorageOnly) {
        const firstRetrofitKey = Object.keys(inverterTypesData).find(
          key => inverterTypesData[key].type === 'AC Charger'
        );
        setInverterTypeKey(firstRetrofitKey || '');
      }
    }
  }, [installationType, offerMode]);

  /* 2. Automatyczne przeliczenie liczby paneli przy zmianie mocy lub modelu */
  useEffect(() => {
    if (offerMode === 'standard' && installationType !== 'only-storage') {
      const selectedPanelData = panelTypesData[panelTypeKey];
      if (selectedPanelData && powerInput) {
        const calculatedPanels = Math.ceil(parseFloat(powerInput) / selectedPanelData.power);
        setNumberOfPanels(isNaN(calculatedPanels) || calculatedPanels < 0 ? 0 : calculatedPanels);
      }
    }
  }, [powerInput, panelTypeKey, installationType, offerMode]);

  /* ---------- HANDLERY ---------- */
  const handleFileChange = setter => event => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf') {
        setter(event.target.files[0]);
      } else {
        alert('Proszę wybrać plik PDF.');
        event.target.value = null;
        setter(null);
      }
    }
  };

  const handleGenerateAndSetPdf = async e => {
    e.preventDefault();
    if (showPrice && !price.trim()) {
      alert('Uzupełnij pole Ceny lub odznacz opcję pokazywania jej w ofercie.');
      return;
    }
    setIsProcessing(true);
    setGeneratedPdfData(null);

    let pdfBlob;
    if (offerMode === 'standard') {
      const formData = {
        userName,
        price,
        isNetto,
        installationType,
        showPrice,
        panelDetails:
          installationType !== 'only-storage'
            ? {
                ...panelTypesData[panelTypeKey],
                count: numberOfPanels,
                totalPower: parseFloat(powerInput),
              }
            : null,
        inverterDetails: inverterTypesData[inverterTypeKey],
        inverterQuantity: isCustomInverterQuantity ? inverterQuantity : 1,
        storageDetails: includeStorage ? storageTypesData[storageTypeKey] : null,
        storageModules: includeStorage ? storageModules : 0,
        isBracketMount,
      };
      pdfBlob = await generatePhotovoltaicsOfferPDF(formData);
    } else {
      const formData = {
        clientName: userName,
        price,
        isNetto,
        installationType,
        showPrice,
        panel: selectCustomPanels
          ? {
              name: customPanelName,
              quantity: customPanelQuantity,
              power: customPanelPower,
              datasheet: customPanelDatasheet,
            }
          : null,
        inverter: selectCustomInverter
          ? {
              name: customInverterName,
              quantity: customInverterQuantity,
              datasheet: customInverterDatasheet,
            }
          : null,
        storage: selectCustomStorage
          ? {
              name: customStorageName,
              quantity: customStorageQuantity,
              datasheet: customStorageDatasheet,
            }
          : null,
      };
      pdfBlob = await generateCustomOfferPDF(formData);
    }

    if (pdfBlob) {
      setGeneratedPdfData(pdfBlob);
    }
    setIsProcessing(false);
  };

  const handleDownloadPdf = () => {
    if (!generatedPdfData) return;
    const url = URL.createObjectURL(generatedPdfData);
    const a = document.createElement('a');
    a.download = `Oferta_PV_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ---------- RENDER ---------- */
  return (
    <form className="form-container photovoltaics-generator" onSubmit={handleGenerateAndSetPdf}>
      {/* --- Tryb oferty --- */}
      <div className="form-mode-switcher">
        <button
          type="button"
          className={offerMode === 'standard' ? 'active' : ''}
          onClick={() => setOfferMode('standard')}
        >
          Oferta Standardowa
        </button>
        <button
          type="button"
          className={offerMode === 'custom' ? 'active' : ''}
          onClick={() => setOfferMode('custom')}
        >
          Oferta Niestandardowa
        </button>
      </div>

      <h2>Generator Fotowoltaika</h2>

      {/* --- Dane klienta i cena --- */}
      <div className="input-group">
        <label htmlFor="pv_userName">Imię i Nazwisko Klienta:</label>
        <input
          type="text"
          id="pv_userName"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          placeholder="Podaj imię i nazwisko"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="pv_pricePV">Cena Końcowa (PLN):</label>
        <input
          type="text"
          id="pv_pricePV"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Podaj cenę"
        />
      </div>

      <div className="input-group-inline">
        <input
          type="checkbox"
          id="isNettoPricePV"
          checked={isNetto}
          onChange={e => setIsNetto(e.target.checked)}
        />
        <label htmlFor="isNettoPricePV">Pokaż cenę jako netto</label>
      </div>

      <div className="input-group-inline">
        <input
          type="checkbox"
          id="pv_showPrice"
          checked={showPrice}
          onChange={e => setShowPrice(e.target.checked)}
        />
        <label htmlFor="pv_showPrice">Dołącz cenę do oferty</label>
      </div>

      {/* ---------- OFERTA STANDARDOWA ---------- */}
      {offerMode === 'standard' && (
        <>
          {/* Typ instalacji */}
          <div className="input-group">
            <label htmlFor="pv_installationType">Typ oferty:</label>
            <select
              id="pv_installationType"
              value={installationType}
              onChange={e => setInstallationType(e.target.value)}
            >
              <option value="dach">Nowa instalacja - Dach</option>
              <option value="grunt">Nowa instalacja - Grunt</option>
              <option value="only-storage">Modernizacja o magazyn energii</option>
            </select>
          </div>

          {/* Montaż na ekierkach */}
          {installationType === 'dach' && (
            <div
              className="input-group-inline"
              style={{ paddingLeft: '10px', marginTop: '5px' }}
            >
              <input
                type="checkbox"
                id="isBracketMount"
                checked={isBracketMount}
                onChange={e => setIsBracketMount(e.target.checked)}
              />
              <label htmlFor="isBracketMount">Zastosuj montaż na ekierkach (dach płaski)</label>
            </div>
          )}

          {/* Panele */}
          {installationType !== 'only-storage' && (
            <>
              <div className="input-group">
                <label htmlFor="pv_panelType">Rodzaj paneli:</label>
                <select
                  id="pv_panelType"
                  value={panelTypeKey}
                  onChange={e => setPanelTypeKey(e.target.value)}
                >
                  {Object.keys(panelTypesData).map(key => (
                    <option key={key} value={key}>
                      {panelTypesData[key].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="pv_powerInput">Moc instalacji (kWp):</label>
                <input
                  type="number"
                  id="pv_powerInput"
                  value={powerInput}
                  onChange={e => setPowerInput(e.target.value)}
                  step="0.001"
                />
              </div>

              <div id="pv_panelCountMessage" className="input-group">
                Sugerowana liczba paneli: {numberOfPanels}
              </div>
            </>
          )}

          {/* Falownik */}
          <div className="input-group">
            <label htmlFor="pv_inverterType">Falownik / Ładowarka AC:</label>
            <select
              id="pv_inverterType"
              value={inverterTypeKey}
              onChange={e => setInverterTypeKey(e.target.value)}
            >
              {Object.keys(inverterTypesData).map(key => (
                <option key={key} value={key}>
                  {inverterTypesData[key].name}
                </option>
              ))}
            </select>
          </div>

          {/* Niestandardowa ilość falowników */}
          <div className="options-box">
            <div className="option-row">
              <input
                type="checkbox"
                id="isCustomInverterQuantity"
                checked={isCustomInverterQuantity}
                onChange={e => setIsCustomInverterQuantity(e.target.checked)}
              />
              <label htmlFor="isCustomInverterQuantity">
                Niestandardowa ilość falowników
              </label>
            </div>

            {isCustomInverterQuantity && (
              <div className="custom-quantity-inputs">
                <div className="input-group">
                  <label htmlFor="inverterQty">Ilość falowników:</label>
                  <input
                    id="inverterQty"
                    type="number"
                    value={inverterQuantity}
                    onChange={e => setInverterQuantity(Number(e.target.value))}
                    min="1"
                    step="1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Magazyn energii */}
          <div className="options-box">
            <div className="option-row">
              <input
                type="checkbox"
                id="pv_includeStorage"
                checked={includeStorage}
                onChange={e => setIncludeStorage(e.target.checked)}
              />
              <label htmlFor="pv_includeStorage">Dołącz magazyn energii</label>
            </div>

            {includeStorage && (
              <>
                {/* Wybór typu magazynu */}
                <div className="input-group" style={{ paddingLeft: '15px', marginTop: '10px' }}>
                  <label htmlFor="pv_storageType">Rodzaj magazynu:</label>
                  <select
                    id="pv_storageType"
                    value={storageTypeKey}
                    onChange={e => setStorageTypeKey(e.target.value)}
                  >
                    {Object.keys(storageTypesData).map(key => (
                      <option key={key} value={key}>
                        {storageTypesData[key].name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Liczba modułów */}
                <div className="input-group" style={{ paddingLeft: '15px', marginTop: '10px' }}>
                  <label htmlFor="storageModules">Ilość modułów magazynu (1-8):</label>
                  <select
                    id="storageModules"
                    value={storageModules}
                    onChange={e => setStorageModules(Number(e.target.value))}
                  >
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'moduł' : 'modułów'}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ---------- OFERTA NIESTANDARDOWA ---------- */}
      {offerMode === 'custom' && (
        <>
          {/* Typ instalacji (wpływa tylko na tabelę prac) */}
          <div className="input-group">
            <label>Typ instalacji (wpływa na zakres prac w tabeli)</label>
            <select
              value={installationType}
              onChange={e => setInstallationType(e.target.value)}
            >
              <option value="dach">Dachowa</option>
              <option value="grunt">Gruntowa</option>
            </select>
          </div>

          {/* Przełączniki panel / falownik / magazyn */}
          <div className="options-box">
            <div className="option-row">
              <input
                type="checkbox"
                id="selectCustomPanels"
                checked={selectCustomPanels}
                onChange={e => setSelectCustomPanels(e.target.checked)}
              />
              <label htmlFor="selectCustomPanels">Dołącz panele</label>
            </div>

            <div className="option-row">
              <input
                type="checkbox"
                id="selectCustomInverter"
                checked={selectCustomInverter}
                onChange={e => setSelectCustomInverter(e.target.checked)}
              />
              <label htmlFor="selectCustomInverter">Dołącz inwerter/falownik</label>
            </div>

            <div className="option-row">
              <input
                type="checkbox"
                id="selectCustomStorage"
                checked={selectCustomStorage}
                onChange={e => setSelectCustomStorage(e.target.checked)}
              />
              <label htmlFor="selectCustomStorage">Dołącz magazyn energii</label>
            </div>
          </div>

          {/* Szczegóły paneli (niestandardowe) */}
          {selectCustomPanels && (
            <fieldset className="component-fieldset">
              <legend>Panele Fotowoltaiczne</legend>
              <label htmlFor="customPanelName">Nazwa i model paneli</label>
              <input
                id="customPanelName"
                type="text"
                placeholder="np. Jinko Solar 470Wp"
                value={customPanelName}
                onChange={e => setCustomPanelName(e.target.value)}
                required={selectCustomPanels}
              />

              <div className="inline-inputs">
                <div className="input-group">
                  <label htmlFor="customPanelQuantity">Ilość (szt.)</label>
                  <input
                    id="customPanelQuantity"
                    type="number"
                    value={customPanelQuantity}
                    onChange={e => setCustomPanelQuantity(Number(e.target.value))}
                    required={selectCustomPanels}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="customPanelPower">Moc 1 szt. (Wp)</label>
                  <input
                    id="customPanelPower"
                    type="number"
                    value={customPanelPower}
                    onChange={e => setCustomPanelPower(Number(e.target.value))}
                    required={selectCustomPanels}
                  />
                </div>
              </div>

              <label htmlFor="customPanelDatasheet">Karta katalogowa paneli (PDF)</label>
              <input
                id="customPanelDatasheet"
                type="file"
                accept=".pdf"
                onChange={handleFileChange(setCustomPanelDatasheet)}
              />
            </fieldset>
          )}

          {/* Szczegóły falownika (niestandardowe) */}
          {selectCustomInverter && (
            <fieldset className="component-fieldset">
              <legend>Falownik / Inwerter</legend>
              <label htmlFor="customInverterName">Nazwa i model falownika</label>
              <input
                id="customInverterName"
                type="text"
                placeholder="np. Falownik hybrydowy DEYE 10kW"
                value={customInverterName}
                onChange={e => setCustomInverterName(e.target.value)}
                required={selectCustomInverter}
              />

              <div className="input-group">
                <label htmlFor="customInverterQuantity">Ilość (szt.)</label>
                <input
                  id="customInverterQuantity"
                  type="number"
                  placeholder="1"
                  value={customInverterQuantity}
                  onChange={e => setCustomInverterQuantity(Number(e.target.value))}
                  required={selectCustomInverter}
                />
              </div>

              <label htmlFor="customInverterDatasheet">Karta katalogowa falownika (PDF)</label>
              <input
                id="customInverterDatasheet"
                type="file"
                accept=".pdf"
                onChange={handleFileChange(setCustomInverterDatasheet)}
              />
            </fieldset>
          )}

          {/* Szczegóły magazynu (niestandardowe) */}
          {selectCustomStorage && (
            <fieldset className="component-fieldset">
              <legend>Magazyn Energii</legend>
              <label htmlFor="customStorageName">Nazwa i model magazynu</label>
              <input
                id="customStorageName"
                type="text"
                placeholder="np. DEYE 5.12kWh"
                value={customStorageName}
                onChange={e => setCustomStorageName(e.target.value)}
                required={selectCustomStorage}
              />

              <div className="input-group">
                <label htmlFor="customStorageQuantity">Ilość modułów/sztuk</label>
                <input
                  id="customStorageQuantity"
                  type="number"
                  value={customStorageQuantity}
                  onChange={e => setCustomStorageQuantity(Number(e.target.value))}
                  required={selectCustomStorage}
                />
              </div>

              <label htmlFor="customStorageDatasheet">Karta katalogowa magazynu (PDF)</label>
              <input
                id="customStorageDatasheet"
                type="file"
                accept=".pdf"
                onChange={handleFileChange(setCustomStorageDatasheet)}
              />
            </fieldset>
          )}
        </>
      )}

      {/* ---------- BUTTONY ---------- */}
      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Przetwarzanie...' : 'Generuj PDF'}
      </button>

      {generatedPdfData && (
        <button
          type="button"
          onClick={handleDownloadPdf}
          style={{ marginTop: '10px', background: '#555' }}
        >
          Pobierz wygenerowany PDF
        </button>
      )}

      {/* Trello (bez zmian) */}
      <TrelloActions generatedPdfData={generatedPdfData} userName={userName} />
    </form>
  );
}
