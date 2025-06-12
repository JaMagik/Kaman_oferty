import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { inverterTypesData, pvOfferCommons, pvRoofMountScope, pvGroundMountScope, pvStorageScope } from '../data/tables/photovoltaicsData';

// Skopiowana i dostosowana funkcja do rysowania tabeli
async function drawStyledTable(pdfDoc, initialPage, fonts, tableData, startY) {
    let currentPage = initialPage;
    let currentY = startY;
    const { regular: regularFont, bold: boldFont } = fonts;
    
    const tableConfig = {
        columnWidths: [30, 160, 250, 35, 35],
        headerHeight: 22,
        padding: { top: 3, bottom: 3, left: 5, right: 5 },
        headerFontSize: 9.5,
        contentFontSize: 8,
        descriptionFontSize: 7.5,
        lineColor: rgb(0.85, 0.85, 0.85),
        headerBgColor: rgb(0.6, 0, 0.15),
        headerFontColor: rgb(1, 1, 1),
        rowFontColor: rgb(0.2, 0.2, 0.2),
        evenRowBgColor: rgb(0.98, 0.96, 0.96),
        pageMargins: { top: 40, bottom: 40 }
    };
    
    const tableWidth = tableConfig.columnWidths.reduce((a, b) => a + b, 0);
    const tableStartX = (currentPage.getWidth() - tableWidth) / 2;

    const columnPositions = [tableStartX];
    for (let i = 0; i < tableConfig.columnWidths.length; i++) {
        columnPositions.push(columnPositions[i] + tableConfig.columnWidths[i]);
    }
    
    let tableSegmentTopY = startY;

    const drawHeader = (page, y) => {
        const headerY = y - tableConfig.headerHeight;
        page.drawRectangle({ x: tableStartX, y: headerY, width: tableWidth, height: tableConfig.headerHeight, color: tableConfig.headerBgColor });
        const headers = ['Lp.', 'Nazwa towaru', 'Opis', 'J.m.', 'Ilość'];
        const headerTextY = headerY + (tableConfig.headerHeight - tableConfig.headerFontSize) / 2;
        headers.forEach((header, i) => {
            const textWidth = fonts.bold.widthOfTextAtSize(header, tableConfig.headerFontSize);
            page.drawText(header, { x: columnPositions[i] + (tableConfig.columnWidths[i] - textWidth) / 2, y: headerTextY, font: fonts.bold, size: tableConfig.headerFontSize, color: tableConfig.headerFontColor });
        });
        return headerY;
    };

    currentY = drawHeader(currentPage, currentY);

    for (const [rowIndex, row] of tableData.entries()) {
        const [lp, name, description, unit, quantity] = row;
        const nameLines = wrapText(name, regularFont, tableConfig.contentFontSize, tableConfig.columnWidths[1] - 10);
        const descLines = wrapText(description || '', regularFont, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - 10);
        
        const rowHeight = Math.max(nameLines.length * (tableConfig.contentFontSize * 1.3), descLines.length * (tableConfig.descriptionFontSize * 1.3)) + tableConfig.padding.top + tableConfig.padding.bottom;

        if (currentY - rowHeight < tableConfig.pageMargins.bottom) {
            for (let i = 0; i <= tableConfig.columnWidths.length; i++) { currentPage.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableSegmentTopY }, thickness: 0.5, color: tableConfig.lineColor }); }
            currentPage = pdfDoc.addPage();
            currentY = currentPage.getHeight() - tableConfig.pageMargins.top;
            tableSegmentTopY = currentY;
            currentY = drawHeader(currentPage, currentY);
        }

        const rowY = currentY - rowHeight;
        if (rowIndex % 2 === 1) { currentPage.drawRectangle({ x: tableStartX, y: rowY, width: tableWidth, height: rowHeight, color: tableConfig.evenRowBgColor }); }
        
        const drawCellText = (lines, font, fontSize, cellBounds) => {
            let textY = cellBounds.y + cellBounds.height - tableConfig.padding.top - fontSize;
            lines.forEach(line => {
                const textWidth = font.widthOfTextAtSize(line, fontSize);
                let textX = cellBounds.x + 5;
                if (cellBounds.isCentered) {
                    textX = cellBounds.x + (cellBounds.width - textWidth) / 2;
                }
                currentPage.drawText(line, { x: textX, y: textY, font, size: fontSize, color: tableConfig.rowFontColor, lineHeight: fontSize * 1.3 });
                textY -= fontSize * 1.3;
            });
        };
        
        drawCellText([String(lp)], regularFont, tableConfig.contentFontSize, { x: columnPositions[0], y: rowY, width: tableConfig.columnWidths[0], height: rowHeight, isCentered: true });
        drawCellText(nameLines, regularFont, tableConfig.contentFontSize, { x: columnPositions[1], y: rowY, width: tableConfig.columnWidths[1], height: rowHeight });
        drawCellText(descLines, regularFont, tableConfig.descriptionFontSize, { x: columnPositions[2], y: rowY, width: tableConfig.columnWidths[2], height: rowHeight });
        drawCellText([String(unit)], regularFont, tableConfig.contentFontSize, { x: columnPositions[3], y: rowY, width: tableConfig.columnWidths[3], height: rowHeight, isCentered: true });
        drawCellText([String(quantity)], regularFont, tableConfig.contentFontSize, { x: columnPositions[4], y: rowY, width: tableConfig.columnWidths[4], height: rowHeight, isCentered: true });

        currentY = rowY;
        currentPage.drawLine({ start: { x: tableStartX, y: currentY }, end: { x: tableStartX + tableWidth, y: currentY }, thickness: 0.5, color: tableConfig.lineColor });
    }

    for (let i = 0; i <= tableConfig.columnWidths.length; i++) { currentPage.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableSegmentTopY }, thickness: 0.5, color: tableConfig.lineColor }); }
    return currentY;
}

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

