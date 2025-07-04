// src/components/RecuperationOfferForm.jsx

import React, { useState, useEffect } from 'react';
// ZMIANA: Poprawiono import z 'otherElementsOptions' na 'otherElements'
import { 
    recuperationDevices, 
    getRecommendedRecuperator, 
    installationSystems, 
    otherElements 
} from '../data/tables/recuperationData';
import { generateRecuperationOfferPDF } from '../utils/recuperationPdfGenerator';
import TrelloActions from './TrelloActions';

export default function RecuperationOfferForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState('');
  const [price, setPrice] = useState('');
  const [isNetto, setIsNetto] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [generatedPdfData, setGeneratedPdfData] = useState(null);
  
  const [offerMode, setOfferMode] = useState('dobor');
  const [surfaceArea, setSurfaceArea] = useState('100');
  
  const [installationSystemKey, setInstallationSystemKey] = useState(Object.keys(installationSystems)[0]);
  // ZMIANA: Użycie poprawnej nazwy zmiennej 'otherElements'
  const [otherElementsKey, setOtherElementsKey] = useState(Object.keys(otherElements)[0]);
  const [selectedDevice, setSelectedDevice] = useState(Object.keys(recuperationDevices)[0]);

  useEffect(() => {
    if (offerMode === 'dobor') {
      const recommendedKey = getRecommendedRecuperator(surfaceArea);
      if (recommendedKey) {
        setSelectedDevice(recommendedKey);
      }
    }
  }, [surfaceArea, offerMode]);
  
  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    if (showPrice && !price.trim()) {
      alert('Uzupełnij pole Ceny lub odznacz opcję pokazywania jej w ofercie.');
      return;
    }
    setIsProcessing(true);
    setGeneratedPdfData(null); 

    const formData = {
      userName, price, isNetto, showPrice, offerMode,
      deviceKey: selectedDevice,
      surfaceArea: surfaceArea,
      installationSystemKey,
      otherElementsKey,
    };
    
    const pdfBlob = await generateRecuperationOfferPDF(formData);
    if (pdfBlob) {
      setGeneratedPdfData(pdfBlob);
    }
    setIsProcessing(false);
  };

  const handleDownloadPdf = () => {
    if (!generatedPdfData) return;
    const url = URL.createObjectURL(generatedPdfData);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oferta_Rekuperacja_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert - Rekuperacja</h2>
      
      <div className="input-group">
        <label>Imię i Nazwisko Klienta:</label>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>
      <div className="input-group">
        <label>Cena Końcowa (PLN):</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Podaj cenę" />
      </div>

      <div className="input-group">
          <label>Typ oferty:</label>
          <div className="form-mode-switcher">
              <button type="button" className={offerMode === 'dobor' ? 'active' : ''} onClick={() => setOfferMode('dobor')}>
                  Dobór i Wycena
              </button>
              <button type="button" className={offerMode === 'wycena' ? 'active' : ''} onClick={() => setOfferMode('wycena')}>
                  Wycena
              </button>
          </div>
      </div>

      {offerMode === 'dobor' && (
        <div className="input-group">
          <label htmlFor="surfaceArea">Powierzchnia domu (m²):</label>
          <input 
            id="surfaceArea"
            type="number" 
            value={surfaceArea} 
            onChange={(e) => setSurfaceArea(e.target.value)} 
            placeholder="np. 150"
          />
        </div>
      )}
      
      <fieldset className="component-fieldset">
        <legend>Konfiguracja systemu</legend>
        <div className="input-group">
            <label htmlFor="installationSystem">System przewodów elastycznych:</label>
            <select id="installationSystem" value={installationSystemKey} onChange={(e) => setInstallationSystemKey(e.target.value)}>
                {Object.keys(installationSystems).map(key => (
                    <option key={key} value={key}>{installationSystems[key].name}</option>
                ))}
            </select>
        </div>
        <div className="input-group">
            <label htmlFor="otherElements">Instalacja Czerpni/Wyrzutni:</label>
            <select id="otherElements" value={otherElementsKey} onChange={(e) => setOtherElementsKey(e.target.value)}>
                {/* ZMIANA: Użycie poprawnej nazwy zmiennej 'otherElements' */}
                {Object.keys(otherElements).map(key => (
                    <option key={key} value={key}>{otherElements[key].name}</option>
                ))}
            </select>
        </div>
        <div className="input-group">
            <label htmlFor="rekuDevice">Jednostka centralna:</label>
            <select id="rekuDevice" value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
                {Object.keys(recuperationDevices).map(key => (
                    <option key={key} value={key}>{recuperationDevices[key].name}</option>
                ))}
            </select>
            {offerMode === 'dobor' && <small>Urządzenie dobrane automatycznie. Możesz je zmienić.</small>}
        </div>
      </fieldset>

      <hr/>

      <div className="input-group-inline">
        <input type="checkbox" id="reku_isNetto" checked={isNetto} onChange={(e) => setIsNetto(e.target.checked)} />
        <label htmlFor="reku_isNetto">Pokaż cenę jako netto</label>
      </div>
      <div className="input-group-inline">
        <input type="checkbox" id="reku_showPrice" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} />
        <label htmlFor="reku_showPrice">Dołącz cenę do oferty</label>
      </div>
      
      <button type="submit" disabled={isProcessing}>{isProcessing ? 'Przetwarzanie...' : 'Generuj Ofertę'}</button>

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