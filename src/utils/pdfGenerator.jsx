import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getTableData } from '../data/tables';
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets';
import { opcjeDlaPompCiepla, opcjeDlaKotlow } from '../data/tables/opcjeDodatkowe.js';

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

// ZMODYFIKOWANA FUNKCJA drawTable
// src/utils/pdfGenerator.jsx

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
        // --- POCZĄTEK ZMIANY ---
        // Poprawiona formuła na idealne wyśrodkowanie tekstu w pionie
        const headerTextY = (y - tableConfig.headerHeight) + (tableConfig.headerHeight - tableConfig.headerFontSize) / 2;
        // --- KONIEC ZMIANY ---
        
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
function drawOptionalExtrasTable(page, regularFont, boldFont, data) {
    const { width: pageWidth, height: pageHeight } = page.getSize();
    let currentY = pageHeight - 40;
    const tableX = 50;
    const kamanRed = rgb(0.815, 0.008, 0.106);

    const title = 'WYPOSAŻENIE UZUPEŁNIAJĄCE (OPCJONALNIE)';
    const titleFontSize = 14;
    const titleBannerHeight = 40;

    page.drawRectangle({
        x: 0,
        y: currentY - titleBannerHeight,
        width: pageWidth,
        height: titleBannerHeight,
        color: kamanRed,
    });
    const titleWidth = boldFont.widthOfTextAtSize(title, titleFontSize);
    page.drawText(title, {
        x: (pageWidth - titleWidth) / 2,
        y: currentY - titleBannerHeight + (titleBannerHeight - titleFontSize) / 2,
        font: boldFont,
        size: titleFontSize,
        color: rgb(1, 1, 1),
    });
    currentY -= titleBannerHeight + 25;

    const tableStartY = currentY;

    const table = {
        x: tableX,
        columnWidths: [30, 170, 220, 40, 50],
        headerHeight: 22,
        padding: { top: 6, bottom: 6, left: 5, right: 5 },
    };
    
    const headerFontSize = 9.5;
    const contentFontSize = 8.5;
    const descriptionFontSize = 7.8;
    const contentLineHeight = contentFontSize * 1.3;
    const descriptionLineHeight = descriptionFontSize * 1.3;
    const textColor = rgb(0.1, 0.1, 0.1);
    const headerColor = rgb(1, 1, 1);
    const headerBgColor = rgb(0.6, 0, 0.15);
    const evenRowBgColor = rgb(0.98, 0.96, 0.96);
    const lineColor = rgb(0.85, 0.85, 0.85);
    const tableWidth = table.columnWidths.reduce((a, b) => a + b, 0);
    const columnPositions = [table.x];
    for (let i = 0; i < table.columnWidths.length; i++) {
        columnPositions.push(columnPositions[i] + table.columnWidths[i]);
    }

    const headerY = currentY - table.headerHeight;
    const headerTextY = headerY + (table.headerHeight - headerFontSize) / 2 + 1;
    page.drawRectangle({ x: table.x, y: headerY, width: tableWidth, height: table.headerHeight, color: headerBgColor });
    const headers = ['Lp.', 'Nazwa towaru', 'Opis', 'J.m.', 'Cena'];
    let currentHeaderX = table.x;
    headers.forEach((header, i) => {
        const textWidth = boldFont.widthOfTextAtSize(header, headerFontSize);
        page.drawText(header, { x: currentHeaderX + (table.columnWidths[i] - textWidth) / 2, y: headerTextY, size: headerFontSize, font: boldFont, color: headerColor });
        currentHeaderX += table.columnWidths[i];
    });
    currentY = headerY;

    data.forEach((row, rowIndex) => {
        const [lp, name, description, unit, price] = row;
        const nameLines = wrapText(name, regularFont, contentFontSize, table.columnWidths[1] - 10);
        const descLines = wrapText(description, regularFont, descriptionFontSize, table.columnWidths[2] - 10);
        const rowLineCount = Math.max(nameLines.length, descLines.length, 1);
        const dynamicRowHeight = (rowLineCount * Math.max(contentLineHeight, descriptionLineHeight)) + table.padding.top + table.padding.bottom;
        
        currentY -= dynamicRowHeight;

        if (rowIndex % 2 === 0) {
            page.drawRectangle({ x: table.x, y: currentY, width: tableWidth, height: dynamicRowHeight, color: evenRowBgColor });
        }
        
        const textStartY = currentY + dynamicRowHeight - table.padding.top - contentFontSize;
        const descTextStartY = currentY + dynamicRowHeight - table.padding.top - descriptionFontSize;

        page.drawText(lp, { x: columnPositions[0] + (table.columnWidths[0] - regularFont.widthOfTextAtSize(lp, contentFontSize)) / 2, y: textStartY, size: contentFontSize, font: regularFont, color: textColor });
        let nameY = textStartY;
        nameLines.forEach(line => {
            page.drawText(line, { x: columnPositions[1] + 5, y: nameY, size: contentFontSize, font: regularFont, color: textColor, lineHeight: contentLineHeight });
            nameY -= contentLineHeight;
        });
        let descY = descTextStartY;
        descLines.forEach(line => {
            page.drawText(line, { x: columnPositions[2] + 5, y: descY, size: descriptionFontSize, font: regularFont, color: textColor, lineHeight: descriptionLineHeight });
            descY -= descriptionLineHeight;
        });
        page.drawText(unit, { x: columnPositions[3] + (table.columnWidths[3] - regularFont.widthOfTextAtSize(unit, contentFontSize)) / 2, y: textStartY, size: contentFontSize, font: regularFont, color: textColor });
        page.drawText(price, { x: columnPositions[4] + (table.columnWidths[4] - regularFont.widthOfTextAtSize(price, contentFontSize)) / 2, y: textStartY, size: contentFontSize, font: regularFont, color: textColor });
        
        page.drawLine({ start: { x: table.x, y: currentY }, end: { x: table.x + tableWidth, y: currentY }, thickness: 0.5, color: lineColor });
    });

    for(let i=0; i <= table.columnWidths.length; i++) {
        page.drawLine({ start: { x: columnPositions[i], y: currentY }, end: { x: columnPositions[i], y: tableStartY }, thickness: 0.5, color: lineColor });
    }

    const footerText = "UWAGI: OPCJE DODATKOWE NIE SĄ WYMAGANE PRZEZ PRODUCENTÓW* DO PRACY INSTALACJI I O ICH ZASADNOŚCI KAŻDORAZOWO NALEŻY KONSULTOWAĆ SIĘ Z OPIEKUNEM HANDLOWYM LUB DORADCĄ TECHNICZNYM";
    const footerFontSize = 8.5;
    const footerLines = wrapText(footerText, boldFont, footerFontSize, tableWidth - 40);
    let footerY = currentY - 35;
    footerLines.forEach(line => {
        const lineWidth = boldFont.widthOfTextAtSize(line, footerFontSize);
        page.drawText(line, {
            x: tableX + (tableWidth - lineWidth) / 2, y: footerY, font: boldFont, size: footerFontSize, color: rgb(0.3, 0.3, 0.3), lineHeight: footerFontSize * 1.3,
        });
        footerY -= footerFontSize * 1.3;
    });

    const bottomBannerHeight = 10;
    page.drawRectangle({
        x: 0, y: 0, width: pageWidth, height: bottomBannerHeight, color: kamanRed,
    });
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

    const pageTopMargin = 40;
    const pageBottomMargin = 40;

    try {
        const selectedTemplatePaths = getTemplatePathsForDevice(deviceType);
        const assetBuffers = await Promise.all([
            ...selectedTemplatePaths.map(path => fetch(path).then(res => res.arrayBuffer())),
            fetch('/fonts/OpenSans-Bold.ttf').then(res => res.arrayBuffer()),
            fetch('/fonts/OpenSans-Regular.ttf').then(res => res.arrayBuffer())
        ]);

        const regularFontBytes = assetBuffers.pop();
        const boldFontBytes = assetBuffers.pop();
        const templatePdfBuffers = assetBuffers;

        const finalPdfDoc = await PDFDocument.create();
        finalPdfDoc.registerFontkit(fontkit);
        const boldFont = await finalPdfDoc.embedFont(boldFontBytes);
        const regularFont = await finalPdfDoc.embedFont(regularFontBytes);

        if (templatePdfBuffers[0]) {
            const okladkaDoc = await PDFDocument.load(templatePdfBuffers[0]);
            const [copiedPage] = await finalPdfDoc.copyPages(okladkaDoc, [0]);
            finalPdfDoc.addPage(copiedPage);
        }

        const dynamicPage = finalPdfDoc.addPage();
        const { width: pageWidth, height: pageHeight } = dynamicPage.getSize();
        const tableData = getTableData(deviceType, model, tankCapacity, bufferCapacity, systemType);
        
        // Zaczynamy rysowanie od samej góry
        let currentY = pageHeight;
        
        // --- POCZĄTEK: Logika czerwonego banera przesunięta na górę ---
        const introLines = [
            "Dziękujemy za zainteresowanie ofertą firmy KAMAN.",
            "Każde urządzenie dobierane jest indywidualnie po szczegółowych ustaleniach technicznych."
        ];
        const introFontSize = 9.5;
        const introLineHeight = introFontSize * 1.4;
        const bannerHeight = 45; // Zmniejszona wysokość banera, aby był bardziej kompaktowy
        const bannerY = currentY - bannerHeight;

        dynamicPage.drawRectangle({ x: 0, y: bannerY, width: pageWidth, height: bannerHeight, color: rgb(0.815, 0.008, 0.106) });

        let introTextY = bannerY + bannerHeight - 15; // Dostosowanie pozycji tekstu w banerze
        introLines.forEach(line => {
            const textWidth = boldFont.widthOfTextAtSize(line, introFontSize);
            dynamicPage.drawText(line, { x: (pageWidth - textWidth) / 2, y: introTextY, font: boldFont, size: introFontSize, color: rgb(1, 1, 1) });
            introTextY -= introLineHeight;
        });
        
        // Ustawienie nowej pozycji startowej dla reszty treści
        currentY = bannerY - 20;
        // --- KONIEC: Logika czerwonego banera ---

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
        
        const tableStartY = currentY;
        let lastYPosAfterTable = tableStartY;

        if (tableData && tableData.length > 0) {
            lastYPosAfterTable = drawTable(finalPdfDoc, dynamicPage, { regular: regularFont, bold: boldFont }, tableData, tableStartY);
        } else {
            dynamicPage.drawText("Brak danych do wyświetlenia w tabeli...", { x: 50, y: tableStartY - 20, size: 12, font: regularFont, color: rgb(0.5, 0.5, 0.5) });
            lastYPosAfterTable = tableStartY - 40;
        }

        const priceString = `Cena końcowa: ${cena} PLN brutto`;
        const priceFontSize = 15;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceString, priceFontSize);

        let pageForPrice = finalPdfDoc.getPage(finalPdfDoc.getPageCount() - 1);
        let priceYPosition = lastYPosAfterTable - 40;

        if (priceYPosition < pageBottomMargin) {
             const newPage = finalPdfDoc.addPage();
             pageForPrice = newPage;
             priceYPosition = newPage.getHeight() - pageTopMargin - 60;
        }
        
        pageForPrice.drawText(priceString, { x: (pageForPrice.getWidth() - priceTextWidth) / 2, y: priceYPosition, size: priceFontSize, font: boldFont, color: rgb(0.7, 0, 0.16) });
        
        const extrasPage = finalPdfDoc.addPage();
        const optionalExtrasData = isKotel ? opcjeDlaKotlow : opcjeDlaPompCiepla;
        drawOptionalExtrasTable(extrasPage, regularFont, boldFont, optionalExtrasData);

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
        alert(`Wystąpił błąd podczas generowania oferty: ${error.message}. Sprawdź konsolę.`);
        return null;
    }
}