export async function generatePhotovoltaicsOfferPDF(formData) {
  const { userName, price, installationType, panelDetails, inverterDetails, storageDetails } = formData;

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const regularFontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then(res => res.arrayBuffer());
    const boldFontBytes = await fetch('/fonts/OpenSans-Bold.ttf').then(res => res.arrayBuffer());
    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);

    const pdfOrder = [
        pvOfferCommons.coverPage,
        ...(inverterDetails?.datasheets || []),
        ...(panelDetails?.datasheets || []),
        ...(storageDetails?.datasheets || []),
        pvOfferCommons.contactPage,
    ].filter(Boolean);

    const loadedTemplatePDFs = [];
    for (const path of pdfOrder) {
        try {
            const pdfBytes = await fetch(path).then(res => {
                if (!res.ok) throw new Error(`Nie udało się wczytać szablonu PV: ${path}`);
                return res.arrayBuffer();
            });
            loadedTemplatePDFs.push(await PDFDocument.load(pdfBytes));
        } catch (error) { console.error(`Błąd ładowania szablonu ${path}:`, error); }
    }
    
    if (loadedTemplatePDFs.length > 0) {
      const [copiedCoverPage] = await pdfDoc.copyPages(loadedTemplatePDFs.shift(), [0]);
      pdfDoc.addPage(copiedCoverPage);
    }

    const offerPage = pdfDoc.addPage();
    const { width, height } = offerPage.getSize();
    let currentY = height - 60;
    
    const mainTitle = installationType === 'only-storage' ? "OFERTA NA MAGAZYN ENERGII" : "OFERTA INSTALACJI FOTOWOLTAICZNEJ";
    offerPage.drawText(mainTitle, { x: 50, y: currentY, font: boldFont, size: 17, color: rgb(0.6, 0, 0.15) });
    currentY -= 35;
    
    const detailsX = 50;
    const detailsFontSize = 9.5;
    const detailsLineHeight = 16;
    const labelWidth = 100;

    const drawDetailRow = (y, label, value) => {
        offerPage.drawText(label, { x: detailsX, y, font: boldFont, size: detailsFontSize, color: rgb(0.6, 0, 0.15) });
        offerPage.drawText(value, { x: detailsX + labelWidth, y, font: regularFont, size: detailsFontSize, color: rgb(0.1, 0.1, 0.1) });
        return y - detailsLineHeight;
    };
    
    currentY = drawDetailRow(currentY, 'Klient:', userName.toUpperCase());
    if (panelDetails) {
        currentY = drawDetailRow(currentY, 'Moc instalacji:', `${panelDetails.totalPower.toFixed(2)} kWp`);
    }
    currentY = drawDetailRow(currentY, 'Typ instalacji:', `${installationType === 'dach' ? 'Dachowa' : installationType === 'grunt' ? 'Gruntowa' : 'Tylko magazyn energii'}`);
    if (panelDetails) {
        currentY = drawDetailRow(currentY, 'Panele:', panelDetails.name);
    }
    if (inverterDetails) {
        currentY = drawDetailRow(currentY, 'Falownik / Ładowarka:', inverterDetails.name);
    }
    if (storageDetails) {
        currentY = drawDetailRow(currentY, 'Magazyn energii:', storageDetails.name);
    }
    currentY -= 20;
    
    let tableData = [];

    if (storageDetails) {
        // --- LOGIKA DLA OFERTY Z MAGAZYNEM ---
        tableData = JSON.parse(JSON.stringify(pvStorageScope)); // Głęboka kopia
        
        // Dynamiczna modyfikacja pierwszych punktów
        let deviceName = inverterDetails.name;
        let connectionType = inverterDetails.type === 'Hybrid Inverter' 
            ? 'bezpośrednio do falownika hybrydowego' 
            : 'poprzez dedykowaną ładowarkę bateryjną typu retrofit';
        tableData[0][2] = `Określenie trybu integracji systemu bateryjnego – ${connectionType}.`;
        tableData[1][1] = storageDetails.name;
        tableData[1][2] = storageDetails.description;

    } else {
        // --- LOGIKA DLA OFERTY BEZ MAGAZYNU ---
        if (panelDetails) {
            tableData.push(['', 'Zestaw modułów fotowoltaicznych', panelDetails.description, 'kpl.', '1']);
        }
        if (inverterDetails) {
            tableData.push(['', 'Urządzenie przekształcające energię – falownik', inverterDetails.description, 'kpl.', '1']);
        }
        if (installationType === 'grunt') {
            tableData.push(...pvGroundMountScope);
        } else if (installationType === 'dach') {
            tableData.push(...pvRoofMountScope); 
        }
    }

    tableData = tableData.map((row, index) => {
        row[0] = String(index + 1);
        return row;
    });

    let lastYPosAfterTable = await drawStyledTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, tableData, currentY);

    const priceText = `CENA KOŃCOWA: ${price} PLN brutto (VAT 8%)`;
    const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 14);
    offerPage.drawText(priceText, { x: width - priceTextWidth - 50, y: lastYPosAfterTable - 40, font: boldFont, size: 14, color: rgb(0.6, 0, 0.15) });
    offerPage.drawText(`Oferta ważna 14 dni.`, { x: 50, y: lastYPosAfterTable - 40, font: regularFont, size: 9, color: rgb(0.4, 0.4, 0.4) });

    for (const templateDoc of loadedTemplatePDFs) {
      const pageIndices = templateDoc.getPageIndices();
      for (const pageIndex of pageIndices) {
        const [copiedPage] = await pdfDoc.copyPages(templateDoc, [pageIndex]);
        pdfDoc.addPage(copiedPage);
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania PDF dla fotowoltaiki:', error);
    alert(`Wystąpił błąd podczas generowania oferty PV: ${error.message}.`);
    return null;
  }
}