// Pełna, poprawna zawartość pliku: src/utils/pdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getTableData } from '../data/tables';
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets';
import { opcjeDlaPompCiepla, opcjeDlaKotlow } from '../data/tables/opcjeDodatkowe.js';
import { opcjeKotlospawProducent, opcjeLazarProducent } from '../data/tables/opcjeProducenta.js';

// --- Funkcje pomocnicze ---

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

function drawTable(pdfDoc, initialPage, fonts, tableData, startY, customConfig = {}) {
    let currentPage = initialPage;
    let currentY = startY;
    const { regular: regularFont, bold: boldFont } = fonts;
    
    const defaultConfig = {
        columnWidths: [30, 160, 250, 35, 35],
        headerHeight: 22,
        padding: { top: 5, bottom: 5, left: 5, right: 5 },
        headerFontSize: 9.5,
        contentFontSize: 8.5,
        descriptionFontSize: 7.5,
        lineHeight: 1.3,
        lineColor: rgb(0.8, 0.8, 0.8),
        headerBgColor: rgb(0.6, 0, 0.15),
        headerFontColor: rgb(1, 1, 1),
        rowFontColor: rgb(0.1, 0.1, 0.1),
        evenRowBgColor: rgb(0.98, 0.96, 0.96),
        pageMargins: { top: 40, bottom: 40 }
    };

    const tableConfig = { ...defaultConfig, ...customConfig };

    const tableWidth = tableConfig.columnWidths.reduce((a, b) => a + b, 0);
    const tableStartX = (currentPage.getWidth() - tableWidth) / 2;

    const columnPositions = [tableStartX];
    for (let i = 0; i < tableConfig.columnWidths.length; i++) {
        columnPositions.push(columnPositions[i] + tableConfig.columnWidths[i]);
    }
    
    let tableSegmentTopY = startY;

    const drawHeader = (page, y) => {
        const headerY = y - tableConfig.headerHeight;
        page.drawRectangle({
            x: tableStartX, y: headerY, width: tableWidth,
            height: tableConfig.headerHeight, color: tableConfig.headerBgColor,
        });
        const headers = ['Lp.', 'Nazwa towaru', 'Opis', 'J.m.', 'Ilość'];
        const headerTextY = headerY + (tableConfig.headerHeight - tableConfig.headerFontSize) / 2;
        headers.forEach((header, i) => {
            const textWidth = fonts.bold.widthOfTextAtSize(header, tableConfig.headerFontSize);
            page.drawText(header, {
                x: columnPositions[i] + (tableConfig.columnWidths[i] - textWidth) / 2,
                y: headerTextY,
                font: fonts.bold, size: tableConfig.headerFontSize, color: tableConfig.headerFontColor,
            });
        });
        return headerY;
    };

    currentY = drawHeader(currentPage, currentY);

    tableData.forEach((row, rowIndex) => {
        const [lp, name, unit, quantity, description] = row;        
        
        const nameLines = wrapText(name, regularFont, tableConfig.contentFontSize, tableConfig.columnWidths[1] - (tableConfig.padding.left * 2));
        const descLines = wrapText(description || '', regularFont, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - (tableConfig.padding.left * 2));
        
        const rowHeight = Math.max(
            nameLines.length * tableConfig.contentFontSize * tableConfig.lineHeight, 
            descLines.length * tableConfig.descriptionFontSize * tableConfig.lineHeight
        ) + tableConfig.padding.top + tableConfig.padding.bottom;

        if (currentY - rowHeight < tableConfig.pageMargins.bottom) {
            for (let i = 0; i <= tableConfig.columnWidths.length; i++) { currentPage.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableSegmentTopY }, thickness: 0.5, color: tableConfig.lineColor }); }
            currentPage = pdfDoc.addPage();
            currentY = currentPage.getHeight() - tableConfig.pageMargins.top;
            tableSegmentTopY = currentY;
            currentY = drawHeader(currentPage, currentY);
        }

        const rowY = currentY - rowHeight;
        if (rowIndex % 2 === 1) { currentPage.drawRectangle({ x: tableStartX, y: rowY, width: tableWidth, height: rowHeight, color: tableConfig.evenRowBgColor }); }
        
        const drawCenteredTextInCell = (text, colIndex, fontSize) => {
            const textWidth = regularFont.widthOfTextAtSize(String(text), fontSize);
            const textHeight = regularFont.heightAtSize(fontSize);
            currentPage.drawText(String(text), {
                x: columnPositions[colIndex] + (tableConfig.columnWidths[colIndex] - textWidth) / 2,
                y: rowY + (rowHeight - textHeight) / 2,
                font: regularFont,
                size: fontSize,
                color: tableConfig.rowFontColor,
            });
        };
        
        let nameTextY = rowY + rowHeight - tableConfig.padding.top - tableConfig.contentFontSize;
        nameLines.forEach(line => {
            currentPage.drawText(line, { x: columnPositions[1] + tableConfig.padding.left, y: nameTextY, font: regularFont, size: tableConfig.contentFontSize, color: tableConfig.rowFontColor });
            nameTextY -= tableConfig.contentFontSize * tableConfig.lineHeight;
        });

        let descTextY = rowY + rowHeight - tableConfig.padding.top - tableConfig.descriptionFontSize;
        descLines.forEach(line => {
             currentPage.drawText(line, { x: columnPositions[2] + tableConfig.padding.left, y: descTextY, font: regularFont, size: tableConfig.descriptionFontSize, color: tableConfig.rowFontColor });
            descTextY -= tableConfig.descriptionFontSize * tableConfig.lineHeight;
        });
        
        drawCenteredTextInCell(lp, 0, tableConfig.contentFontSize);
        drawCenteredTextInCell(unit, 3, tableConfig.contentFontSize);
        drawCenteredTextInCell(quantity, 4, tableConfig.contentFontSize);

        currentY = rowY;
        currentPage.drawLine({ start: { x: tableStartX, y: currentY }, end: { x: tableStartX + tableWidth, y: currentY }, thickness: 0.5, color: tableConfig.lineColor });
    });

    for (let i = 0; i <= tableConfig.columnWidths.length; i++) { currentPage.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableSegmentTopY }, thickness: 0.5, color: tableConfig.lineColor }); }
    
    return { finalY: currentY, finalPage: currentPage };
}


