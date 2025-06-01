// ścieżka: src/utils/pvPdfGenerator.jsx

import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib'; // Dodano PDFFont dla type hinting
import fontkit from '@pdf-lib/fontkit';
import { panelTypesData, inverterTypesData, storageTypesData, pvOfferCommons } from '../data/tables/photovoltaicsData';

/**
 * Rysuje ostylowaną tabelę komponentów fotowoltaicznych.
 * @param {import('pdf-lib').PDFPage} page Strona PDF, na której rysować.
 * @param {PDFFont} font Używana czcionka.
 * @param {object} data Dane oferty.
 * @param {number} startY Pozycja Y, od której zacząć rysowanie tabeli.
 * @returns {Promise<number>} Pozycja Y pod tabelą.
 */
async function drawStyledPhotovoltaicsTable(page, font, data, startY) {
  const { panelDetails, inverterDetails, storageDetails, installationType } = data;
  let currentY = startY;
  const tableX = 50;
  const defaultRowHeight = 25; // Minimalna wysokość wiersza
  const headerHeight = 30;
  const fontSize = 9.5; // Nieco mniejsza czcionka dla zawartości tabeli
  const headerFontSize = 10.5;
  const lineSpacingFactor = 1.4; // Mnożnik dla wysokości linii tekstu (fontSize * lineSpacingFactor)

  const tableColumnWidths = [30, 355, 50, 55]; // Lp., Nazwa komponentu, Ilość, J.m.
  const tableWidth = tableColumnWidths.reduce((a, b) => a + b, 0);

  const columnPositions = [tableX];
  for (let i = 0; i < tableColumnWidths.length - 1; i++) {
    columnPositions.push(columnPositions[i] + tableColumnWidths[i]);
  }
  const cellPadding = { top: 7, bottom: 7, left: 5, right: 5 }; // Zwiększony padding

  const wrapText = (text, textFont, textSize, maxWidth) => {
    if (typeof text !== 'string') text = String(text);
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0] || '';
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = textFont.widthOfTextAtSize(`${currentLine} ${word}`, textSize);
      if (width < maxWidth - cellPadding.left - cellPadding.right) { // Uwzględnij padding
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Rysowanie nagłówka tabeli
  currentY -= headerHeight;
  page.drawRectangle({
    x: tableX, y: currentY, width: tableWidth, height: headerHeight,
    color: rgb(0.1, 0.1, 0.25), // Ciemniejszy, bardziej profesjonalny granat
  });

  const headerTextY = currentY + (headerHeight - headerFontSize) / 2 - 1; // Lepsze centrowanie w pionie

  page.drawText('Lp.', { x: columnPositions[0] + cellPadding.left, y: headerTextY, font, size: headerFontSize, color: rgb(1, 1, 1) });
  page.drawText('Nazwa komponentu', { x: columnPositions[1] + cellPadding.left, y: headerTextY, font, size: headerFontSize, color: rgb(1, 1, 1) });
  page.drawText('Ilość', { x: columnPositions[2] + (tableColumnWidths[2] - font.widthOfTextAtSize('Ilość', headerFontSize)) / 2, y: headerTextY, font, size: headerFontSize, color: rgb(1, 1, 1) });
  page.drawText('J.m.', { x: columnPositions[3] + (tableColumnWidths[3] - font.widthOfTextAtSize('J.m.', headerFontSize)) / 2, y: headerTextY, font, size: headerFontSize, color: rgb(1, 1, 1) });

  const components = [];
  if (installationType !== 'only-storage' && panelDetails) {
    components.push({ name: panelDetails.name, quantity: panelDetails.count, unit: 'szt.' });
    if (inverterDetails) components.push({ name: inverterDetails.name, quantity: 1, unit: 'szt.' });
    components.push({ name: 'Konstrukcja montażowa CORAB (lub równoważna)', quantity: 1, unit: 'kpl.' });
    components.push({ name: 'Okablowanie AC/DC, zabezpieczenia, uziemienie', quantity: 1, unit: 'kpl.' });
    components.push({ name: 'Montaż, uruchomienie, dokumentacja, zgłoszenie do OSD', quantity: 1, unit: 'kpl.' });
  }
  if (storageDetails) {
    components.push({ name: storageDetails.name, quantity: 1, unit: 'szt.' });
  }
  if (installationType === 'only-storage' && !storageDetails && components.length === 0) {
     components.push({ name: 'Magazyn energii (konfiguracja wg ustaleń)', quantity: 1, unit: 'kpl.' });
  }

  components.forEach((comp, index) => {
    const textLines = wrapText(comp.name, font, fontSize, tableColumnWidths[1]);
    const dynamicRowHeight = Math.max(defaultRowHeight, textLines.length * (fontSize * lineSpacingFactor) + cellPadding.top + cellPadding.bottom);
    
    currentY -= dynamicRowHeight;
    if (currentY < 40) { // Sprawdzenie czy jest miejsce na stronie
        page.addPage();
        currentY = page.getHeight() - headerHeight - 50; // Reset Y na nowej stronie, zostaw miejsce na ewentualny nagłówek tabeli
        // TODO: Opcjonalnie narysuj ponownie nagłówek tabeli na nowej stronie
    }


    if (index % 2 === 1) {
      page.drawRectangle({ x: tableX, y: currentY, width: tableWidth, height: dynamicRowHeight, color: rgb(0.94, 0.94, 0.96) }); // Jaśniejszy fiolet/szary
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

  // Linie pionowe tabeli
  for(let i=0; i <= tableColumnWidths.length; i++) {
    const x = (i === tableColumnWidths.length) ? (tableX + tableWidth) : columnPositions[i];
     page.drawLine({
          start: {x: x, y: currentY},
          end: {x: x, y: startY - headerHeight}, // Linia do góry do nagłówka
          thickness: 0.5,
          color: rgb(0.85, 0.85, 0.85)
      });
  }
  // Górna linia tabeli (pod nagłówkiem)
   page.drawLine({
    start: { x: tableX, y: startY - headerHeight },
    end: { x: tableX + tableWidth, y: startY - headerHeight },
    thickness: 1, // Grubsza linia pod nagłówkiem
    color: rgb(0.1, 0.1, 0.25),
});

  return currentY;
}

export async function generatePhotovoltaicsOfferPDF(formData) {
  const { userName, price, installationType, panelDetails, inverterDetails, storageDetails } = formData;

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then(res => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    const templatePathsToLoad = [];
    let coverPath = pvOfferCommons.coverPage; // Domyślna okładka PV

    if (installationType === 'dach' && pvOfferCommons.coverDach) coverPath = pvOfferCommons.coverDach;
    else if (installationType === 'grunt' && pvOfferCommons.coverGrunt) coverPath = pvOfferCommons.coverGrunt;
    else if (installationType === 'only-storage' && pvOfferCommons.coverStorageOnly) coverPath = pvOfferCommons.coverStorageOnly;
    
    if (coverPath) templatePathsToLoad.push(coverPath);
    else console.warn("Nie zdefiniowano ścieżki do okładki dla danego typu instalacji PV.");


    // Kolejność dodawania stron szablonów
    const pdfOrder = [
        // Okładka jest już w templatePathsToLoad jako pierwsza (jeśli istnieje)
        ...(inverterDetails?.datasheets || []),
        ...(installationType !== 'only-storage' && panelDetails?.datasheets || []),
        ...(storageDetails?.datasheets || []),
        pvOfferCommons.contactPage,
        // pvOfferCommons.lastPage, // Jeśli masz ostatnią stronę
    ].filter(Boolean); // Usuń ewentualne puste ścieżki

    // Wczytaj wszystkie potrzebne szablony PDF (okładkę i karty katalogowe)
    const loadedTemplatePDFs = [];
    for (const path of [coverPath, ...pdfOrder.filter(p => p !== coverPath && p !== pvOfferCommons.contactPage)]) { // Najpierw okładka, potem reszta bez kontaktu
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
     // Osobno wczytaj stronę kontaktową, aby dodać ją na końcu po dynamicznej stronie
    let contactPageDoc = null;
    if (pvOfferCommons.contactPage) {
        try {
            const contactBytes = await fetch(pvOfferCommons.contactPage).then(res => res.arrayBuffer());
            contactPageDoc = await PDFDocument.load(contactBytes);
        } catch (error) {
            console.error(`Błąd ładowania strony kontaktowej:`, error);
        }
    }


    // 1. Dodaj okładkę
    if (loadedTemplatePDFs.length > 0 && loadedTemplatePDFs[0].path === coverPath) {
      const coverTemplate = loadedTemplatePDFs.shift().doc; // Pobierz i usuń okładkę
      const [copiedCoverPage] = await pdfDoc.copyPages(coverTemplate, [0]);
      pdfDoc.addPage(copiedCoverPage);
      console.log("Dodano okładkę:", coverPath);
    } else {
        console.warn("Nie udało się załadować lub zidentyfikować okładki. Pierwsza strona może być niepoprawna.");
    }

    // 2. Strona dynamiczna z ofertą i tabelą komponentów
    const offerPage = pdfDoc.addPage();
    const { width, height } = offerPage.getSize();
    const mainTitle = installationType === 'only-storage' ? "OFERTA NA MAGAZYN ENERGII" : "OFERTA INSTALACJI FOTOWOLTAICZNEJ";
    const titleY = height - 70; // Wyżej
    const detailsYStart = titleY - 35;
    const lineHeightDetails = 20; // Większy odstęp
    const fontSizeDetails = 10.5;
    const fontSizeTitle = 17;
    const sectionSpacing = 25;

    offerPage.drawText(mainTitle, {
      x: 50, y: titleY, font: customFont, size: fontSizeTitle, color: rgb(0.1, 0.1, 0.25), // Ciemny granat
    });
    offerPage.drawText(`DLA: ${userName.toUpperCase()}`, {
        x: 50, y: titleY - (fontSizeTitle * 1.1), font: customFont, size: fontSizeDetails, color: rgb(0.3, 0.3, 0.3),
    });
    
    let currentY = detailsYStart;
    currentY -= lineHeightDetails; // Dodatkowy odstęp

    if (installationType !== 'only-storage' && panelDetails) {
        offerPage.drawText(
            `Moc instalacji: ${panelDetails.totalPower.toFixed(2)} kWp (${panelDetails.count} x ${panelDetails.name})`, 
            { x: 50, y: currentY, font: customFont, size: fontSizeDetails, color: rgb(0.2, 0.2, 0.2) }
        );
        currentY -= lineHeightDetails;
    }
    offerPage.drawText(
        `Typ instalacji: ${installationType === 'dach' ? 'Dachowa' : installationType === 'grunt' ? 'Gruntowa' : 'Tylko magazyn energii'}`, 
        { x: 50, y: currentY, font: customFont, size: fontSizeDetails, color: rgb(0.2, 0.2, 0.2) }
    );
    currentY -= lineHeightDetails;

    if (inverterDetails) {
        offerPage.drawText(`Falownik: ${inverterDetails.name}`, {
            x: 50, y: currentY, font: customFont, size: fontSizeDetails, color: rgb(0.2, 0.2, 0.2)
        });
        currentY -= lineHeightDetails;
    }
    if (storageDetails) {
        offerPage.drawText(`Magazyn energii: ${storageDetails.name}`, {
            x: 50, y: currentY, font: customFont, size: fontSizeDetails, color: rgb(0.2, 0.2, 0.2)
        });
        currentY -= lineHeightDetails;
    }
    currentY -= sectionSpacing * 0.8; // Odstęp przed tabelą

    let lastYPosAfterTable = await drawStyledPhotovoltaicsTable(offerPage, customFont, formData, currentY);
    
    // Cena i uwagi pod tabelą
    const priceText = `CENA KOŃCOWA: ${price} PLN brutto (VAT 8%)`;
    const priceTextWidth = customFont.widthOfTextAtSize(priceText, 14);
    offerPage.drawText(priceText, { 
      x: width - priceTextWidth - 50, // Wyrównanie do prawej
      y: lastYPosAfterTable - 40, 
      font: customFont, 
      size: 14, 
      color: rgb(0.6, 0, 0.15), 
    });
    offerPage.drawText(`Oferta ważna 14 dni.`, {
        x: 50, y: lastYPosAfterTable - 40, // Pod ceną, po lewej
        font: customFont, size: 9, color: rgb(0.4, 0.4, 0.4)
      });

    // 3. Dodaj resztę stron szablonów (karty katalogowe)
    for (const template of loadedTemplatePDFs) { // Iteruj po pozostałych załadowanych szablonach (okładka została usunięta)
      const pageIndices = template.doc.getPageIndices();
      for (const pageIndex of pageIndices) {
        const [copiedPage] = await pdfDoc.copyPages(template.doc, [pageIndex]);
        pdfDoc.addPage(copiedPage);
      }
    }
    
    // 4. Dodaj stronę kontaktową na samym końcu
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
