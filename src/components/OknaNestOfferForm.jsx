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

const gasketOptions = [
  { value: 'reinforced-2', label: 'Pakiet wzmocniony (2 uszczelki)' },
  { value: 'premium-3', label: 'Pakiet premium (3 uszczelki)' },
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
  const [hardwareThickness, setHardwareThickness] = useState(hardwareThicknessOptions[1]?.value || '');
  const [assemblyType, setAssemblyType] = useState(assemblyTypeOptions[0]?.value || '');
  const [profileColor, setProfileColor] = useState('');
  const [hingeType, setHingeType] = useState(hingeOptions[0]?.value || '');
  const [warmSpacer, setWarmSpacer] = useState('yes');
  const [glazingPackage, setGlazingPackage] = useState(glazingPackageOptions[1]?.value || 'triple');
  const [rcPackage, setRcPackage] = useState(rcPackageOptions[0]?.value || 'no');
  const [lazikIncluded, setLazikIncluded] = useState('na');
  const [demolitionMode, setDemolitionMode] = useState('na');
  const [glassProducer, setGlassProducer] = useState('Shift Glass');
  const [gasketPackage, setGasketPackage] = useState(gasketOptions[0]?.value);
  const [vatPreset, setVatPreset] = useState('8');
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

  const handleFillWithSampleData = () => {
    const selectedAdvisorValue = clientAdvisorOptions[0]?.value || '';
    const defaultHardware = hardwareThicknessOptions[1]?.value || hardwareThicknessOptions[0]?.value || '';
    const defaultAssembly = assemblyTypeOptions[0]?.value || '';
    const defaultHinge = hingeOptions[1]?.value || hingeOptions[0]?.value || '';
    const defaultGlazing = glazingPackageOptions[1]?.value || glazingPackageOptions[0]?.value || '';
    const optionalSelection = optionalWindowOptions.slice(0, 2);

    const nextInstallationExtras = buildDefaultInstallationExtrasState();
    if (nextInstallationExtras['install-sealed-tape']) {
      nextInstallationExtras['install-sealed-tape'] = { selected: true, price: '2400' };
    }
    if (nextInstallationExtras['install-inner-sills']) {
      nextInstallationExtras['install-inner-sills'] = { selected: true, price: '1800' };
    }

    const optionPricesSample = buildDefaultWindowOptionPriceState();
    const additionalOptionIds = optionalSelection.map((option, index) => {
      optionPricesSample[option.id] = { price: String(1500 + index * 500) };
      return option.id;
    });

    const featureStateSample = buildDefaultFeatureState();
    if (featureStateSample['feature-microvent']) {
      featureStateSample['feature-microvent'] = { enabled: true, detail: '' };
    }

    setUserName('Anna Testowa');
    setInvestmentAddress('ul. Przykladowa 12, Krakow');
    setSelectedAdvisorKey(selectedAdvisorValue);
    setCatalogPrice('55000');
    setDiscountPercent('15');
    setMarginPercent('10');
    setInstallationPrice('8500');
    setWindowPerimeter('132');
    setWindowArea('48');
    setProfileType('Okno Nest Premium 82 mm');
    setHardwareThickness(defaultHardware);
    setAssemblyType(defaultAssembly);
    setProfileColor('Antracyt obustronny');
    setHingeType(defaultHinge);
    setWarmSpacer('yes');
    setGlazingPackage(defaultGlazing);
    setRcPackage(rcPackageOptions[1]?.value || rcPackageOptions[0]?.value || 'no');
    setLazikIncluded('yes');
    setDemolitionMode('yes');
    setGlassProducer('Shift Glass');
    setGasketPackage(gasketOptions[1]?.value || gasketOptions[0]?.value);
    setVatPreset('8');
    setVatCustom('');
    setSelectedOptionIds([...new Set([...defaultSelectedWindowOptionIds, ...additionalOptionIds])]);
    setAdditionalNotes('Oferta demonstracyjna – dane pogladowe do testow.');
    setFeatureSelections(featureStateSample);
    setInstallationExtrasState(nextInstallationExtras);
    setOptionPriceState(optionPricesSample);
    setAttachmentFile(null);
    setAttachmentInputKey((value) => value + 1);
    setIsProcessing(false);
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
      glassProducer,
      gasketPackage,
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
        setHardwareThickness(hardwareThicknessOptions[1]?.value || '');
        setAssemblyType(assemblyTypeOptions[0]?.value || '');
        setProfileColor('');
        setHingeType(hingeOptions[0]?.value || '');
        setGlassProducer('Shift Glass');
        setGasketPackage(gasketOptions[0]?.value);
        setWarmSpacer('yes');
        setGlazingPackage(glazingPackageOptions[1]?.value || 'triple');
        setRcPackage(rcPackageOptions[0]?.value || 'no');
        setLazikIncluded('na');
        setDemolitionMode('na');
        setVatPreset('8');
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button type="button" onClick={handleFillWithSampleData}>
          Wypelnij danymi testowymi
        </button>
      </div>

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
          <div className="input-group">
            <label htmlFor="okna_glassProducer">Rodzaj szyby i producent</label>
            <input
              id="okna_glassProducer"
              type="text"
              value={glassProducer}
              onChange={(event) => setGlassProducer(event.target.value)}
              placeholder="np. Shift Glass"
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
            <label htmlFor="okna_gasket">Pakiet uszczelek</label>
            <select
              id="okna_gasket"
              value={gasketPackage}
              onChange={(event) => setGasketPackage(event.target.value)}
            >
              {gasketOptions.map((option) => (
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