function drawExtrasPage(page, fonts, data, title) {
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const { regular: regularFont, bold: boldFont } = fonts;
    const maroonColor = rgb(0.6, 0, 0.15);
    const whiteColor = rgb(1, 1, 1);
    const textColor = rgb(0.1, 0.1, 0.1);
    const evenRowBgColor = rgb(0.98, 0.96, 0.96);
    const lineColor = rgb(0.85, 0.85, 0.85);
    const titleFontSize = 14;
    const topBannerHeight = 40;
    const tableConfig = {
        columnWidths: [30, 220, 140, 40, 80],
        headerHeight: 22,
        padding: { top: 6, bottom: 6, left: 5, right: 5 },
        headerFontSize: 9.5,
        contentFontSize: 8.5,
        descriptionFontSize: 7.8,
    };
    const tableWidth = tableConfig.columnWidths.reduce((a, b) => a + b, 0);
    
    // --- ZMIANA 1: Zmniejszenie czcionki i interlinii w stopce ---
    const footerText = "UWAGI: OPCJE DODATKOWE NIE SĄ WYMAGANE PRZEZ PRODUCENTÓW* DO PRACY INSTALACJI I O ICH ZASADNOŚCI KAŻDORAZOWO NALEŻY KONSULTOWAĆ SIĘ Z OPIEKUNEM HANDLOWYM LUB DORADCĄ TECHNICZNYM";
    const footerFontSize = 7.5; // Zmniejszono z 9
    const footerLineHeight = footerFontSize * 1.3; // Zmniejszono z 1.4

    const footerLines = wrapText(footerText, boldFont, footerFontSize, pageWidth - 80);
    const bottomBannerHeight = (footerLines.length * footerLineHeight) + 20; // Zmniejszono padding (z 30 na 20)
    let currentY = pageHeight;
    page.drawRectangle({ x: 0, y: currentY - topBannerHeight, width: pageWidth, height: topBannerHeight, color: maroonColor });
    const titleWidth = boldFont.widthOfTextAtSize(title, titleFontSize);
    page.drawText(title, {
        x: (pageWidth - titleWidth) / 2,
        y: currentY - topBannerHeight + (topBannerHeight - titleFontSize) / 2,
        font: boldFont, size: titleFontSize, color: whiteColor,
    });
    currentY -= (topBannerHeight + 20);
    const tableX = (pageWidth - tableWidth) / 2;
    const tableStartY = currentY;
    const columnPositions = [tableX];
    for (let i = 0; i < tableConfig.columnWidths.length; i++) {
        columnPositions.push(columnPositions[i] + tableConfig.columnWidths[i]);
    }
    
    const headerY = currentY - tableConfig.headerHeight;
    page.drawRectangle({ x: tableX, y: headerY, width: tableWidth, height: tableConfig.headerHeight, color: maroonColor });
    const headers = ['Lp.', 'Nazwa towaru', 'Opis', 'J.m.', 'Cena'];
    const headerTextY = headerY + (tableConfig.headerHeight - tableConfig.headerFontSize) / 2;
    headers.forEach((header, i) => {
        const textWidth = boldFont.widthOfTextAtSize(header, tableConfig.headerFontSize);
        page.drawText(header, { x: columnPositions[i] + (tableConfig.columnWidths[i] - textWidth) / 2, y: headerTextY, size: tableConfig.headerFontSize, font: boldFont, color: whiteColor });
    });
    currentY = headerY;
    let segmentTopY = tableStartY;
    data.forEach((row, rowIndex) => {
        if (row.type === 'separator') {
            for (let i = 0; i <= tableConfig.columnWidths.length; i++) { page.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: segmentTopY }, thickness: 0.5, color: lineColor }); }
            const separatorBannerHeight = 22;
            currentY -= separatorBannerHeight;
            page.drawRectangle({ x: tableX, y: currentY, width: tableWidth, height: separatorBannerHeight, color: maroonColor });
            const separatorTitleWidth = boldFont.widthOfTextAtSize(row.title, tableConfig.headerFontSize);
            page.drawText(row.title, {
                x: tableX + (tableWidth - separatorTitleWidth) / 2,
                y: currentY + (separatorBannerHeight - tableConfig.headerFontSize) / 2,
                font: boldFont, size: tableConfig.headerFontSize, color: whiteColor,
            });
            segmentTopY = currentY;
            return; 
        }
        const [lp, name, description, unit, price] = row;
        const nameLines = wrapText(name, regularFont, tableConfig.contentFontSize, tableConfig.columnWidths[1] - 10);
        const descLines = wrapText(description, regularFont, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - 10);
        const dynamicRowHeight = Math.max(nameLines.length * tableConfig.contentFontSize * 1.3, descLines.length * tableConfig.descriptionFontSize * 1.3) + tableConfig.padding.top + tableConfig.padding.bottom;
        currentY -= dynamicRowHeight;
        if (rowIndex % 2 === 0) { page.drawRectangle({ x: tableX, y: currentY, width: tableWidth, height: dynamicRowHeight, color: evenRowBgColor }); }
        const textStartY = currentY + dynamicRowHeight - tableConfig.padding.top - tableConfig.contentFontSize;
        const descTextStartY = currentY + dynamicRowHeight - tableConfig.padding.top - tableConfig.descriptionFontSize;
        page.drawText(String(lp), { x: columnPositions[0] + (tableConfig.columnWidths[0] - regularFont.widthOfTextAtSize(String(lp), tableConfig.contentFontSize)) / 2, y: textStartY, size: tableConfig.contentFontSize, font: regularFont, color: textColor });
        let nameY = textStartY;
        nameLines.forEach(line => { page.drawText(line, { x: columnPositions[1] + 5, y: nameY, size: tableConfig.contentFontSize, font: regularFont, color: textColor, lineHeight: tableConfig.contentFontSize * 1.3 }); nameY -= tableConfig.contentFontSize * 1.3; });
        let descY = descTextStartY;
        descLines.forEach(line => { page.drawText(line, { x: columnPositions[2] + 5, y: descY, size: tableConfig.descriptionFontSize, font: regularFont, color: textColor, lineHeight: tableConfig.descriptionFontSize * 1.3 }); descY -= tableConfig.descriptionFontSize * 1.3; });
        page.drawText(unit, { x: columnPositions[3] + (tableConfig.columnWidths[3] - regularFont.widthOfTextAtSize(unit, tableConfig.contentFontSize)) / 2, y: textStartY, size: tableConfig.contentFontSize, font: regularFont, color: textColor });
        page.drawText(String(price), { x: columnPositions[4] + (tableConfig.columnWidths[4] - regularFont.widthOfTextAtSize(String(price), tableConfig.contentFontSize)) / 2, y: textStartY, size: tableConfig.contentFontSize, font: regularFont, color: textColor });
        page.drawLine({ start: { x: tableX, y: currentY }, end: { x: tableX + tableWidth, y: currentY }, thickness: 0.5, color: lineColor });
    });
    for (let i = 0; i <= tableConfig.columnWidths.length; i++) { page.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: segmentTopY }, thickness: 0.5, color: lineColor }); }
    
    // --- ZMIANA 2: Przesunięcie banera wyżej i zapewnienie, że nie wyjdzie poza stronę ---
    currentY = Math.max(bottomBannerHeight, currentY - 20); // Zapewnia, że jest miejsce na baner

    page.drawRectangle({ x: 0, y: currentY - bottomBannerHeight, width: pageWidth, height: bottomBannerHeight, color: maroonColor });
    const totalTextHeight = footerLines.length * footerLineHeight - (footerLineHeight - footerFontSize);
    let footerTextY = (currentY - bottomBannerHeight) + (bottomBannerHeight + totalTextHeight) / 2 - footerFontSize;
    footerLines.forEach(line => {
        const lineWidth = boldFont.widthOfTextAtSize(line, footerFontSize);
        page.drawText(line, { x: (pageWidth - lineWidth) / 2, y: footerTextY, font: boldFont, size: footerFontSize, color: whiteColor });
        footerTextY -= footerLineHeight;
    });
}

