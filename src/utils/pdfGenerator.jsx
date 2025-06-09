// ścieżka: src/utils/pdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getTableData } from '../data/tables';
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets';

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

function drawTable(pdfDoc, initialPage, font, tableData, startY) {
    let currentPage = initialPage;
    let currentY = startY;

    const table = {
        x: 50,
        columnWidths: [30, 150, 240, 40, 50],
        headerHeight: 22,
        padding: { top: 6, bottom: 6, left: 5, right: 5 },
    };

    const headerFontSize = 9.5;
    const contentFontSize = 8.5; // Czcionka dla Nazwy, Lp, Jm, Ilości
    const descriptionFontSize = 7.8; // Delikatnie mniejsza czcionka dla Opisu
    const contentLineHeight = contentFontSize * 1.3;
    const descriptionLineHeight = descriptionFontSize * 1.3; // Osobna wysokość linii dla opisu

    const textColor = rgb(0.1, 0.1, 0.1);
    const headerColor = rgb(1, 1, 1);
    const headerBgColor = rgb(0.6, 0, 0.15);
    const evenRowBgColor = rgb(0.98, 0.96, 0.96);
    const lineColor = rgb(0.8, 0.8, 0.8);
    const pageBottomMargin = 40;
    const pageTopMargin = 40;

    const tableWidth = table.columnWidths.reduce((a, b) => a + b, 0);
    const columnPositions = [table.x];
    for (let i = 0; i < table.columnWidths.length; i++) {
        columnPositions.push(columnPositions[i] + table.columnWidths[i]);
    }

    let tableSegmentStartY = startY;

    const drawHeader = (page, y) => {
        const headerTextY = y + (table.headerHeight - headerFontSize) / 2 + 1;
        page.drawRectangle({
            x: table.x, y: y, width: tableWidth,
            height: table.headerHeight, color: headerBgColor,
        });
        const headers = ['Lp.', 'Nazwa towaru', 'Opis', 'J.m.', 'Ilość'];
        const colWidthsForHeader = table.columnWidths;
        
        let currentX = table.x;
        headers.forEach((header, i) => {
            const textWidth = font.widthOfTextAtSize(header, headerFontSize);
            page.drawText(header, {
                x: currentX + (colWidthsForHeader[i] - textWidth) / 2,
                y: headerTextY,
                size: headerFontSize,
                font,
                color: headerColor,
            });
            currentX += colWidthsForHeader[i];
        });
    };
    
    const headerY = currentY - table.headerHeight;
    drawHeader(currentPage, headerY);
    currentY = headerY;

    tableData.forEach((row, rowIndex) => {
        const lp = String(row[0] || '');
        const name = row[1] || '';
        const unit = String(row[2] || '');
        const quantity = String(row[3] || '');
        const description = row.length > 4 ? String(row[4]) : '';

        const nameLines = wrapText(name, font, contentFontSize, table.columnWidths[1] - (2 * table.padding.left));
        const descLines = wrapText(description, font, descriptionFontSize, table.columnWidths[2] - (2 * table.padding.left));

        // Oblicz wysokość bloku tekstu dla obu kolumn
        const nameBlockHeight = nameLines.length * contentLineHeight;
        const descBlockHeight = descLines.length * descriptionLineHeight;

        // Wybierz większą wysokość bloku i dodaj padding
        const dynamicRowHeight = Math.max(nameBlockHeight, descBlockHeight) + table.padding.top + table.padding.bottom;

        if (currentY - dynamicRowHeight < pageBottomMargin) {
            for(let i=0; i <= table.columnWidths.length; i++) {
                const xPos = columnPositions[i];
                currentPage.drawLine({ start: { x: xPos, y: currentY }, end: { x: xPos, y: tableSegmentStartY - table.headerHeight }, thickness: 0.5, color: lineColor });
            }
            
            currentPage = pdfDoc.addPage();
            currentY = currentPage.getHeight() - pageTopMargin;
            tableSegmentStartY = currentY;
            const newHeaderY = currentY - table.headerHeight;
            drawHeader(currentPage, newHeaderY);
            currentY = newHeaderY;
        }
        
        currentY -= dynamicRowHeight;

        if (rowIndex % 2 === 1) {
            currentPage.drawRectangle({
                x: table.x, y: currentY, width: tableWidth,
                height: dynamicRowHeight, color: evenRowBgColor,
            });
        }
        
        const textStartY = currentY + dynamicRowHeight - table.padding.top - contentFontSize;
        const descTextStartY = currentY + dynamicRowHeight - table.padding.top - descriptionFontSize;


        const lpTextWidth = font.widthOfTextAtSize(lp, contentFontSize);
        currentPage.drawText(lp, { x: columnPositions[0] + (table.columnWidths[0] - lpTextWidth) / 2, y: textStartY, size: contentFontSize, font, color: textColor });
        
        let nameY = textStartY;
        nameLines.forEach(line => {
            currentPage.drawText(line, { x: columnPositions[1] + table.padding.left, y: nameY, size: contentFontSize, font, color: textColor, lineHeight: contentLineHeight });
            nameY -= contentLineHeight;
        });
        
        let descY = descTextStartY;
        descLines.forEach(line => {
            currentPage.drawText(line, { x: columnPositions[2] + table.padding.left, y: descY, size: descriptionFontSize, font, color: textColor, lineHeight: descriptionLineHeight });
            descY -= descriptionLineHeight;
        });
        
        const unitTextWidth = font.widthOfTextAtSize(unit, contentFontSize);
        currentPage.drawText(unit, { x: columnPositions[3] + (table.columnWidths[3] - unitTextWidth) / 2, y: textStartY, size: contentFontSize, font, color: textColor });
        
        const quantityTextWidth = font.widthOfTextAtSize(quantity, contentFontSize);
        currentPage.drawText(quantity, { x: columnPositions[4] + (table.columnWidths[4] - quantityTextWidth) / 2, y: textStartY, size: contentFontSize, font, color: textColor });
        
        currentPage.drawLine({ start: { x: table.x, y: currentY }, end: { x: table.x + tableWidth, y: currentY }, thickness: 0.7, color: lineColor });
    });

    for(let i=0; i <= table.columnWidths.length; i++) {
        const xPos = columnPositions[i];
        currentPage.drawLine({ start: { x: xPos, y: currentY }, end: { x: xPos, y: tableSegmentStartY - table.headerHeight }, thickness: 0.5, color: lineColor });
    }

    return currentY;
}


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

    const pageTopMargin = 40;
    const pageBottomMargin = 40;

    try {
        const selectedTemplatePaths = getTemplatePathsForDevice(deviceType);
        const assetBuffers = await Promise.all([
            ...selectedTemplatePaths.map(path => fetch(path).then(res => {
                if (!res.ok) throw new Error(`Nie udało się wczytać pliku szablonu PDF: ${path}.`);
                return res.arrayBuffer();
            })),
            fetch('/fonts/OpenSans-Bold.ttf').then(res => {
                if (!res.ok) throw new Error(`Nie udało się wczytać czcionki OpenSans-Bold.ttf.`);
                return res.arrayBuffer();
            }),
            fetch('/fonts/OpenSans-Regular.ttf').then(res => {
                if (!res.ok) throw new Error(`Nie udało się wczytać czcionki OpenSans-Regular.ttf.`);
                return res.arrayBuffer();
            })
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
        const tableData = getTableData(deviceType, model, tankCapacity, bufferCapacity);
        
        let currentY = pageHeight;
        
        const introLines = [
            "Dziękujemy za zainteresowanie ofertą firmy KAMAN.",
            "Każde urządzenie dobierane jest indywidualnie po szczegółowych ustaleniach technicznych."
        ];
        const userNameText = `Oferta dla: ${userName}`;

        const introFontSize = 9.5;
        const userNameFontSize = 20;
        const introLineHeight = introFontSize * 1.4;

        const headerBlockHeight = 80;
        const bannerY = currentY - headerBlockHeight;

        dynamicPage.drawRectangle({
            x: 0,
            y: bannerY,
            width: pageWidth,
            height: headerBlockHeight,
            color: rgb(0.815, 0.008, 0.106),
        });

        let introTextY = bannerY + headerBlockHeight - 18;
        introLines.forEach(line => {
            const textWidth = boldFont.widthOfTextAtSize(line, introFontSize);
            dynamicPage.drawText(line, {
                x: (pageWidth - textWidth) / 2,
                y: introTextY,
                font: boldFont,
                size: introFontSize,
                color: rgb(1, 1, 1),
            });
            introTextY -= introLineHeight;
        });

        const userNameTextWidth = boldFont.widthOfTextAtSize(userNameText, userNameFontSize);
        dynamicPage.drawText(userNameText, {
            x: (pageWidth - userNameTextWidth) / 2,
            y: bannerY + 15,
            font: boldFont,
            size: userNameFontSize,
            color: rgb(1, 1, 1),
        });
        
        currentY = bannerY - 15;
        
        const tableStartY = currentY;
        let lastYPosAfterTable = tableStartY;

        if (tableData && tableData.length > 0) {
            lastYPosAfterTable = drawTable(finalPdfDoc, dynamicPage, regularFont, tableData, tableStartY);
        } else {
            dynamicPage.drawText("Brak danych do wyświetlenia w tabeli dla wybranej konfiguracji.", {
                x: 50, y: tableStartY - 20, size: 12, font: regularFont, color: rgb(0.5, 0.5, 0.5)
            });
            lastYPosAfterTable = tableStartY - 40;
        }

        const priceString = `Cena końcowa: ${cena} PLN brutto`;
        const priceFontSize = 15;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceString, priceFontSize);

        let pageForPrice = finalPdfDoc.getPage(finalPdfDoc.getPageCount() - 1);
        let heightOfPageForPrice = pageForPrice.getHeight();
        let widthOfPageForPrice = pageForPrice.getWidth();
        let priceYPosition = lastYPosAfterTable - 40;

        if (priceYPosition < pageBottomMargin) {
             const newPricePage = finalPdfDoc.addPage();
             pageForPrice = newPricePage;
             priceYPosition = newPricePage.getHeight() - pageTopMargin - 60;
        }
        
        pageForPrice.drawText(priceString, {
            x: (widthOfPageForPrice - priceTextWidth) / 2,
            y: priceYPosition,
            size: priceFontSize,
            font: boldFont,
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