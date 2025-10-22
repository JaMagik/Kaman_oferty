import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

const drawRow = (context, label, value) => {
  const labelWidth = 170;
  const fontSize = 11;
  const lineHeight = 15;
  ensureSpace(context, 70);
  const resolvedValue = normalizeValue(value);
  context.page.drawText(`${label}:`, {
    x: context.marginX,
    y: context.cursorY,
    font: context.boldFont,
    size: fontSize,
    color: context.textColor,
  });
  const maxValueWidth = context.width - context.marginX - labelWidth - context.marginX;
  const valueLines = wrapText(resolvedValue, context.regularFont, fontSize, maxValueWidth);
  let valueY = context.cursorY;
  valueLines.forEach((line) => {
    context.page.drawText(line, {
      x: context.marginX + labelWidth,
      y: valueY,
      font: context.regularFont,
      size: fontSize,
      color: context.textColor,
    });
    valueY -= lineHeight;
  });
  context.cursorY = valueY + lineHeight - 8;
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
}) {
  const pdfDoc = await PDFDocument.create();
  const [boldFont, regularFont] = await Promise.all([
    pdfDoc.embedFont(StandardFonts.HelveticaBold),
    pdfDoc.embedFont(StandardFonts.Helvetica),
  ]);
  const page = pdfDoc.addPage();
  const size = page.getSize();

  const context = {
    pdfDoc,
    page,
    width: size.width,
    height: size.height,
    boldFont,
    regularFont,
    cursorY: size.height - 60,
    topMargin: 60,
    marginX: 60,
    accentColor: rgb(0.62, 0.0, 0.18),
    textColor: rgb(0.1, 0.1, 0.1),
  };

  const drawCentered = (text, font, fontSize, y, color) => {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: (context.width - textWidth) / 2,
      y,
      font,
      size: fontSize,
      color,
    });
  };

  drawCentered(title, boldFont, 22, context.cursorY, context.accentColor);
  context.cursorY -= 32;
  const dateText = `Data oferty: ${new Date().toLocaleDateString('pl-PL')}`;
  drawCentered(dateText, regularFont, 11, context.cursorY, context.textColor);
  context.cursorY -= 28;

  drawSectionTitle(context, 'Klient');
  drawRow(context, 'Nazwa / klient', customerName);
  drawRow(context, 'Adres inwestycji', investmentAddress.join(' | '));

  if (advisor && (advisor.name || advisor.email || advisor.phone)) {
    const advisorSummary = [
      advisor.name || '',
      advisor.phone || '',
      advisor.email || '',
    ]
      .filter(Boolean)
      .join(' | ');
    drawRow(context, 'Doradca', advisorSummary || '---');
  }

  sections.forEach((section) => {
    drawSectionTitle(context, section.title);
    section.rows.forEach((row) => {
      drawRow(context, row.label, row.value);
    });
  });

  if (financial?.rows?.length) {
    drawSectionTitle(context, 'Parametry finansowe');
    financial.rows.forEach((row) => {
      drawRow(context, row.label, row.value);
    });
  }

  if (financial?.summaryRows?.length) {
    drawSectionTitle(context, 'Podsumowanie cenowe');
    financial.summaryRows.forEach((row) => {
      drawRow(context, row.label, row.value);
    });
  }

  if (financial?.note) {
    drawRow(context, 'Informacja', financial.note);
  }

  if (price) {
    drawSectionTitle(context, 'Finanse');
    drawRow(context, 'Cena oferty', formatCurrency(price.amount));
    if (price.includesInstallation !== undefined) {
      drawRow(
        context,
        'Cena zawiera montaz',
        price.includesInstallation ? 'Tak' : 'Nie'
      );
    }
    if (price.notes) {
      drawRow(context, 'Uwagi cenowe', price.notes);
    }
  }

  drawNotes(context, notes);

  if (attachmentFile) {
    drawSectionTitle(context, 'Zalaczniki');
    drawRow(context, 'Plik', attachmentFile.name || 'Zalacznik');
  }

  const attachmentBytes = await readAttachmentBytes(attachmentFile);
  if (attachmentBytes) {
    try {
      const attachmentDoc = await PDFDocument.load(attachmentBytes);
      const copiedPages = await pdfDoc.copyPages(attachmentDoc, attachmentDoc.getPageIndices());
      copiedPages.forEach((copiedPage) => {
        pdfDoc.addPage(copiedPage);
      });
    } catch {
      // ignore non-PDF attachments, they remain referenced as nazwa pliku
    }
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
  });

}

