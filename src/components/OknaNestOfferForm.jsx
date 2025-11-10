// src/components/OknaNestOfferForm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { generateOknaNestPDF } from '../utils/oknaNestPdfGenerator';
import { generateOknaNestPricingAssumptionsPDF } from '../utils/oknaNestPricingAssumptionsPdfGenerator';
import { reserveOfferNumber } from '../utils/offerNumbering';
import {
  profileTypeOptions,
  assemblyTypeOptions,
  hardwareThicknessOptions,
  windowOptionDefinitions,
  optionalFeatureGroups,
  installationExtras,
  demolitionOptions,
  demolitionTypeOptions,
  demolitionDirectionOptions,
  additionalOfferIds,
  glassTypeOptions,
} from '../data/windowsOfferConfig';
import { clientAdvisorOptions } from '../data/clientAdvisorOptions';

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

const rcPackageOptions = [
  { value: 'no', label: 'Nie' },
  { value: 'yes', label: 'Tak' },
];

const lazikOptions = [
  { value: 'na', label: 'Nie dotyczy' },
  { value: 'yes', label: 'Tak' },
];

const gasketOptions = [
  { value: 'standard-2', label: 'Pakiet standard (2 uszczelki)' },
  { value: 'premium-3', label: 'Pakiet premium (3 uszczelki)' },
];

const normalizeString = (value) => (value ? value.trim() : '');

const composeInvestmentAddressDisplay = (town, street, postalCode, city) => {
  const segments = [];
  const normalizedTown = normalizeString(town);
  const normalizedStreet = normalizeString(street);
  const normalizedPostalCode = normalizeString(postalCode);
  const normalizedCity = normalizeString(city);

  if (normalizedTown) {
    segments.push(normalizedTown);
  }
  if (normalizedStreet) {
    segments.push(normalizedStreet);
  }

  const postalCityLine = [normalizedPostalCode, normalizedCity].filter(Boolean).join(' ');
  if (postalCityLine) {
    segments.push(postalCityLine);
  }

  return segments.join('\n');
};

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
    state[item.id] = { selected: false, price: '', quantity: '' };
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

const OKNA_OFFER_COUNTER_STORAGE_KEY = 'oknaNestOfferCounters';

