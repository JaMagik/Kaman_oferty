import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const FONT_REGULAR_PATH = '/fonts/OpenSans-Regular.ttf';
const FONT_BOLD_PATH = '/fonts/OpenSans-Bold.ttf';
const PRIMARY_LOGO_PATH = '/logos/Kaman%20Nest.png';
const SECONDARY_LOGO_PATH = '/logos/Grupa%20Kaman.png';
const DEFAULT_CONTACT_PAGE = '/pdf_templates/common/kontakt_NEST.pdf';
const DEFAULT_INFO_PAGES = [
  '/pdf_templates/common/O_grupie_NEST.pdf',
  '/pdf_templates/common/Co_robimy_NEST.pdf',
];
const ACCENT_COLOR = rgb(0.04, 0.33, 0.58);
const TEXT_COLOR = rgb(0.12, 0.18, 0.24);
const INFO_SEPARATOR_COLOR = rgb(0.78, 0.86, 0.94);
const INFO_LABEL_COLOR = rgb(0.15, 0.15, 0.15);
const TABLE_ROW_BG_EVEN = rgb(0.94, 0.97, 1);
const TABLE_ROW_BG_ODD = rgb(1, 1, 1);
const TABLE_HEADER_FONT_COLOR = rgb(1, 1, 1);

const fetchAsset = async (path) => {
  if (!path) {
    return null;
  }
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.warn(`[simpleOfferPdfGenerator] Nie udalo sie pobrac zasobu ${path}`, error);
    return null;
  }
};

const scaleImageToFit = (image, maxWidth, maxHeight) => {
  const widthScale = maxWidth / image.width;
  const heightScale = maxHeight / image.height;
  const scale = Math.min(widthScale, heightScale);
  return image.scale(scale);
};

const drawOfferHeader = (page, fonts, { title, dateText }) => {
  const { height } = page.getSize();
  let cursorY = height - 64;

  if (title) {
    page.drawText(title, {
      x: 60,
      y: cursorY,
      size: 22,
      font: fonts.bold,
      color: ACCENT_COLOR,
    });
    cursorY -= 28;
  }

  if (dateText) {
    page.drawText(dateText, {
      x: 60,
      y: cursorY,
      size: 11,
      font: fonts.regular,
      color: TEXT_COLOR,
    });
    cursorY -= 24;
  }

  page.drawLine({
    start: { x: 60, y: cursorY + 10 },
    end: { x: page.getSize().width - 60, y: cursorY + 10 },
    thickness: 0.75,
    color: INFO_SEPARATOR_COLOR,
  });

  return cursorY;
};

const drawInfoColumn = (page, fonts, entries, startX, startY, columnWidth) => {
  let cursorY = startY;
  entries.forEach(({ label, value }, index) => {
    page.drawText(label, {
      x: startX,
      y: cursorY,
      size: 11,
      font: fonts.bold,
      color: INFO_LABEL_COLOR,
    });
    cursorY -= 13;

    const resolvedValue = normalizeValue(value);
    const segments = resolvedValue.split('\n').filter(Boolean);
    const valueLines = segments.length > 0 ? segments : ['---'];
    valueLines.forEach((segment, segmentIndex) => {
      const wrappedLines = wrapText(segment, fonts.regular, 10, Math.max(columnWidth - 10, 40));
      wrappedLines.forEach((line) => {
        page.drawText(line, {
          x: startX,
          y: cursorY,
          size: 10,
          font: fonts.regular,
          color: TEXT_COLOR,
        });
        cursorY -= 12;
      });
      if (segmentIndex < valueLines.length - 1) {
        cursorY -= 4;
      }
    });

    if (index < entries.length - 1) {
      cursorY -= 4;
      page.drawLine({
        start: { x: startX, y: cursorY + 6 },
        end: { x: startX + columnWidth, y: cursorY + 6 },
        thickness: 0.5,
        color: INFO_SEPARATOR_COLOR,
      });
      cursorY -= 10;
    }
  });
  return cursorY;
};

