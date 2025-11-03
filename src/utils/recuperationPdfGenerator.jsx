// src/utils/recuperationPdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { drawTable, drawHeaderBlock } from './pdfUtils';
import {
  recuperationDevices,
  recuperationVariants,
  recuperationItemsById,
  recuperationMainItems,
  recuperationStages,
  recuperationItemStageMap,
} from '../data/tables/recuperationData';
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets';

const buildRowsForIds = (ids, selectedDevice) =>
  ids
    .map((id) => {
      const item = recuperationItemsById[id];
      if (!item) return null;

      let name = item.name;
      let description = item.description;

      const isDeviceRow = ['1', 'SAM-1', 'ETAP2-1'].includes(id);

      if (isDeviceRow && selectedDevice) {
        name = `${item.name} (${selectedDevice.name})`;
        description = selectedDevice.description || item.description;
      }

      return ['', name, description, item.unit, item.quantity];
    })
    .filter(Boolean);

const getMainTableConfig = (rowCount) => {
  const base = {
    columnWidths: [30, 205, 230, 42, 48],
    headerHeight: 27,
    padding: { top: 10, bottom: 10, left: 6, right: 6 },
    headerFontSize: 9.6,
    contentFontSize: 8.2,
    descriptionFontSize: 7.5,
    lineHeightMultiplier: 1.26,
    pageMargins: { top: 30, bottom: 34 },
  };

  if (rowCount > 22) {
    return {
      ...base,
      contentFontSize: 7.8,
      descriptionFontSize: 7.1,
      lineHeightMultiplier: 1.12,
      padding: { ...base.padding, top: 6, bottom: 6 },
      headerHeight: 24,
      pageMargins: { top: 24, bottom: 30 },
    };
  }

  if (rowCount > 18) {
    return {
      ...base,
      contentFontSize: 8,
      descriptionFontSize: 7.3,
      lineHeightMultiplier: 1.16,
      padding: { ...base.padding, top: 8, bottom: 8 },
      headerHeight: 25,
      pageMargins: { top: 26, bottom: 32 },
    };
  }

  return base;
};

const isPdfBuffer = (buffer) => {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 5) {
    return false;
  }
  const headerView = new Uint8Array(buffer.slice(0, 5));
  const headerString = String.fromCharCode(...headerView);
  return headerString === '%PDF-';
};

