// Pełna, poprawiona zawartość pliku: src/utils/recuperationPdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { drawTable, drawHeaderBlock } from './pdfUtils';
import {
    recuperationDevices,
    installationSystems,
    otherElements,
    recuperationBaseScope
} from '../data/tables/recuperationData';
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets';

export async function generateRecuperationOfferPDF(formData) {
  const { userName, price, isNetto, showPrice, offerMode, deviceKey, surfaceArea, installationSystemKey, otherElementsKey } = formData;

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // --- Krok 1: Wczytanie wszystkich potrzebnych zasobów ---
    const regularFontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then(res => res.arrayBuffer());
    const boldFontBytes = await fetch('/fonts/OpenSans-Bold.ttf').then(res => res.arrayBuffer());
    const kamanLogoBytes = await fetch('/logos/kaman_logo.png').then(res => res.ok ? res.arrayBuffer() : null).catch(() => null);

    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    let kamanLogoImage = null;
    if (kamanLogoBytes) kamanLogoImage = await pdfDoc.embedPng(kamanLogoBytes);

    // Pobranie ścieżek do szablonów
    const templatePaths = getTemplatePathsForDevice(deviceKey) || [];
    const templatePromises = templatePaths.map(path =>
      fetch(path).then(res => res.ok ? res.arrayBuffer() : null).catch(() => null)
    );
    const templatePdfBytesArray = (await Promise.all(templatePromises)).filter(Boolean);

    // --- Krok 2: Składanie dokumentu we właściwej kolejności ---

    // 2a. Dodanie dedykowanej okładki (jeśli istnieje w szablonie, zakładamy że jest pierwsza)
    if (templatePdfBytesArray.length > 0) {
      const coverPdfBytes = templatePdfBytesArray.shift(); // Pobierz i usuń pierwszy element (okładkę)
      if (coverPdfBytes) {
          const coverDoc = await PDFDocument.load(coverPdfBytes);
          const [copiedCoverPage] = await pdfDoc.copyPages(coverDoc, [0]);
          pdfDoc.addPage(copiedCoverPage);
      }
    }

    // 2b. Stworzenie i dodanie dynamicznej strony z ofertą
    const offerPage = pdfDoc.addPage();
    let lastContentPage = offerPage;
    const { width, height } = offerPage.getSize();
    let currentY = height - 55;

    const offerDetails = [
      { type: 'title', value: 'OFERTA NA SYSTEM REKUPERACJI' },
      { label: 'Klient:', value: userName.toUpperCase() },
    ];
    if (offerMode === 'dobor') {
      offerDetails.push({ label: 'Powierzchnia domu:', value: `${surfaceArea} m²` });
    }

    currentY = drawHeaderBlock(offerPage, { regular: regularFont, bold: boldFont }, kamanLogoImage, offerDetails, currentY);

    let mainTableData = [];
    const selectedDevice = recuperationDevices[deviceKey];
    const selectedSystem = installationSystems[installationSystemKey];
    const selectedOther = otherElements[otherElementsKey];

    if (selectedDevice) mainTableData.push(['', selectedDevice.name, selectedDevice.description, 'szt.', '1']);
    if (selectedSystem) mainTableData.push(['', selectedSystem.name, selectedSystem.description, 'kpl.', '1']);
    if (selectedOther) mainTableData.push(['', selectedOther.name, selectedOther.description, 'kpl.', '1']);
    mainTableData.push(...recuperationBaseScope);
    
    mainTableData = mainTableData.map((row, index) => {
      const newRow = [...row];
      newRow[0] = String(index + 1);
      return newRow;
    });

    currentY -= 15;
    const tableResult = await drawTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, mainTableData, currentY, "Zakres prac i komponenty systemu");
    lastContentPage = tableResult.finalPage;

    // 2c. Dodanie ceny na ostatniej stronie z treścią
    if (showPrice) {
        let priceY = tableResult.finalY - 40;
        if (priceY < 80) {
            lastContentPage = pdfDoc.addPage();
            priceY = height - 100;
        }
        const priceSuffix = isNetto ? 'PLN netto' : 'PLN brutto';
        const priceText = `CENA KOŃCOWA: ${price} ${priceSuffix}`;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 16);
        lastContentPage.drawText(priceText, {
            x: (width - priceTextWidth) / 2, y: priceY, font: boldFont,
            size: 16, color: rgb(0.6, 0, 0.15)
        });
    }

    // 2d. Dodanie pozostałych stron z szablonów (karty katalogowe, info o firmie, kontakt)
    for (const pdfBytes of templatePdfBytesArray) {
      const templateDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await pdfDoc.copyPages(templateDoc, templateDoc.getPageIndices());
      copiedPages.forEach(page => pdfDoc.addPage(page));
    }

    // --- Krok 3: Zapis i zwrot gotowego pliku ---
    const finalPdfBytes = await pdfDoc.save();
    return new Blob([finalPdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania oferty na rekuperację:', error);
    alert(`Wystąpił błąd: ${error.message}.`);
    return null;
  }
}