const drawOfferInfoBlock = (page, fonts, { leftEntries, rightEntries, startY, primaryLogo, secondaryLogo }) => {
  const { width } = page.getSize();
  const columnWidth = (width - 148) / 2;
  const leftStartX = 60;
  const rightStartX = width / 2 + 14;
  const infoTop = startY + 6;

  const leftBottom = drawInfoColumn(page, fonts, leftEntries, leftStartX, startY, columnWidth);
  const rightBottom = drawInfoColumn(page, fonts, rightEntries, rightStartX, startY, columnWidth);

  const infoBottom = Math.min(leftBottom, rightBottom);

  page.drawLine({
    start: { x: leftStartX + columnWidth + 20, y: infoTop },
    end: { x: leftStartX + columnWidth + 20, y: infoBottom - 10 },
    thickness: 0.5,
    color: INFO_SEPARATOR_COLOR,
  });

  let cursorY = infoBottom - 20;

  if (primaryLogo) {
    const dimensions = scaleImageToFit(primaryLogo, 160, 46);
    const logoX = (width - dimensions.width) / 2;
    const logoY = cursorY - dimensions.height;
    page.drawImage(primaryLogo, {
      x: logoX,
      y: logoY,
      width: dimensions.width,
      height: dimensions.height,
    });
    cursorY = logoY - 14;
  }

  if (secondaryLogo) {
    const secondaryDims = scaleImageToFit(secondaryLogo, 120, 32);
    const secondaryX = (width - secondaryDims.width) / 2;
    const secondaryY = cursorY - secondaryDims.height;
    page.drawImage(secondaryLogo, {
      x: secondaryX,
      y: secondaryY,
      width: secondaryDims.width,
      height: secondaryDims.height,
    });
    cursorY = secondaryY - 18;
  }

  return cursorY;
};

const wrapText = (text, font, size, maxWidth) => {
  const normalized = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return ['---'];
  }
  const words = normalized.split(' ');
  const lines = [];
  let currentLine = words[0];
  for (let index = 1; index < words.length; index += 1) {
    const candidate = `${currentLine} ${words[index]}`;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = words[index];
    }
  }
  lines.push(currentLine);
  return lines;
};

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return '---';
  }
  const trimmed = String(value).trim();
  return trimmed ? trimmed : '---';
};

