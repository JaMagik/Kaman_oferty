// src/utils/oknaNestPricingAssumptionsPdfGenerator.jsx
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const FONT_REGULAR_PATH = '/fonts/OpenSans-Regular.ttf';
const FONT_BOLD_PATH = '/fonts/OpenSans-Bold.ttf';
const PRIMARY_COLOR = rgb(0.66, 0.0, 0.18);
const LABEL_COLOR = rgb(0.25, 0.25, 0.25);
const SECTION_STROKE = rgb(0.82, 0.82, 0.82);

const wrapText = (font, text, size, maxWidth) => {
  const normalized = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return ['---'];
  }
  const words = normalized.split(' ');
  const lines = [];
  let current = words[0];
  for (let index = 1; index < words.length; index += 1) {
    const candidate = `${current} ${words[index]}`;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[index];
    }
  }
  lines.push(current);
  return lines;
};

const formatNumber = (value, fractionDigits = 2) => {
  if (!Number.isFinite(value)) {
    return '0,00';
  }
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

const formatCurrency = (value) => `${formatNumber(value, 2)} PLN`;
const formatPercent = (value) => `${formatNumber(value, 1)}%`;

const ensureNumber = (value) => {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
};

const composeInvestmentAddress = (details = {}) => {
  const parts = [
    details.town,
    details.street,
    [details.postalCode, details.city].filter(Boolean).join(' '),
  ]
    .map((entry) => String(entry ?? '').trim())
    .filter(Boolean);
  return parts.length ? parts.join('\n') : '---';
};

const fetchBinary = async (path, label) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Nie udalo sie pobrac zasobu ${label}: ${path}`);
  }
  return await response.arrayBuffer();
};

const drawSectionHeader = (page, fonts, title, cursor, marginX, width) => {
  const headerSize = 13;
  const { bold } = fonts;
  const nextY = cursor - 8;
  page.drawText(title, {
    x: marginX,
    y: nextY,
    size: headerSize,
    font: bold,
    color: PRIMARY_COLOR,
  });
  const lineY = nextY - 6;
  page.drawLine({
    start: { x: marginX, y: lineY },
    end: { x: width - marginX, y: lineY },
    thickness: 1,
    color: SECTION_STROKE,
  });
  return lineY - 14;
};

const drawKeyValueRows = (page, fonts, rows, cursor, marginX, labelWidth) => {
  const { regular, bold } = fonts;
  const valueWidth = page.getSize().width - marginX * 2 - labelWidth;
  let currentY = cursor;

  rows.forEach((row) => {
    if (!row) {
      return;
    }
    const label = String(row.label ?? '').trim();
    const rawValue = row.value ?? '---';
    const fontSize = 10;
    const valueLines = wrapText(regular, rawValue, fontSize, valueWidth);
    const labelY = currentY;

    page.drawText(`${label}:`, {
      x: marginX,
      y: labelY,
      size: fontSize,
      font: bold,
      color: LABEL_COLOR,
    });

    valueLines.forEach((line, index) => {
      page.drawText(line, {
        x: marginX + labelWidth,
        y: currentY,
        size: fontSize,
        font: regular,
        color: rgb(0.1, 0.1, 0.1),
      });
      currentY -= fontSize + 4;
      if (index === 0) {
        currentY += 4;
      }
    });

    currentY -= 6;
  });

  return currentY + 2;
};

export async function generateOknaNestPricingAssumptionsPDF(payload = {}) {
  try {
    const {
      userName = '',
      investmentAddressDetails = {},
      clientAdvisor = {},
      investmentAddressText = '',
      calculations = {},
      generatedAt = Date.now(),
      additionalNotes = '',
    } = payload;

    const {
      catalogPrice = 0,
      discountPercent = 0,
      marginPercent = 0,
      vatRate = 23,
      installationPricingMode = 'flat',
      installationRatePerMeter = 0,
      installationPerMeterExtra = 0,
      installationOverride = 0,
      installationComputed = 0,
      installationApplied = 0,
      windowPerimeter = 0,
      windowArea = 0,
      pricePreview = {},
    } = calculations;

    const preview = {
      baseSum: ensureNumber(pricePreview.baseSum),
      discountAmount: ensureNumber(pricePreview.discountAmount),
      discountedWindowsPrice: ensureNumber(pricePreview.discountedWindowsPrice),
      netAfterDiscount: ensureNumber(pricePreview.netAfterDiscount),
      marginAmount: ensureNumber(pricePreview.marginAmount),
      netWithMargin: ensureNumber(pricePreview.netWithMargin),
      vatAmount: ensureNumber(pricePreview.vatAmount),
      grossTotal: ensureNumber(pricePreview.grossTotal),
      installationApplied: ensureNumber(pricePreview.installationApplied),
      installationComputed: ensureNumber(pricePreview.installationComputed),
    };

    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);

    const [regularBytes, boldBytes] = await Promise.all([
      fetchBinary(FONT_REGULAR_PATH, 'font (regular)'),
      fetchBinary(FONT_BOLD_PATH, 'font (bold)'),
    ]);

    const regularFont = await doc.embedFont(regularBytes);
    const boldFont = await doc.embedFont(boldBytes);

    const page = doc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    const marginX = 56;
    const labelWidth = 170;
    let cursorY = height - 60;

    const fonts = { regular: regularFont, bold: boldFont };

    page.drawText('Zalozenia cenowe - Okna Nest', {
      x: marginX,
      y: cursorY,
      size: 20,
      font: boldFont,
      color: PRIMARY_COLOR,
    });

    const generatedDate = new Date(generatedAt);
    const dateLines = [
      `Klient: ${userName || '---'}`,
      `Data wygenerowania: ${generatedDate.toLocaleDateString('pl-PL')}`,
    ];
    cursorY -= 26;
    dateLines.forEach((line) => {
      page.drawText(line, {
        x: marginX,
        y: cursorY,
        size: 11,
        font: regularFont,
        color: LABEL_COLOR,
      });
      cursorY -= 16;
    });
    cursorY -= 6;

    cursorY = drawSectionHeader(page, fonts, 'Dane klienta i inwestycji', cursorY, marginX, width);
    cursorY = drawKeyValueRows(
      page,
      fonts,
      [
        { label: 'Imie i nazwisko', value: userName || '---' },
        {
          label: 'Adres inwestycji',
          value: investmentAddressText || composeInvestmentAddress(investmentAddressDetails),
        },
        {
          label: 'Opiekun klienta',
          value: clientAdvisor?.name || clientAdvisor?.label || '---',
        },
        {
          label: 'Kontakt opiekuna',
          value: [clientAdvisor?.phone, clientAdvisor?.email].filter(Boolean).join(' - ') || '---',
        },
      ],
      cursorY,
      marginX,
      labelWidth,
    );

    cursorY = drawSectionHeader(page, fonts, 'Parametry okien', cursorY, marginX, width);
    cursorY = drawKeyValueRows(
      page,
      fonts,
      [
        { label: 'Powierzchnia stolarki', value: `${formatNumber(ensureNumber(windowArea), 2)} m2` },
        { label: 'Obwod stolarki', value: `${formatNumber(ensureNumber(windowPerimeter), 2)} mb` },
      ],
      cursorY,
      marginX,
      labelWidth,
    );

    cursorY = drawSectionHeader(page, fonts, 'Parametry finansowe wejsciowe', cursorY, marginX, width);
    const installationModeLabel =
      installationPricingMode === 'per-meter'
        ? 'Stawka za metr obwodu'
        : 'Kwota ryczaltowa';
    const financialRows = [
      { label: 'Cena katalogowa', value: formatCurrency(ensureNumber(catalogPrice)) },
      { label: 'Rabat', value: formatPercent(ensureNumber(discountPercent)) },
      { label: 'Marza', value: formatPercent(ensureNumber(marginPercent)) },
      { label: 'VAT', value: formatPercent(ensureNumber(vatRate)) },
      {
        label: 'Tryb rozliczenia montazu',
        value: installationPricingMode === 'per-meter' ? 'wedlug mb obwodu' : 'cena ryczaltowa',
      },
      {
        label: installationModeLabel,
        value:
          installationPricingMode === 'per-meter'
            ? `${formatCurrency(ensureNumber(installationRatePerMeter))} / mb`
            : formatCurrency(ensureNumber(installationOverride)),
      },
    ];

    if (installationPricingMode === 'per-meter') {
      financialRows.push({
        label: 'Dodatkowa kwota do montazu',
        value: formatCurrency(ensureNumber(installationPerMeterExtra)),
      });
    }
    financialRows.push({
      label: 'Montaz w kalkulacji',
      value: formatCurrency(ensureNumber(installationApplied || installationComputed)),
    });

    cursorY = drawKeyValueRows(page, fonts, financialRows, cursorY, marginX, labelWidth);

    cursorY = drawSectionHeader(page, fonts, 'Podsumowanie obliczen', cursorY, marginX, width);
    cursorY = drawKeyValueRows(
      page,
      fonts,
      [
        { label: 'Kwota rabatu', value: formatCurrency(preview.discountAmount) },
        { label: 'Okna po rabacie', value: formatCurrency(preview.discountedWindowsPrice) },
        { label: 'Suma netto po rabacie', value: formatCurrency(preview.netAfterDiscount) },
        { label: 'Marza (kwota)', value: formatCurrency(preview.marginAmount) },
        { label: 'Cena netto oferty', value: formatCurrency(preview.netWithMargin) },
        { label: 'VAT kwotowo', value: formatCurrency(preview.vatAmount) },
        { label: 'Cena brutto oferty', value: formatCurrency(preview.grossTotal) },
      ],
      cursorY,
      marginX,
      labelWidth,
    );

    if (additionalNotes) {
      cursorY = drawSectionHeader(page, fonts, 'Uwagi handlowe', cursorY, marginX, width);
      const noteLines = wrapText(regularFont, additionalNotes, 10, width - marginX * 2);
      noteLines.forEach((line) => {
        if (cursorY < 80) {
          cursorY = height - 80;
        }
        page.drawText(line, {
          x: marginX,
          y: cursorY,
          size: 10,
          font: regularFont,
          color: rgb(0.1, 0.1, 0.1),
        });
        cursorY -= 14;
      });
    }

    const pdfBytes = await doc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Blad podczas generowania zalozen cenowych:', error);
    alert(`Nie udalo sie przygotowac zalozen cenowych: ${error.message}`);
    return null;
  }
}