function prepareTableData(deviceType, model, tankCapacity, bufferCapacity, systemType, offerOptions, isKotel, quantityOptions, isAc) {
    let mainTableData = getTableData(deviceType, model, tankCapacity, bufferCapacity, systemType, isAc);

    // Warunek, który naprawia kolejność kolumn TYLKO dla klimatyzacji.
    // Dane źródłowe dla AC mają format: [Lp, Nazwa, J.m., Ilość, Opis]
    // Oczekiwany format przez funkcję rysującą to: [Lp, Nazwa, Opis, J.m., Ilość]
    if (isAc) {
        mainTableData = mainTableData.map(row => {
            const [lp, name, description, unit, quantity,] = row;
            // Zwraca wiersz w nowej, poprawnej kolejności
            return [lp, name, unit, description, quantity];
        });
    }

    let extrasTableData = isKotel ? [...opcjeDlaKotlow] : [...opcjeDlaPompCiepla];

    // Dodawanie opcji od producentów kotłów
    const kotlospawDeviceTypes = ["Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid"];
    if (kotlospawDeviceTypes.includes(deviceType)) {
        extrasTableData.push({ type: 'separator', title: 'WYPOSAŻENIE UZUPEŁNIAJĄCE (OPCJONALNIE) OD PRODUCENTA' });
        extrasTableData.push(...opcjeKotlospawProducent);
    } else if (deviceType === 'LAZAR') {
        extrasTableData.push({ type: 'separator', title: 'WYPOSAŻENIE UZUPEŁNIAJĄCE (OPCJONALNIE) OD PRODUCENTA' });
        extrasTableData.push(...opcjeLazarProducent);
    }

    // Obsługa niestandardowej ilości jednostek dla pomp ciepła
    if (!isKotel && !isAc && quantityOptions.isCustom) {
        const outdoorUnitIndex = mainTableData.findIndex(row => row[1] && row[1].toLowerCase().includes('jednostka zew'));
        if (outdoorUnitIndex !== -1) mainTableData[outdoorUnitIndex][4] = String(quantityOptions.outdoor);
        
        const indoorUnitIndex = mainTableData.findIndex(row => row[1] && (row[1].toLowerCase().includes('hydrobox') || row[1].toLowerCase().includes('cylinder')));
        if (indoorUnitIndex !== -1) mainTableData[indoorUnitIndex][4] = String(quantityOptions.indoor);
    }

    // Przenoszenie opcji (demontaż, podbudowa, wentylator) z tabeli dodatków do tabeli głównej
    const movableItems = [
        { key: 'podbudowa', name: 'Wykonanie podbudowy pod jednostkę zewnętrzną', applicable: () => !isKotel && !isAc },
        { key: 'demontaz', name: 'Demontaż starego źródła ciepła', applicable: () => !isAc },
        { key: 'exhaustFan', name: 'Wentylator wyciągowy', applicable: () => isKotel },
    ];
    
    movableItems.forEach(item => {
        if (offerOptions[item.key] && item.applicable()) {
            let itemIndexInExtras = extrasTableData.findIndex(row => row[1] && row[1].includes(item.name));
            if (itemIndexInExtras > -1) {
                const [itemRow] = extrasTableData.splice(itemIndexInExtras, 1);
                // Format wiersza dla tabeli głównej: [lp, nazwa, opis, jm, ilość]
                const itemRowForMainTable = ['', itemRow[1], itemRow[2], itemRow[3], '1'];
                
                let insertAtIndex = mainTableData.findIndex(row => row[1] && row[1].includes("Dokumentacja powykonawcza"));
                if (insertAtIndex === -1) {
                    insertAtIndex = mainTableData.length > 2 ? mainTableData.length - 2 : 1;
                }
                
                mainTableData.splice(insertAtIndex, 0, itemRowForMainTable);
            }
        }
    });

    // Usunięcie wiersza o dotacji, jeśli opcja jest odznaczona
    if (offerOptions.dotacja === false) {
        mainTableData = mainTableData.filter(row => !row[1] || !row[1].includes('Pomoc w uzyskaniu dotacji'));
    }

    // Ponowne numerowanie wierszy w tabeli głównej
    mainTableData.forEach((row, index) => {
        row[0] = String(index + 1);
    });

    return { mainTableData, extrasTableData };
}

