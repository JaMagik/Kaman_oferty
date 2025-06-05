// ścieżka: src/utils/pdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getTableData } from '../data/tables';
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets';

// Funkcja pomocnicza do rysowania tabeli ze zmniejszonymi odstępami i czcionkami
function drawTable(pdfDoc, initialPage, font, tableData) {
  let currentPage = initialPage;
  const startY = 750;
  let currentY = startY;

  const table = {
    x: 50,
    columnWidths: [28, 362, 50, 50], // Dopasuj szerokości Lp., Nazwa, J.m., Ilość
    headerHeight: 24, // Zmniejszono
    padding: { top: 5, bottom: 5, left: 5, right: 5 }, // Zmniejszono paddingi
  };

  const headerFontSize = 11; // Zmniejszono
  const nameFontSize = 9;    // Zmniejszono
  const descriptionFontSize = 7.5; // Zmniejszono
  const quantityUnitFontSize = 9; // Zmniejszono

  const nameLineHeight = nameFontSize * 1.25; // Zmniejszono mnożnik
  const descriptionLineHeight = descriptionFontSize * 1.2; // Zmniejszono mnożnik
  const spacingAfterName = 2; // Zmniejszono

  const nameColor = rgb(0.1, 0.1, 0.1);
  const descriptionColor = rgb(0.3, 0.3, 0.3);
  const quantityUnitColor = rgb(0.1, 0.1, 0.1);
  const headerColor = rgb(1, 1, 1);
  const headerBgColor = rgb(0.6, 0, 0.15);
  const evenRowBgColor = rgb(0.98, 0.96, 0.96);
  const lineColor = rgb(0.8, 0.8, 0.8);
  const pageTopMargin = 40; // Zmniejszono margines górny dla nowych stron tabeli
  const pageBottomMargin = 40; // Zmniejszono margines dolny

  const columnPositions = [table.x];
  for (let i = 0; i < table.columnWidths.length - 1; i++) {
    columnPositions.push(columnPositions[i] + table.columnWidths[i]);
  }
  const tableWidth = table.columnWidths.reduce((a, b) => a + b, 0);

  const wrapText = (text, textFont, textSize, maxWidth) => {
    if (typeof text !== 'string') { text = String(text); }
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

  let tableSegmentStartY = startY;

  const drawHeader = (targetPage, yPosition) => {
    const headerTextY = yPosition + (table.headerHeight - headerFontSize) / 2 + 1.5; // Dostosowanie pionowe
    targetPage.drawRectangle({
      x: table.x, y: yPosition, width: tableWidth,
      height: table.headerHeight, color: headerBgColor,
    });
    targetPage.drawText('Lp.', { x: columnPositions[0] + table.padding.left, y: headerTextY, size: headerFontSize, font, color: headerColor });
    targetPage.drawText('Nazwa towaru / Opis', { x: columnPositions[1] + table.padding.left, y: headerTextY, size: headerFontSize, font, color: headerColor });
    targetPage.drawText('J.m.', { x: columnPositions[2] + (table.columnWidths[2] - font.widthOfTextAtSize('J.m.', headerFontSize))/2, y: headerTextY, size: headerFontSize, font, color: headerColor });
    targetPage.drawText('Ilość', { x: columnPositions[3] + (table.columnWidths[3] - font.widthOfTextAtSize('Ilość', headerFontSize))/2, y: headerTextY, size: headerFontSize, font, color: headerColor });
    targetPage.drawLine({
        start: { x: table.x, y: yPosition }, end: { x: table.x + tableWidth, y: yPosition },
        thickness: 1, color: rgb(0.4, 0, 0.1),
    });
  };

  currentY -= table.headerHeight;
  drawHeader(currentPage, currentY);
  tableSegmentStartY = currentY + table.headerHeight;

  tableData.forEach((row, rowIndex) => {
    if (!row || row.length < 4) { return; }

    const lp = String(row[0] || '');
    const nameText = row[1] || '';
    const unitText = String(row[2] || '');
    const quantityTextContent = String(row[3] || '');
    const descriptionText = row.length > 4 && row[4] ? String(row[4]) : '';

    const nameMaxWidth = table.columnWidths[1] - table.padding.left - table.padding.right;
    const nameTextLines = wrapText(nameText, font, nameFontSize, nameMaxWidth);
    const nameBlockHeight = nameTextLines.length * nameLineHeight;

    let descriptionBlockHeight = 0;
    let descriptionTextLines = [];
    if (descriptionText) {
      descriptionTextLines = wrapText(descriptionText, font, descriptionFontSize, nameMaxWidth);
      descriptionBlockHeight = descriptionTextLines.length * descriptionLineHeight + (nameTextLines.length > 0 ? spacingAfterName : 0);
    }

    const minRowHeight = 20; // Zmniejszono
    const calculatedContentHeight = nameBlockHeight + descriptionBlockHeight;
    const dynamicRowHeight = Math.max(minRowHeight, calculatedContentHeight + table.padding.top + table.padding.bottom);

    if (currentY - dynamicRowHeight < pageBottomMargin) {
      for(let i=0; i <= table.columnWidths.length; i++) {
        const xPos = (i === table.columnWidths.length) ? (table.x + tableWidth) : columnPositions[i];
        currentPage.drawLine({
            start: {x: xPos, y: currentY}, end: {x: xPos, y: tableSegmentStartY},
            thickness: 0.5, color: lineColor
        });
      }
      currentPage = pdfDoc.addPage();
      currentY = currentPage.getHeight() - pageTopMargin;
      currentY -= table.headerHeight;
      drawHeader(currentPage, currentY);
      tableSegmentStartY = currentY + table.headerHeight;
    }

    currentY -= dynamicRowHeight;

    if (rowIndex % 2 === 1) {
      currentPage.drawRectangle({
        x: table.x, y: currentY, width: tableWidth,
        height: dynamicRowHeight, color: evenRowBgColor,
      });
    }

    const nameStartY = currentY + dynamicRowHeight - table.padding.top - nameFontSize +1; // +1 dla lepszego ułożenia

    let currentNameLineY = nameStartY;
    nameTextLines.forEach(line => {
      currentPage.drawText(line, {
        x: columnPositions[1] + table.padding.left, y: currentNameLineY,
        size: nameFontSize, font, color: nameColor, lineHeight: nameLineHeight,
      });
      currentNameLineY -= nameLineHeight;
    });
    
    const ancillaryY = nameStartY;

    currentPage.drawText(lp, { x: columnPositions[0] + (table.columnWidths[0] - font.widthOfTextAtSize(lp, quantityUnitFontSize))/2 , y: ancillaryY, size: quantityUnitFontSize, font, color: quantityUnitColor });
    currentPage.drawText(unitText, { x: columnPositions[2] + (table.columnWidths[2] - font.widthOfTextAtSize(unitText, quantityUnitFontSize))/2, y: ancillaryY, size: quantityUnitFontSize, font, color: quantityUnitColor });
    const quantityWidth = font.widthOfTextAtSize(quantityTextContent, quantityUnitFontSize);
    const quantityX = columnPositions[3] + (table.columnWidths[3] - quantityWidth) / 2;
    currentPage.drawText(quantityTextContent, { x: quantityX, y: ancillaryY, size: quantityUnitFontSize, font, color: quantityUnitColor });

    if (descriptionText) {
      let currentDescLineY = nameStartY - nameBlockHeight - spacingAfterName;
       descriptionTextLines.forEach((line) => { // Usunięto nieużywany lineIndex
        currentPage.drawText(line, {
          x: columnPositions[1] + table.padding.left,
          y: currentDescLineY,
          size: descriptionFontSize, font, color: descriptionColor, lineHeight: descriptionLineHeight,
        });
        currentDescLineY -= descriptionLineHeight;
      });
    }
    currentPage.drawLine({
      start: { x: table.x, y: currentY }, end: { x: table.x + tableWidth, y: currentY },
      thickness: 0.7, color: lineColor,
    });
  });
  
  for(let i=0; i <= table.columnWidths.length; i++) {
    const xPos = (i === table.columnWidths.length) ? (table.x + tableWidth) : columnPositions[i];
     currentPage.drawLine({
          start: {x: xPos, y: currentY}, end: {x: xPos, y: tableSegmentStartY},
          thickness: 0.5, color: lineColor
      });
  }
  return currentY;
}

// Główna funkcja generująca PDF
export async function generateOfferPDF(
  cena,
  userName,
  deviceType,
  model,
  tankCapacity,
  bufferCapacity
) {
  if (!userName?.trim() || !String(cena).trim()) {
    alert('Uzupełnij wszystkie wymagane pola: Imię i nazwisko oraz cena!');
    return null;
  }

  const pageTopMargin = 40; // Zdefiniowane dla spójności z drawTable
  const pageBottomMargin = 40; // Zdefiniowane dla spójności

  console.log(`[DIAGNOSTYKA] Próba znalezienia szablonów dla klucza: "${deviceType}"`);
  const selectedTemplatePaths = getTemplatePathsForDevice(deviceType);
  // ... (reszta wczytywania szablonów i czcionek bez zmian) ...
  try {
    const assetBuffers = await Promise.all([
      ...selectedTemplatePaths.map(path => fetch(path).then(res => {
        if (!res.ok) throw new Error(`Nie udało się wczytać pliku szablonu PDF: ${path}.`);
        return res.arrayBuffer();
      })),
      fetch('/fonts/OpenSans-Bold.ttf').then(res => {
        if (!res.ok) throw new Error(`Nie udało się wczytać czcionki OpenSans-Bold.ttf.`);
        return res.arrayBuffer();
      })
      // Aby dodać czcionkę ExtraBold (800):
      // fetch('/fonts/OpenSans-ExtraBold.ttf').then(res => res.arrayBuffer()),
    ]);

    const fontBytes = assetBuffers.pop();
    // const extraBoldFontBytes = assetBuffers.pop(); // Jeśli dodałeś ExtraBold
    const templatePdfBuffers = assetBuffers;

    const finalPdfDoc = await PDFDocument.create();
    finalPdfDoc.registerFontkit(fontkit);
    const customFont = await finalPdfDoc.embedFont(fontBytes);
    // const customExtraBoldFont = await finalPdfDoc.embedFont(extraBoldFontBytes); // Jeśli dodałeś

    // Użyj customExtraBoldFont dla userNameText i priceString jeśli dostępna, inaczej customFont
    const titleFont = customFont; // Zmień na customExtraBoldFont, gdy będzie dostępna

    if (templatePdfBuffers[0]) {
      const okladkaDoc = await PDFDocument.load(templatePdfBuffers[0]);
      const [copiedPage] = await finalPdfDoc.copyPages(okladkaDoc, [0]);
      finalPdfDoc.addPage(copiedPage);
    }

    const dynamicPage = finalPdfDoc.addPage();
    const { width: pageWidth, height: initialDynamicPageHeight } = dynamicPage.getSize();
    const tableData = getTableData(deviceType, model, tankCapacity, bufferCapacity);

    const userNameText = `Oferta dla: ${userName}`;
    const userNameFontSize = 20; // Lekko zmniejszone dla ogólnej spójności
    const userNameTextWidth = titleFont.widthOfTextAtSize(userNameText, userNameFontSize);
    dynamicPage.drawText(userNameText, {
      x: (pageWidth - userNameTextWidth) / 2,
      y: initialDynamicPageHeight - 60, // Podniesione nieco wyżej
      size: userNameFontSize,
      font: titleFont, // Użyj titleFont (które powinno być ExtraBold)
      color: rgb(0.7, 0, 0.16),
    });

    let lastYPosAfterTable = initialDynamicPageHeight - 90; 

    if (tableData && tableData.length > 0) {
      lastYPosAfterTable = drawTable(finalPdfDoc, dynamicPage, customFont, tableData);
    } else {
      dynamicPage.drawText("Brak danych do wyświetlenia w tabeli dla wybranej konfiguracji.", {
        x: 50, y: initialDynamicPageHeight - 90 - 20, size: 12, font: customFont, color: rgb(0.5, 0.5, 0.5)
      });
      lastYPosAfterTable = initialDynamicPageHeight - 90 - 40; 
    }

    const priceString = `Cena końcowa: ${cena} PLN brutto`;
    const priceFontSize = 15; // Lekko zmniejszone
    const priceTextWidth = titleFont.widthOfTextAtSize(priceString, priceFontSize);

    let pageForPrice = finalPdfDoc.getPage(finalPdfDoc.getPageCount() - 1);
    let heightOfPageForPrice = pageForPrice.getHeight();
    let widthOfPageForPrice = pageForPrice.getWidth();

    let priceYPosition = lastYPosAfterTable - 30; // Zmniejszony odstęp 
    const priceTextEstimatedHeight = priceFontSize * 1.2;

    if (priceYPosition - priceTextEstimatedHeight < pageBottomMargin) {
      // Jeśli cena nie mieści się, dodaj nową stronę
      const newPricePage = finalPdfDoc.addPage();
      pageForPrice = newPricePage;
      heightOfPageForPrice = newPricePage.getHeight();
      widthOfPageForPrice = newPricePage.getWidth();
      priceYPosition = heightOfPageForPrice - pageTopMargin - 60; // Ustaw cenę na górze nowej strony
    }
    
    pageForPrice.drawText(priceString, {
      x: (widthOfPageForPrice - priceTextWidth) / 2,
      y: priceYPosition,
      size: priceFontSize,
      font: titleFont, // Użyj titleFont (które powinno być ExtraBold)
      color: rgb(0.7, 0, 0.16),
    });
    
    for (let i = 1; i < templatePdfBuffers.length; i++) {
      if (templatePdfBuffers[i]) {
        const templateDoc = await PDFDocument.load(templatePdfBuffers[i]);
        const pageIndices = templateDoc.getPageIndices();
        for (const pageIndex of pageIndices) {
          const [copiedPage] = await finalPdfDoc.copyPages(templateDoc, [pageIndex]);
          finalPdfDoc.addPage(copiedPage);
        }
      }
    }

    const pdfBytes = await finalPdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania PDF:', error);
    alert(`Wystąpił błąd podczas generowania oferty: ${error.message}. Sprawdź konsolę deweloperską (F12).`);
    return null;
  }
}