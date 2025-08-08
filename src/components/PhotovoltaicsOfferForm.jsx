// src/components/PhotovoltaicsOfferForm.jsx
import React, { useState, useEffect } from 'react';
import { generatePhotovoltaicsOfferPDF } from '../utils/pvPdfGenerator';
import { generateCustomOfferPDF } from '../utils/customPdfGenerator';
import {
  panelTypesData,
  inverterTypesData,
  storageTypesData,
} from '../data/tables/photovoltaicsData';
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

  /* Panele (standard) */
  const [panelTypeKey, setPanelTypeKey] = useState('CANADIAN_SOLAR_455');
  const [powerInput, setPowerInput] = useState('');
  const [numberOfPanels, setNumberOfPanels] = useState(0);

  /* Falownik (standard) */
  const [includeInverter, setIncludeInverter] = useState(false);
  const [inverterTypeKey, setInverterTypeKey] = useState(
    Object.keys(inverterTypesData)[0]
  );
  const [inverterQuantity, setInverterQuantity] = useState(1);
  const [isCustomInverterQuantity, setIsCustomInverterQuantity] = useState(false);

  /* Magazyn (standard) */
  const [includeStorage, setIncludeStorage] = useState(false);
  const [storageTypeKey, setStorageTypeKey] = useState(
    Object.keys(storageTypesData)[0]
  );
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
  useEffect(() => {
    // automatyka dla „modernizacji o magazyn” w trybie standard
    if (offerMode === 'standard') {
      const isStorageOnly = installationType === 'only-storage';
      setIncludeInverter(!isStorageOnly); // przy modernizacji falownik zwykle zostaje
      setIncludeStorage(true);
    }
  }, [installationType, offerMode]);

  useEffect(() => {
    // auto-obliczenie liczby paneli w trybie standard
    if (offerMode === 'standard' && installationType !== 'only-storage') {
      const selectedPanelData = panelTypesData[panelTypeKey];
      if (selectedPanelData && powerInput) {
        const calc = Math.ceil(parseFloat(powerInput) / selectedPanelData.power);
        setNumberOfPanels(isNaN(calc) || calc < 0 ? 0 : calc);
      }
    }
  }, [powerInput, panelTypeKey, installationType, offerMode]);

  /* ---------- HANDLERY ---------- */
  const handleFileChange = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') setter(file);
    else {
      alert('Proszę wybrać plik PDF.');
      e.target.value = null;
    }
  };

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();

    if (showPrice && !String(price || '').trim()) {
      alert('Uzupełnij pole Ceny lub odznacz opcję pokazywania jej w ofercie.');
      return;
    }

    setIsProcessing(true);
    let pdfBlob = null;

    if (offerMode === 'standard') {
      const formData = {
        userName,
        showPrice,
        isNetto,
        price: price.trim(),
        installationType,
        panelDetails:
          installationType !== 'only-storage'
            ? {
                ...panelTypesData[panelTypeKey],
                count: numberOfPanels,
                totalPower: parseFloat(powerInput),
              }
            : null,
        inverterDetails: includeInverter
          ? inverterTypesData[inverterTypeKey]
          : null,
        inverterQuantity: includeInverter
          ? isCustomInverterQuantity
            ? inverterQuantity
            : 1
          : 0,
        storageDetails: includeStorage
          ? storageTypesData[storageTypeKey]
          : null,
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

    if (pdfBlob) setGeneratedPdfData(pdfBlob);
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
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* ---------- RENDER ---------- */
  return (
    <form
      className="form-container photovoltaics-generator"
      onSubmit={handleGenerateAndSetPdf}
    >
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
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Podaj imię i nazwisko"
        />
      </div>

      <div className="input-group">
        <label htmlFor="pv_pricePV">Cena Końcowa (PLN):</label>
        <input
          type="text"
          id="pv_pricePV"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Podaj cenę"
        />
      </div>

      <div className="input-group-inline">
        <input
          type="checkbox"
          id="isNettoPricePV"
          checked={isNetto}
          onChange={(e) => setIsNetto(e.target.checked)}
        />
        <label htmlFor="isNettoPricePV">Pokaż cenę jako netto</label>
      </div>

      <div className="input-group-inline">
        <input
          type="checkbox"
          id="pv_showPrice"
          checked={showPrice}
          onChange={(e) => setShowPrice(e.target.checked)}
        />
        <label htmlFor="pv_showPrice">Dołącz cenę do oferty</label>
      </div>

      {/* ---------- OFERTA STANDARDOWA ---------- */}
      {offerMode === 'standard' && (
        <>
          {/* Typ oferty */}
          <div className="input-group">
            <label htmlFor="pv_installationType">Typ oferty:</label>
            <select
              id="pv_installationType"
              value={installationType}
              onChange={(e) => setInstallationType(e.target.value)}
            >
              <option value="dach">Nowa instalacja - Dach</option>
              <option value="grunt">Nowa instalacja - Grunt</option>
              <option value="only-storage">Modernizacja o magazyn energii</option>
            </select>
          </div>

          {/* Montaż na ekierkach */}
          {installationType === 'dach' && (
            <div className="input-group-inline" style={{ paddingLeft: 10, marginTop: 5 }}>
              <input
                type="checkbox"
                id="isBracketMount"
                checked={isBracketMount}
                onChange={(e) => setIsBracketMount(e.target.checked)}
              />
              <label htmlFor="isBracketMount">Montaż na ekierkach (blacha trapezowa)</label>
            </div>
          )}

          {/* Panele */}
          {installationType !== 'only-storage' && (
            <>
              <div className="input-group">
                <label htmlFor="pv_panelType">Panele:</label>
                <select
                  id="pv_panelType"
                  value={panelTypeKey}
                  onChange={(e) => setPanelTypeKey(e.target.value)}
                >
                  {Object.keys(panelTypesData).map((key) => (
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
                  onChange={(e) => setPowerInput(e.target.value)}
                  placeholder="np. 9.1"
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="input-group">
                <label>Liczba modułów: {numberOfPanels}</label>
              </div>
            </>
          )}

          {/* Falownik */}
          <div className="input-group" style={{ marginTop: 10 }}>
            <div className="input-group-inline">
              <input
                type="checkbox"
                id="pv_includeInverter"
                checked={includeInverter}
                onChange={(e) => setIncludeInverter(e.target.checked)}
              />
              <label htmlFor="pv_includeInverter">Dołącz falownik / ładowarkę AC</label>
            </div>

            {includeInverter && (
              <>
                <div className="input-group" style={{ paddingLeft: 15 }}>
                  <label htmlFor="pv_inverterType">Falownik / Ładowarka AC:</label>
                  <select
                    id="pv_inverterType"
                    value={inverterTypeKey}
                    onChange={(e) => setInverterTypeKey(e.target.value)}
                  >
                    {Object.keys(inverterTypesData).map((key) => (
                      <option key={key} value={key}>
                        {inverterTypesData[key].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group" style={{ paddingLeft: 15 }}>
                  <div className="input-group-inline">
                    <input
                      type="checkbox"
                      id="pv_customInverterQuantity"
                      checked={isCustomInverterQuantity}
                      onChange={(e) => setIsCustomInverterQuantity(e.target.checked)}
                    />
                    <label htmlFor="pv_customInverterQuantity">Własna ilość</label>
                  </div>
                  {isCustomInverterQuantity && (
                    <input
                      type="number"
                      min={1}
                      value={inverterQuantity}
                      onChange={(e) => setInverterQuantity(Number(e.target.value))}
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Magazyn energii */}
          <div className="input-group" style={{ marginTop: 10 }}>
            <div className="input-group-inline">
              <input
                type="checkbox"
                id="pv_includeStorage"
                checked={includeStorage}
                onChange={(e) => setIncludeStorage(e.target.checked)}
              />
              <label htmlFor="pv_includeStorage">Dołącz magazyn energii</label>
            </div>

            {includeStorage && (
              <>
                <div className="input-group" style={{ paddingLeft: 15 }}>
                  <label htmlFor="pv_storageType">Magazyn energii:</label>
                  <select
                    id="pv_storageType"
                    value={storageTypeKey}
                    onChange={(e) => setStorageTypeKey(e.target.value)}
                  >
                    {Object.keys(storageTypesData).map((key) => (
                      <option key={key} value={key}>
                        {storageTypesData[key].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group" style={{ paddingLeft: 15, marginTop: 10 }}>
                  <label htmlFor="storageModules">Ilość modułów magazynu (1-8):</label>
                  <select
                    id="storageModules"
                    value={storageModules}
                    onChange={(e) => setStorageModules(Number(e.target.value))}
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
          {/* Typ oferty */}
          <div className="input-group">
            <label htmlFor="pv_installationType_custom">Typ oferty:</label>
            <select
              id="pv_installationType_custom"
              value={installationType}
              onChange={(e) => setInstallationType(e.target.value)}
            >
              <option value="dach">Nowa instalacja - Dach</option>
              <option value="grunt">Nowa instalacja - Grunt</option>
              <option value="only-storage">Modernizacja o magazyn energii</option>
            </select>
          </div>

          {/* PANEELE */}
          <div className="input-group">
            <div className="input-group-inline">
              <input
                type="checkbox"
                id="pv_custom_panels_toggle"
                checked={selectCustomPanels}
                onChange={(e) => setSelectCustomPanels(e.target.checked)}
              />
              <label htmlFor="pv_custom_panels_toggle">Dołącz panele</label>
            </div>

            {selectCustomPanels && (
              <div style={{ paddingLeft: 15 }}>
                <div className="input-group">
                  <label htmlFor="pv_custom_panel_name">Nazwa paneli:</label>
                  <input
                    type="text"
                    id="pv_custom_panel_name"
                    value={customPanelName}
                    onChange={(e) => setCustomPanelName(e.target.value)}
                    placeholder="np. Canadian Solar 455 Wp"
                  />
                </div>

                <div className="input-group-inline">
                  <div style={{ flex: 1 }}>
                    <label htmlFor="pv_custom_panel_qty">Ilość (szt.):</label>
                    <input
                      type="number"
                      id="pv_custom_panel_qty"
                      value={customPanelQuantity}
                      min={1}
                      onChange={(e) => setCustomPanelQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="pv_custom_panel_power">Moc jednego modułu (Wp):</label>
                    <input
                      type="number"
                      id="pv_custom_panel_power"
                      value={customPanelPower}
                      min={1}
                      onChange={(e) => setCustomPanelPower(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="pv_custom_panel_ds">Karta katalogowa (PDF):</label>
                  <input
                    type="file"
                    id="pv_custom_panel_ds"
                    accept="application/pdf"
                    onChange={handleFileChange(setCustomPanelDatasheet)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* FALOWNIK / ŁADOWARKA */}
          <div className="input-group">
            <div className="input-group-inline">
              <input
                type="checkbox"
                id="pv_custom_inverter_toggle"
                checked={selectCustomInverter}
                onChange={(e) => setSelectCustomInverter(e.target.checked)}
              />
              <label htmlFor="pv_custom_inverter_toggle">Dołącz falownik / ładowarkę</label>
            </div>

            {selectCustomInverter && (
              <div style={{ paddingLeft: 15 }}>
                <div className="input-group">
                  <label htmlFor="pv_custom_inverter_name">Nazwa urządzenia:</label>
                  <input
                    type="text"
                    id="pv_custom_inverter_name"
                    value={customInverterName}
                    onChange={(e) => setCustomInverterName(e.target.value)}
                    placeholder="np. Huawei SUN2000-10KTL"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="pv_custom_inverter_qty">Ilość (szt.):</label>
                  <input
                    type="number"
                    id="pv_custom_inverter_qty"
                    value={customInverterQuantity}
                    min={1}
                    onChange={(e) => setCustomInverterQuantity(Number(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="pv_custom_inverter_ds">Karta katalogowa (PDF):</label>
                  <input
                    type="file"
                    id="pv_custom_inverter_ds"
                    accept="application/pdf"
                    onChange={handleFileChange(setCustomInverterDatasheet)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* MAGAZYN ENERGII */}
          <div className="input-group">
            <div className="input-group-inline">
              <input
                type="checkbox"
                id="pv_custom_storage_toggle"
                checked={selectCustomStorage}
                onChange={(e) => setSelectCustomStorage(e.target.checked)}
              />
              <label htmlFor="pv_custom_storage_toggle">Dołącz magazyn energii</label>
            </div>

            {selectCustomStorage && (
              <div style={{ paddingLeft: 15 }}>
                <div className="input-group">
                  <label htmlFor="pv_custom_storage_name">Nazwa magazynu:</label>
                  <input
                    type="text"
                    id="pv_custom_storage_name"
                    value={customStorageName}
                    onChange={(e) => setCustomStorageName(e.target.value)}
                    placeholder="np. Sungrow SBR096"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="pv_custom_storage_qty">Ilość (kpl.):</label>
                  <input
                    type="number"
                    id="pv_custom_storage_qty"
                    value={customStorageQuantity}
                    min={1}
                    onChange={(e) => setCustomStorageQuantity(Number(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="pv_custom_storage_ds">Karta katalogowa (PDF):</label>
                  <input
                    type="file"
                    id="pv_custom_storage_ds"
                    accept="application/pdf"
                    onChange={handleFileChange(setCustomStorageDatasheet)}
                  />
                </div>
              </div>
            )}
          </div>
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
          style={{ marginTop: 10, background: '#555' }}
        >
          Pobierz wygenerowany PDF
        </button>
      )}

      <TrelloActions generatedPdfData={generatedPdfData} userName={userName} />
    </form>
  );
}