export default function OknaNestOfferForm() {
  const defaultAdvisor =
    clientAdvisorOptions.find((advisor) => advisor.value === 'robert') || clientAdvisorOptions[0];
  const firstProfileOption =
    profileTypeOptions.find((option) => option.value !== 'custom')?.value ||
    profileTypeOptions[0]?.value ||
    'custom';
  const firstProfileLabel =
    profileTypeOptions.find((option) => option.value === firstProfileOption)?.label || '';
  const firstGlassOption =
    glassTypeOptions.find((option) => option.value !== 'custom')?.value ||
    glassTypeOptions[0]?.value ||
    'custom';
  const firstGlassLabel =
    glassTypeOptions.find((option) => option.value === firstGlassOption)?.label || '';

  const [userName, setUserName] = useState('');
  const [investmentTown, setInvestmentTown] = useState('');
  const [investmentStreet, setInvestmentStreet] = useState('');
  const [investmentPostalCode, setInvestmentPostalCode] = useState('');
  const [investmentCity, setInvestmentCity] = useState('');
  const [selectedAdvisorKey, setSelectedAdvisorKey] = useState(defaultAdvisor?.value || '');
  const selectedAdvisor = useMemo(
    () => clientAdvisorOptions.find((option) => option.value === selectedAdvisorKey) || defaultAdvisor || {},
    [selectedAdvisorKey, defaultAdvisor],
  );
  const [catalogPrice, setCatalogPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [marginPercent, setMarginPercent] = useState('');
  const [installationPricingMode, setInstallationPricingMode] = useState('flat');
  const [installationRatePerMeter, setInstallationRatePerMeter] = useState('');
  const [installationPerMeterExtra, setInstallationPerMeterExtra] = useState('');
  const [installationTotalOverride, setInstallationTotalOverride] = useState('');
  const [windowPerimeter, setWindowPerimeter] = useState('');
  const [windowArea, setWindowArea] = useState('');
  const [profileTypeSelection, setProfileTypeSelection] = useState(firstProfileOption);
  const [profileType, setProfileType] = useState(firstProfileOption === 'custom' ? '' : firstProfileLabel);
  const [hardwareThickness, setHardwareThickness] = useState(
    hardwareThicknessOptions[1]?.value || hardwareThicknessOptions[0]?.value || '',
  );
  const [assemblyType, setAssemblyType] = useState(assemblyTypeOptions[0]?.value || '');
  const [profileColor, setProfileColor] = useState('');
  const [hingeType, setHingeType] = useState(hingeOptions[0]?.value || '');
  const [warmSpacer, setWarmSpacer] = useState('yes');
  const [glassTypeSelection, setGlassTypeSelection] = useState(firstGlassOption);
  const [glassType, setGlassType] = useState(firstGlassOption === 'custom' ? '' : firstGlassLabel);
  const [rcPackage, setRcPackage] = useState(rcPackageOptions[0]?.value || 'no');
  const [lazikIncluded, setLazikIncluded] = useState('na');
  const [demolitionMode, setDemolitionMode] = useState('na');
  const [demolitionType, setDemolitionType] = useState('na');
  const [demolitionDirection, setDemolitionDirection] = useState('na');
  const [glassProducer, setGlassProducer] = useState('Glass Shift');
  const defaultGasketValue =
    gasketOptions.find((option) => option.value === 'standard-2')?.value || gasketOptions[0]?.value;
  const [gasketPackage, setGasketPackage] = useState(defaultGasketValue);
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
  const [pricingAssumptionsPayload, setPricingAssumptionsPayload] = useState(null);
  const [isGeneratingAssumptions, setIsGeneratingAssumptions] = useState(false);

  useEffect(() => {
    if (demolitionType === 'na') {
      return;
    }
    setInstallationExtrasState((current) => {
      const currentEntry = current['install-full-window-demolition'];
      if (!currentEntry || !currentEntry.selected) {
        return current;
      }
      return {
        ...current,
        'install-full-window-demolition': { selected: false, price: '', quantity: '' },
      };
    });
  }, [demolitionType]);

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
    const defaultGlassSelection =
      glassTypeOptions.find((option) => option.value !== 'custom')?.value ||
      glassTypeOptions[0]?.value ||
      'custom';
    const defaultGlassLabel =
      glassTypeOptions.find((option) => option.value === defaultGlassSelection)?.label || '';
    const optionalSelection = optionalWindowOptions.slice(0, 2);

    const nextInstallationExtras = buildDefaultInstallationExtrasState();
    if (nextInstallationExtras['install-sealed-tape']) {
      nextInstallationExtras['install-sealed-tape'] = { selected: true, price: '2400', quantity: '' };
    }
    if (nextInstallationExtras['install-inner-sills']) {
      nextInstallationExtras['install-inner-sills'] = { selected: true, price: '1800', quantity: '6' };
    }
    if (nextInstallationExtras['install-outer-sills']) {
      nextInstallationExtras['install-outer-sills'] = { selected: true, price: '2100', quantity: '6' };
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
    setInvestmentTown('Krakow');
    setInvestmentStreet('ul. Przykladowa 12');
    setInvestmentPostalCode('30-001');
    setInvestmentCity('Krakow');
    setSelectedAdvisorKey(selectedAdvisorValue);
    setCatalogPrice('55000');
    setDiscountPercent('15');
    setMarginPercent('10');
    setInstallationPricingMode('flat');
    setInstallationRatePerMeter('');
    setInstallationPerMeterExtra('');
    setInstallationTotalOverride('8500');
    setWindowPerimeter('132');
    setWindowArea('48');
    setProfileTypeSelection('veka');
    setProfileType('VEKA');
    setHardwareThickness(defaultHardware);
    setAssemblyType(defaultAssembly);
    setProfileColor('Kolor stolarki zgodny z projektem');
    setHingeType(defaultHinge);
    setWarmSpacer('yes');
    setGlassTypeSelection(defaultGlassSelection);
    setGlassType(defaultGlassSelection === 'custom' ? '' : defaultGlassLabel);
    setRcPackage(rcPackageOptions[1]?.value || rcPackageOptions[0]?.value || 'no');
    setLazikIncluded('yes');
    setDemolitionMode('yes');
    setDemolitionType('full');
    setDemolitionDirection('inside');
    setGlassProducer('Glass Shift');
    setGasketPackage(defaultGasketValue);
    setVatPreset('8');
    setVatCustom('');
    setSelectedOptionIds([...new Set([...defaultSelectedWindowOptionIds, ...additionalOptionIds])]);
    setAdditionalNotes('Oferta demonstracyjna - dane pogladowe do testow.');
    setFeatureSelections(featureStateSample);
    setInstallationExtrasState(nextInstallationExtras);
    setOptionPriceState(optionPricesSample);
    setAttachmentFile(null);
    setAttachmentInputKey((value) => value + 1);
    setIsProcessing(false);
  };

  const toggleInstallationExtra = (extraId) => {
    setInstallationExtrasState((current) => {
      const previous = current[extraId] || { selected: false, price: '', quantity: '' };
      const nextSelected = !previous.selected;
      return {
        ...current,
        [extraId]: {
          ...previous,
          selected: nextSelected,
          price: nextSelected ? previous.price : '',
          quantity: nextSelected ? previous.quantity : '',
        },
      };
    });
  };

  const updateInstallationExtraPrice = (extraId, value) => {
    setInstallationExtrasState((current) => ({
      ...current,
      [extraId]: {
        ...(current[extraId] || { selected: false, price: '', quantity: '' }),
        price: value,
      },
    }));
  };

  const updateInstallationExtraQuantity = (extraId, value) => {
    setInstallationExtrasState((current) => ({
      ...current,
      [extraId]: {
        ...(current[extraId] || { selected: false, price: '', quantity: '' }),
        quantity: value,
      },
    }));
  };

  const getInstallationExtraState = (extraId) => {
    const entry = installationExtrasState[extraId];
    if (entry && typeof entry === 'object') {
      return {
        selected: Boolean(entry.selected),
        price: entry.price ?? '',
        quantity: entry.quantity ?? '',
      };
    }
    return { selected: Boolean(entry), price: '', quantity: '' };
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setAttachmentFile(file);
  };

  const perMeterBaseTotal = useMemo(() => {
    if (installationPricingMode !== 'per-meter') {
      return 0;
    }
    const perimeterNumber = parsePreviewNumber(windowPerimeter);
    const rateNumber = parsePreviewNumber(installationRatePerMeter);
    if (perimeterNumber > 0 && rateNumber > 0) {
      return perimeterNumber * rateNumber;
    }
    return 0;
  }, [installationPricingMode, windowPerimeter, installationRatePerMeter]);

  const perMeterTotalWithExtra = useMemo(() => {
    if (installationPricingMode !== 'per-meter') {
      return 0;
    }
    const extraNumber = parsePreviewNumber(installationPerMeterExtra);
    return perMeterBaseTotal + extraNumber;
  }, [installationPricingMode, perMeterBaseTotal, installationPerMeterExtra]);

  const pricePreview = useMemo(() => {
    const catalog = parsePreviewNumber(catalogPrice);
    const perimeter = parsePreviewNumber(windowPerimeter);
    const ratePerMeter = parsePreviewNumber(installationRatePerMeter);
    const extraPerMeter = parsePreviewNumber(installationPerMeterExtra);
    const flatOverride = parsePreviewNumber(installationTotalOverride);

    let installationComputed = 0;
    let installationApplied = 0;
    let installationOverride = null;
    let installationRateValue = 0;

    if (installationPricingMode === 'per-meter') {
      installationRateValue = ratePerMeter;
      installationComputed = perimeter > 0 && ratePerMeter > 0 ? perimeter * ratePerMeter : 0;
      installationApplied = installationComputed + extraPerMeter;
    } else {
      installationComputed = flatOverride;
      installationApplied = flatOverride;
      installationOverride = flatOverride > 0 ? flatOverride : null;
    }

    const discountRateRaw = parsePreviewNumber(discountPercent);
    const marginRate = parsePreviewNumber(marginPercent);
    const vatRaw = vatPreset === 'custom' ? vatCustom : vatPreset;
    const vatRateValue = Math.max(parsePreviewNumber(vatRaw), 0);

    const baseSum = catalog + installationApplied;
    if (baseSum <= 0) {
      return null;
    }

    const discountRate = Math.min(Math.max(discountRateRaw, 0), 100);
    const discountAmount = catalog * (discountRate / 100);
    const discountedWindowsPrice = Math.max(catalog - discountAmount, 0);
    const netAfterDiscount = discountedWindowsPrice + installationApplied;
    const marginAmount = netAfterDiscount * (Math.max(marginRate, 0) / 100);
    const netWithMargin = netAfterDiscount + marginAmount;
    const vatAmount = netWithMargin * (vatRateValue / 100);
    const grossTotal = netWithMargin + vatAmount;

    return {
      baseSum,
      discountRate,
      discountAmount,
      discountedWindowsPrice,
      installationRate: installationRateValue,
      installationComputed,
      installationOverride,
      installationApplied,
      installationPerMeterExtra: extraPerMeter,
      installationPricingMode,
      marginAmount,
      netAfterDiscount,
      netWithMargin,
      vatAmount,
      grossTotal,
      vatRateValue,
    };
  }, [
    catalogPrice,
    installationPricingMode,
    installationRatePerMeter,
    installationPerMeterExtra,
    installationTotalOverride,
    windowPerimeter,
    discountPercent,
    marginPercent,
    vatPreset,
    vatCustom,
  ]);

  const handleGeneratePDF = async (event) => {
    event.preventDefault();

    if (!userName.trim()) {
      alert('Uzupelnij imie i nazwisko klienta.');
      return;
    }

    const townValue = normalizeString(investmentTown);
    const streetValue = normalizeString(investmentStreet);
    const postalValue = normalizeString(investmentPostalCode);
    const cityValue = normalizeString(investmentCity);

    if (!townValue || !streetValue || !cityValue) {
      alert('Podaj miejscowosc, ulice i miasto dla inwestycji.');
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

    const profileTypeValue = profileType.trim();
    const glassTypeValue = glassType.trim();

    if (!profileTypeValue) {
      alert('Wybierz lub wpisz rodzaj profilu.');
      return;
    }

    if (!glassTypeValue) {
      alert('Wybierz lub wpisz rodzaj szyby.');
      return;
    }

    const perimeterValue = parsePreviewNumber(windowPerimeter);
    const areaValue = parsePreviewNumber(windowArea);
    const rateValue = parsePreviewNumber(installationRatePerMeter);
    const extraValue = parsePreviewNumber(installationPerMeterExtra);
    const overrideValue = parsePreviewNumber(installationTotalOverride);

    let computedInstallation = 0;
    let effectiveInstallation = 0;

    if (installationPricingMode === 'per-meter') {
      computedInstallation = perimeterValue > 0 && rateValue > 0 ? perimeterValue * rateValue : 0;
      if (computedInstallation <= 0) {
        alert('Podaj stawke montazu za 1 mb obwodu oraz obwod okien.');
        return;
      }
      effectiveInstallation = computedInstallation + extraValue;
    } else {
      computedInstallation = overrideValue;
      effectiveInstallation = overrideValue;
    }

    if (effectiveInstallation <= 0) {
      alert('Podaj poprawne dane do wyliczenia ceny montazu.');
      return;
    }

    const investmentAddressText = composeInvestmentAddressDisplay(
      townValue,
      streetValue,
      postalValue,
      cityValue,
    );
    const hingeLabel = hingeOptions.find((option) => option.value === hingeType)?.label || hingeType;
    const resolvedVatRate = vatPreset === 'custom' ? vatCustom : vatPreset;
    const advisor = selectedAdvisor || defaultAdvisor || {};

    if (!pricePreview) {
      alert('Uzupelnij dane finansowe (cena katalogowa i montaz), aby obliczyc oferte.');
      return;
    }

    const advisorNameForNumber = advisor.label || advisor.value || userName.trim();
    const { offerNumber: generatedOfferNumber } = reserveOfferNumber(
      advisorNameForNumber || userName.trim(),
      {
        storageKey: OKNA_OFFER_COUNTER_STORAGE_KEY,
        fallbackInitials: 'OF',
        categoryCode: 'OKN',
      }
    );

    setPricingAssumptionsPayload(null);
    setIsProcessing(true);

    try {
      const pricePreviewSnapshot = pricePreview ? { ...pricePreview } : null;
      const assumptionsSnapshot = {
        userName: userName.trim(),
        investmentAddressDetails: {
          town: townValue,
          street: streetValue,
          postalCode: postalValue,
          city: cityValue,
        },
        investmentAddressText,
        clientAdvisor: {
          name: advisor.label || '',
          phone: advisor.phone || '',
          email: advisor.email || '',
        },
        offerNumber: generatedOfferNumber,
        generatedAt: Date.now(),
        additionalNotes: additionalNotes.trim(),
        calculations: {
          catalogPrice: parsePreviewNumber(catalogPrice),
          discountPercent: parsePreviewNumber(discountPercent),
          marginPercent: parsePreviewNumber(marginPercent),
          vatRate: parsePreviewNumber(resolvedVatRate),
          installationPricingMode,
          installationRatePerMeter: installationPricingMode === 'per-meter' ? rateValue : 0,
          installationPerMeterExtra: installationPricingMode === 'per-meter' ? extraValue : 0,
          installationOverride: installationPricingMode === 'flat' ? overrideValue : 0,
          installationComputed: computedInstallation,
          installationApplied: effectiveInstallation,
          windowPerimeter: perimeterValue,
          windowArea: areaValue,
          pricePreview: pricePreviewSnapshot,
        },
      };

      const pdfBlob = await generateOknaNestPDF({
        userName: userName.trim(),
        investmentAddress: investmentAddressText,
        investmentAddressDetails: {
          town: townValue,
          street: streetValue,
          postalCode: postalValue,
          city: cityValue,
        },
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
        installationPrice: String(effectiveInstallation),
        installationPricingMode,
        installationRatePerMeter: installationPricingMode === 'per-meter' ? installationRatePerMeter : '',
        installationPerMeterExtra: installationPricingMode === 'per-meter' ? String(extraValue) : '',
        installationPriceComputed: String(computedInstallation),
        installationPriceOverride: installationPricingMode === 'flat' ? installationTotalOverride : '',
        windowPerimeter,
        windowArea,
        profileType: profileTypeValue,
        hardwareThickness,
        assemblyType,
        profileColor: profileColor.trim(),
        hingeType,
        hingeLabel,
        glassProducer,
        glassType: glassTypeValue,
        gasketPackage,
        warmSpacer,
        rcPackage,
        lazikIncluded,
        demolitionMode,
        demolitionType,
        demolitionDirection,
        selectedOptionIds,
        additionalNotes,
        featureSelections,
        installationExtras: installationExtrasState,
        optionPrices: optionPriceState,
        vatRate: resolvedVatRate,
        offerNumber: generatedOfferNumber,
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
        setPricingAssumptionsPayload(assumptionsSnapshot);
      } else {
        alert('Nie udalo sie wygenerowac pliku PDF.');
      }
    } catch (error) {
      console.error('Blad podczas generowania PDF dla Okien Nest:', error);
      alert(`Wystapil blad: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAssumptions = async () => {
    if (!pricingAssumptionsPayload) {
      return;
    }

    setIsGeneratingAssumptions(true);
    try {
      const assumptionsBlob = await generateOknaNestPricingAssumptionsPDF(pricingAssumptionsPayload);
      if (!assumptionsBlob) {
        alert('Nie udalo sie przygotowac pliku z zalozeniami cenowymi.');
        return;
      }
      const clientName = pricingAssumptionsPayload.userName || userName || 'klient';
      const safeName = clientName.trim().replace(/\s+/g, '_') || 'klient';
      const safeOfferNumber = (pricingAssumptionsPayload.offerNumber || '')
        .trim()
        .replace(/[^\w]+/g, '_');
      const url = URL.createObjectURL(assumptionsBlob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = safeOfferNumber
        ? `Zalozenia_cenowe_${safeOfferNumber}.pdf`
        : `Zalozenia_cenowe_OknaNest_${safeName}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Blad podczas generowania zalozen cenowych:', error);
      alert(`Wystapil blad podczas generowania zalozen cenowych: ${error.message}`);
    } finally {
      setIsGeneratingAssumptions(false);
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
          <label>Adres inwestycji</label>
          <div
            className="input-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
          >
            <div className="input-group">
              <label htmlFor="okna_town">Miejscowosc</label>
              <input
                id="okna_town"
                type="text"
                value={investmentTown}
                onChange={(event) => setInvestmentTown(event.target.value)}
                placeholder="np. Wieliczka"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="okna_street">Ulica i numer</label>
              <input
                id="okna_street"
                type="text"
                value={investmentStreet}
                onChange={(event) => setInvestmentStreet(event.target.value)}
                placeholder="np. ul. Wiosenna 12"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="okna_postalCode">Kod pocztowy</label>
              <input
                id="okna_postalCode"
                type="text"
                value={investmentPostalCode}
                onChange={(event) => setInvestmentPostalCode(event.target.value)}
                placeholder="np. 30-001"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="okna_city">Miasto</label>
              <input
                id="okna_city"
                type="text"
                value={investmentCity}
                onChange={(event) => setInvestmentCity(event.target.value)}
                placeholder="np. Krakow"
                required
              />
            </div>
          </div>
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
            <label htmlFor="okna_installationMode">Sposób rozliczenia montażu</label>
            <select
              id="okna_installationMode"
              value={installationPricingMode}
              onChange={(event) => setInstallationPricingMode(event.target.value)}
            >
              <option value="flat">Cena ryczałtowa</option>
              <option value="per-meter">Cena za 1 mb obwodu</option>
            </select>
          </div>

          {installationPricingMode === 'per-meter' && (
            <>
              <div className="input-group">
                <label htmlFor="okna_installationRate">Cena montażu - stawka za 1 mb obwodu (PLN)</label>
                <input
                  id="okna_installationRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={installationRatePerMeter}
                  onChange={(event) => setInstallationRatePerMeter(event.target.value)}
                  placeholder="np. 65"
                />
              </div>
              <div className="input-group">
                <label htmlFor="okna_installationExtra">Dodatkowa kwota do montażu (PLN)</label>
                <input
                  id="okna_installationExtra"
                  type="number"
                  step="0.01"
                  value={installationPerMeterExtra}
                  onChange={(event) => setInstallationPerMeterExtra(event.target.value)}
                  placeholder="np. 850"
                />
                <small style={{ display: 'block', marginTop: '8px', color: '#555' }}>
                  Kwota ta zostanie dodana do obliczenia montażu na podstawie stawki i obwodu.
                </small>
                {perMeterBaseTotal > 0 && (
                  <small style={{ display: 'block', marginTop: '6px', color: '#2c3e50' }}>
                    Obliczenie wg obwodu: {perMeterBaseTotal.toFixed(2)} PLN
                  </small>
                )}
                {installationPricingMode === 'per-meter' && perMeterTotalWithExtra !== 0 && (
                  <small style={{ display: 'block', marginTop: '4px', color: '#2c3e50' }}>
                    Łącznie z dodatkiem: {perMeterTotalWithExtra.toFixed(2)} PLN
                  </small>
                )}
              </div>
            </>
          )}

          {installationPricingMode === 'flat' && (
            <div className="input-group">
              <label htmlFor="okna_installationOverride">Cena montażu - kwota ryczałtowa</label>
              <input
                id="okna_installationOverride"
                type="number"
                step="0.01"
                min="0"
                value={installationTotalOverride}
                onChange={(event) => setInstallationTotalOverride(event.target.value)}
                placeholder="np. 8500"
              />
              <small style={{ display: 'block', marginTop: '8px', color: '#555' }}>
                Wpisz pełną kwotę montażu. Pole pozostaw puste, jeśli montaż nie jest uwzględniany.
              </small>
            </div>
          )}

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
              {pricePreview.installationPricingMode === 'per-meter' && pricePreview.installationRate > 0 && (
                <div>Stawka montazu (1 mb): {pricePreview.installationRate.toFixed(2)} PLN</div>
              )}
              {pricePreview.installationPricingMode === 'per-meter' && pricePreview.installationComputed > 0 && (
                <div>Montaz wg obwodu: {pricePreview.installationComputed.toFixed(2)} PLN</div>
              )}
              {pricePreview.installationPricingMode === 'per-meter' && pricePreview.installationPerMeterExtra !== 0 && (
                <div>Dodatkowa kwota: {pricePreview.installationPerMeterExtra.toFixed(2)} PLN</div>
              )}
              <div>Montaz w kalkulacji: {pricePreview.installationApplied.toFixed(2)} PLN</div>
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
            <label htmlFor="okna_profileTypeSelect">Rodzaj profili</label>
            <select
              id="okna_profileTypeSelect"
              value={profileTypeSelection}
              onChange={(event) => {
                const value = event.target.value;
                setProfileTypeSelection(value);
                if (value === 'custom') {
                  setProfileType('');
                } else {
                  const option = profileTypeOptions.find((item) => item.value === value);
                  setProfileType(option?.label || '');
                }
              }}
            >
              {profileTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {profileTypeSelection === 'custom' && (
            <div className="input-group">
              <label htmlFor="okna_profileTypeCustom">Rodzaj profilu (wpisz recznie)</label>
              <input
                id="okna_profileTypeCustom"
                type="text"
                value={profileType}
                onChange={(event) => setProfileType(event.target.value)}
                placeholder="np. VEKA Softline 82"
                required
              />
            </div>
          )}
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
              placeholder="np. Glass Shift"
            />
          </div>
        </div>
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="okna_glassTypeSelect">Rodzaj szyby</label>
            <select
              id="okna_glassTypeSelect"
              value={glassTypeSelection}
              onChange={(event) => {
                const value = event.target.value;
                setGlassTypeSelection(value);
                if (value === 'custom') {
                  setGlassType('');
                } else {
                  const option = glassTypeOptions.find((item) => item.value === value);
                  setGlassType(option?.label || '');
                }
              }}
            >
              {glassTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {glassTypeSelection === 'custom' && (
            <div className="input-group">
              <label htmlFor="okna_glassTypeCustom">Rodzaj szyby (wpisz recznie)</label>
              <input
                id="okna_glassTypeCustom"
                type="text"
                value={glassType}
                onChange={(event) => setGlassType(event.target.value)}
                placeholder="np. Hartowana szyba 6 mm"
                required
              />
            </div>
          )}
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
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="okna_demolitionType">Rodzaj demontazu</label>
            <select
              id="okna_demolitionType"
              value={demolitionType}
              onChange={(event) => setDemolitionType(event.target.value)}
            >
              {demolitionTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="okna_demolitionDirection">Kierunek demontazu</label>
            <select
              id="okna_demolitionDirection"
              value={demolitionDirection}
              onChange={(event) => setDemolitionDirection(event.target.value)}
            >
              {demolitionDirectionOptions.map((option) => (
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
            const isFullDemolitionExtra = item.id === 'install-full-window-demolition';
            const fullDemolitionDisabled = isFullDemolitionExtra && demolitionType !== 'na';
            return (
              <div key={item.id} style={{ marginBottom: '12px' }}>
                <label className="option-row" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={extraState.selected}
                    onChange={() => {
                      if (fullDemolitionDisabled) {
                        return;
                      }
                      toggleInstallationExtra(item.id);
                    }}
                    disabled={fullDemolitionDisabled}
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
                    disabled={!extraState.selected || fullDemolitionDisabled}
                  />
                </div>
                {item.supportsQuantity && (
                  <div className="input-group" style={{ marginLeft: '28px', marginTop: '6px' }}>
                    <label style={{ fontSize: '0.8rem' }}>Sztuk</label>
                    <input
                      type="number"
                      min="0"
                      value={extraState.quantity}
                      onChange={(event) => updateInstallationExtraQuantity(item.id, event.target.value)}
                      placeholder="np. 6"
                      disabled={!extraState.selected || fullDemolitionDisabled}
                    />
                  </div>
                )}
                {isFullDemolitionExtra && fullDemolitionDisabled && (
                  <div style={{ marginLeft: '28px', marginTop: '4px', fontSize: '0.75rem', color: '#666' }}>
                    Opcja dostepna tylko gdy w polu "Rodzaj demontazu" wybrano "Nie dotyczy".
                  </div>
                )}
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
      {pricingAssumptionsPayload && (
        <button
          type="button"
          onClick={handleDownloadAssumptions}
          disabled={isGeneratingAssumptions}
          style={{ marginTop: '10px', background: '#555' }}
        >
          {isGeneratingAssumptions ? 'Przygotowywanie...' : 'Pobierz zalozenia cenowe'}
        </button>
      )}
    </form>
  );
}
