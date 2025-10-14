// src/components/OknaNestOfferForm.jsx
import React, { useMemo, useState } from 'react';
import { generateOknaNestPDF } from '../utils/oknaNestPdfGenerator';
import {
  assemblyTypeOptions,
  hardwareThicknessOptions,
  windowOptionDefinitions,
  optionalFeatureGroups,
  installationExtras,
  demolitionOptions,
  additionalOfferIds,
} from '../data/windowsOfferConfig';

const clientAdvisorOptions = [
  {
    value: 'daniel',
    label: 'Daniel Kopek',
    phone: '578 615 100',
    email: 'daniel.kopek@kaman.eu',
  },
  {
    value: 'beata',
    label: 'Beata Mularczyk',
    phone: '884 996 055',
    email: 'b.mularczyk@kaman.eu',
  },
  {
    value: 'robert',
    label: 'Robert Mularczyk',
    phone: '574 571 100',
    email: 'robert.mularczyk@kaman.eu',
  },
];

const ADDITIONAL_OFFER_ID_SET = new Set(additionalOfferIds);

const coreWindowOptions = windowOptionDefinitions.filter(
  (option) => !ADDITIONAL_OFFER_ID_SET.has(option.id),
);

const defaultSelectedWindowOptionIds = coreWindowOptions
  .filter((option) => option.defaultSelected)
  .map((option) => option.id);

const optionalWindowOptions = coreWindowOptions.filter(
  (option) => !option.defaultSelected && option.id !== 'security-package',
);
const complementaryOfferOptions = windowOptionDefinitions.filter((option) =>
  ADDITIONAL_OFFER_ID_SET.has(option.id),
);

const vatPresetOptions = [
  { value: '23', label: '23%' },
  { value: '8', label: '8%' },
  { value: '0', label: '0%' },
  { value: 'custom', label: 'Inna stawka' },
];

const hingeOptions = [
  { value: 'visible', label: 'Zawiasy widoczne' },
  { value: 'hidden', label: 'Zawiasy ukryte' },
];

const warmSpacerOptions = [
  { value: 'no', label: 'Nie' },
  { value: 'yes', label: 'Tak' },
];

const glazingPackageOptions = [
  { value: 'double', label: 'Pakiet 2-szybowy' },
  { value: 'triple', label: 'Pakiet 3-szybowy' },
];

const rcPackageOptions = [
  { value: 'no', label: 'Nie' },
  { value: 'yes', label: 'Tak' },
];

