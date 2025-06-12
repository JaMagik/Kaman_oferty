import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { inverterTypesData, pvOfferCommons, pvRoofMountScope, pvGroundMountScope, pvStorageScope } from '../data/tables/photovoltaicsData';

// --- FUNKCJE POMOCNICZE ---

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

async function drawTable(pdfDoc, page, fonts, tableData, startY, title) {
    let currentPage = page;
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
        pageMargins: { top: 40, bottom: 80 }
    };
    
    const tableWidth = tableConfig.columnWidths.reduce((a, b) => a + b, 0);
    const tableStartX = (currentPage.getSize().width - tableWidth) / 2;
    const columnPositions = [tableStartX];
    for (let i = 0; i < tableConfig.columnWidths.length; i++) {
        columnPositions.push(columnPositions[i] + tableConfig.columnWidths[i]);
    }
    
    if (title) {
        currentY -= 5;
        currentPage.drawText(title, { x: tableStartX, y: currentY, font: boldFont, size: 12, color: rgb(0.1, 0.1, 0.25) });
        currentY -= (12 + 8);
    }

    let tableSegmentTopY = currentY;

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
            if (title) {
                currentPage.drawText(`${title} (c.d.)`, { x: tableStartX, y: currentY, font: boldFont, size: 12, color: rgb(0.1, 0.1, 0.25) });
                currentY -= (12 + 8);
            }
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
                if (cellBounds.isCentered) { textX = cellBounds.x + (cellBounds.width - textWidth) / 2; }
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
    return {finalY: currentY, finalPage: currentPage};
}

export async function generatePhotovoltaicsOfferPDF(formData) {
  const { userName, price, installationType, panelDetails, inverterDetails, storageDetails, storageModules } = formData;

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const regularFontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then(res => res.arrayBuffer());
    const boldFontBytes = await fetch('/fonts/OpenSans-Bold.ttf').then(res => res.arrayBuffer());
    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    const kamanLogoBytes = await fetch('/logos/kaman_logo.png').then(res => res.ok ? res.arrayBuffer() : null).catch(() => null);
    let kamanLogoImage = null;
    if (kamanLogoBytes) kamanLogoImage = await pdfDoc.embedPng(kamanLogoBytes);

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
            const response = await fetch(path);
            if (!response.ok) {
                console.error(`Nie udało się pobrać pliku: ${path} (status: ${response.status}). Plik zostanie pominięty.`);
                continue;
            }
            const pdfBytes = await response.arrayBuffer();
            try {
                const loadedPdf = await PDFDocument.load(pdfBytes);
                loadedTemplatePDFs.push(loadedPdf);
            } catch (parsingError) {
                console.error(`Plik '${path}' nie jest prawidłowym plikiem PDF i zostanie pominięty. Błąd: ${parsingError.message}`);
            }
        } catch (fetchError) {
            console.error(`Błąd sieci podczas pobierania pliku ${path}: ${fetchError.message}. Plik zostanie pominięty.`);
        }
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
    
    const detailsX = 50, detailsFontSize = 9.5, detailsLineHeight = 16, labelWidth = 110;
    const drawDetailRow = (page, y, label, value) => {
        page.drawText(label, { x: detailsX, y, font: boldFont, size: detailsFontSize, color: rgb(0.6, 0, 0.15) });
        page.drawText(value, { x: detailsX + labelWidth, y, font: regularFont, size: detailsFontSize, color: rgb(0.1, 0.1, 0.1) });
        return y - detailsLineHeight;
    };
    
    currentY = drawDetailRow(offerPage, currentY, 'Klient:', userName.toUpperCase());
    if (panelDetails) { currentY = drawDetailRow(offerPage, currentY, 'Moc instalacji:', `${panelDetails.totalPower.toFixed(2)} kWp`); }
    currentY = drawDetailRow(offerPage, currentY, 'Typ instalacji:', `${installationType === 'dach' ? 'Dachowa' : installationType === 'grunt' ? 'Gruntowa' : 'Tylko magazyn energii'}`);
    
    let mainTableData = [];
    if (panelDetails) { mainTableData.push(['', panelDetails.name, panelDetails.description, 'szt.', panelDetails.count]); }
    if (inverterDetails) { mainTableData.push(['', inverterDetails.name, inverterDetails.description, 'szt.', '1']); }
    if (storageDetails) {
        const totalCapacity = (storageDetails.capacity * storageModules).toFixed(2);
        const nameWithCapacity = `${storageDetails.name} ${totalCapacity} kWh`;
        const descriptionWithModules = `${storageDetails.description} Zestaw składa się z ${storageModules} modułu/ów.`;
        mainTableData.push(['', nameWithCapacity, descriptionWithModules, 'kpl.', '1']);
    }
    
    if (installationType !== 'only-storage') {
        const scopeData = installationType === 'grunt' ? pvGroundMountScope : pvRoofMountScope;
        mainTableData.push(...scopeData);
    }
    
    mainTableData = mainTableData.map((row, index) => { row[0] = String(index + 1); return row; });
    
    currentY -= 10;
    await drawTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, mainTableData, currentY, "Komponenty i zakres prac");
    
    if (storageDetails) {
        const storageScopePage = pdfDoc.addPage();
        let scopeY = height - 60;
        if(kamanLogoImage) {
            const logoDims = kamanLogoImage.scale(0.05);
            storageScopePage.drawImage(kamanLogoImage, { x: (width - logoDims.width) / 2, y: scopeY, width: logoDims.width, height: logoDims.height });
            scopeY -= (logoDims.height + 25);
        }
        
        const scopeTitle = "Zakres prac – instalacja magazynu energii";
        let scopeTableData = JSON.parse(JSON.stringify(pvStorageScope));
        const connectionType = inverterDetails.type === 'Hybrid Inverter' ? 'bezpośrednio do falownika hybrydowego' : 'poprzez dedykowaną ładowarkę typu retrofit';
        scopeTableData[0][2] = `Określenie trybu integracji systemu bateryjnego – ${connectionType}.`;
        
        scopeTableData[1][4] = String(storageModules);
        
        scopeTableData = scopeTableData.map((row, index) => {
            row[0] = String(index + 1);
            return row;
        });
        await drawTable(pdfDoc, storageScopePage, { regular: regularFont, bold: boldFont }, scopeTableData, scopeY, scopeTitle);
    }
    
    const lastPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    const priceText = `CENA KOŃCOWA: ${price} PLN brutto (VAT 8%)`;
    const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 14);
    lastPage.drawText(priceText, { x: width - priceTextWidth - 50, y: 50, font: boldFont, size: 14, color: rgb(0.6, 0, 0.15) });
    lastPage.drawText(`Oferta ważna 14 dni.`, { x: 50, y: 50, font: regularFont, size: 9, color: rgb(0.4, 0.4, 0.4) });
    
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