import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getTableData } from '../data/tables';
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets';
import { opcjeDlaPompCiepla, opcjeDlaKotlow } from '../data/tables/opcjeDodatkowe.js';
import { opcjeKotlospawProducent, opcjeLazarProducent } from '../data/tables/opcjeProducenta.js';

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

// ZMIANA: Ta funkcja jest teraz wyeksportowana i ma poprawione szerokości kolumn
export function drawTable(pdfDoc, initialPage, fonts, tableData, startY) {
    let currentPage = initialPage;
    let currentY = startY;
    const { regular: regularFont, bold: boldFont } = fonts;
    const tableConfig = {
        columnWidths: [30, 160, 250, 35, 35], // Zmienione szerokości dla lepszego dopasowania
        headerHeight: 22,
        padding: { top: 4, bottom: 4, left: 5, right: 5 },
        headerFontSize: 9.5,
        contentFontSize: 8.5,
        descriptionFontSize: 7.5,
        lineColor: rgb(0.8, 0.8, 0.8),
        headerBgColor: rgb(0.6, 0, 0.15),
        headerFontColor: rgb(1, 1, 1),
        rowFontColor: rgb(0.1, 0.1, 0.1),
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
        // ZMIANA: Poprawiona kolejność odczytu danych z wiersza
        const [lp, name, unit, quantity, description] = row;
        const nameLines = wrapText(name, regularFont, tableConfig.contentFontSize, tableConfig.columnWidths[1] - 10);
        const descLines = wrapText(description || '', regularFont, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - 10);
        
        const rowHeight = Math.max(
            nameLines.length * tableConfig.contentFontSize * 1.3, 
            descLines.length * tableConfig.descriptionFontSize * 1.3
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
        
        const drawCenteredCellText = (lines, font, fontSize, cellBounds) => {
            const lineHeight = fontSize * 1.3;
            const textBlockHeight = lines.length * lineHeight - (lineHeight - fontSize);
            let textY = cellBounds.y + (cellBounds.height - textBlockHeight) / 2 + textBlockHeight - fontSize;

            lines.forEach(line => {
                const textWidth = font.widthOfTextAtSize(line, fontSize);
                let textX = cellBounds.x + 5; 
                if (cellBounds.isCentered) {
                    textX = cellBounds.x + (cellBounds.width - textWidth) / 2;
                }
                currentPage.drawText(line, { x: textX, y: textY, font, size: fontSize, color: tableConfig.rowFontColor });
                textY -= lineHeight;
            });
        };

        drawCenteredCellText([String(lp)], regularFont, tableConfig.contentFontSize, { x: columnPositions[0], y: rowY, width: tableConfig.columnWidths[0], height: rowHeight, isCentered: true });
        drawCenteredCellText(nameLines, regularFont, tableConfig.contentFontSize, { x: columnPositions[1], y: rowY, width: tableConfig.columnWidths[1], height: rowHeight });
        drawCenteredCellText(descLines, regularFont, tableConfig.descriptionFontSize, { x: columnPositions[2], y: rowY, width: tableConfig.columnWidths[2], height: rowHeight });
        drawCenteredCellText([String(unit)], regularFont, tableConfig.contentFontSize, { x: columnPositions[3], y: rowY, width: tableConfig.columnWidths[3], height: rowHeight, isCentered: true });
        drawCenteredCellText([String(quantity)], regularFont, tableConfig.contentFontSize, { x: columnPositions[4], y: rowY, width: tableConfig.columnWidths[4], height: rowHeight, isCentered: true });
        
        currentY = rowY;
        currentPage.drawLine({ start: { x: tableStartX, y: currentY }, end: { x: tableStartX + tableWidth, y: currentY }, thickness: 0.5, color: tableConfig.lineColor });
    });

    for (let i = 0; i <= tableConfig.columnWidths.length; i++) { currentPage.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: startY }, thickness: 0.5, color: tableConfig.lineColor }); }
    return currentY;
}

