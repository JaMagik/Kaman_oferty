// ścieżka: src/utils/pvPdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
// ZMIANA: Dodajemy import 'photovoltaicsBaseItems'
import { panelTypesData, inverterTypesData, storageTypesData, pvOfferCommons, photovoltaicsBaseItems } from '../data/tables/photovoltaicsData';

const wrapText = (text, textFont, textSize, maxWidth) => {
    if (typeof text !== 'string') text = String(text);
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0] || '';
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = textFont.widthOfTextAtSize(`${currentLine} ${word}`, textSize);
      if (width < maxWidth) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
};

async function drawStyledPhotovoltaicsTable(page, font, data, startY) {
  const { panelDetails, inverterDetails, storageDetails, installationType } = data;
  let currentY = startY;
  const tableX = 50;
  const defaultRowHeight = 25;
  const headerHeight = 30;
  const fontSize = 9.5;
  const headerFontSize = 10.5;
  const lineSpacingFactor = 1.4;

  const tableColumnWidths = [30, 355, 50, 55];
  const tableWidth = tableColumnWidths.reduce((a, b) => a + b, 0);

  const columnPositions = [tableX];
  for (let i = 0; i < tableColumnWidths.length - 1; i++) {
    columnPositions.push(columnPositions[i] + tableColumnWidths[i]);
  }
  const cellPadding = { top: 7, bottom: 7, left: 5, right: 5 };

  currentY -= headerHeight;
  page.drawRectangle({
    x: tableX, y: currentY, width: tableWidth, height: headerHeight,
    color: rgb(0.1, 0.1, 0.25),
  });

  const headerTextY = currentY + (headerHeight - headerFontSize) / 2 - 1;

  page.drawText('Lp.', { x: columnPositions[0] + cellPadding.left, y: headerTextY, font, size: headerFontSize, color: rgb(1, 1, 1) });
  page.drawText('Nazwa komponentu', { x: columnPositions[1] + cellPadding.left, y: headerTextY, font, size: headerFontSize, color: rgb(1, 1, 1) });
  page.drawText('Ilość', { x: columnPositions[2] + (tableColumnWidths[2] - font.widthOfTextAtSize('Ilość', headerFontSize)) / 2, y: headerTextY, font, size: headerFontSize, color: rgb(1, 1, 1) });
  page.drawText('J.m.', { x: columnPositions[3] + (tableColumnWidths[3] - font.widthOfTextAtSize('J.m.', headerFontSize)) / 2, y: headerTextY, font, size: headerFontSize, color: rgb(1, 1, 1) });

  // ZMIANA: Budowanie listy komponentów z użyciem importowanych danych
  const components = [];
  if (installationType !== 'only-storage' && panelDetails) {
    components.push({ name: panelDetails.name, quantity: panelDetails.count, unit: 'szt.' });
    if (inverterDetails) components.push({ name: inverterDetails.name, quantity: 1, unit: 'szt.' });
    // Używamy gotowej listy, zamiast wpisywać ręcznie
    components.push(...photovoltaicsBaseItems);
  }
  if (storageDetails) {
    components.push({ name: storageDetails.name, quantity: 1, unit: 'szt.' });
  }
  if (installationType === 'only-storage' && !storageDetails && components.length === 0) {
     components.push({ name: 'Magazyn energii (konfiguracja wg ustaleń)', quantity: 1, unit: 'kpl.' });
  }

  components.forEach((comp, index) => {
    const textLines = wrapText(comp.name, font, fontSize, tableColumnWidths[1] - (cellPadding.left + cellPadding.right));
    const dynamicRowHeight = Math.max(defaultRowHeight, textLines.length * (fontSize * lineSpacingFactor) + cellPadding.top + cellPadding.bottom);
    
    currentY -= dynamicRowHeight;
    if (currentY < 40) {
        page.addPage();
        currentY = page.getHeight() - headerHeight - 50;
    }

    if (index % 2 === 1) {
      page.drawRectangle({ x: tableX, y: currentY, width: tableWidth, height: dynamicRowHeight, color: rgb(0.94, 0.94, 0.96) });
    }

    const cellTextStartY = currentY + dynamicRowHeight - cellPadding.top - fontSize;

    page.drawText(String(index + 1), { x: columnPositions[0] + (tableColumnWidths[0] - font.widthOfTextAtSize(String(index + 1), fontSize)) / 2, y: cellTextStartY - (textLines.length > 1 ? (textLines.length-1) * fontSize * lineSpacingFactor / 2 : 0), font, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    
    let textYForWrapped = cellTextStartY;
    textLines.forEach(line => {
        page.drawText(line, { x: columnPositions[1] + cellPadding.left, y: textYForWrapped, font, size: fontSize, color: rgb(0.2, 0.2, 0.2), lineHeight: fontSize * lineSpacingFactor});
        textYForWrapped -= (fontSize * lineSpacingFactor);
    });

    page.drawText(String(comp.quantity), { x: columnPositions[2] + (tableColumnWidths[2] - font.widthOfTextAtSize(String(comp.quantity), fontSize)) / 2, y: cellTextStartY - (textLines.length > 1 ? (textLines.length-1) * fontSize * lineSpacingFactor / 2 : 0), font, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(comp.unit, { x: columnPositions[3] + (tableColumnWidths[3] - font.widthOfTextAtSize(comp.unit, fontSize)) / 2, y: cellTextStartY - (textLines.length > 1 ? (textLines.length-1) * fontSize * lineSpacingFactor / 2 : 0), font, size: fontSize, color: rgb(0.2, 0.2, 0.2) });
    
    page.drawLine({ start: { x: tableX, y: currentY }, end: { x: tableX + tableWidth, y: currentY }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  });

  for(let i=0; i <= tableColumnWidths.length; i++) {
    const x = (i === tableColumnWidths.length) ? (tableX + tableWidth) : columnPositions[i];
     page.drawLine({
          start: {x: x, y: currentY},
          end: {x: x, y: startY - headerHeight},
          thickness: 0.5,
          color: rgb(0.85, 0.85, 0.85)
      });
  }
   page.drawLine({
    start: { x: tableX, y: startY - headerHeight },
    end: { x: tableX + tableWidth, y: startY - headerHeight },
    thickness: 1,
    color: rgb(0.1, 0.1, 0.25),
});

  return currentY;
}

export async function generatePhotovoltaicsOfferPDF(formData) {
  const { userName, price, installationType, panelDetails, inverterDetails, storageDetails } = formData;

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const regularFontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then(res => res.arrayBuffer());
    const boldFontBytes = await fetch('/fonts/OpenSans-Bold.ttf').then(res => res.arrayBuffer());
    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);

    let coverPath = pvOfferCommons.coverPage;
    const pdfOrder = [
        ...(inverterDetails?.datasheets || []),
        ...(installationType !== 'only-storage' && panelDetails?.datasheets || []),
        ...(storageDetails?.datasheets || []),
        pvOfferCommons.contactPage,
    ].filter(Boolean);

    const loadedTemplatePDFs = [];
    for (const path of [coverPath, ...pdfOrder.filter(p => p !== coverPath && p !== pvOfferCommons.contactPage)]) {
        if (!path) continue;
        try {
            const pdfBytes = await fetch(path).then(res => {
            if (!res.ok) throw new Error(`Nie udało się wczytać szablonu PV: ${path} (status: ${res.status})`);
            return res.arrayBuffer();
            });
            loadedTemplatePDFs.push({path, doc: await PDFDocument.load(pdfBytes)});
        } catch (error) {
            console.error(`Błąd ładowania szablonu ${path}:`, error);
        }
    }

    let contactPageDoc = null;
    if (pvOfferCommons.contactPage) {
        try {
            const contactBytes = await fetch(pvOfferCommons.contactPage).then(res => res.arrayBuffer());
            contactPageDoc = await PDFDocument.load(contactBytes);
        } catch (error) {
            console.error(`Błąd ładowania strony kontaktowej:`, error);
        }
    }

    if (loadedTemplatePDFs.length > 0 && loadedTemplatePDFs[0].path === coverPath) {
      const coverTemplate = loadedTemplatePDFs.shift().doc;
      const [copiedCoverPage] = await pdfDoc.copyPages(coverTemplate, [0]);
      pdfDoc.addPage(copiedCoverPage);
    } else {
        console.warn("Nie udało się załadować lub zidentyfikować okładki.");
    }

    const offerPage = pdfDoc.addPage();
    const { width, height } = offerPage.getSize();
    const mainTitle = installationType === 'only-storage' ? "OFERTA NA MAGAZYN ENERGII" : "OFERTA INSTALACJI FOTOWOLTAICZNEJ";
    const titleY = height - 50;
    const lineHeightDetails = 20;
    const fontSizeDetails = 10.5;
    const fontSizeTitle = 17;
    const sectionSpacing = 25;
    
    let currentY = titleY;

    // --- POCZĄTEK: Logika czerwonego banera ---
    const introFontSize = 11;
    const introLineHeight = introFontSize * 1.5;
    const introText = "Dziękujemy za zainteresowanie ofertą firmy KAMAN. Każde urządzenie dobierane jest indywidualnie po szczegółowych ustaleniach technicznych.";
    const introTextLines = wrapText(introText, boldFont, introFontSize, width - 80);

    const verticalPadding = 15;
    const bannerHeight = (introTextLines.length * introLineHeight) + (2 * verticalPadding) - (introLineHeight - introFontSize) + 2;
    const bannerY = currentY - bannerHeight;

    offerPage.drawRectangle({
        x: 0,
        y: bannerY,
        width: width,
        height: bannerHeight,
        color: rgb(0.815, 0.008, 0.106),
    });

    const totalTextHeight = (introTextLines.length - 1) * introLineHeight + introFontSize;
    let textBlockY = bannerY + (bannerHeight - totalTextHeight) / 2 + totalTextHeight - introFontSize;

    introTextLines.forEach((line, index) => {
        const textWidth = boldFont.widthOfTextAtSize(line, introFontSize);
        offerPage.drawText(line, {
            x: (width - textWidth) / 2,
            y: textBlockY - (index * introLineHeight),
            size: introFontSize,
            font: boldFont,
            color: rgb(1, 1, 1),
        });
    });
    
    currentY = bannerY - 30;
    // --- KONIEC: Logika czerwonego banera ---

    offerPage.drawText(mainTitle, {
      x: 50, y: currentY, font: boldFont, size: fontSizeTitle, color: rgb(0.1, 0.1, 0.25),
    });
    currentY -= (fontSizeTitle * 1.1);

    offerPage.drawText(`DLA: ${userName.toUpperCase()}`, {
        x: 50, y: currentY, font: regularFont, size: fontSizeDetails, color: rgb(0.3, 0.3, 0.3),
    });
    currentY -= (lineHeightDetails * 1.5);

    if (installationType !== 'only-storage' && panelDetails) {
        offerPage.drawText(
            `Moc instalacji: ${panelDetails.totalPower.toFixed(2)} kWp (${panelDetails.count} x ${panelDetails.name})`, 
            { x: 50, y: currentY, font: regularFont, size: fontSizeDetails, color: rgb(0.2, 0.2, 0.2) }
        );
        currentY -= lineHeightDetails;
    }
    offerPage.drawText(
        `Typ instalacji: ${installationType === 'dach' ? 'Dachowa' : installationType === 'grunt' ? 'Gruntowa' : 'Tylko magazyn energii'}`, 
        { x: 50, y: currentY, font: regularFont, size: fontSizeDetails, color: rgb(0.2, 0.2, 0.2) }
    );
    currentY -= lineHeightDetails;

    if (inverterDetails) {
        offerPage.drawText(`Falownik: ${inverterDetails.name}`, {
            x: 50, y: currentY, font: regularFont, size: fontSizeDetails, color: rgb(0.2, 0.2, 0.2)
        });
        currentY -= lineHeightDetails;
    }
    if (storageDetails) {
        offerPage.drawText(`Magazyn energii: ${storageDetails.name}`, {
            x: 50, y: currentY, font: regularFont, size: fontSizeDetails, color: rgb(0.2, 0.2, 0.2)
        });
        currentY -= lineHeightDetails;
    }
    currentY -= sectionSpacing * 0.8;

    let lastYPosAfterTable = await drawStyledPhotovoltaicsTable(offerPage, regularFont, formData, currentY);
    
    const priceText = `CENA KOŃCOWA: ${price} PLN brutto (VAT 8%)`;
    const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 14);
    offerPage.drawText(priceText, { 
      x: width - priceTextWidth - 50,
      y: lastYPosAfterTable - 40, 
      font: boldFont, 
      size: 14, 
      color: rgb(0.6, 0, 0.15), 
    });
    offerPage.drawText(`Oferta ważna 14 dni.`, {
        x: 50, y: lastYPosAfterTable - 40,
        font: regularFont, size: 9, color: rgb(0.4, 0.4, 0.4)
    });

    for (const template of loadedTemplatePDFs) {
      const pageIndices = template.doc.getPageIndices();
      for (const pageIndex of pageIndices) {
        const [copiedPage] = await pdfDoc.copyPages(template.doc, [pageIndex]);
        pdfDoc.addPage(copiedPage);
      }
    }
    
    if (contactPageDoc) {
        const [copiedContactPage] = await pdfDoc.copyPages(contactPageDoc, [0]);
        pdfDoc.addPage(copiedContactPage);
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania PDF dla fotowoltaiki:', error);
    alert(`Wystąpił błąd podczas generowania oferty PV: ${error.message}. Sprawdź konsolę.`);
    return null;
  }
}