const wrapText = (font, text, size, maxWidth) => {
  const normalized = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return [''];
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

const OPTIONS_ACCENT_COLOR = rgb(0.62, 0.0, 0.18);
const INFO_SEPARATOR_COLOR = rgb(0.82, 0.82, 0.82);
const INFO_LABEL_COLOR = rgb(0.15, 0.15, 0.15);

const formatAddressLines = (address = {}) => {
  const street = String(address.street ?? '').trim();
  const town = String(address.town ?? '').trim();
  const postalCode = String(address.postalCode ?? '').trim();
  const city = String(address.city ?? '').trim();

  const lines = [];
  if (town) {
    lines.push(town);
  }
  if (street) {
    lines.push(street);
  }
  const postalCity = [postalCode, city].filter(Boolean).join(' ');
  if (postalCity) {
    lines.push(postalCity);
  }

  return lines.length ? lines : ['---'];
};

const drawInfoColumn = (page, fonts, entries, startX, startY, columnWidth) => {
  let cursorY = startY;
  const labelSize = 9.5;
  const valueSize = 8.4;
  const labelSpacing = 10;
  const valueLineHeight = 10.6;

  entries.forEach((entry, index) => {
    const label = entry.label || '';
    const lines = Array.isArray(entry.lines) && entry.lines.length > 0 ? entry.lines : ['---'];

    page.drawText(label, {
      x: startX,
      y: cursorY,
      font: fonts.bold,
      size: labelSize,
      color: INFO_LABEL_COLOR,
    });
    cursorY -= labelSpacing;

    lines.forEach((line) => {
      const sanitized = String(line ?? '').trim() || '---';
      const wrappedLines = wrapText(fonts.regular, sanitized, valueSize, columnWidth - 4);
      wrappedLines.forEach((wrapped) => {
        page.drawText(wrapped, {
          x: startX,
          y: cursorY,
          font: fonts.regular,
          size: valueSize,
          color: rgb(0.22, 0.22, 0.22),
        });
        cursorY -= valueLineHeight;
      });
    });

    if (index < entries.length - 1) {
      cursorY -= 3;
      page.drawLine({
        start: { x: startX, y: cursorY + 5.5 },
        end: { x: startX + columnWidth, y: cursorY + 5.5 },
        thickness: 0.55,
        color: INFO_SEPARATOR_COLOR,
      });
      cursorY -= 5;
    }
  });

  return cursorY;
};

const drawSummaryInfoBlock = (page, fonts, { leftEntries, rightEntries, startY, marginX = 48, columnGap = 16 }) => {
  const { width } = page.getSize();
  const columnWidth = (width - marginX * 2 - columnGap) / 2;
  const leftStartX = marginX;
  const rightStartX = marginX + columnWidth + columnGap;

  const leftBottom = drawInfoColumn(page, fonts, leftEntries, leftStartX, startY, columnWidth);
  const rightBottom = drawInfoColumn(page, fonts, rightEntries, rightStartX, startY, columnWidth);

  const separatorTop = startY + 6;
  const separatorBottom = Math.min(leftBottom, rightBottom) - 4;
  const separatorX = marginX + columnWidth + columnGap / 2;

  page.drawLine({
    start: { x: separatorX, y: separatorTop },
    end: { x: separatorX, y: separatorBottom },
    thickness: 0.55,
    color: INFO_SEPARATOR_COLOR,
  });

  return Math.min(leftBottom, rightBottom);
};

const drawOptionsPricingSection = ({
  pdfDoc,
  startPage,
  fonts,
  startY,
  title,
  rows,
  introText,
  note,
  footer,
}) => {
  const config = {
    marginX: 32,
    marginTop: 54,
    marginBottom: 54,
    headerHeight: 22,
    paddingX: 12,
    paddingY: 9,
    fontSize: 9,
    lineHeight: 14,
    headerBgColor: OPTIONS_ACCENT_COLOR,
    headerFontColor: rgb(1, 1, 1),
    rowOddColor: rgb(1, 1, 1),
    rowEvenColor: rgb(0.94, 0.97, 1),
    borderColor: rgb(0.78, 0.86, 0.94),
    titleColor: OPTIONS_ACCENT_COLOR,
  };

  let page = startPage;
  let cursorY = startY;
  const { width, height } = page.getSize();
  const columnWidths = [
    Math.max(width - config.marginX * 2 - 160, 220),
    50,
    110,
  ];
  const tableWidth = columnWidths.reduce((sum, value) => sum + value, 0);
  const tableStartX = config.marginX;

  const ensureSpace = (required) => {
    if (cursorY - required < config.marginBottom) {
      page = pdfDoc.addPage();
      cursorY = page.getSize().height - config.marginTop;
    }
  };

  ensureSpace(60);

  if (title) {
    page.drawText(title, {
      x: tableStartX,
      y: cursorY,
      font: fonts.bold,
      size: 11,
      color: config.titleColor,
    });
    cursorY -= 18;
  }

  if (introText) {
    const introLines = wrapText(fonts.regular, introText, 9, tableWidth);
    introLines.forEach((line) => {
      ensureSpace(config.lineHeight + 10);
      page.drawText(line, {
        x: tableStartX,
        y: cursorY,
        font: fonts.regular,
        size: 9,
        color: rgb(0.2, 0.2, 0.2),
      });
      cursorY -= config.lineHeight;
    });
    cursorY -= 6;
  }

  const drawHeader = () => {
    ensureSpace(config.headerHeight + 10);
    const headerTop = cursorY;
    page.drawRectangle({
      x: tableStartX,
      y: headerTop - config.headerHeight,
      width: tableWidth,
      height: config.headerHeight,
      color: config.headerBgColor,
    });

    const headers = ['Nazwa', 'szt.', 'Netto'];
    headers.forEach((header, index) => {
      const columnWidth = columnWidths[index];
      const textWidth = fonts.bold.widthOfTextAtSize(
        header,
        config.fontSize
      );
      const headerX =
        tableStartX +
        columnWidths.slice(0, index).reduce((sum, value) => sum + value, 0) +
        config.paddingX;
      page.drawText(header, {
        x: headerX,
        y: headerTop - config.headerHeight + (config.headerHeight - config.fontSize) / 2,
        font: fonts.bold,
        size: config.fontSize,
        color: config.headerFontColor,
      });
    });

    cursorY = headerTop - config.headerHeight;
  };

  drawHeader();

  rows.forEach((row, index) => {
    const name = row.name || '';
    const quantity = row.quantity || '';
    const price = row.price || '';

    const nameLines = wrapText(
      fonts.regular,
      name,
      config.fontSize,
      columnWidths[0] - config.paddingX * 2
    );
    const rowHeight =
      config.paddingY * 2 +
      Math.max(nameLines.length, 1) * config.lineHeight;

    ensureSpace(rowHeight + 10);

    const rowTop = cursorY;

    page.drawRectangle({
      x: tableStartX,
      y: rowTop - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: index % 2 === 0 ? config.rowEvenColor : config.rowOddColor,
    });

    const drawCell = (textLines, columnIndex, align = 'left') => {
      const columnStart =
        tableStartX +
        columnWidths.slice(0, columnIndex).reduce((sum, value) => sum + value, 0);
      let textY = rowTop - config.paddingY - config.fontSize;

      textLines.forEach((line) => {
        let textX = columnStart + config.paddingX;
        if (align === 'center') {
          const textWidth = fonts.regular.widthOfTextAtSize(
            line,
            config.fontSize
          );
          textX =
            columnStart +
            (columnWidths[columnIndex] - textWidth) / 2;
        } else if (align === 'right') {
          const textWidth = fonts.regular.widthOfTextAtSize(
            line,
            config.fontSize
          );
          textX =
            columnStart +
            columnWidths[columnIndex] -
            config.paddingX -
            textWidth;
        }

        page.drawText(line, {
          x: textX,
          y: textY,
          font: fonts.regular,
          size: config.fontSize,
          color: rgb(0.18, 0.18, 0.18),
        });
        textY -= config.lineHeight;
      });
    };

    drawCell(nameLines, 0, 'left');
    drawCell([String(quantity)], 1, 'center');
    drawCell([price], 2, 'right');

    cursorY = rowTop - rowHeight;

    page.drawLine({
      start: { x: tableStartX, y: cursorY },
      end: { x: tableStartX + tableWidth, y: cursorY },
      thickness: 0.5,
      color: config.borderColor,
    });
  });

  cursorY -= 12;

  if (note) {
    const noteLines = wrapText(
      fonts.regular,
      note,
      8.5,
      tableWidth
    );
    noteLines.forEach((line) => {
      ensureSpace(config.lineHeight + 6);
      page.drawText(line, {
        x: tableStartX,
        y: cursorY,
        font: fonts.regular,
        size: 8.5,
        color: rgb(0.25, 0.25, 0.25),
      });
      cursorY -= config.lineHeight;
    });
    cursorY -= 6;
  }

  if (footer) {
    const footerLines = wrapText(
      fonts.bold,
      footer,
      8.5,
      tableWidth
    );
    footerLines.forEach((line) => {
      ensureSpace(config.lineHeight + 6);
      page.drawText(line, {
        x: tableStartX,
        y: cursorY,
        font: fonts.bold,
        size: 8.5,
        color: rgb(0.25, 0.25, 0.25),
      });
      cursorY -= config.lineHeight;
    });
    cursorY -= 6;
  }

  return { finalPage: page, finalY: cursorY };
};

export async function generateRecuperationOfferPDF(formData) {
  const {
    userName,
    price,
    isNetto,
    showPrice,
    deviceKey,
    variantKey,
    mainItemIds = [],
    includeAquaClear,
    isEnthalpyVariant = false,
    investmentAddress = {},
    advisorInfo = {},
  } = formData;

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const regularFontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then(
      (res) => res.arrayBuffer()
    );
    const boldFontBytes = await fetch('/fonts/OpenSans-Bold.ttf').then((res) =>
      res.arrayBuffer()
    );
    const kamanLogoBytes = await fetch('/logos/kaman_logo.png')
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .catch(() => null);

    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    let kamanLogoImage = null;
    if (kamanLogoBytes) {
      kamanLogoImage = await pdfDoc.embedPng(kamanLogoBytes);
    }

    const templatePaths = getTemplatePathsForDevice(deviceKey) || [];
    const templateFetchResults = await Promise.all(
      templatePaths.map(async (path) => {
        try {
          const response = await fetch(path);
          if (!response.ok) {
            console.warn(`[recuperationPDF] Nie znaleziono szablonu: ${path} (status ${response.status})`);
            return null;
          }
          const buffer = await response.arrayBuffer();
          if (!isPdfBuffer(buffer)) {
            console.warn(`[recuperationPDF] Pominieto plik, poniewaz nie jest PDF: ${path}`);
            return null;
          }
          return { path, buffer };
        } catch (error) {
          console.warn(`[recuperationPDF] Blad podczas pobierania szablonu ${path}:`, error);
          return null;
        }
      })
    );
    const templatePdfEntries = templateFetchResults.filter(Boolean);

    if (templatePdfEntries.length > 0) {
      const coverEntry = templatePdfEntries.shift();
      if (coverEntry) {
        const coverDoc = await PDFDocument.load(coverEntry.buffer);
        const [copiedCoverPage] = await pdfDoc.copyPages(coverDoc, [0]);
        pdfDoc.addPage(copiedCoverPage);
      }
    }

    const offerPage = pdfDoc.addPage();
    let lastContentPage = offerPage;
    const { width, height } = offerPage.getSize();
    let currentY = height - 55;

    const offerDetails = [
      { type: 'title', value: 'OFERTA NA SYSTEM REKUPERACJI' },
    ];

    currentY = drawHeaderBlock(
      offerPage,
      { regular: regularFont, bold: boldFont },
      kamanLogoImage,
      offerDetails,
      currentY
    );

    currentY -= 14;

    const leftEntries = [
      { label: 'Oferta dla', lines: [userName || '---'] },
      { label: 'Adres inwestycji', lines: formatAddressLines(investmentAddress) },
      { label: 'Waznosc oferty', lines: ['14 dni'] },
    ];

    const advisorName = advisorInfo?.label || advisorInfo?.name || '---';
    const advisorPhone = advisorInfo?.phone || '---';
    const advisorEmail = advisorInfo?.email || '---';

    const rightEntries = [
      { label: 'Oferte sporzadzil', lines: [advisorName || '---'] },
      { label: 'Telefon', lines: [advisorPhone || '---'] },
      { label: 'Email', lines: [advisorEmail || '---'] },
    ];

    currentY = drawSummaryInfoBlock(offerPage, { regular: regularFont, bold: boldFont }, {
      leftEntries,
      rightEntries,
      startY: currentY,
    }) - 10;

    const selectedDevice = recuperationDevices[deviceKey];
    const deviceForOutput = selectedDevice
      ? {
          ...selectedDevice,
          name: `${selectedDevice.name}${isEnthalpyVariant ? ' entalpiczny' : ''}`,
        }
      : undefined;
    const variant = recuperationVariants[variantKey];
    const fallbackIds =
      variant?.itemIds || recuperationMainItems.map((item) => item.id);

    let effectiveMainIds =
      mainItemIds && mainItemIds.length > 0 ? [...mainItemIds] : [...fallbackIds];

    if (includeAquaClear) {
      if (!effectiveMainIds.includes('21')) {
        effectiveMainIds.push('21');
      }
    } else {
      effectiveMainIds = effectiveMainIds.filter((id) => id !== '21');
    }

    const variantSections =
      Array.isArray(variant?.sections) && variant.sections.length > 0
        ? variant.sections
        : [{ stageKey: 'samRekuperator', title: variant?.label || 'Zakres prac i komponenty systemu' }];

    const assignedIds = new Set();
    const sectionsToRender = [];

    for (const section of variantSections) {
      if (!section || !section.stageKey) {
        continue;
      }

      const stageIds = effectiveMainIds.filter((id) => {
        if (assignedIds.has(id)) {
          return false;
        }
        return recuperationItemStageMap[id] === section.stageKey;
      });

      if (stageIds.length === 0) {
        continue;
      }

      stageIds.forEach((id) => assignedIds.add(id));
      sectionsToRender.push({
        title:
          section.title ||
          recuperationStages[section.stageKey]?.label ||
          'Zakres prac i komponenty systemu',
        ids: stageIds,
      });
    }

    const remainingIds = effectiveMainIds.filter((id) => !assignedIds.has(id));
    if (remainingIds.length > 0) {
      if (sectionsToRender.length === 0) {
        sectionsToRender.push({
          title: variant?.label || 'Zakres prac i komponenty systemu',
          ids: remainingIds,
        });
      } else {
        const lastSection = sectionsToRender[sectionsToRender.length - 1];
        lastSection.ids = [...lastSection.ids, ...remainingIds];
      }
    }

    if (sectionsToRender.length === 0) {
      sectionsToRender.push({
        title: variant?.label || 'Zakres prac i komponenty systemu',
        ids: [...effectiveMainIds],
      });
    }

    const tableStartPage = offerPage;
    const tableStartY = currentY - 15;

    let tableResult = null;
    let finalY = tableStartY;

    for (const section of sectionsToRender) {
      const rows = buildRowsForIds(section.ids, deviceForOutput).map(
        (row, rowIndex) => {
          const newRow = [...row];
          newRow[0] = String(rowIndex + 1);
          return newRow;
        }
      );

      if (rows.length === 0) {
        continue;
      }

      const tableConfig = getMainTableConfig(rows.length);
      const startPage =
        tableResult === null ? tableStartPage : pdfDoc.addPage();
      const startY =
        tableResult === null
          ? tableStartY
          : startPage.getSize().height - tableConfig.pageMargins.top;

      tableResult = await drawTable(
        pdfDoc,
        startPage,
        { regular: regularFont, bold: boldFont },
        rows,
        startY,
        section.title,
        tableConfig
      );
    }

    if (tableResult) {
      lastContentPage = tableResult.finalPage;
      finalY = tableResult.finalY;
    } else {
      lastContentPage = tableStartPage;
      finalY = tableStartY;
    }

    const isDrafton =
      typeof deviceKey === 'string' &&
      deviceKey.toLowerCase().includes('drafton');

    if (showPrice) {
      let pricePage = lastContentPage;
      let priceY = finalY - 30;

      if (priceY < 120) {
        pricePage = pdfDoc.addPage();
        priceY = pricePage.getSize().height - 140;
      }

      const pageSize = pricePage.getSize();
      const priceSuffix = isNetto ? 'PLN netto' : 'PLN brutto';
      const priceText = `CENA KOŃCOWA: ${price} ${priceSuffix}`;
      const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 16);
      pricePage.drawText(priceText, {
        x: (pageSize.width - priceTextWidth) / 2,
        y: priceY,
        font: boldFont,
        size: 16,
        color: rgb(0.6, 0, 0.15),
      });
      lastContentPage = pricePage;
      finalY = priceY - 40;
    }

    if (isDrafton) {
      const draftOptionsPage = pdfDoc.addPage();
      const draftOptionsResult = drawOptionsPricingSection({
        pdfDoc,
        startPage: draftOptionsPage,
        fonts: { regular: regularFont, bold: boldFont },
        startY: draftOptionsPage.getSize().height - 80,
        title: 'Opcje do Draftona - sterowanie bezprzewodowe',
        introText:
          'Opcjonalne sterowanie bezprzewodowe dla central DRAFTON Professional:',
        rows: [
          {
            name: 'Radiowy odbiornik USB Drafton PRO',
            quantity: '1',
            price: '250 PLN',
          },
          {
            name: 'Radiowy panel sterujący Drafton PRO',
            quantity: '1',
            price: '580 PLN',
          },
          {
            name: 'Radiowy panel sterujący z czujnikiem CO2 Drafton PRO',
            quantity: '1',
            price: '1 390 PLN',
          },
          {
            name:
              'Radiowy panel sterujący z czujnikiem RH (wilgotności) Drafton PRO',
            quantity: '1',
            price: '680 PLN',
          },
          {
            name: 'Radiowy czujnik CO2 Drafton PRO',
            quantity: '1',
            price: '1 290 PLN',
          },
          {
            name: 'Radiowy czujnik RH (wilgotności) Drafton PRO',
            quantity: '1',
            price: '580 PLN',
          },
        ],
      });

      lastContentPage = draftOptionsResult.finalPage;
      finalY = draftOptionsResult.finalY;
    }
    for (const entry of templatePdfEntries) {
      const templateDoc = await PDFDocument.load(entry.buffer);
      const copiedPages = await pdfDoc.copyPages(
        templateDoc,
        templateDoc.getPageIndices()
      );
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const finalPdfBytes = await pdfDoc.save();
    return new Blob([finalPdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Błąd podczas generowania oferty na rekuperację:', error);
    alert(`Wystąpił błąd: ${error.message}.`);
    return null;
  }
}

