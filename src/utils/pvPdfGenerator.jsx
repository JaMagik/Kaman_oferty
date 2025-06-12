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

// ZMIANA: Zoptymalizowano tabelę pod kątem oszczędności miejsca
async function drawTable(pdfDoc, page, fonts, tableData, startY, title) {
    let currentPage = page;
    let currentY = startY;
    const { regular: regularFont, bold: boldFont } = fonts;
    
    const tableConfig = {
        columnWidths: [30, 160, 250, 35, 35],
        headerHeight: 20, // Zmniejszono
        padding: { top: 2, bottom: 2, left: 5, right: 5 }, // Zmniejszono
        headerFontSize: 9,
        contentFontSize: 8,
        descriptionFontSize: 7.5,
        lineHeightMultiplier: 1.25, // Zmniejszono
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
        currentPage.drawText(title, { x: tableStartX, y: currentY, font: boldFont, size: 9, color: rgb(0.1, 0.1, 0.25) });
        currentY -= (9 + 8);
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
        
        const rowHeight = Math.max(nameLines.length * (tableConfig.contentFontSize * tableConfig.lineHeightMultiplier), descLines.length * (tableConfig.descriptionFontSize * tableConfig.lineHeightMultiplier)) + tableConfig.padding.top + tableConfig.padding.bottom;

        if (currentY - rowHeight < tableConfig.pageMargins.bottom) {
            for (let i = 0; i <= tableConfig.columnWidths.length; i++) { currentPage.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableSegmentTopY }, thickness: 0.5, color: tableConfig.lineColor }); }
            currentPage = pdfDoc.addPage();
            currentY = currentPage.getHeight() - tableConfig.pageMargins.top;
            if (title) {
                currentPage.drawText(`${title} (c.d.)`, { x: tableStartX, y: currentY, font: boldFont, size: 9, color: rgb(0.1, 0.1, 0.25) });
                currentY -= (9 + 8);
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
                currentPage.drawText(line, { x: textX, y: textY, font, size: fontSize, color: tableConfig.rowFontColor, lineHeight: fontSize * tableConfig.lineHeightMultiplier });
                textY -= fontSize * tableConfig.lineHeightMultiplier;
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

// ZMIANA: Zoptymalizowano blok nagłówka pod kątem oszczędności miejsca
function drawHeaderBlock(page, fonts, logoImage, details, yPos) {
    const { width } = page.getSize();
    const { bold: boldFont, regular: regularFont } = fonts;
    let currentY = yPos;
    
    const detailsX = 50;
    const titleFontSize = 11;
    const detailsFontSize = 7.5;
    const detailsLineHeight = 11;
    const labelWidth = 100;

    const textBlockStartY = currentY;

    details.forEach(detail => {
        if (detail.type === 'title' && detail.value) {
            page.drawText(detail.value, {
                x: detailsX,
                y: currentY,
                font: boldFont,
                size: titleFontSize,
                color: rgb(0.6, 0, 0.15)
            });
            currentY -= (titleFontSize + 4); 
        } else if (detail.label && detail.value) {
            page.drawText(detail.label, { x: detailsX, y: currentY, font: boldFont, size: detailsFontSize, color: rgb(0.6, 0, 0.15) });
            page.drawText(String(detail.value), { x: detailsX + labelWidth, y: currentY, font: regularFont, size: detailsFontSize, color: rgb(0.1, 0.1, 0.1) });
            currentY -= detailsLineHeight;
        }
    });

    const textBlockHeight = textBlockStartY - currentY;

    if (logoImage) {
        const logoDims = logoImage.scale(0.03); 
        const logoX = width - logoDims.width - 50;
        const logoY = textBlockStartY - (textBlockHeight / 2) - (logoDims.height / 2);
        page.drawImage(logoImage, { x: logoX, y: logoY, width: logoDims.width, height: logoDims.height });
    }

    return currentY;
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
            if (!response.ok) { console.error(`Nie udało się pobrać pliku: ${path}. Plik pominięty.`); continue; }
            const pdfBytes = await response.arrayBuffer();
            try { loadedTemplatePDFs.push({doc: await PDFDocument.load(pdfBytes), path}); } 
            catch (parsingError) { console.error(`Błąd parsowania PDF: ${path}. Plik pominięty.`); }
        } catch (fetchError) { console.error(`Błąd sieci: ${path}. Plik pominięty.`); }
    }
    
    const findAndAddPage = async (pathFragment) => {
        const index = loadedTemplatePDFs.findIndex(p => p.path.includes(pathFragment));
        if (index > -1) {
            const pdfToCopy = loadedTemplatePDFs.splice(index, 1)[0];
            if (pdfToCopy) {
                const [copiedPage] = await pdfDoc.copyPages(pdfToCopy.doc, [0]);
                pdfDoc.addPage(copiedPage);
            }
        }
    };
    
    await findAndAddPage(pvOfferCommons.coverPage);

    const offerPage = pdfDoc.addPage();
    let lastContentPage = offerPage;
    const { width, height } = offerPage.getSize();
    let currentY = height - 55;
    
    const isStorageOnly = installationType === 'only-storage';
    const mainTitle = isStorageOnly ? "OFERTA NA MODERNIZACJĘ O MAGAZYN ENERGII" : "OFERTA INSTALACJI FOTOWOLTAICZNEJ";
    
    const mainOfferDetails = [
        { type: 'title', value: mainTitle },
        { label: 'Klient:', value: userName.toUpperCase() },
        { label: 'Moc instalacji:', value: !isStorageOnly && panelDetails ? `${panelDetails.totalPower.toFixed(2)} kWp` : null },
        { label: 'Typ instalacji:', value: isStorageOnly ? 'Modernizacja (Retrofit)' : (installationType === 'dach' ? 'Dachowa' : 'Gruntowa') },
        { label: 'Panele:', value: panelDetails?.name },
        { label: 'Falownik/Ładowarka:', value: inverterDetails?.name }
    ];
    currentY = drawHeaderBlock(offerPage, { regular: regularFont, bold: boldFont }, kamanLogoImage, mainOfferDetails, currentY);
    
    let mainTableData = [];
    if (!isStorageOnly) {
        mainTableData.push(['', panelDetails.name, panelDetails.description, 'szt.', panelDetails.count]);
        mainTableData.push(['', inverterDetails.name, inverterDetails.description, 'szt.', '1']);
        if (storageDetails) {
            const totalCapacity = (storageDetails.capacity * storageModules).toFixed(2);
            mainTableData.push(['', `${storageDetails.name} ${totalCapacity} kWh`, storageDetails.description, 'kpl.', '1']);
        }
        const scopeData = installationType === 'grunt' ? pvGroundMountScope : pvRoofMountScope;
        mainTableData.push(...scopeData);
    } else {
        const scopeTitle = "Komponenty i zakres prac";
        mainTableData = JSON.parse(JSON.stringify(pvStorageScope));
        
        mainTableData.unshift(['', inverterDetails.name, inverterDetails.description, 'szt.', '1']);
        
        const storageRowIndex = mainTableData.findIndex(row => row[1].includes('Zestaw magazynowania energii'));
        if(storageRowIndex > -1) {
            const totalCapacity = (storageDetails.capacity * storageModules).toFixed(2);
            mainTableData.splice(storageRowIndex, 0, ['', `${storageDetails.name} (${totalCapacity} kWh)`, storageDetails.description, 'kpl.', '1']);
            mainTableData.splice(storageRowIndex + 1, 1);
        }
    }
    
    mainTableData = mainTableData.map((row, index) => { row[0] = String(index + 1); return row; });
    
    currentY -= 10; 
    let tableResult = await drawTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, mainTableData, currentY, "Komponenty i zakres prac");
    lastContentPage = tableResult.finalPage;

    if (storageDetails && !isStorageOnly) {
        const storageScopePage = pdfDoc.addPage();
        lastContentPage = storageScopePage;
        let scopeY = height - 60;
        
        const scopeTitle = "Zakres prac – instalacja magazynu energii";
        const storageDetailsList = [
            { type: 'title', value: scopeTitle },
            { label: 'Klient:', value: userName.toUpperCase() },
            { label: 'Pojemność magazynu:', value: `${(storageDetails.capacity * storageModules).toFixed(2)} kWh` },
            { label: 'Moc ładowania/rozł.:', value: `${(storageDetails.capacity * storageModules / 2).toFixed(2)} kW` },
        ];
        scopeY = drawHeaderBlock(storageScopePage, { regular: regularFont, bold: boldFont }, kamanLogoImage, storageDetailsList, scopeY);
        
        let scopeTableData = JSON.parse(JSON.stringify(pvStorageScope));
        scopeTableData[1][4] = String(storageModules);
        
        scopeTableData = scopeTableData.map((row, index) => {
            row[0] = String(index + 1);
            return row;
        });
        
        scopeY -= 20;
        tableResult = await drawTable(pdfDoc, storageScopePage, { regular: regularFont, bold: boldFont }, scopeTableData, scopeY, "Szczegółowy zakres prac");
        lastContentPage = tableResult.finalPage;
    }
    
    const priceText = `CENA KOŃCOWA: ${price} PLN brutto (VAT 8%)`;
    const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 14);
    lastContentPage.drawText(priceText, { x: width - priceTextWidth - 50, y: 50, font: boldFont, size: 14, color: rgb(0.6, 0, 0.15) });
    lastContentPage.drawText(`Oferta ważna 14 dni.`, { x: 50, y: 50, font: regularFont, size: 9, color: rgb(0.4, 0.4, 0.4) });
    
    for (const templateDoc of loadedTemplatePDFs) {
      const pageIndices = templateDoc.doc.getPageIndices();
      for (const pageIndex of pageIndices) {
        const [copiedPage] = await pdfDoc.copyPages(templateDoc.doc, [pageIndex]);
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