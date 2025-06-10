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

function drawTable(pdfDoc, initialPage, fonts, tableData, startY) {
    let currentPage = initialPage;
    let currentY = startY;

    const tableConfig = {
        x: 50,
        columnWidths: [30, 150, 240, 40, 50],
        headerHeight: 22,
        padding: { top: 5, bottom: 5, left: 5, right: 5 },
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
    const columnPositions = [tableConfig.x];
    for (let i = 0; i < tableConfig.columnWidths.length; i++) {
        columnPositions.push(columnPositions[i] + tableConfig.columnWidths[i]);
    }

    let tableSegmentTopY = startY;

    const drawHeader = (page, y) => {
        const headerTextY = (y - tableConfig.headerHeight) + (tableConfig.headerHeight - tableConfig.headerFontSize) / 2;
        page.drawRectangle({
            x: tableConfig.x, y: y - tableConfig.headerHeight, width: tableWidth,
            height: tableConfig.headerHeight, color: tableConfig.headerBgColor,
        });
        const headers = ['Lp.', 'Nazwa towaru', 'Opis', 'J.m.', 'Ilość'];
        headers.forEach((header, i) => {
            const textWidth = fonts.bold.widthOfTextAtSize(header, tableConfig.headerFontSize);
            page.drawText(header, {
                x: columnPositions[i] + (tableConfig.columnWidths[i] - textWidth) / 2,
                y: headerTextY,
                font: fonts.bold, size: tableConfig.headerFontSize, color: tableConfig.headerFontColor,
            });
        });
        return y - tableConfig.headerHeight;
    };

    currentY = drawHeader(currentPage, currentY);

    tableData.forEach((row, rowIndex) => {
        const [lp, name, unit, quantity, description] = row;
        const nameLines = wrapText(name, fonts.regular, tableConfig.contentFontSize, tableConfig.columnWidths[1] - 10);
        const descLines = wrapText(description || '', fonts.regular, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - 10);
        
        const rowHeight = Math.max(
            nameLines.length * tableConfig.contentFontSize * 1.3, 
            descLines.length * tableConfig.descriptionFontSize * 1.3
        ) + tableConfig.padding.top + tableConfig.padding.bottom;

        if (currentY - rowHeight < tableConfig.pageMargins.bottom) {
            for (let i = 0; i <= tableConfig.columnWidths.length; i++) {
                currentPage.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableSegmentTopY }, thickness: 0.5, color: tableConfig.lineColor });
            }
            currentPage = pdfDoc.addPage();
            currentY = currentPage.getHeight() - tableConfig.pageMargins.top;
            tableSegmentTopY = currentY;
            currentY = drawHeader(currentPage, currentY);
        }

        const rowY = currentY - rowHeight;

        if (rowIndex % 2 === 1) {
            currentPage.drawRectangle({ x: tableConfig.x, y: rowY, width: tableWidth, height: rowHeight, color: tableConfig.evenRowBgColor });
        }
        
        const textBaseY = currentY - tableConfig.padding.top;
        
        currentPage.drawText(String(lp), { x: columnPositions[0] + (tableConfig.columnWidths[0] - fonts.regular.widthOfTextAtSize(String(lp), tableConfig.contentFontSize)) / 2, y: textBaseY - tableConfig.contentFontSize, font: fonts.regular, size: tableConfig.contentFontSize, color: tableConfig.rowFontColor });
        
        let nameY = textBaseY;
        nameLines.forEach(line => {
            currentPage.drawText(line, { x: columnPositions[1] + 5, y: nameY - tableConfig.contentFontSize, font: fonts.regular, size: tableConfig.contentFontSize, lineHeight: tableConfig.contentFontSize * 1.3, color: tableConfig.rowFontColor });
            nameY -= tableConfig.contentFontSize * 1.3;
        });

        let descY = textBaseY;
        descLines.forEach(line => {
            currentPage.drawText(line, { x: columnPositions[2] + 5, y: descY - tableConfig.descriptionFontSize, font: fonts.regular, size: tableConfig.descriptionFontSize, lineHeight: tableConfig.descriptionFontSize * 1.3, color: tableConfig.rowFontColor });
            descY -= tableConfig.descriptionFontSize * 1.3;
        });
        
        currentPage.drawText(String(unit), { x: columnPositions[3] + (tableConfig.columnWidths[3] - fonts.regular.widthOfTextAtSize(String(unit), tableConfig.contentFontSize)) / 2, y: textBaseY - tableConfig.contentFontSize, font: fonts.regular, size: tableConfig.contentFontSize, color: tableConfig.rowFontColor });
        currentPage.drawText(String(quantity), { x: columnPositions[4] + (tableConfig.columnWidths[4] - fonts.regular.widthOfTextAtSize(String(quantity), tableConfig.contentFontSize)) / 2, y: textBaseY - tableConfig.contentFontSize, font: fonts.regular, size: tableConfig.contentFontSize, color: tableConfig.rowFontColor });
        
        currentY -= rowHeight;
        currentPage.drawLine({ start: { x: tableConfig.x, y: currentY }, end: { x: tableConfig.x + tableWidth, y: currentY }, thickness: 0.5, color: tableConfig.lineColor });
    });

    for (let i = 0; i <= tableConfig.columnWidths.length; i++) {
        currentPage.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableSegmentTopY }, thickness: 0.5, color: tableConfig.lineColor });
    }

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
        columnWidths: [30, 220, 170, 40, 50],
        headerHeight: 22,
        padding: { top: 6, bottom: 6, left: 5, right: 5 },
        headerFontSize: 9.5,
        contentFontSize: 8.5,
        descriptionFontSize: 7.8,
    };
    const tableWidth = tableConfig.columnWidths.reduce((a, b) => a + b, 0);

    const footerText = "UWAGI: OPCJE DODATKOWE NIE SĄ WYMAGANE PRZEZ PRODUCENTÓW* DO PRACY INSTALACJI I O ICH ZASADNOŚCI KAŻDORAZOWO NALEŻY KONSULTOWAĆ SIĘ Z OPIEKUNEM HANDLOWYM LUB DORADCĄ TECHNICZNYM";
    const footerFontSize = 9;
    const footerLines = wrapText(footerText, boldFont, footerFontSize, pageWidth - 80);
    const bottomBannerHeight = (footerLines.length * footerFontSize * 1.5) + 30;

    let currentY = pageHeight;
    page.drawRectangle({ x: 0, y: currentY - topBannerHeight, width: pageWidth, height: topBannerHeight, color: maroonColor });
    const titleWidth = boldFont.widthOfTextAtSize(title, titleFontSize);
    page.drawText(title, {
        x: (pageWidth - titleWidth) / 2,
        y: currentY - topBannerHeight + (topBannerHeight - titleFontSize) / 2,
        font: boldFont, size: titleFontSize, color: whiteColor,
    });
    currentY -= topBannerHeight;

    if (logoImage) {
        currentY -= 15;
        const logoDims = logoImage.scale(0.15);
        page.drawImage(logoImage, {
            x: (pageWidth - logoDims.width) / 2,
            y: currentY - logoDims.height,
            width: logoDims.width,
            height: logoDims.height,
        });
        currentY -= (logoDims.height + 15);
    } else {
        currentY -= 30;
    }

    page.drawRectangle({ x: 0, y: 0, width: pageWidth, height: bottomBannerHeight, color: maroonColor });
    let footerTextY = bottomBannerHeight - 18;
    footerLines.forEach(line => {
        const lineWidth = boldFont.widthOfTextAtSize(line, footerFontSize);
        page.drawText(line, { x: (pageWidth - lineWidth) / 2, y: footerTextY, font: boldFont, size: footerFontSize, color: whiteColor, lineHeight: footerFontSize * 1.5 });
        footerTextY -= footerFontSize * 1.5;
    });

    let calculatedTableHeight = tableConfig.headerHeight;
    data.forEach(row => {
        const nameLines = wrapText(row[1], regularFont, tableConfig.contentFontSize, tableConfig.columnWidths[1] - 10);
        const descLines = wrapText(row[2], regularFont, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - 10);
        calculatedTableHeight += Math.max(nameLines.length * tableConfig.contentFontSize * 1.3, descLines.length * tableConfig.descriptionFontSize * 1.3) + tableConfig.padding.top + tableConfig.padding.bottom;
    });

    const freeSpace = currentY - bottomBannerHeight;
    const tableStartY = bottomBannerHeight + (freeSpace + calculatedTableHeight) / 2;
    currentY = tableStartY;

    const tableX = (pageWidth - tableWidth) / 2;
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

    data.forEach((row, rowIndex) => {
        const [lp, name, description, unit, price] = row;
        const nameLines = wrapText(name, regularFont, tableConfig.contentFontSize, tableConfig.columnWidths[1] - 10);
        const descLines = wrapText(description, regularFont, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - 10);
        const dynamicRowHeight = Math.max(nameLines.length * tableConfig.contentFontSize * 1.3, descLines.length * tableConfig.descriptionFontSize * 1.3) + tableConfig.padding.top + tableConfig.padding.bottom;
        currentY -= dynamicRowHeight;

        if (rowIndex % 2 === 0) { page.drawRectangle({ x: tableX, y: currentY, width: tableWidth, height: dynamicRowHeight, color: evenRowBgColor }); }
        
        const textStartY = currentY + dynamicRowHeight - tableConfig.padding.top - tableConfig.contentFontSize;
        const descTextStartY = currentY + dynamicRowHeight - tableConfig.padding.top - tableConfig.descriptionFontSize;

        page.drawText(lp, { x: columnPositions[0] + (tableConfig.columnWidths[0] - regularFont.widthOfTextAtSize(lp, tableConfig.contentFontSize)) / 2, y: textStartY, size: tableConfig.contentFontSize, font: regularFont, color: textColor });
        let nameY = textStartY;
        nameLines.forEach(line => { page.drawText(line, { x: columnPositions[1] + 5, y: nameY, size: tableConfig.contentFontSize, font: regularFont, color: textColor, lineHeight: tableConfig.contentFontSize * 1.3 }); nameY -= tableConfig.contentFontSize * 1.3; });
        let descY = descTextStartY;
        descLines.forEach(line => { page.drawText(line, { x: columnPositions[2] + 5, y: descY, size: tableConfig.descriptionFontSize, font: regularFont, color: textColor, lineHeight: tableConfig.descriptionFontSize * 1.3 }); descY -= tableConfig.descriptionFontSize * 1.3; });
        page.drawText(unit, { x: columnPositions[3] + (tableConfig.columnWidths[3] - regularFont.widthOfTextAtSize(unit, tableConfig.contentFontSize)) / 2, y: textStartY, size: tableConfig.contentFontSize, font: regularFont, color: textColor });
        page.drawText(price, { x: columnPositions[4] + (tableConfig.columnWidths[4] - regularFont.widthOfTextAtSize(price, tableConfig.contentFontSize)) / 2, y: textStartY, size: tableConfig.contentFontSize, font: regularFont, color: textColor });
        page.drawLine({ start: { x: tableX, y: currentY }, end: { x: tableX + tableWidth, y: currentY }, thickness: 0.5, color: lineColor });
    });

    for (let i = 0; i <= tableConfig.columnWidths.length; i++) { page.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableStartY }, thickness: 0.5, color: lineColor }); }
}


