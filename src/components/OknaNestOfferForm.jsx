// src/components/OknaNestOfferForm.jsx
import React, { useMemo, useState } from 'react';
import { generateOknaNestPDF } from '../utils/oknaNestPdfGenerator';
import {
  assemblyTypeOptions,
  hardwareThicknessOptions,
  windowOptionDefinitions,
  optionalFeatureGroups,
  installationExtras,
  additionalServiceOptions,
  demolitionOptions,
} from '../data/windowsOfferConfig';

const defaultSelectedWindowOptionIds = windowOptionDefinitions
  .filter((option) => option.defaultSelected)
  .map((option) => option.id);

const vatPresetOptions = [
  { value: '23', label: '23%' },
  { value: '8', label: '8%' },
  { value: '0', label: '0%' },
  { value: 'custom', label: 'Inna stawka' },
];

const hingeOptions = [
  { value: 'hidden', label: 'Zawiasy ukryte' },
  { value: 'standard', label: 'Zawiasy widoczne' },
];

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

const buildDefaultServiceAddonsState = () => {
  const state = {};
  additionalServiceOptions.forEach((item) => {
    state[item.id] = false;
  });
  return state;
};
export default function OknaNestOfferForm() {
  const [userName, setUserName] = useState('');
  const [investmentAddress, setInvestmentAddress] = useState('');
  const [catalogPrice, setCatalogPrice] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [marginPercent, setMarginPercent] = useState('');
  const [installationPrice, setInstallationPrice] = useState('');
  const [windowPerimeter, setWindowPerimeter] = useState('');
  const [windowArea, setWindowArea] = useState('');
  const [profileType, setProfileType] = useState('');
  const [hardwareThickness, setHardwareThickness] = useState(hardwareThicknessOptions[0]?.value || '');
  const [assemblyType, setAssemblyType] = useState(assemblyTypeOptions[0]?.value || '');
  const [profileColor, setProfileColor] = useState('');
  const [hingeType, setHingeType] = useState(hingeOptions[0]?.value || '');
  const [lazikIncluded, setLazikIncluded] = useState('yes');
  const [demolitionMode, setDemolitionMode] = useState(demolitionOptions[0]?.value || '');
  const [vatPreset, setVatPreset] = useState('23');
  const [vatCustom, setVatCustom] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentInputKey, setAttachmentInputKey] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState(defaultSelectedWindowOptionIds);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [featureSelections, setFeatureSelections] = useState(() => buildDefaultFeatureState());
  const [installationExtrasState, setInstallationExtrasState] = useState(() => buildDefaultInstallationExtrasState());
  const [serviceAddonsState, setServiceAddonsState] = useState(() => buildDefaultServiceAddonsState());
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

  const toggleServiceAddon = (addonId) => {
    setServiceAddonsState((current) => ({
      ...current,
      [addonId]: !current[addonId],
    }));
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setAttachmentFile(file);
  };

  const pricePreview = useMemo(() => {
    const catalog = parsePreviewNumber(catalogPrice);
    const installation = parsePreviewNumber(installationPrice);
    const discount = parsePreviewNumber(discountValue);
    const marginRate = parsePreviewNumber(marginPercent);
    const vatRaw = vatPreset === 'custom' ? vatCustom : vatPreset;
    const vatRateValue = Math.max(parsePreviewNumber(vatRaw), 0);

    const baseSum = catalog + installation;
    if (baseSum <= 0) {
      return null;
    }

    const netAfterDiscount = Math.max(baseSum - discount, 0);
    const marginAmount = netAfterDiscount * (marginRate / 100);
    const netWithMargin = netAfterDiscount + marginAmount;
    const vatAmount = netWithMargin * (vatRateValue / 100);
    const grossTotal = netWithMargin + vatAmount;

    return {
      baseSum,
      discount,
      marginAmount,
      netAfterDiscount,
      netWithMargin,
      vatAmount,
      grossTotal,
      vatRateValue,
    };
  }, [catalogPrice, installationPrice, discountValue, marginPercent, vatPreset, vatCustom]);

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

  if (vatPreset === 'custom' && !vatCustom) {
    alert('Podaj wartosc podatku VAT.');
    return;
  }

  setIsProcessing(true);

  try {
    const hingeLabel = hingeOptions.find((option) => option.value === hingeType)?.label || hingeType;
    const resolvedVatRate = vatPreset === 'custom' ? vatCustom : vatPreset;
    const pdfBlob = await generateOknaNestPDF({
      userName: userName.trim(),
      investmentAddress: investmentAddress.trim(),
      catalogPrice,
      discountValue,
      marginPercent,
      installationPrice,
      windowPerimeter,
      windowArea,
      profileType: profileType.trim(),
      hardwareThickness,
      assemblyType,
      profileColor: profileColor.trim(),
      hingeType: hingeLabel,
      lazikIncluded,
      demolitionMode,
      selectedOptionIds,
      additionalNotes,
      featureSelections,
      installationExtras: installationExtrasState,
      serviceAddons: serviceAddonsState,
      vatRate: resolvedVatRate,
      attachmentFile,
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
        setDiscountValue('');
        setMarginPercent('');
        setInstallationPrice('');
        setWindowPerimeter('');
        setWindowArea('');
        setProfileType('');
        setHardwareThickness(hardwareThicknessOptions[0]?.value || '');
        setAssemblyType(assemblyTypeOptions[0]?.value || '');
        setProfileColor('');
        setHingeType(hingeOptions[0]?.value || '');
        setLazikIncluded('yes');
        setDemolitionMode(demolitionOptions[0]?.value || '');
        setVatPreset('23');
        setVatCustom('');
        setAttachmentFile(null);
        setAttachmentInputKey((value) => value + 1);
        setSelectedOptionIds(defaultSelectedWindowOptionIds);
        setAdditionalNotes('');
        setFeatureSelections(buildDefaultFeatureState());
        setInstallationExtrasState(buildDefaultInstallationExtrasState());
        setServiceAddonsState(buildDefaultServiceAddonsState());
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
            <label htmlFor="okna_discount">Rabat (PLN)</label>
            <input
              id="okna_discount"
              type="number"
              step="0.01"
              min="0"
              value={discountValue}
              onChange={(event) => setDiscountValue(event.target.value)}
              placeholder="np. 3500"
            />
          </div>
          <div className="input-group">
            <label htmlFor="okna_margin">Marza (%)</label>
            <input
              id="okna_margin"
              type="number"
              step="0.1"
              min="0"
              value={marginPercent}
              onChange={(event) => setMarginPercent(event.target.value)}
              placeholder="np. 15"
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
          <div className="input-group">
            <label htmlFor="okna_vatPreset">Podatek VAT</label>
            <select
              id="okna_vatPreset"
              value={vatPreset}
              onChange={(event) => setVatPreset(event.target.value)}
            >
              {vatPresetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {vatPreset === 'custom' && (
              <input
                id="okna_vatCustom"
                type="number"
                step="0.1"
                min="0"
                value={vatCustom}
                onChange={(event) => setVatCustom(event.target.value)}
                placeholder="np. 23"
                style={{ marginTop: '8px' }}
              />
            )}
          </div>
        </div>
        {pricePreview && (
          <div className="input-group">
            <label>Podglad wyliczenia</label>
            <div>
              <div>Suma bazowa netto: {pricePreview.baseSum.toFixed(2)} PLN</div>
              {pricePreview.discount > 0 && (
                <div>Po odjeciu rabatu: {pricePreview.netAfterDiscount.toFixed(2)} PLN</div>
              )}
              {pricePreview.marginAmount !== 0 && (
                <div>
                  Marza ({marginPercent || 0}%): {pricePreview.marginAmount.toFixed(2)} PLN
                </div>
              )}
              <div>Cena netto oferty: {pricePreview.netWithMargin.toFixed(2)} PLN</div>
              <div>
                VAT ({pricePreview.vatRateValue.toFixed(2)}%): {pricePreview.vatAmount.toFixed(2)} PLN
              </div>
              <div>Cena brutto oferty: {pricePreview.grossTotal.toFixed(2)} PLN</div>
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
            <input
              id="okna_profileType"
              type="text"
              value={profileType}
              onChange={(event) => setProfileType(event.target.value)}
              placeholder="np. Nest 82 (7-komorowy, 82 mm)"
            />
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
            <input
              id="okna_profileColor"
              type="text"
              value={profileColor}
              onChange={(event) => setProfileColor(event.target.value)}
              placeholder="np. Antracyt struktura RAL 7016"
            />
          </div>
        </div>
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="okna_hinges">Rodzaj zawiasow</label>
            <select
              id="okna_hinges"
              value={hingeType}
              onChange={(event) => setHingeType(event.target.value)}
            >
              {hingeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="okna_lazik">Lazik w cenie</label>
            <select
              id="okna_lazik"
              value={lazikIncluded}
              onChange={(event) => setLazikIncluded(event.target.value)}
            >
              <option value="yes">Tak</option>
              <option value="no">Nie</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="okna_demolition">Demontaz okien</label>
            <select
              id="okna_demolition"
              value={demolitionMode}
              onChange={(event) => setDemolitionMode(event.target.value)}
            >
              {demolitionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Dodatkowe uslugi</legend>
        <div className="options-box">
          {additionalServiceOptions.map((item) => (
            <label key={item.id} className="option-row">
              <input
                type="checkbox"
                checked={Boolean(serviceAddonsState[item.id])}
                onChange={() => toggleServiceAddon(item.id)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Zalacznik do oferty</legend>
        <div className="input-group">
          <label htmlFor="okna_attachment">Zalacznik PDF (parametry okien / rysunki)</label>
          <input
            key={attachmentInputKey}
            id="okna_attachment"
            type="file"
            accept="application/pdf"
            onChange={handleAttachmentChange}
          />
          {attachmentFile && (
            <small>Wybrano: {attachmentFile.name}</small>
          )}
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Zakres i opcje dodatkowe</legend>
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333', marginBottom: '8px' }}>Elementy w cenie</h4>
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
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333', marginBottom: '8px' }}>Opcje dodatkowe (TAK/NIE)</h4>
          {optionalFeatureGroups
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <div key={group.id} style={{ marginBottom: '16px' }}>
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