/**
 * Główna funkcja generująca dokument PDF oferty.
 */
export async function generateOfferPDF(
  cena, userName, deviceType, model, tankCapacity, bufferCapacity, systemType,
  offerOptions, isNettoPrice, quantityOptions, showPrice
) {
    if (!userName?.trim()) {
        alert('Uzupełnij pole Imię i Nazwisko!');
        return null;
    }

    // Definicje typów urządzeń
    const kotlyDeviceTypes = ["LAZAR", "Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "QMPELL", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid"];
    const acDeviceTypes = ['MITSUBISHI AY', 'MITSUBISHI HR', 'VIVAX Y-Design', 'VIVAX H-Design', 'VIVAX M-Design', 'VIVAX Q-Design', 'VIVAX N-Design'];
    const isKotel = kotlyDeviceTypes.includes(deviceType);
    const isAc = acDeviceTypes.includes(deviceType);

    try {
        // Asynchroniczne ładowanie zasobów (szablony, fonty, logo)
        const selectedTemplatePaths = getTemplatePathsForDevice(deviceType);
        const assetPaths = [ ...selectedTemplatePaths, '/fonts/OpenSans-Bold.ttf', '/fonts/OpenSans-Regular.ttf', '/logos/kaman_logo.png' ];
        const assetBuffers = await Promise.all(assetPaths.map(path => fetch(path).then(res => res.ok ? res.arrayBuffer() : null).catch(() => null)));
        
        const kamanLogoBytes = assetBuffers.pop();
        const regularFontBytes = assetBuffers.pop();
        const boldFontBytes = assetBuffers.pop();
        const templatePdfBuffers = assetBuffers;

        // Inicjalizacja dokumentu PDF
        const finalPdfDoc = await PDFDocument.create();
        finalPdfDoc.registerFontkit(fontkit);
        const boldFont = await finalPdfDoc.embedFont(boldFontBytes);
        const regularFont = await finalPdfDoc.embedFont(regularFontBytes);
        const fonts = { regular: regularFont, bold: boldFont };
        
        let kamanLogoImage = null;
        if (kamanLogoBytes) kamanLogoImage = await finalPdfDoc.embedPng(kamanLogoBytes);

        // Dodawanie strony tytułowej z szablonu
        if (templatePdfBuffers[0]) {
            const okladkaDoc = await PDFDocument.load(templatePdfBuffers[0]);
            const [copiedPage] = await finalPdfDoc.copyPages(okladkaDoc, [0]);
            finalPdfDoc.addPage(copiedPage);
        }

        // Dodawanie strony dynamicznej z tabelą
        const dynamicPage = finalPdfDoc.addPage();
        const { width: pageWidth, height: pageHeight } = dynamicPage.getSize();
        
        const { mainTableData, extrasTableData } = prepareTableData(
            deviceType, model, tankCapacity, bufferCapacity, systemType, offerOptions, isKotel, quantityOptions, isAc
        );
        
        let currentY = pageHeight - 35;
        if (kamanLogoImage) {
            const logoDims = kamanLogoImage.scale(0.03); 
            dynamicPage.drawImage(kamanLogoImage, { x: (pageWidth - logoDims.width) / 2, y: currentY - logoDims.height, width: logoDims.width, height: logoDims.height });
            currentY -= (logoDims.height + 25);
        }
        
        const userNameText = `Oferta dla: ${userName}`;
        const userNameFontSize = 22;
        const userNameTextWidth = boldFont.widthOfTextAtSize(userNameText, userNameFontSize);
        dynamicPage.drawText(userNameText, { x: (pageWidth - userNameTextWidth) / 2, y: currentY, size: userNameFontSize, font: boldFont, color: rgb(0.7, 0, 0.16) });
        currentY -= (userNameFontSize + 20);

        // Rysowanie tabeli głównej
        const tableResult = await drawTable(finalPdfDoc, dynamicPage, fonts, mainTableData, currentY);
        let lastContentPage = tableResult.finalPage;
        let lastYPosAfterTable = tableResult.finalY;

        // Dodawanie ceny końcowej
        if (showPrice) {
            const priceSuffix = isNettoPrice ? 'PLN netto' : 'PLN brutto';
            const priceString = `Cena końcowa: ${cena} ${priceSuffix}`;
            const priceFontSize = 15;
            const priceTextWidth = boldFont.widthOfTextAtSize(priceString, priceFontSize);

            if (lastYPosAfterTable < 80) {
                 lastContentPage = finalPdfDoc.addPage();
                 lastYPosAfterTable = lastContentPage.getHeight() - 60;
            } else {
                 lastYPosAfterTable -= 40;
            }
            lastContentPage.drawText(priceString, { x: (lastContentPage.getWidth() - priceTextWidth) / 2, y: lastYPosAfterTable, size: priceFontSize, font: boldFont, color: rgb(0.7, 0, 0.16) });
        }
        
        // Dodawanie strony z opcjami dodatkowymi (jeśli dotyczy)
        if (!isAc && extrasTableData.some(row => row.type !== 'separator')) {
            let lpCounter = 1;
            const numberedExtrasData = extrasTableData.map(row => {
                if (row.type === 'separator') return row;
                return [String(lpCounter++), ...row.slice(1)];
            });
            const extrasPage = finalPdfDoc.addPage();
            drawExtrasPage(extrasPage, fonts, numberedExtrasData, 'WYPOSAŻENIE UZUPEŁNIAJĄCE (OPCJONALNIE)');
        }

        // Dodawanie pozostałych stron z szablonów
        for (let i = 1; i < templatePdfBuffers.length; i++) {
            if (templatePdfBuffers[i] && templatePdfBuffers[i].byteLength > 0) {
                try {
                    const templateDoc = await PDFDocument.load(templatePdfBuffers[i]);
                    for (const pageIndex of templateDoc.getPageIndices()) {
                        const [copiedPage] = await finalPdfDoc.copyPages(templateDoc, [pageIndex]);
                        finalPdfDoc.addPage(copiedPage);
                    }
                } catch(e) { console.error("Could not load template PDF buffer at index", i, e); }
            }
        }

        // Zapisanie dokumentu i zwrócenie jako Blob
        const pdfBytes = await finalPdfDoc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });

    } catch (error) {
        console.error('Błąd podczas generowania PDF:', error);
        alert(`Wystąpił błąd podczas generowania oferty: ${error.message}. Sprawdź konsolę.`);
        return null;
    }
}