const parseCurrency = (rawValue) => {
  if (rawValue === null || rawValue === undefined) {
    return null;
  }
  const normalized = String(rawValue).replace(/\s+/g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCurrency = (rawValue) => {
  if (!rawValue && rawValue !== 0) {
    return '---';
  }
  const parsed = parseCurrency(rawValue);
  if (!Number.isFinite(parsed)) {
    return normalizeValue(rawValue);
  }
  return `${parsed.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`;
};

const formatPriceWithFallback = (rawValue) => {
  const parsed = parseCurrency(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 'wedlug projektu';
  }
  return `${parsed.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`;
};

const formatStatusWithPrice = (selected, rawPrice) => {
  const status = selected ? 'TAK' : 'Opcja';
  const priceText = formatPriceWithFallback(rawPrice);
  return `${status} | ${priceText}`;
};

const DOORS_COVER_PATH = '/pdf_templates/doors/1_okladka.pdf';
const GARAGE_DOORS_COVER_PATH = '/pdf_templates/garage_doors/1_okladka.pdf';

const readAttachmentBytes = async (file) => {
  if (!file) {
    return null;
  }
  if (typeof file.arrayBuffer === 'function') {
    return file.arrayBuffer();
  }
  if (file instanceof ArrayBuffer) {
    return file;
  }
  if (file && file.buffer instanceof ArrayBuffer) {
    return file.buffer;
  }
  return null;
};

const createAddressLines = ({ street, town, postalCode, city }) => {
  const lines = [];
  if (street) {
    lines.push(street);
  }
  const locality = [town, postalCode, city].filter(Boolean).join(', ');
  if (locality) {
    lines.push(locality);
  }
  return lines.length ? lines : ['---'];
};

const ensureSpace = (context, requiredSpace = 60) => {
  if (context.cursorY <= requiredSpace) {
    context.page = context.pdfDoc.addPage();
    const size = context.page.getSize();
    context.width = size.width;
    context.height = size.height;
    context.cursorY = context.height - context.topMargin;
  }
};

const drawSectionTitle = (context, title) => {
  ensureSpace(context, 50);
  context.page.drawText(title, {
    x: context.marginX,
    y: context.cursorY,
    font: context.boldFont,
    size: 14,
    color: context.accentColor,
  });
  context.cursorY -= 20;
};

const drawNotes = (context, notes) => {
  if (!notes || !notes.trim()) {
    return;
  }
  drawSectionTitle(context, 'Uwagi');
  const fontSize = 11;
  const maxWidth = context.width - context.marginX * 2;
  const lines = wrapText(notes, context.regularFont, fontSize, maxWidth);
  lines.forEach((line) => {
    ensureSpace(context, 40);
    context.page.drawText(line, {
      x: context.marginX,
      y: context.cursorY,
      font: context.regularFont,
      size: fontSize,
      color: context.textColor,
    });
    context.cursorY -= 16;
  });
  context.cursorY -= 4;
};

const drawDefinitionTable = (
  context,
  rows,
  {
    labelHeader = 'Parametr',
    valueHeader = 'Wartosc',
    labelColumnWidth = 230,
    fontSize = 10.5,
    paddingX = 10,
    paddingY = 6,
    lineHeight = 13,
  } = {},
) => {
  if (!rows || rows.length === 0) {
    return;
  }

  const tableWidth = context.width - context.marginX * 2;
  const valueColumnWidth = tableWidth - labelColumnWidth;
  const headerHeight = 22;
  const borderColor = INFO_SEPARATOR_COLOR;

  const drawTableHeader = () => {
    ensureSpace(context, headerHeight + 10);
    context.page.drawRectangle({
      x: context.marginX,
      y: context.cursorY - headerHeight,
      width: tableWidth,
      height: headerHeight,
      color: ACCENT_COLOR,
    });

    const headerBaseY = context.cursorY - headerHeight + (headerHeight - fontSize) / 2;

    context.page.drawText(labelHeader, {
      x: context.marginX + paddingX,
      y: headerBaseY,
      font: context.boldFont,
      size: fontSize,
      color: TABLE_HEADER_FONT_COLOR,
    });

    context.page.drawText(valueHeader, {
      x: context.marginX + labelColumnWidth + paddingX,
      y: headerBaseY,
      font: context.boldFont,
      size: fontSize,
      color: TABLE_HEADER_FONT_COLOR,
    });

    context.page.drawLine({
      start: { x: context.marginX + labelColumnWidth, y: context.cursorY },
      end: { x: context.marginX + labelColumnWidth, y: context.cursorY - headerHeight },
      thickness: 1,
      color: TABLE_HEADER_FONT_COLOR,
    });

    context.cursorY -= headerHeight;
  };

  const drawRowBackground = (topY, rowHeight, isEven) => {
    context.page.drawRectangle({
      x: context.marginX,
      y: topY - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: isEven ? TABLE_ROW_BG_EVEN : TABLE_ROW_BG_ODD,
    });

    context.page.drawLine({
      start: { x: context.marginX, y: topY },
      end: { x: context.marginX + tableWidth, y: topY },
      thickness: 0.5,
      color: borderColor,
    });

    context.page.drawLine({
      start: { x: context.marginX + labelColumnWidth, y: topY },
      end: { x: context.marginX + labelColumnWidth, y: topY - rowHeight },
      thickness: 0.5,
      color: borderColor,
    });

    context.page.drawLine({
      start: { x: context.marginX, y: topY - rowHeight },
      end: { x: context.marginX + tableWidth, y: topY - rowHeight },
      thickness: 0.5,
      color: borderColor,
    });
  };

  drawTableHeader();

  rows.forEach((row, index) => {
    const rawLabel = normalizeValue(row.label);
    const rawValue = normalizeValue(row.value);
    const labelLines = wrapText(rawLabel, context.boldFont, fontSize, Math.max(labelColumnWidth - paddingX * 2, 40));
    const valueLines = wrapText(rawValue, context.regularFont, fontSize, Math.max(valueColumnWidth - paddingX * 2, 40));
    const linesCount = Math.max(labelLines.length, valueLines.length, 1);
    const rowHeight = paddingY * 2 + linesCount * lineHeight;

    if (context.cursorY - rowHeight <= 40) {
      context.page = context.pdfDoc.addPage();
      const size = context.page.getSize();
      context.width = size.width;
      context.height = size.height;
      context.cursorY = context.height - context.topMargin;
      drawTableHeader();
    }

    const topY = context.cursorY;
    drawRowBackground(topY, rowHeight, index % 2 === 0);

    let labelY = topY - paddingY - fontSize;
    labelLines.forEach((line) => {
      context.page.drawText(line, {
        x: context.marginX + paddingX,
        y: labelY,
        font: context.boldFont,
        size: fontSize,
        color: TEXT_COLOR,
      });
      labelY -= lineHeight;
    });

    let valueY = topY - paddingY - fontSize;
    valueLines.forEach((line) => {
      context.page.drawText(line, {
        x: context.marginX + labelColumnWidth + paddingX,
        y: valueY,
        font: context.regularFont,
        size: fontSize,
        color: TEXT_COLOR,
      });
      valueY -= lineHeight;
    });

    context.cursorY = topY - rowHeight;
  });

  context.cursorY -= 12;
};

async function createSimpleOfferPdf({
  title,
  customerName,
  investmentAddress,
  advisor,
  sections,
  price,
  financial,
  notes,
  attachmentFile,
  coverPath = null,
  infoPages = DEFAULT_INFO_PAGES,
  contactPagePath = DEFAULT_CONTACT_PAGE,
  brandLogoPath = PRIMARY_LOGO_PATH,
  secondaryLogoPath = SECONDARY_LOGO_PATH,
}) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const [regularFontBytes, boldFontBytes, primaryLogoBytes, secondaryLogoBytes] = await Promise.all([
    fetchAsset(FONT_REGULAR_PATH),
    fetchAsset(FONT_BOLD_PATH),
    fetchAsset(brandLogoPath),
    fetchAsset(secondaryLogoPath),
  ]);

  const regularFont = regularFontBytes
    ? await pdfDoc.embedFont(regularFontBytes)
    : await pdfDoc.embedFont(StandardFonts.Helvetica);

  const boldFont = boldFontBytes
    ? await pdfDoc.embedFont(boldFontBytes)
    : await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let primaryLogo = null;
  if (primaryLogoBytes) {
    try {
      primaryLogo = await pdfDoc.embedPng(primaryLogoBytes);
    } catch (error) {
      console.warn('[simpleOfferPdfGenerator] Nie udalo sie osadzic logo firmy', error);
    }
  }

  let secondaryLogo = null;
  if (secondaryLogoBytes) {
    try {
      secondaryLogo = await pdfDoc.embedPng(secondaryLogoBytes);
    } catch (error) {
      console.warn('[simpleOfferPdfGenerator] Nie udalo sie osadzic dodatkowego logo', error);
    }
  }

  if (coverPath) {
    const coverBytes = await fetchAsset(coverPath);
    if (coverBytes) {
      try {
        const coverDoc = await PDFDocument.load(coverBytes);
        const [coverPage] = await pdfDoc.copyPages(coverDoc, [0]);
        pdfDoc.addPage(coverPage);
      } catch (error) {
        console.warn(`[simpleOfferPdfGenerator] Nie udalo sie dolaczyc okladki ${coverPath}`, error);
      }
    }
  }

  const page = pdfDoc.addPage();
  const size = page.getSize();
  const fonts = { bold: boldFont, regular: regularFont };

  const investmentLines = Array.isArray(investmentAddress)
    ? investmentAddress.filter(Boolean)
    : [normalizeValue(investmentAddress)];
  const addressDisplay = investmentLines.length > 0 ? investmentLines.join('\n') : '---';
  const advisorName = advisor?.label || advisor?.name || '---';
  const advisorPhone = advisor?.phone || '---';
  const advisorEmail = advisor?.email || '---';
  const offerDate = new Date().toLocaleDateString('pl-PL');

  const headerBottomY = drawOfferHeader(page, fonts, {
    title,
    dateText: `Data oferty: ${offerDate}`,
  });

  const leftColumnEntries = [
    { label: 'Oferta dla', value: normalizeValue(customerName) },
    { label: 'Adres inwestycji', value: addressDisplay },
    { label: 'Waznosc oferty', value: '14 dni' },
  ];

  const rightColumnEntries = [
    { label: 'Oferte sporzadzil', value: advisorName },
    { label: 'Telefon', value: advisorPhone },
    { label: 'Email', value: advisorEmail },
  ];

  let cursorY = drawOfferInfoBlock(page, fonts, {
    leftEntries: leftColumnEntries,
    rightEntries: rightColumnEntries,
    startY: headerBottomY - 4,
    primaryLogo,
    secondaryLogo,
  });
  cursorY -= 12;

  const context = {
    pdfDoc,
    page,
    width: size.width,
    height: size.height,
    boldFont,
    regularFont,
    cursorY,
    topMargin: 60,
    marginX: 60,
    accentColor: ACCENT_COLOR,
    textColor: TEXT_COLOR,
  };

  (sections || []).forEach((section) => {
    if (!section || !Array.isArray(section.rows) || section.rows.length === 0) {
      return;
    }
    drawSectionTitle(context, section.title);
    drawDefinitionTable(context, section.rows, section.tableOptions || {});
  });

  const financialRows = Array.isArray(financial?.rows) ? financial.rows : [];
  const financialSummaryRows = Array.isArray(financial?.summaryRows) ? financial.summaryRows : [];

  const summaryRows = financialSummaryRows.filter((row) =>
    typeof row?.label === 'string' &&
    ['Cena netto', 'Cena brutto', 'VAT'].some((keyword) => row.label.toLowerCase().includes(keyword.toLowerCase())),
  );

  if (summaryRows.length > 0) {
    drawSectionTitle(context, 'Podsumowanie cenowe');
    drawDefinitionTable(context, summaryRows, {
      labelHeader: 'Element',
      valueHeader: 'Kwota (PLN)',
      labelColumnWidth: 260,
    });
  } else if (financialSummaryRows.length > 0) {
    drawSectionTitle(context, 'Podsumowanie cenowe');
    drawDefinitionTable(context, financialSummaryRows, {
      labelHeader: 'Element',
      valueHeader: 'Kwota (PLN)',
      labelColumnWidth: 260,
    });
  }

  if (financial?.note) {
    drawDefinitionTable(context, [{ label: 'Informacja', value: financial.note }], {
      labelHeader: 'Opis',
      valueHeader: 'Wartosc',
      labelColumnWidth: 220,
    });
  }

  drawNotes(context, notes);

  const appendStaticPdf = async (path) => {
    if (!path) {
      return;
    }
    const bytes = await fetchAsset(path);
    if (!bytes) {
      return;
    }
    try {
      const doc = await PDFDocument.load(bytes);
      const pages = await pdfDoc.copyPages(doc, doc.getPageIndices());
      pages.forEach((copiedPage) => {
        pdfDoc.addPage(copiedPage);
      });
    } catch (error) {
      console.warn(`[simpleOfferPdfGenerator] Nie udalo sie dolaczyc pliku ${path}`, error);
    }
  };

  let attachmentEmbedded = false;
  const attachmentFallbackRows = [];

  if (attachmentFile) {
    const attachmentBytes = await readAttachmentBytes(attachmentFile);
    if (attachmentBytes) {
      try {
        const attachmentDoc = await PDFDocument.load(attachmentBytes);
        const copiedPages = await pdfDoc.copyPages(attachmentDoc, attachmentDoc.getPageIndices());
        copiedPages.forEach((copiedPage) => {
          pdfDoc.addPage(copiedPage);
        });
        attachmentEmbedded = true;
      } catch (error) {
        console.warn('[simpleOfferPdfGenerator] Nie udalo sie dolaczyc zalacznika PDF', error);
      }
    }

    if (!attachmentEmbedded) {
      attachmentFallbackRows.push({
        label: 'Plik',
        value: attachmentFile.name || 'Zalacznik',
      });
    }
  }

  if (attachmentFallbackRows.length > 0) {
    drawSectionTitle(context, 'Zalaczniki');
    drawDefinitionTable(context, attachmentFallbackRows, {
      labelHeader: 'Typ',
      valueHeader: 'Opis',
      labelColumnWidth: 180,
    });
  }

  const normalizedInfoPages = Array.isArray(infoPages)
    ? infoPages.filter(Boolean)
    : [];
  for (const infoPath of normalizedInfoPages) {
    await appendStaticPdf(infoPath);
  }

  if (contactPagePath) {
    await appendStaticPdf(contactPagePath);
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function generateDoorsOfferPDF(formData) {
  const {
    userName,
    address,
    advisor,
    variant,
    price,
    financial,
    notes,
    attachmentFile,
    extras = [],
  } = formData;

  const extrasRows = extras
    .filter((extra) => extra.selected || (extra.price && extra.price.trim()))
    .map((extra) => ({
      label: extra.label,
      value: formatStatusWithPrice(extra.selected, extra.price),
    }));

  const sections = [
    {
      title: 'Parametry drzwi',
      rows: [
        { label: 'Rodzaj', value: variant.type },
        { label: 'Material', value: variant.material },
        { label: 'Kolorystyka', value: variant.color },
      ],
    },
  ];

  if (extrasRows.length > 0) {
    sections.push({
      title: 'Prace dodatkowe',
      rows: extrasRows,
    });
  }

  return createSimpleOfferPdf({
    title: 'Oferta - Drzwi',
    customerName: userName,
    investmentAddress: createAddressLines(address),
    advisor,
    sections,
    price,
    financial,
    notes,
    attachmentFile,
    coverPath: DOORS_COVER_PATH,
    infoPages: DEFAULT_INFO_PAGES,
    contactPagePath: DEFAULT_CONTACT_PAGE,
  });
}

export async function generateGarageDoorsOfferPDF(formData) {
  const {
    userName,
    address,
    advisor,
    variant,
    price,
    financial,
    notes,
    attachmentFile,
    extras = [],
  } = formData;

  const extrasRows = extras
    .filter((extra) => extra.selected || (extra.price && extra.price.trim()))
    .map((extra) => ({
      label: extra.label,
      value: formatStatusWithPrice(extra.selected, extra.price),
    }));

  const sections = [
    {
      title: 'Parametry bramy',
      rows: [
        { label: 'Typ bramy', value: variant.type },
        { label: 'Sterowanie', value: variant.drive },
        { label: 'Izolacyjnosc', value: variant.insulation },
        { label: 'Kolor / faktura', value: variant.finish },
        { label: 'Dodatkowe przeszklenia', value: variant.glazing },
        { label: 'Termin realizacji', value: variant.leadTime },
      ],
    },
  ];

  if (extrasRows.length > 0) {
    sections.push({
      title: 'Prace dodatkowe',
      rows: extrasRows,
    });
  }

  return createSimpleOfferPdf({
    title: 'Oferta - Bramy garazowe',
    customerName: userName,
    investmentAddress: createAddressLines(address),
    advisor,
    sections,
    price,
    financial,
    notes,
    attachmentFile,
    coverPath: GARAGE_DOORS_COVER_PATH,
    infoPages: DEFAULT_INFO_PAGES,
    contactPagePath: DEFAULT_CONTACT_PAGE,
  });

}

