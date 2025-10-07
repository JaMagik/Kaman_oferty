// src/components/OknaNestOfferForm.jsx
import React, { useMemo, useState } from 'react';
import { generateOknaNestPDF } from '../utils/oknaNestPdfGenerator';
import {
  assemblyTypeOptions,
  hardwareThicknessOptions,
  profileColorOptions,
  profileTypeOptions,
  windowOptionDefinitions,
  optionalFeatureGroups,
  installationVariants,
  installationExtras,
} from '../data/windowsOfferConfig';

const defaultSelectedWindowOptionIds = windowOptionDefinitions
  .filter((option) => option.defaultSelected)
  .map((option) => option.id);

const parsePreviewNumber = (value) => {
  if (!value) {
    return 0;
  }
  const normalized = String(value).replace(/\s+/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildDefaultFeatureState = () => {
  const state = {};
  optionalFeatureGroups.forEach((group) => {
    group.items.forEach((item) => {
      state[item.id] = { enabled: false, detail: '' };
    });
  });
  return state;
};

const buildDefaultInstallationExtrasState = () => {
  const state = {};
  installationExtras.forEach((item) => {
    state[item.id] = false;
  });
  return state;
};

export default function OknaNestOfferForm() {
  const [userName, setUserName] = useState('');
  const [investmentAddress, setInvestmentAddress] = useState('');
  const [catalogPrice, setCatalogPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [installationPrice, setInstallationPrice] = useState('');
  const [windowPerimeter, setWindowPerimeter] = useState('');
  const [windowArea, setWindowArea] = useState('');
  const [profileType, setProfileType] = useState(profileTypeOptions[0]?.value || '');
  const [hardwareThickness, setHardwareThickness] = useState(hardwareThicknessOptions[0]?.value || '');
  const [assemblyType, setAssemblyType] = useState(assemblyTypeOptions[0]?.value || '');
  const [profileColor, setProfileColor] = useState(profileColorOptions[0]?.value || '');
  const [selectedOptionIds, setSelectedOptionIds] = useState(defaultSelectedWindowOptionIds);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [featureSelections, setFeatureSelections] = useState(() => buildDefaultFeatureState());
  const [installationVariant, setInstallationVariant] = useState(installationVariants[0]?.value || '');
  const [installationExtrasState, setInstallationExtrasState] = useState(() => buildDefaultInstallationExtrasState());
  const [isProcessing, setIsProcessing] = useState(false);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  };

  const toggleOption = (optionId) => {
    setSelectedOptionIds((current) => {
      if (current.includes(optionId)) {
        return current.filter((id) => id !== optionId);
      }
      return [...current, optionId];
    });
  };

  const toggleFeatureSelection = (featureId) => {
    setFeatureSelections((current) => {
      const previous = current[featureId] || { enabled: false, detail: '' };
      const nextEnabled = !previous.enabled;
      return {
        ...current,
        [featureId]: {
          enabled: nextEnabled,
          detail: nextEnabled ? previous.detail : '',
        },
      };
    });
  };

  const updateFeatureDetail = (featureId, value) => {
    setFeatureSelections((current) => ({
      ...current,
      [featureId]: {
        ...(current[featureId] || { enabled: false, detail: '' }),
        detail: value,
      },
    }));
  };

  const toggleInstallationExtra = (extraId) => {
    setInstallationExtrasState((current) => ({
      ...current,
      [extraId]: !current[extraId],
    }));
  };

  const pricePreview = useMemo(() => {
    const catalog = parsePreviewNumber(catalogPrice);
    const discount = parsePreviewNumber(discountPercent);
    const installation = parsePreviewNumber(installationPrice);

    if (catalog <= 0) {
      return null;
    }

    const discountedValue = catalog * (1 - discount / 100);
    const discountValue = catalog - discountedValue;
    const total = discountedValue + installation;

    return {
      discountedValue,
      discountValue,
      total,
    };
  }, [catalogPrice, discountPercent, installationPrice]);

  const handleGeneratePDF = async (event) => {
    event.preventDefault();

    if (!userName.trim()) {
      alert('Uzupelnij imie i nazwisko klienta.');
      return;
    }

    if (!investmentAddress.trim()) {
      alert('Podaj adres inwestycji.');
      return;
    }

    if (!windowArea || !windowPerimeter) {
      alert('Podaj obwod oraz laczna powierzchnie okien.');
      return;
    }

    setIsProcessing(true);

    try {
      const pdfBlob = await generateOknaNestPDF({
        userName: userName.trim(),
        investmentAddress: investmentAddress.trim(),
        catalogPrice,
        discountPercent,
        installationPrice,
        windowPerimeter,
        windowArea,
        profileType,
        hardwareThickness,
        assemblyType,
        profileColor,
        selectedOptionIds,
        additionalNotes,
        featureSelections,
        installationVariant,
        installationExtras: installationExtrasState,
      });

      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `Oferta_OknaNest_KAMAN_${userName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);

        setUserName('');
        setInvestmentAddress('');
        setCatalogPrice('');
        setDiscountPercent('');
        setInstallationPrice('');
        setWindowPerimeter('');
        setWindowArea('');
        setProfileType(profileTypeOptions[0]?.value || '');
        setHardwareThickness(hardwareThicknessOptions[0]?.value || '');
        setAssemblyType(assemblyTypeOptions[0]?.value || '');
        setProfileColor(profileColorOptions[0]?.value || '');
        setSelectedOptionIds(defaultSelectedWindowOptionIds);
        setAdditionalNotes('');
        setFeatureSelections(buildDefaultFeatureState());
        setInstallationVariant(installationVariants[0]?.value || '');
        setInstallationExtrasState(buildDefaultInstallationExtrasState());
      }
    } catch (error) {
      console.error('Blad podczas generowania PDF dla Okien Nest:', error);
      alert(`Wystapil blad: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="form-container okna-nest-generator" onSubmit={handleGeneratePDF}>
      <h2>Generator Okna Nest</h2>

      <fieldset className="component-fieldset">
        <legend>Dane klienta</legend>
        <div className="input-group">
          <label htmlFor="okna_userName">Imie i nazwisko klienta</label>
          <input
            id="okna_userName"
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="np. Jan Nowak"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="okna_address">Adres inwestycji</label>
          <input
            id="okna_address"
            type="text"
            value={investmentAddress}
            onChange={(event) => setInvestmentAddress(event.target.value)}
            placeholder="np. ul. Wiosenna 12, Krakow"
            required
          />
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Parametry finansowe</legend>
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="okna_catalogPrice">Cena katalogowa (PLN)</label>
            <input
              id="okna_catalogPrice"
              type="number"
              step="0.01"
              min="0"
              value={catalogPrice}
              onChange={(event) => setCatalogPrice(event.target.value)}
              placeholder="np. 56000"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="okna_discount">Rabat (%)</label>
            <input
              id="okna_discount"
              type="number"
              step="0.1"
              min="0"
              value={discountPercent}
              onChange={(event) => setDiscountPercent(event.target.value)}
              placeholder="np. 8"
            />
          </div>
          <div className="input-group">
            <label htmlFor="okna_installationPrice">Cena montazu (PLN)</label>
            <input
              id="okna_installationPrice"
              type="number"
              step="0.01"
              min="0"
              value={installationPrice}
              onChange={(event) => setInstallationPrice(event.target.value)}
              placeholder="np. 7200"
              required
            />
          </div>
        </div>
        {pricePreview && (
          <div className="input-group">
            <label>Podglad wyliczenia</label>
            <div>
              <div>
                Cena po rabacie: {pricePreview.discountedValue.toFixed(2)} PLN (oszczednosc {pricePreview.discountValue.toFixed(2)} PLN)
              </div>
              <div>Cena koncowa z montazem: {pricePreview.total.toFixed(2)} PLN</div>
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Parametry stolarki</legend>
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="okna_area">Laczna powierzchnia okien (m2)</label>
            <input
              id="okna_area"
              type="number"
              step="0.01"
              min="0"
              value={windowArea}
              onChange={(event) => setWindowArea(event.target.value)}
              placeholder="np. 18.4"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="okna_perimeter">Obwod okien (mb)</label>
            <input
              id="okna_perimeter"
              type="number"
              step="0.01"
              min="0"
              value={windowPerimeter}
              onChange={(event) => setWindowPerimeter(event.target.value)}
              placeholder="np. 52"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="okna_profileType">Rodzaj profili</label>
            <select
              id="okna_profileType"
              value={profileType}
              onChange={(event) => setProfileType(event.target.value)}
            >
              {profileTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="okna_hardware">Grubosc okuc</label>
            <select
              id="okna_hardware"
              value={hardwareThickness}
              onChange={(event) => setHardwareThickness(event.target.value)}
            >
              {hardwareThicknessOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="okna_assembly">Rodzaj montazu</label>
            <select
              id="okna_assembly"
              value={assemblyType}
              onChange={(event) => setAssemblyType(event.target.value)}
            >
              {assemblyTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="okna_profileColor">Kolor profili</label>
            <select
              id="okna_profileColor"
              value={profileColor}
              onChange={(event) => setProfileColor(event.target.value)}
            >
              {profileColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Elementy w zakresie</legend>
        <div className="options-box">
          {windowOptionDefinitions.map((option) => (
            <label key={option.id} className="option-row">
              <input
                type="checkbox"
                checked={selectedOptionIds.includes(option.id)}
                onChange={() => toggleOption(option.id)}
              />
              <span>
                <strong>{option.label}</strong>
                {option.summaryBullet && (
                  <>
                    <br />
                    <small>{option.summaryBullet}</small>
                  </>
                )}
                {option.description && option.description !== option.summaryBullet && (
                  <>
                    <br />
                    <small style={{ color: '#555' }}>{option.description}</small>
                  </>
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Opcje dodatkowe (TAK/NIE)</legend>
        {optionalFeatureGroups.map((group) => (
          <div key={group.id} style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333', marginBottom: '8px' }}>{group.label}</h4>
            <div className="options-box">
              {group.items.map((item) => {
                const entry = featureSelections[item.id] || { enabled: false, detail: '' };
                return (
                  <div key={item.id} style={{ marginBottom: '10px' }}>
                    <label className="option-row" style={{ alignItems: 'flex-start' }}>
                      <input
                        type="checkbox"
                        checked={entry.enabled}
                        onChange={() => toggleFeatureSelection(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                    {entry.enabled && item.detailLabel && (
                      <div className="input-group" style={{ marginTop: '6px', marginLeft: '28px' }}>
                        <label style={{ fontSize: '0.8rem' }}>{item.detailLabel}</label>
                        <input
                          type="text"
                          value={entry.detail}
                          onChange={(event) => updateFeatureDetail(item.id, event.target.value)}
                          placeholder={item.detailPlaceholder || ''}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Montaz - wariant</legend>
        <div className="options-box">
          {installationVariants.map((variant) => (
            <label key={variant.value} className="option-row">
              <input
                type="radio"
                name="installationVariant"
                value={variant.value}
                checked={installationVariant === variant.value}
                onChange={() => setInstallationVariant(variant.value)}
              />
              <span>{variant.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Montaz - dodatki (TAK/NIE)</legend>
        <div className="options-box">
          {installationExtras.map((item) => (
            <label key={item.id} className="option-row">
              <input
                type="checkbox"
                checked={Boolean(installationExtrasState[item.id])}
                onChange={() => toggleInstallationExtra(item.id)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Dodatkowe uwagi</legend>
        <div className="input-group">
          <label htmlFor="okna_notes">Notatki do oferty (opcjonalnie)</label>
          <textarea
            id="okna_notes"
            rows={4}
            value={additionalNotes}
            onChange={(event) => setAdditionalNotes(event.target.value)}
            placeholder="Opis preferencji klienta, termin montazu, inne istotne informacje"
          />
        </div>
      </fieldset>

      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Przetwarzanie...' : 'Generuj PDF Okna Nest'}
      </button>
    </form>
  );
}