export async function generateOfferPDF(
  cena,
  userName,
  deviceType,
  model,
  tankCapacity,
  bufferCapacity,
  systemType
) {
    if (!userName?.trim() || !String(cena).trim()) {
        alert('Uzupełnij wszystkie wymagane pola: Imię i nazwisko oraz cena!');
        return null;
    }

    const kotlyDeviceTypes = ["LAZAR", "Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "QMPELL", "Kotlospaw drewko hybrid", "Kotlospaw drewko plus"];
    const isKotel = kotlyDeviceTypes.includes(deviceType);
    const kotlospawDeviceTypes = ["Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid"];

    try {
        const selectedTemplatePaths = getTemplatePathsForDevice(deviceType);
        const assetPaths = [
            ...selectedTemplatePaths,
            '/fonts/OpenSans-Bold.ttf',
            '/fonts/OpenSans-Regular.ttf',
            '/logos/kaman_logo.png',
        ];

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
        try {
            if (kamanLogoBytes) kamanLogoImage = await finalPdfDoc.embedPng(kamanLogoBytes);
        } catch (e) {
            console.error("Błąd ładowania logo KAMAN. Upewnij się, że plik /logos/kaman_logo.png jest poprawnym plikiem PNG.", e);
        }

        if (templatePdfBuffers[0]) {
            const okladkaDoc = await PDFDocument.load(templatePdfBuffers[0]);
            const [copiedPage] = await finalPdfDoc.copyPages(okladkaDoc, [0]);
            finalPdfDoc.addPage(copiedPage);
        }

        const dynamicPage = finalPdfDoc.addPage();
        const { width: pageWidth, height: pageHeight } = dynamicPage.getSize();
        const tableData = getTableData(deviceType, model, tankCapacity, bufferCapacity, systemType);
        
        let currentY = pageHeight;
        
        const introLines = ["Dziękujemy za zainteresowanie ofertą firmy KAMAN.","Każde urządzenie dobierane jest indywidualnie po szczegółowych ustaleniach technicznych."];
        const introFontSize = 9.5;
        const bannerHeight = 45;
        const bannerY = currentY - bannerHeight;

        dynamicPage.drawRectangle({ x: 0, y: bannerY, width: pageWidth, height: bannerHeight, color: rgb(0.6, 0, 0.15) });

        let introTextY = bannerY + bannerHeight - 15;
        introLines.forEach(line => {
            const textWidth = boldFont.widthOfTextAtSize(line, introFontSize);
            dynamicPage.drawText(line, { x: (pageWidth - textWidth) / 2, y: introTextY, font: boldFont, size: introFontSize, color: rgb(1, 1, 1) });
            introTextY -= introFontSize * 1.4;
        });
        
        currentY = bannerY - 20;
        
        const userNameText = `Oferta dla: ${userName}`;
        const userNameFontSize = 22;
        const userNameTextWidth = boldFont.widthOfTextAtSize(userNameText, userNameFontSize);
        dynamicPage.drawText(userNameText, {
            x: (pageWidth - userNameTextWidth) / 2,
            y: currentY,
            size: userNameFontSize,
            font: boldFont,
            color: rgb(0.7, 0, 0.16),
        });

        currentY -= (userNameFontSize + 15);
        
        const pageBottomMargin = 40;
        let lastYPosAfterTable = drawTable(finalPdfDoc, dynamicPage, { regular: regularFont, bold: boldFont }, tableData, currentY);

        const priceString = `Cena końcowa: ${cena} PLN brutto`;
        const priceFontSize = 15;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceString, priceFontSize);

        let pageForPrice = finalPdfDoc.getPage(finalPdfDoc.getPageCount() - 1);
        let priceYPosition = lastYPosAfterTable - 40;

        if (priceYPosition < pageBottomMargin) {
             pageForPrice = finalPdfDoc.addPage();
             priceYPosition = pageForPrice.getHeight() - pageBottomMargin - 20;
        }
        
        pageForPrice.drawText(priceString, { x: (pageForPrice.getWidth() - priceTextWidth) / 2, y: priceYPosition, size: priceFontSize, font: boldFont, color: rgb(0.7, 0, 0.16) });
        
        const extrasPage = finalPdfDoc.addPage();
        const optionalExtrasData = isKotel ? opcjeDlaKotlow : opcjeDlaPompCiepla;
        drawExtrasPage(extrasPage, {regular: regularFont, bold: boldFont}, optionalExtrasData, 'WYPOSAŻENIE UZUPEŁNIAJĄCE (OPCJONALNIE)', kamanLogoImage);
        
        if (kotlospawDeviceTypes.includes(deviceType)) {
            const producerPage = finalPdfDoc.addPage();
            drawExtrasPage(producerPage, {regular: regularFont, bold: boldFont}, opcjeKotlospawProducent, 'WYPOSAŻENIE DODATKOWE OD PRODUCENTA', kamanLogoImage);
        }
        
        if (deviceType === 'LAZAR') {
            const producerPage = finalPdfDoc.addPage();
            drawExtrasPage(producerPage, {regular: regularFont, bold: boldFont}, opcjeLazarProducent, 'WYPOSAŻENIE DODATKOWE OD PRODUCENTA', kamanLogoImage);
        }

        for (let i = 1; i < templatePdfBuffers.length; i++) {
            if (templatePdfBuffers[i] && templatePdfBuffers[i].byteLength > 0) {
                try {
                    const templateDoc = await PDFDocument.load(templatePdfBuffers[i]);
                    for (const pageIndex of templateDoc.getPageIndices()) {
                        const [copiedPage] = await finalPdfDoc.copyPages(templateDoc, [pageIndex]);
                        finalPdfDoc.addPage(copiedPage);
                    }
                } catch(e) {
                    console.error("Could not load template PDF buffer at index", i, e);
                }
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