function drawExtrasPage(page, fonts, data, title, logoImage = null) {
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

    const footerText = "UWAGI: OPCJE DODATKOWE NIE SĄ WYMAGANE PRZEZ PRODUCENTÓW* DO PRACY INSTALACJI I O ICH ZASADNOŚCI KAŻDORAZOWO NALEŻY KONSULTOWAĆ SIĘ Z OPIEKUNEM HANDLOWYM LUB DORADCĄ TECHNICZNYM";
    const footerFontSize = 9;
    const footerLineHeight = footerFontSize * 1.4;
    const footerLines = wrapText(footerText, boldFont, footerFontSize, pageWidth - 80);
    const bottomBannerHeight = (footerLines.length * footerLineHeight) + 30;

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

    currentY -= 30;
    page.drawRectangle({ x: 0, y: currentY - bottomBannerHeight, width: pageWidth, height: bottomBannerHeight, color: maroonColor });
    const totalTextHeight = footerLines.length * footerLineHeight - (footerLineHeight - footerFontSize);
    let footerTextY = (currentY - bottomBannerHeight) + (bottomBannerHeight + totalTextHeight) / 2 - footerFontSize;
    footerLines.forEach(line => {
        const lineWidth = boldFont.widthOfTextAtSize(line, footerFontSize);
        page.drawText(line, { x: (pageWidth - lineWidth) / 2, y: footerTextY, font: boldFont, size: footerFontSize, color: whiteColor });
        footerTextY -= footerLineHeight;
    });
}

function prepareTableData(deviceType, model, tankCapacity, bufferCapacity, systemType, offerOptions, isKotel, quantityOptions) {
    let mainTableData = getTableData(deviceType, model, tankCapacity, bufferCapacity, systemType);
    let extrasTableData = isKotel ? [...opcjeDlaKotlow] : [...opcjeDlaPompCiepla];

    if (!isKotel && quantityOptions.isCustom) {
        const outdoorUnitIndex = mainTableData.findIndex(row => row[1] && row[1].toLowerCase().includes('jednostka zew'));
        if (outdoorUnitIndex !== -1) {
            mainTableData[outdoorUnitIndex][3] = String(quantityOptions.outdoor); 
        }

        const indoorUnitIndex = mainTableData.findIndex(row => row[1] && (row[1].toLowerCase().includes('hydrobox') || row[1].toLowerCase().includes('cylinder')));
        if (indoorUnitIndex !== -1) {
            mainTableData[indoorUnitIndex][3] = String(quantityOptions.indoor);
        }
    }

    const movableItems = [
        { key: 'demontaz', name: 'Demontaż starego źródła ciepła', applicable: () => true },
        { key: 'podbudowa', name: 'Wykonanie podbudowy pod jednostkę zewnętrzną', applicable: () => !isKotel }
    ];

    movableItems.forEach(item => {
        if (offerOptions[item.key] && item.applicable()) {
            const itemIndexInExtras = extrasTableData.findIndex(row => row[1] && row[1].includes(item.name));
            if (itemIndexInExtras > -1) {
                const [itemRow] = extrasTableData.splice(itemIndexInExtras, 1);
                // ZMIANA: Poprawiony format tworzenia wiersza, aby pasował do reszty danych
                // Prawidłowy format: [lp, nazwa, jm, ilosc, opis]
                const itemRowForMainTable = ['', itemRow[1], itemRow[3], '1', itemRow[2]];
                
                const insertionKeywords = ["Montaż systemu grzewczego", "Podłączenie do istniejącej instalacji"];
                let insertAtIndex = mainTableData.findIndex(row => insertionKeywords.some(keyword => row[1] && row[1].includes(keyword)));
                if (insertAtIndex === -1) {
                    const fallbackIndex = mainTableData.findIndex(row => row[1] && row[1].includes("Dokumentacja powykonawcza"));
                    insertAtIndex = fallbackIndex > -1 ? fallbackIndex : mainTableData.length - 2;
                }
                mainTableData.splice(insertAtIndex, 0, itemRowForMainTable);
            }
        }
    });

    mainTableData = mainTableData.map((row, index) => {
        row[0] = String(index + 1);
        return row;
    });

    return { mainTableData, extrasTableData };
}


