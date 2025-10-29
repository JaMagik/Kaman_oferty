// src/components/RecuperationOfferForm.jsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  recuperationDevices,
  getRecommendedRecuperator,
  recuperationVariants,
  DRILLING_ITEM_ID,
} from '../data/tables/recuperationData';
import { generateRecuperationOfferPDF } from '../utils/recuperationPdfGenerator';
import TrelloActions from './TrelloActions';
import { clientAdvisorOptions } from '../data/clientAdvisorOptions';

const drillingOptions = [
  { key: 'main', label: 'W zakresie głównym' },
  { key: 'addon', label: 'Jako opcja dodatkowa' },
];

export default function RecuperationOfferForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState('');
  const [price, setPrice] = useState('');
  const [isNetto, setIsNetto] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [generatedPdfData, setGeneratedPdfData] = useState(null);

  const [offerMode, setOfferMode] = useState('dobor');
  const [surfaceArea, setSurfaceArea] = useState('100');

  const [variantKey, setVariantKey] = useState('samRekuperator');
  const [isEnthalpyVariant, setIsEnthalpyVariant] = useState(false);
  const [drillingMode, setDrillingMode] = useState('main');
  const [includeAquaClear, setIncludeAquaClear] = useState(false);

  const [investmentStreet, setInvestmentStreet] = useState('');
  const [investmentTown, setInvestmentTown] = useState('');
  const [investmentPostalCode, setInvestmentPostalCode] = useState('');
  const [investmentCity, setInvestmentCity] = useState('');
  const [advisorId, setAdvisorId] = useState(clientAdvisorOptions[0]?.value || '');
  const selectedAdvisor = useMemo(
    () => clientAdvisorOptions.find((option) => option.value === advisorId) || clientAdvisorOptions[0] || {},
    [advisorId],
  );

  const variantOptions = useMemo(
    () => Object.values(recuperationVariants),
    []
  );

  const variantConfig =
    recuperationVariants[variantKey] || recuperationVariants.samRekuperator;

  const [selectedDeviceKey, setSelectedDeviceKey] = useState(
    getRecommendedRecuperator(surfaceArea)
  );

  useEffect(() => {
    if (offerMode === 'dobor') {
      const recommendedKey = getRecommendedRecuperator(surfaceArea);
      if (recommendedKey) {
        setSelectedDeviceKey(recommendedKey);
      }
    }
  }, [surfaceArea, offerMode]);

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    if (showPrice && !price.trim()) {
      alert(
        'Uzupełnij pole Ceny lub odznacz opcję wyświetlania jej w ofercie.'
      );
      return;
    }

    const baseMainIds = [...(variantConfig?.itemIds || [])];
    let mainItemIds = baseMainIds;
    let addonItemIds = [];

    if (drillingMode === 'addon') {
      mainItemIds = baseMainIds.filter((id) => id !== DRILLING_ITEM_ID);
      if (baseMainIds.includes(DRILLING_ITEM_ID)) {
        addonItemIds = [DRILLING_ITEM_ID];
      }
    }

    if (includeAquaClear) {
      if (!mainItemIds.includes('21')) {
        mainItemIds = [...mainItemIds, '21'];
      }
    } else {
      mainItemIds = mainItemIds.filter((id) => id !== '21');
    }

    setIsProcessing(true);
    setGeneratedPdfData(null);

    try {
    const formData = {
      userName,
      price,
      isNetto,
      showPrice,
      offerMode,
      surfaceArea,
      deviceKey: selectedDeviceKey,
      variantKey: variantConfig.key,
      variantLabel: variantConfig.label,
      mainItemIds,
      addonItemIds,
      drillingMode,
      includeAquaClear,
      isEnthalpyVariant,
      investmentAddress: {
        street: investmentStreet,
        town: investmentTown,
        postalCode: investmentPostalCode,
        city: investmentCity,
      },
      advisorInfo: {
        label: selectedAdvisor?.label || '',
        phone: selectedAdvisor?.phone || '',
        email: selectedAdvisor?.email || '',
      },
    };

      const pdfBlob = await generateRecuperationOfferPDF(formData);
      if (pdfBlob) {
        setGeneratedPdfData(pdfBlob);
      }
    } catch (error) {
      console.error('Błąd podczas generowania oferty na rekuperację:', error);
      alert(`Wystąpił błąd: ${error.message}.`);
    } finally {
      setIsProcessing(false);
    }
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
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label>Cena Końcowa (PLN):</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Podaj cenę"
        />
      </div>

      <fieldset className="component-fieldset">
        <legend>Dane inwestycji i doradcy</legend>
        <div className="input-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="input-group">
            <label htmlFor="recuperation_town">Miejscowość</label>
            <input
              id="recuperation_town"
              type="text"
              value={investmentTown}
              onChange={(event) => setInvestmentTown(event.target.value)}
              placeholder="np. Kraków"
            />
          </div>
          <div className="input-group">
            <label htmlFor="recuperation_street">Ulica i numer</label>
            <input
              id="recuperation_street"
              type="text"
              value={investmentStreet}
              onChange={(event) => setInvestmentStreet(event.target.value)}
              placeholder="np. ul. Przykładowa 12"
            />
          </div>
          <div className="input-group">
            <label htmlFor="recuperation_postal">Kod pocztowy</label>
            <input
              id="recuperation_postal"
              type="text"
              value={investmentPostalCode}
              onChange={(event) => setInvestmentPostalCode(event.target.value)}
              placeholder="np. 30-001"
            />
          </div>
          <div className="input-group">
            <label htmlFor="recuperation_city">Miasto</label>
            <input
              id="recuperation_city"
              type="text"
              value={investmentCity}
              onChange={(event) => setInvestmentCity(event.target.value)}
              placeholder="np. Kraków"
            />
          </div>
          <div className="input-group">
            <label htmlFor="recuperation_advisor">Ofertę sporządził</label>
            <select
              id="recuperation_advisor"
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

      <div className="input-group">
        <label>Typ oferty:</label>
        <div className="form-mode-switcher">
          <button
            type="button"
            className={offerMode === 'dobor' ? 'active' : ''}
            onClick={() => setOfferMode('dobor')}
          >
            Dobór i Wycena
          </button>
          <button
            type="button"
            className={offerMode === 'wycena' ? 'active' : ''}
            onClick={() => setOfferMode('wycena')}
          >
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
          <label htmlFor="rekuDevice">Jednostka wentylacyjna:</label>
          <select
            id="rekuDevice"
            value={selectedDeviceKey}
            onChange={(e) => setSelectedDeviceKey(e.target.value)}
          >
            {Object.keys(recuperationDevices).map((key) => (
              <option key={key} value={key}>
                {recuperationDevices[key].name + (isEnthalpyVariant ? ' entalpiczny' : '')}
              </option>
            ))}
          </select>
          {offerMode === 'dobor' && (
            <small style={{ display: 'block', marginTop: '8px' }}>
              Urządzenie dobrane automatycznie na podstawie powierzchni. Możesz
              je zmienić.
            </small>
          )}
        </div>
        <div className="input-group-inline" style={{ marginTop: '10px' }}>
          <input
            type="checkbox"
            id="reku_enthalpyVariant"
            checked={isEnthalpyVariant}
            onChange={(event) => setIsEnthalpyVariant(event.target.checked)}
          />
          <label htmlFor="reku_enthalpyVariant">Wariant entalpiczny</label>
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Zakres montażu</legend>

        <div className="input-group">
          <label>Wariant prac:</label>
          <div className="form-mode-switcher">
            {variantOptions.map((variant) => (
              <button
                key={variant.key}
                type="button"
                className={variantKey === variant.key ? 'active' : ''}
                onClick={() => setVariantKey(variant.key)}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Wiercenie otworów koroną:</label>
          <div className="form-mode-switcher">
            {drillingOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={drillingMode === option.key ? 'active' : ''}
                onClick={() => setDrillingMode(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="input-group-inline">
        <input
          type="checkbox"
          id="includeAquaClear"
          checked={includeAquaClear}
          onChange={(event) => setIncludeAquaClear(event.target.checked)}
        />
        <label htmlFor="includeAquaClear">Filtr Aqua Clear (dodaj do zakresu)</label>
      </div>

      <hr />

      <div className="input-group-inline">
        <input
          type="checkbox"
          id="reku_isNetto"
          checked={isNetto}
          onChange={(e) => setIsNetto(e.target.checked)}
        />
        <label htmlFor="reku_isNetto">Pokaż cenę jako netto</label>
      </div>
      <div className="input-group-inline">
        <input
          type="checkbox"
          id="reku_showPrice"
          checked={showPrice}
          onChange={(e) => setShowPrice(e.target.checked)}
        />
        <label htmlFor="reku_showPrice">Dołącz cenę do oferty</label>
      </div>

      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Przetwarzanie...' : 'Generuj Ofertę'}
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

      <TrelloActions generatedPdfData={generatedPdfData} userName={userName} />
    </form>
  );
}
