// src/utils/recuperationPdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { drawTable, drawHeaderBlock } from './pdfUtils';
import {
  recuperationDevices,
  recuperationVariants,
  recuperationItemsById,
  recuperationMainItems,
  DRILLING_ITEM_ID,
} from '../data/tables/recuperationData';
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets';

const buildRowsForIds = (ids, selectedDevice) =>
  ids
    .map((id) => {
      const item = recuperationItemsById[id];
      if (!item) return null;

      let name = item.name;
      let description = item.description;

      if (id === '1' && selectedDevice) {
        name = `${item.name} (${selectedDevice.name})`;
        description = selectedDevice.description || item.description;
      }

      return ['', name, description, item.unit, item.quantity];
    })
    .filter(Boolean);

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
    marginX: 60,
    marginTop: 60,
    marginBottom: 60,
    headerHeight: 22,
    paddingX: 10,
    paddingY: 6,
    fontSize: 9,
    lineHeight: 14,
    headerBgColor: rgb(0.04, 0.33, 0.58),
    headerFontColor: rgb(1, 1, 1),
    rowOddColor: rgb(1, 1, 1),
    rowEvenColor: rgb(0.94, 0.97, 1),
    borderColor: rgb(0.78, 0.86, 0.94),
    titleColor: rgb(0.04, 0.33, 0.58),
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
    offerMode,
    deviceKey,
    surfaceArea,
    variantKey,
    variantLabel,
    mainItemIds = [],
    addonItemIds = [],
    drillingMode,
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
      { label: 'Klient:', value: userName.toUpperCase() },
      { label: 'Zakres oferty:', value: variantLabel },
    ];

    if (offerMode === 'dobor') {
      offerDetails.push({
        label: 'Powierzchnia domu:',
        value: `${surfaceArea} m²`,
      });
    }

    const drillingDetail =
      drillingMode === 'addon'
        ? 'wiercenie jako opcja dodatkowa'
        : 'wiercenie w zakresie podstawowym';

    if (
      (mainItemIds && mainItemIds.includes(DRILLING_ITEM_ID)) ||
      (addonItemIds && addonItemIds.includes(DRILLING_ITEM_ID))
    ) {
      offerDetails.push({
        label: 'Wiercenie koroną:',
        value: drillingDetail,
      });
    }

    currentY = drawHeaderBlock(
      offerPage,
      { regular: regularFont, bold: boldFont },
      kamanLogoImage,
      offerDetails,
      currentY
    );

    const selectedDevice = recuperationDevices[deviceKey];
    const variant = recuperationVariants[variantKey];
    const fallbackIds =
      variant?.itemIds || recuperationMainItems.map((item) => item.id);

    const effectiveMainIds =
      mainItemIds && mainItemIds.length > 0 ? mainItemIds : fallbackIds;

    let mainTableData = buildRowsForIds(effectiveMainIds, selectedDevice).map(
      (row, index) => {
        const newRow = [...row];
        newRow[0] = String(index + 1);
        return newRow;
      }
    );

    currentY -= 15;

    const tableResult = await drawTable(
      pdfDoc,
      offerPage,
      { regular: regularFont, bold: boldFont },
      mainTableData,
      currentY,
      'Zakres prac i komponenty systemu'
    );

    lastContentPage = tableResult.finalPage;
    let finalY = tableResult.finalY;

    const isDrafton =
      typeof deviceKey === 'string' && deviceKey.startsWith('DRAFTON_PRO');

    if (isDrafton) {
      const optionsResult = drawOptionsPricingSection({
        pdfDoc,
        startPage: lastContentPage,
        fonts: { regular: regularFont, bold: boldFont },
        startY: finalY - 30,
        title: 'Opcje dodatkowe',
        rows: [
          {
            name: 'System antysmogowy ALPHAclear',
            quantity: '1',
            price: '6 337 PLN',
          },
          {
            name: 'Wkład węglowy dla ALPHAclear do redukcji zapachów (opcja)',
            quantity: '1',
            price: '357 PLN',
          },
          {
            name: 'Podstawa dla central AERISnext/DRAFTON Professional (*)',
            quantity: '1',
            price: '730 PLN',
          },
        ],
        note:
          'W przypadku montażu centrali na uchwytach ściennych cena za podstawę pomiń.',
        footer: 'Wszystkie podane ceny są cenami katalogowymi netto.',
      });

      lastContentPage = optionsResult.finalPage;
      finalY = optionsResult.finalY;

      const wirelessResult = drawOptionsPricingSection({
        pdfDoc,
        startPage: lastContentPage,
        fonts: { regular: regularFont, bold: boldFont },
        startY: finalY - 20,
        title: 'Opcje do Draftona – sterowanie bezprzewodowe',
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
            name: 'Radiowy panel sterujący z czujnikiem CO₂ Drafton PRO',
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
            name: 'Radiowy czujnik CO₂ Drafton PRO',
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

      lastContentPage = wirelessResult.finalPage;
      finalY = wirelessResult.finalY;
    }

    if (addonItemIds && addonItemIds.length > 0) {
      const optionalRows = buildRowsForIds(addonItemIds, selectedDevice).map(
        (row, index) => {
          const newRow = [...row];
          newRow[0] = String(index + 1);
          return newRow;
        }
      );

      let optionalPage = lastContentPage;
      let optionalStartY = finalY - 40;

      if (optionalStartY < 120) {
        optionalPage = pdfDoc.addPage();
        optionalStartY = optionalPage.getSize().height - 80;
      }

      const optionalResult = await drawTable(
        pdfDoc,
        optionalPage,
        { regular: regularFont, bold: boldFont },
        optionalRows,
        optionalStartY,
        'Opcje dodatkowe'
      );

      lastContentPage = optionalResult.finalPage;
      finalY = optionalResult.finalY;
    }

    if (showPrice) {
      let pricePage = lastContentPage;
      let priceY = finalY - 40;

      if (priceY < 80) {
        pricePage = pdfDoc.addPage();
        priceY = pricePage.getSize().height - 100;
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