const lazikOptions = [
  { value: 'na', label: 'Nie dotyczy' },
  { value: 'yes', label: 'Tak' },
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

const excludedFeatureIdsInForm = new Set(['feature-hinge-brake', 'feature-rc2']);

const buildDefaultInstallationExtrasState = () => {
  const state = {};
  installationExtras.forEach((item) => {
    state[item.id] = { selected: false, price: '' };
  });
  return state;
};

const buildDefaultWindowOptionPriceState = () => {
  const state = {};
  optionalWindowOptions.forEach((option) => {
    state[option.id] = { price: '' };
  });
  return state;
};
export default function OknaNestOfferForm() {
const defaultAdvisor =
  clientAdvisorOptions.find((advisor) => advisor.value === 'robert') || clientAdvisorOptions[0];
const [userName, setUserName] = useState('');
const [investmentAddress, setInvestmentAddress] = useState('');
const [selectedAdvisorKey, setSelectedAdvisorKey] = useState(defaultAdvisor?.value || '');
const selectedAdvisor = useMemo(
  () => clientAdvisorOptions.find((option) => option.value === selectedAdvisorKey) || defaultAdvisor || {},
  [selectedAdvisorKey, defaultAdvisor],
);
  const [catalogPrice, setCatalogPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [marginPercent, setMarginPercent] = useState('');
  const [installationPrice, setInstallationPrice] = useState('');
  const [windowPerimeter, setWindowPerimeter] = useState('');
  const [windowArea, setWindowArea] = useState('');
  const [profileType, setProfileType] = useState('');
  const [hardwareThickness, setHardwareThickness] = useState(hardwareThicknessOptions[0]?.value || '');
  const [assemblyType, setAssemblyType] = useState(assemblyTypeOptions[0]?.value || '');
  const [profileColor, setProfileColor] = useState('');
  const [hingeType, setHingeType] = useState(hingeOptions[0]?.value || '');
  const [warmSpacer, setWarmSpacer] = useState('yes');
  const [glazingPackage, setGlazingPackage] = useState(glazingPackageOptions[1]?.value || 'triple');
  const [rcPackage, setRcPackage] = useState(rcPackageOptions[0]?.value || 'no');
  const [lazikIncluded, setLazikIncluded] = useState('na');
  const [demolitionMode, setDemolitionMode] = useState(demolitionOptions[0]?.value || '');
  const [vatPreset, setVatPreset] = useState('23');
  const [vatCustom, setVatCustom] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentInputKey, setAttachmentInputKey] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState(defaultSelectedWindowOptionIds);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [featureSelections, setFeatureSelections] = useState(() => buildDefaultFeatureState());
  const [installationExtrasState, setInstallationExtrasState] = useState(() => buildDefaultInstallationExtrasState());
  const [optionPriceState, setOptionPriceState] = useState(() => buildDefaultWindowOptionPriceState());
  const [isProcessing, setIsProcessing] = useState(false);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  };

  const toggleOption = (optionId) => {
    if (!optionalWindowOptions.some((option) => option.id === optionId)) {
      return;
    }
    setSelectedOptionIds((current) => {
      if (current.includes(optionId)) {
        return current.filter((id) => id !== optionId);
      }
      return [...current, optionId];
    });
  };

  const updateOptionPrice = (optionId, value) => {
    if (!optionalWindowOptions.some((option) => option.id === optionId)) {
      return;
    }
    setOptionPriceState((current) => ({
      ...current,
      [optionId]: { price: value },
    }));
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
    setInstallationExtrasState((current) => {
      const previous = current[extraId] || { selected: false, price: '' };
      return {
        ...current,
        [extraId]: {
          ...previous,
          selected: !previous.selected,
        },
      };
    });
  };

  const updateInstallationExtraPrice = (extraId, value) => {
    setInstallationExtrasState((current) => ({
      ...current,
      [extraId]: {
        ...(current[extraId] || { selected: false, price: '' }),
        price: value,
      },
    }));
  };

  const getInstallationExtraState = (extraId) => {
    const entry = installationExtrasState[extraId];
    if (entry && typeof entry === 'object') {
      return entry;
    }
    return { selected: Boolean(entry), price: '' };
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setAttachmentFile(file);
  };

  const pricePreview = useMemo(() => {
    const catalog = parsePreviewNumber(catalogPrice);
    const installation = parsePreviewNumber(installationPrice);
    const discountRateRaw = parsePreviewNumber(discountPercent);
    const marginRate = parsePreviewNumber(marginPercent);
    const vatRaw = vatPreset === 'custom' ? vatCustom : vatPreset;
    const vatRateValue = Math.max(parsePreviewNumber(vatRaw), 0);

    const baseSum = catalog + installation;
    if (baseSum <= 0) {
      return null;
    }

    const discountRate = Math.min(Math.max(discountRateRaw, 0), 100);
    const discountAmount = catalog * (discountRate / 100);
    const discountedWindowsPrice = Math.max(catalog - discountAmount, 0);
    const netAfterDiscount = discountedWindowsPrice + installation;
    const marginAmount = netAfterDiscount * (marginRate / 100);
    const netWithMargin = netAfterDiscount + marginAmount;
    const vatAmount = netWithMargin * (vatRateValue / 100);
    const grossTotal = netWithMargin + vatAmount;

    return {
      baseSum,
      discountRate,
      discountAmount,
      discountedWindowsPrice,
      marginAmount,
      netAfterDiscount,
      netWithMargin,
      vatAmount,
      grossTotal,
      vatRateValue,
    };
  }, [catalogPrice, installationPrice, discountPercent, marginPercent, vatPreset, vatCustom]);

  const complementaryOfferList = useMemo(() => {
    const base = complementaryOfferOptions
      .filter((option) => {
        if (option.id === 'internal-sills' && getInstallationExtraState('install-inner-sills').selected) {
          return false;
        }
        if (option.id === 'external-sills' && getInstallationExtraState('install-outer-sills').selected) {
          return false;
        }
        if (option.id === 'external-blinds' && getInstallationExtraState('install-titan-wings').selected) {
          return false;
        }
        return true;
      })
      .map((option) => ({
        id: option.id,
        label: option.label,
        summaryBullet: option.summaryBullet,
      }));

    if (!getInstallationExtraState('install-threshold-seal').selected) {
      base.push({
        id: 'threshold-extensions',
        label: 'Poszerzenia progowe',
        summaryBullet: 'Dostawa i montaz poszerzen pod drzwi balkonowe / HST.',
      });
    }

    return base;
  }, [installationExtrasState]);

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
    const advisor = selectedAdvisor || defaultAdvisor || {};
    const pdfBlob = await generateOknaNestPDF({
      userName: userName.trim(),
      investmentAddress: investmentAddress.trim(),
      clientAdvisor: {
        name: advisor.label || '',
        phone: advisor.phone || '',
        email: advisor.email || '',
      },
      preparedBy: advisor.value || '',
      preparedByLabel: advisor.label || '',
      catalogPrice,
      discountPercent,
      marginPercent,
      installationPrice,
      windowPerimeter,
      windowArea,
      profileType: profileType.trim(),
      hardwareThickness,
      assemblyType,
      profileColor: profileColor.trim(),
      hingeType,
      hingeLabel,
      warmSpacer,
      glazingPackage,
      rcPackage,
      lazikIncluded,
      demolitionMode,
      selectedOptionIds,
      additionalNotes,
      featureSelections,
      installationExtras: installationExtrasState,
      optionPrices: optionPriceState,
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
        setSelectedAdvisorKey(defaultAdvisor?.value || '');
        setCatalogPrice('');
        setDiscountPercent('');
        setMarginPercent('');
        setInstallationPrice('');
        setWindowPerimeter('');
        setWindowArea('');
        setProfileType('');
        setHardwareThickness(hardwareThicknessOptions[0]?.value || '');
        setAssemblyType(assemblyTypeOptions[0]?.value || '');
        setProfileColor('');
        setHingeType(hingeOptions[0]?.value || '');
        setWarmSpacer('yes');
        setGlazingPackage(glazingPackageOptions[1]?.value || 'triple');
        setRcPackage(rcPackageOptions[0]?.value || 'no');
        setLazikIncluded('na');
        setDemolitionMode(demolitionOptions[0]?.value || '');
        setVatPreset('23');
        setVatCustom('');
        setAttachmentFile(null);
        setAttachmentInputKey((value) => value + 1);
        setSelectedOptionIds(defaultSelectedWindowOptionIds);
        setAdditionalNotes('');
        setFeatureSelections(buildDefaultFeatureState());
        setInstallationExtrasState(buildDefaultInstallationExtrasState());
        setOptionPriceState(buildDefaultWindowOptionPriceState());
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
    <div className="input-grid" style={gridStyle}>
      <div className="input-group">
        <label htmlFor="okna_advisorSelect">Opiekun klienta</label>
        <select
          id="okna_advisorSelect"
          value={selectedAdvisorKey}
          onChange={(event) => {
            const value = event.target.value;
            setSelectedAdvisorKey(value);
          }}
        >
          {clientAdvisorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
              max="100"
              value={discountPercent}
              onChange={(event) => setDiscountPercent(event.target.value)}
              placeholder="np. 5"
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
              {pricePreview.discountAmount > 0 && (
                <>
                  <div>
                    Rabat ({pricePreview.discountRate.toFixed(1)}%): -
                    {pricePreview.discountAmount.toFixed(2)} PLN
                  </div>
                  <div>Po rabacie (okna + montaz): {pricePreview.netAfterDiscount.toFixed(2)} PLN</div>
                </>
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
            <label htmlFor="okna_glazing">Pakiet szklenia</label>
            <select
              id="okna_glazing"
              value={glazingPackage}
              onChange={(event) => setGlazingPackage(event.target.value)}
            >
              {glazingPackageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="okna_warmSpacer">Ciepla ramka</label>
            <select
              id="okna_warmSpacer"
              value={warmSpacer}
              onChange={(event) => setWarmSpacer(event.target.value)}
            >
              {warmSpacerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="okna_rc">Pakiet RC</label>
            <select
              id="okna_rc"
              value={rcPackage}
              onChange={(event) => setRcPackage(event.target.value)}
            >
              {rcPackageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              {lazikOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="okna_demolition">Demontaz starych okien</label>
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
        <legend>Prace dodatkowe</legend>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
            Zakres montazowy
          </h4>
          <div className="options-box">
            {installationExtras.map((item) => {
            const extraState = getInstallationExtraState(item.id);
            return (
              <div key={item.id} style={{ marginBottom: '12px' }}>
                <label className="option-row" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={extraState.selected}
                    onChange={() => toggleInstallationExtra(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
                <div className="input-group" style={{ marginLeft: '28px', marginTop: '6px' }}>
                  <label style={{ fontSize: '0.8rem' }}>Cena (PLN)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={extraState.price}
                    onChange={(event) => updateInstallationExtraPrice(item.id, event.target.value)}
                    placeholder="np. 1500"
                    disabled={!extraState.selected}
                  />
                </div>
              </div>
            );
          })}
        </div>
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
        <legend>Zakres stolarki</legend>

        {optionalWindowOptions.length > 0 && (
          <section style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              Elementy konfigurowalne
            </h4>
            <div className="options-box">
              {optionalWindowOptions.map((option) => {
                const selected = selectedOptionIds.includes(option.id);
                const priceValue = optionPriceState[option.id]?.price || '';
                return (
                  <div key={option.id} style={{ marginBottom: '12px' }}>
                    <label className="option-row" style={{ alignItems: 'flex-start' }}>
                      <input
                        type="checkbox"
                        checked={selected}
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
                    <div className="input-group" style={{ marginLeft: '28px', marginTop: '6px' }}>
                      <label style={{ fontSize: '0.8rem' }}>Cena (PLN)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={priceValue}
                        onChange={(event) => updateOptionPrice(option.id, event.target.value)}
                        placeholder="np. 2500"
                        disabled={!selected}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
            Opcje funkcjonalne i komfortu (TAK/NIE)
          </h4>
          {optionalFeatureGroups
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <div key={group.id} style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#444' }}>
                  {group.label}
                </h5>
                <div className="options-box">
                  {group.items.map((item) => {
                    if (excludedFeatureIdsInForm.has(item.id)) {
                      return null;
                    }
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
        </section>

        {complementaryOfferList.length > 0 && (
          <section>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
              Komplementarna oferta Grupy KAMAN
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#444', fontSize: '0.9rem' }}>
              {complementaryOfferList.map((option) => (
                <li key={option.id} style={{ marginBottom: '6px' }}>
                  <strong>{option.label}</strong>
                  {option.summaryBullet ? ` - ${option.summaryBullet}` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}
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
