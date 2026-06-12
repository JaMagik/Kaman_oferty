import React, { useMemo, useState } from 'react';
import TrelloActions from './TrelloActions';
import { clientAdvisorOptions } from '../data/clientAdvisorOptions';
import { generateDoorsOfferPDF } from '../utils/simpleOfferPdfGenerator';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px',
};

const doorTypeOptions = [
  { value: 'wejsciowe', label: 'Drzwi wejsciowe' },
  { value: 'tarasowe', label: 'Drzwi tarasowe' },
  { value: 'techniczne', label: 'Drzwi techniczne' },
  { value: 'wewnetrzne', label: 'Drzwi wewnetrzne' },
];

const doorMaterialOptionsByType = {
  default: [
    { value: 'aluminium', label: 'Aluminium' },
    { value: 'pvc', label: 'PVC' },
    { value: 'drewno', label: 'Drewno' },
    { value: 'stal', label: 'Stal' },
  ],
  wewnetrzne: [
    { value: 'plytowe', label: 'Plytowe' },
    { value: 'ramowe', label: 'Ramowe' },
  ],
};

const getDoorMaterialOptions = (doorType) =>
  doorMaterialOptionsByType[doorType] || doorMaterialOptionsByType.default;

const doorExtrasConfig = [
  { id: 'seal-tape', label: 'Szczelny montaz (tasmy)' },
  { id: 'titan-wings', label: 'Szczelny montaz (Titan Wings)' },
  { id: 'threshold-epdm', label: 'Szczelny montaz progow (EPDM)' },
  { id: 'reveal-prep', label: 'Przygotowanie glifow pod szczelny montaz - zagruntowanie i wyrownanie klejem' },
];

const vatPresetOptions = [
  { value: '23', label: '23%' },
  { value: '8', label: '8%' },
  { value: '0', label: '0%' },
  { value: 'custom', label: 'Inna stawka' },
];

const buildDefaultExtrasState = () => {
  const state = {};
  doorExtrasConfig.forEach((extra) => {
    state[extra.id] = { selected: false, price: '' };
  });
  return state;
};

const composeAddress = (street, town, postalCode, city) => ({
  street: street.trim(),
  town: town.trim(),
  postalCode: postalCode.trim(),
  city: city.trim(),
});

const toNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  const normalized = String(value).replace(/\s+/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const hasValue = (value) => String(value ?? '').trim() !== '';

const formatCurrencyDisplay = (value) => {
  if (!hasValue(value) && typeof value !== 'number') {
    return '---';
  }
  const numberValue = typeof value === 'number' ? value : toNumber(value);
  if (!Number.isFinite(numberValue)) {
    return '---';
  }
  return `${numberValue.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`;
};

const formatPercentDisplay = (value) => {
  if (!hasValue(value) && typeof value !== 'number') {
    return '---';
  }
  const numberValue = typeof value === 'number' ? value : toNumber(value);
  if (!Number.isFinite(numberValue)) {
    return '---';
  }
  return `${numberValue.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} %`;
};

const resolveInstallationModeLabel = (mode) =>
  mode === 'per-meter' ? 'Cena za 1 mb obwodu' : 'Cena ryczaltowa';

export default function DoorsOfferForm() {
  const [userName, setUserName] = useState('');
  const [investmentStreet, setInvestmentStreet] = useState('');
  const [investmentTown, setInvestmentTown] = useState('');
  const [investmentPostalCode, setInvestmentPostalCode] = useState('');
  const [investmentCity, setInvestmentCity] = useState('');

  const [advisorId, setAdvisorId] = useState(clientAdvisorOptions[0]?.value || '');
  const selectedAdvisor = useMemo(
    () => clientAdvisorOptions.find((item) => item.value === advisorId) || clientAdvisorOptions[0] || {},
    [advisorId],
  );

  const [doorType, setDoorType] = useState(doorTypeOptions[0]?.value || '');
  const [doorMaterial, setDoorMaterial] = useState(() => {
    const initialType = doorTypeOptions[0]?.value || '';
    const initialMaterialOptions = getDoorMaterialOptions(initialType);
    return initialMaterialOptions[0]?.value || '';
  });
  const [doorColor, setDoorColor] = useState('');

  const [catalogPrice, setCatalogPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [marginPercent, setMarginPercent] = useState('');
  const [installationPricingMode, setInstallationPricingMode] = useState('flat');
  const [installationRatePerMeter, setInstallationRatePerMeter] = useState('');
  const [installationLength, setInstallationLength] = useState('');
  const [installationPerMeterExtra, setInstallationPerMeterExtra] = useState('');
  const [installationTotalOverride, setInstallationTotalOverride] = useState('');
  const [vatPreset, setVatPreset] = useState('8');
  const [vatCustom, setVatCustom] = useState('');

  const [notes, setNotes] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [generatedPdfData, setGeneratedPdfData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [extrasState, setExtrasState] = useState(() => buildDefaultExtrasState());

  const resetGeneratedPdf = () => setGeneratedPdfData(null);

  const availableDoorMaterialOptions = useMemo(() => getDoorMaterialOptions(doorType), [doorType]);

  const handleDoorTypeChange = (nextType) => {
    setDoorType(nextType);
    setDoorMaterial((currentMaterial) => {
      const nextMaterialOptions = getDoorMaterialOptions(nextType);
      const isCurrentValid = nextMaterialOptions.some((option) => option.value === currentMaterial);
      return isCurrentValid ? currentMaterial : nextMaterialOptions[0]?.value || '';
    });
    resetGeneratedPdf();
  };

  const validateCommonFields = () => {
    if (!userName.trim()) {
      alert('Podaj imie i nazwisko klienta.');
      return false;
    }
    if (!investmentStreet.trim() || !investmentTown.trim() || !investmentCity.trim()) {
      alert('Podaj ulice, miejscowosc i miasto dla inwestycji.');
      return false;
    }
    if (!hasValue(catalogPrice)) {
      alert('Podaj cene katalogowa.');
      return false;
    }
    if (installationPricingMode === 'flat') {
      if (!hasValue(installationTotalOverride)) {
        alert('Podaj kwote montazu (ryczalt).');
        return false;
      }
    } else {
      if (!hasValue(installationRatePerMeter) || !hasValue(installationLength)) {
        alert('Podaj stawke montazu za mb oraz dlugosc/obwod montazu.');
        return false;
      }
    }
    if (vatPreset === 'custom' && !hasValue(vatCustom)) {
      alert('Podaj wartosc podatku VAT.');
      return false;
    }
    return true;
  };

  const handleFillWithSampleData = () => {
    const advisorValue = clientAdvisorOptions[0]?.value || '';
    const nextExtrasState = buildDefaultExtrasState();

    nextExtrasState['seal-tape'] = { selected: true, price: '1500' };
    nextExtrasState['threshold-epdm'] = { selected: true, price: '600' };

    setUserName('Jan Testowy');
    setInvestmentStreet('ul. Krolewska 10');
    setInvestmentTown('Warszawa');
    setInvestmentPostalCode('00-001');
    setInvestmentCity('Warszawa');
    setAdvisorId(advisorValue);
    setDoorType('wejsciowe');
    setDoorMaterial('aluminium');
    setDoorColor('Antracyt struktura');
    setCatalogPrice('18500');
    setDiscountPercent('7');
    setMarginPercent('12');
    setInstallationPricingMode('flat');
    setInstallationRatePerMeter('');
    setInstallationLength('');
    setInstallationPerMeterExtra('');
    setInstallationTotalOverride('2800');
    setVatPreset('8');
    setVatCustom('');
    setNotes('Oferta testowa dla klienta pokazowego.');
    setExtrasState(nextExtrasState);
    setAttachmentFile(null);
    setIsGenerating(false);
    resetGeneratedPdf();
  };

  const calculateFinancialSummary = () => {
    const catalogPriceNumber = toNumber(catalogPrice);
    const discountPercentNumber = toNumber(discountPercent);
    const marginPercentNumber = toNumber(marginPercent);

    let installationAmount = 0;
    if (installationPricingMode === 'per-meter') {
      const rateValue = toNumber(installationRatePerMeter);
      const lengthValue = toNumber(installationLength);
      const extraValue = toNumber(installationPerMeterExtra);
      installationAmount = rateValue > 0 && lengthValue > 0 ? rateValue * lengthValue + extraValue : 0;
    } else {
      installationAmount = toNumber(installationTotalOverride);
    }

    const discountAmount = catalogPriceNumber * (discountPercentNumber / 100);
    const discountedCatalog = Math.max(catalogPriceNumber - discountAmount, 0);
    const netBeforeMargin = discountedCatalog + installationAmount;
    const marginAmount = netBeforeMargin * (marginPercentNumber / 100);
    const finalNetPrice = netBeforeMargin + marginAmount;
    const vatRateNumber = toNumber(vatPreset === 'custom' ? vatCustom : vatPreset);
    const vatAmount = finalNetPrice * (vatRateNumber / 100);
    const finalGrossPrice = finalNetPrice + vatAmount;

    return {
      catalogPriceNumber,
      discountAmount,
      discountedCatalog,
      installationAmount,
      marginAmount,
      finalNetPrice,
      vatRate: vatRateNumber,
      vatAmount,
      finalGrossPrice,
    };
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0];
    setAttachmentFile(file || null);
    resetGeneratedPdf();
  };

  const toggleExtra = (extraId) => {
    setExtrasState((current) => {
      const previous = current[extraId] || { selected: false, price: '' };
      return {
        ...current,
        [extraId]: { selected: !previous.selected, price: previous.price },
      };
    });
    resetGeneratedPdf();
  };

  const updateExtraPrice = (extraId, value) => {
    setExtrasState((current) => ({
      ...current,
      [extraId]: { ...current[extraId], price: value },
    }));
    resetGeneratedPdf();
  };

  const handleGenerateOffer = async (event) => {
    event.preventDefault();
    if (!validateCommonFields()) {
      return;
    }
    setIsGenerating(true);
    resetGeneratedPdf();

    try {
      const summary = calculateFinancialSummary();
      const resolvedVatRate = vatPreset === 'custom' ? vatCustom : vatPreset;

      const extras = doorExtrasConfig.map((extra) => ({
        id: extra.id,
        label: extra.label,
        selected: Boolean(extrasState[extra.id]?.selected),
        price: extrasState[extra.id]?.price || '',
      }));

      const financialRows = [
        { label: 'Cena katalogowa (PLN)', value: formatCurrencyDisplay(catalogPrice) },
        { label: 'Rabat (%)', value: formatPercentDisplay(discountPercent) },
        { label: 'Marza (%)', value: formatPercentDisplay(marginPercent) },
        { label: 'Sposob rozliczenia montazu', value: resolveInstallationModeLabel(installationPricingMode) },
      ];

      if (installationPricingMode === 'per-meter') {
        financialRows.push(
          { label: 'Stawka montazu za 1 mb (PLN)', value: formatCurrencyDisplay(installationRatePerMeter) },
          { label: 'Obwod montazu (mb)', value: hasValue(installationLength) ? installationLength : '---' },
          {
            label: 'Dodatkowe oplaty montazowe (PLN)',
            value: formatCurrencyDisplay(installationPerMeterExtra),
          },
        );
      } else {
        financialRows.push({
          label: 'Cena montazu - kwota ryczaltowa',
          value: formatCurrencyDisplay(installationTotalOverride),
        });
      }

      financialRows.push({
        label: 'Podatek VAT',
        value: formatPercentDisplay(resolvedVatRate),
      });

      const financialSummaryRows = [
        { label: 'Cena po rabacie', value: formatCurrencyDisplay(summary.discountedCatalog) },
        { label: 'Koszt montazu', value: formatCurrencyDisplay(summary.installationAmount) },
        { label: 'Marza (PLN)', value: formatCurrencyDisplay(summary.marginAmount) },
        { label: 'Cena netto', value: formatCurrencyDisplay(summary.finalNetPrice) },
        {
          label: `VAT (${formatPercentDisplay(summary.vatRate)})`,
          value: formatCurrencyDisplay(summary.vatAmount),
        },
        { label: 'Cena brutto', value: formatCurrencyDisplay(summary.finalGrossPrice) },
      ];

      const pdfBlob = await generateDoorsOfferPDF({
        userName: userName.trim(),
        address: composeAddress(
          investmentStreet,
          investmentTown,
          investmentPostalCode,
          investmentCity,
        ),
        advisor: selectedAdvisor,
        variant: {
          type: doorType,
          material: doorMaterial,
          color: doorColor.trim(),
        },
        financial: {
          rows: financialRows,
          summaryRows: financialSummaryRows,
          installationMode: resolveInstallationModeLabel(installationPricingMode),
          vatRate: formatPercentDisplay(summary.vatRate),
        },
        extras,
        notes,
        attachmentFile,
      });
      setGeneratedPdfData(pdfBlob);
    } catch (error) {
      console.error('Nie udalo sie wygenerowac oferty drzwi:', error);
      alert('Wystapil blad podczas generowania PDF. Sprawdz konsole.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!generatedPdfData) {
      alert('Najpierw wygeneruj PDF.');
      return;
    }
    const fileName = `Oferta_Drzwi_${userName.replace(/ /g, '_') || 'klient'}.pdf`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(generatedPdfData);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <form className="form-container" onSubmit={handleGenerateOffer}>
      <h2>Oferta - Drzwi</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button type="button" onClick={handleFillWithSampleData}>
          Wypelnij danymi testowymi
        </button>
      </div>

      <div className="input-group">
        <label htmlFor="doors_userName">Imie i nazwisko klienta</label>
        <input
          id="doors_userName"
          type="text"
          value={userName}
          onChange={(event) => {
            setUserName(event.target.value);
            resetGeneratedPdf();
          }}
          placeholder="np. Jan Nowak"
          required
        />
      </div>

      <fieldset className="component-fieldset">
        <legend>Dane inwestycji</legend>
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="doors_town">Miejscowosc</label>
            <input
              id="doors_town"
              type="text"
              value={investmentTown}
              onChange={(event) => {
                setInvestmentTown(event.target.value);
                resetGeneratedPdf();
              }}
              placeholder="np. Wieliczka"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="doors_street">Ulica i numer</label>
            <input
              id="doors_street"
              type="text"
              value={investmentStreet}
              onChange={(event) => {
                setInvestmentStreet(event.target.value);
                resetGeneratedPdf();
              }}
              placeholder="np. ul. Wiosenna 12"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="doors_postalCode">Kod pocztowy (opcjonalnie)</label>
            <input
              id="doors_postalCode"
              type="text"
              value={investmentPostalCode}
              onChange={(event) => {
                setInvestmentPostalCode(event.target.value);
                resetGeneratedPdf();
              }}
              placeholder="np. 30-001"
            />
          </div>
          <div className="input-group">
            <label htmlFor="doors_city">Miasto</label>
            <input
              id="doors_city"
              type="text"
              value={investmentCity}
              onChange={(event) => {
                setInvestmentCity(event.target.value);
                resetGeneratedPdf();
              }}
              placeholder="np. Krakow"
              required
            />
          </div>
        </div>

        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="doors_advisor">Opiekun klienta</label>
            <select
              id="doors_advisor"
              value={advisorId}
              onChange={(event) => {
                setAdvisorId(event.target.value);
                resetGeneratedPdf();
              }}
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

      <fieldset className="component-fieldset">
        <legend>Parametry finansowe</legend>
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="doors_catalogPrice">Cena katalogowa (PLN)</label>
            <input
              id="doors_catalogPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="np. 56000"
              value={catalogPrice}
              onChange={(event) => {
                setCatalogPrice(event.target.value);
                resetGeneratedPdf();
              }}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="doors_discount">Rabat (%)</label>
            <input
              id="doors_discount"
              type="number"
              min="0"
              step="0.1"
              placeholder="np. 5"
              value={discountPercent}
              onChange={(event) => {
                setDiscountPercent(event.target.value);
                resetGeneratedPdf();
              }}
            />
          </div>
          <div className="input-group">
            <label htmlFor="doors_margin">Marza (%)</label>
            <input
              id="doors_margin"
              type="number"
              min="0"
              step="0.1"
              placeholder="np. 15"
              value={marginPercent}
              onChange={(event) => {
                setMarginPercent(event.target.value);
                resetGeneratedPdf();
              }}
            />
          </div>
          <div className="input-group">
            <label htmlFor="doors_installationMode">Sposob rozliczenia montazu</label>
            <select
              id="doors_installationMode"
              value={installationPricingMode}
              onChange={(event) => {
                setInstallationPricingMode(event.target.value);
                resetGeneratedPdf();
              }}
            >
              <option value="flat">Cena ryczaltowa</option>
              <option value="per-meter">Cena za 1 mb obwodu</option>
            </select>
          </div>
          {installationPricingMode === 'per-meter' ? (
            <>
              <div className="input-group">
                <label htmlFor="doors_installationRate">Cena montazu - stawka za 1 mb (PLN)</label>
                <input
                  id="doors_installationRate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="np. 250"
                  value={installationRatePerMeter}
                  onChange={(event) => {
                    setInstallationRatePerMeter(event.target.value);
                    resetGeneratedPdf();
                  }}
                />
              </div>
              <div className="input-group">
                <label htmlFor="doors_installationLength">Obwod montazu (mb)</label>
                <input
                  id="doors_installationLength"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="np. 18"
                  value={installationLength}
                  onChange={(event) => {
                    setInstallationLength(event.target.value);
                    resetGeneratedPdf();
                  }}
                />
              </div>
              <div className="input-group">
                <label htmlFor="doors_installationExtra">Dodatkowe oplaty montazowe (PLN)</label>
                <input
                  id="doors_installationExtra"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="np. 500"
                  value={installationPerMeterExtra}
                  onChange={(event) => {
                    setInstallationPerMeterExtra(event.target.value);
                    resetGeneratedPdf();
                  }}
                />
              </div>
            </>
          ) : (
            <div className="input-group">
              <label htmlFor="doors_installationFlat">Cena montazu - kwota ryczaltowa</label>
              <input
                id="doors_installationFlat"
                type="number"
                min="0"
                step="0.01"
                placeholder="np. 8500"
                value={installationTotalOverride}
                onChange={(event) => {
                  setInstallationTotalOverride(event.target.value);
                  resetGeneratedPdf();
                }}
              />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="doors_vat">Podatek VAT</label>
            <select
              id="doors_vat"
              value={vatPreset}
              onChange={(event) => {
                setVatPreset(event.target.value);
                resetGeneratedPdf();
              }}
            >
              {vatPresetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {vatPreset === 'custom' && (
            <div className="input-group">
              <label htmlFor="doors_vatCustom">Wlasna stawka VAT (%)</label>
              <input
                id="doors_vatCustom"
                type="number"
                min="0"
                step="0.1"
                placeholder="np. 7"
                value={vatCustom}
                onChange={(event) => {
                  setVatCustom(event.target.value);
                  resetGeneratedPdf();
                }}
              />
            </div>
          )}
        </div>
        <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#555' }}>
          Wpisz pelna kwote montazu. Pole pozostaw puste, jesli montaz nie jest uwzgledniany.
        </p>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Parametry drzwi</legend>
        <div className="input-grid" style={gridStyle}>
          <div className="input-group">
            <label htmlFor="doors_type">Rodzaj drzwi</label>
            <select
              id="doors_type"
              value={doorType}
              onChange={(event) => handleDoorTypeChange(event.target.value)}
            >
              {doorTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="doors_material">Material</label>
            <select
              id="doors_material"
              value={doorMaterial}
              onChange={(event) => {
                setDoorMaterial(event.target.value);
                resetGeneratedPdf();
              }}
            >
              {availableDoorMaterialOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="doors_color">Kolor / wykonczenie</label>
            <input
              id="doors_color"
              type="text"
              value={doorColor}
              onChange={(event) => {
                setDoorColor(event.target.value);
                resetGeneratedPdf();
              }}
              placeholder="np. Antracyt struktura"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Prace dodatkowe</legend>
        <div className="options-box">
          {doorExtrasConfig.map((extra) => {
            const extraState = extrasState[extra.id] || { selected: false, price: '' };
            return (
              <div key={extra.id} style={{ marginBottom: '16px' }}>
                <label className="option-row">
                  <input
                    type="checkbox"
                    checked={extraState.selected}
                    onChange={() => toggleExtra(extra.id)}
                  />
                  {extra.label}
                </label>
                <div className="input-group" style={{ marginLeft: '28px', marginTop: '6px' }}>
                  <label style={{ fontSize: '0.8rem' }}>Cena (PLN)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={extraState.price}
                    onChange={(event) => updateExtraPrice(extra.id, event.target.value)}
                    placeholder="np. 1500"
                    disabled={!extraState.selected}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Zalacznik</legend>
        <div className="input-group">
          <label htmlFor="doors_attachment">Dodatkowy plik (PDF)</label>
          <input
            id="doors_attachment"
            type="file"
            accept="application/pdf"
            onChange={handleAttachmentChange}
          />
          {attachmentFile && <small>Wybrano: {attachmentFile.name}</small>}
        </div>
      </fieldset>

      <fieldset className="component-fieldset">
        <legend>Uwagi</legend>
        <div className="input-group">
          <label htmlFor="doors_notes">Dodatkowe informacje</label>
          <textarea
            id="doors_notes"
            rows={4}
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              resetGeneratedPdf();
            }}
            placeholder="Opis nietypowych wymagan, termin montazu, dodatkowe akcesoria..."
          />
        </div>
      </fieldset>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isGenerating}>
          {isGenerating ? 'Generowanie...' : 'Generuj PDF'}
        </button>
        <button type="button" className="secondary-button" onClick={handleDownloadPdf} disabled={!generatedPdfData}>
          Pobierz PDF
        </button>
      </div>

      <TrelloActions generatedPdfData={generatedPdfData} userName={userName || 'Klient'} />
    </form>
  );
}
