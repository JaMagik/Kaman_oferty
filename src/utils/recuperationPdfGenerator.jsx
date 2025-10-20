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