export async function generateOfferPDF(
  cena,
  userName,
  deviceType,
  model,
  tankCapacity,
  bufferCapacity,
  systemType,
  offerOptions,
  isNettoPrice,
  quantityOptions // <-- NOWY PARAMETR
) {
    if (!userName?.trim() || !String(cena).trim()) {
        alert('Uzupełnij wszystkie wymagane pola: Imię i nazwisko oraz cena!');
        return null;
    }

    const kotlyDeviceTypes = ["LAZAR", "Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "QMPELL", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid"];
    const isKotel = kotlyDeviceTypes.includes(deviceType);
    const kotlospawDeviceTypes = ["Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid"];

    try {
        const selectedTemplatePaths = getTemplatePathsForDevice(deviceType);
        const assetPaths = [ ...selectedTemplatePaths, '/fonts/OpenSans-Bold.ttf', '/fonts/OpenSans-Regular.ttf', '/logos/kaman_logo.png' ];
        const assetBuffers = await Promise.all(assetPaths.map(path => fetch(path).then(res => res.ok ? res.arrayBuffer() : null).catch(() => null)));
        
        const kamanLogoBytes = assetBuffers.pop();
        const regularFontBytes = assetBuffers.pop();
        const boldFontBytes = assetBuffers.pop();
        const templatePdfBuffers = assetBuffers;

        const finalPdfDoc = await PDFDocument.create();
        finalPdfDoc.registerFontkit(fontkit);
        const boldFont = await finalPdfDoc.embedFont(boldFontBytes);
        const regularFont = await finalPdfDoc.embedFont(regularFontBytes);
        
        let kamanLogoImage = null;
        try { if (kamanLogoBytes) kamanLogoImage = await finalPdfDoc.embedPng(kamanLogoBytes); } 
        catch (e) { console.error("Błąd ładowania logo KAMAN.", e); }

        if (templatePdfBuffers[0]) {
            const okladkaDoc = await PDFDocument.load(templatePdfBuffers[0]);
            const [copiedPage] = await finalPdfDoc.copyPages(okladkaDoc, [0]);
            finalPdfDoc.addPage(copiedPage);
        }

        const dynamicPage = finalPdfDoc.addPage();
        const { width: pageWidth, height: pageHeight } = dynamicPage.getSize();
        
        // ZMIANA: Przekazanie `quantityOptions` do funkcji przygotowującej dane
        const { mainTableData, extrasTableData } = prepareTableData(
            deviceType, model, tankCapacity, bufferCapacity, systemType, offerOptions, isKotel, quantityOptions
        );
        
        let currentY = pageHeight - 35;
        
        if (kamanLogoImage) {
            const logoDims = kamanLogoImage.scale(0.05); 
            dynamicPage.drawImage(kamanLogoImage, { x: (pageWidth - logoDims.width) / 2, y: currentY - logoDims.height, width: logoDims.width, height: logoDims.height });
            currentY -= (logoDims.height + 25);
        }
        
        const userNameText = `Oferta dla: ${userName}`;
        const userNameFontSize = 22;
        const userNameTextWidth = boldFont.widthOfTextAtSize(userNameText, userNameFontSize);
        dynamicPage.drawText(userNameText, { x: (pageWidth - userNameTextWidth) / 2, y: currentY, size: userNameFontSize, font: boldFont, color: rgb(0.7, 0, 0.16) });
        currentY -= (userNameFontSize + 20);
        
        let lastYPosAfterTable = drawTable(finalPdfDoc, dynamicPage, { regular: regularFont, bold: boldFont }, mainTableData, currentY);

        const priceSuffix = isNettoPrice ? 'PLN netto' : 'PLN brutto';
        const priceString = `Cena końcowa: ${cena} ${priceSuffix}`;
        const priceFontSize = 15;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceString, priceFontSize);

        let pageForPrice = finalPdfDoc.getPage(finalPdfDoc.getPageCount() - 1);
        let priceYPosition = lastYPosAfterTable - 40;

        if (priceYPosition < 40) {
             pageForPrice = finalPdfDoc.addPage();
             priceYPosition = pageForPrice.getHeight() - 60;
        }
        
        pageForPrice.drawText(priceString, { x: (pageForPrice.getWidth() - priceTextWidth) / 2, y: priceYPosition, size: priceFontSize, font: boldFont, color: rgb(0.7, 0, 0.16) });
        
        let finalExtrasData = [...extrasTableData];
        let producerOptions = null;
        if (kotlospawDeviceTypes.includes(deviceType)) {
            producerOptions = opcjeKotlospawProducent;
        } else if (deviceType === 'LAZAR') {
            producerOptions = opcjeLazarProducent;
        }

        if (producerOptions && producerOptions.length > 0) {
            finalExtrasData.push({ type: 'separator', title: 'WYPOSAŻENIE UZUPEŁNIAJĄCE (OPCJONALNIE) OD PRODUCENTA' });
            finalExtrasData.push(...producerOptions);
        }
        
        if (finalExtrasData.some(row => row.type !== 'separator')) {
            let lpCounter = 1;
            const numberedExtrasData = finalExtrasData.map(row => {
                if (row.type === 'separator') return row;
                const newRow = [...row];
                newRow[0] = String(lpCounter++);
                return newRow;
            });
            
            const extrasPage = finalPdfDoc.addPage();
            drawExtrasPage(extrasPage, {regular: regularFont, bold: boldFont}, numberedExtrasData, 'WYPOSAŻENIE UZUPEŁNIAJĄCE (OPCJONALNIE)');
        }

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

        const pdfBytes = await finalPdfDoc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });

    } catch (error) {
        console.error('Błąd podczas generowania PDF:', error);
        alert(`Wystąpił błąd podczas generowania oferty: ${error.message}. Sprawdź konsolę.`);
        return null;
    }
}