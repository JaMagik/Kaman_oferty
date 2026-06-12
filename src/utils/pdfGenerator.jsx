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

const INFO_SEPARATOR_COLOR = rgb(0.82, 0.82, 0.82);
const INFO_LABEL_COLOR = rgb(0.15, 0.15, 0.15);

const formatAddressLines = (address = {}) => {
    const street = String(address.street ?? '').trim();
    const town = String(address.town ?? '').trim();
    const postalCode = String(address.postalCode ?? '').trim();
    const city = String(address.city ?? '').trim();

    const lines = [];
    if (town) {
        lines.push(town);
    }
    if (street) {
        lines.push(street);
    }
    const postalCity = [postalCode, city].filter(Boolean).join(' ');
    if (postalCity) {
        lines.push(postalCity);
    }

    return lines.length ? lines : ['---'];
};

const drawInfoColumn = (page, fonts, entries, startX, startY, columnWidth) => {
    let cursorY = startY;
    const labelFontSize = 9;
    const valueFontSize = 7.8;
    const labelSpacing = 8.6;
    const valueLineHeight = 9;
    entries.forEach((entry, index) => {
        const label = entry.label || '';
        const lines = Array.isArray(entry.lines) && entry.lines.length > 0 ? entry.lines : ['---'];

        page.drawText(label, {
            x: startX,
            y: cursorY,
            font: fonts.bold,
            size: labelFontSize,
            color: INFO_LABEL_COLOR,
        });
        cursorY -= labelSpacing;

        lines.forEach((line) => {
            const sanitized = String(line ?? '').trim() || '---';
            const wrappedLines = wrapText(sanitized, fonts.regular, valueFontSize, columnWidth - 4);
            wrappedLines.forEach((wrapped) => {
                page.drawText(wrapped, {
                    x: startX,
                    y: cursorY,
                    font: fonts.regular,
                    size: valueFontSize,
                    color: rgb(0.22, 0.22, 0.22),
                });
                cursorY -= valueLineHeight;
            });
        });

        if (index < entries.length - 1) {
            cursorY -= 3;
            page.drawLine({
                start: { x: startX, y: cursorY + 6 },
                end: { x: startX + columnWidth, y: cursorY + 6 },
                thickness: 0.6,
                color: INFO_SEPARATOR_COLOR,
            });
            cursorY -= 6;
        }
    });
    return cursorY;
};

const drawOfferInfoBlock = (page, fonts, { leftEntries, rightEntries, startY, marginX = 40, columnGap = 14 }) => {
    const { width } = page.getSize();
    const columnWidth = (width - marginX * 2 - columnGap) / 2;
    const leftStartX = marginX;
    const rightStartX = marginX + columnWidth + columnGap;

    const leftBottom = drawInfoColumn(page, fonts, leftEntries, leftStartX, startY, columnWidth);
    const rightBottom = drawInfoColumn(page, fonts, rightEntries, rightStartX, startY, columnWidth);

    const separatorTop = startY + 8;
    const separatorBottom = Math.min(leftBottom, rightBottom) - 6;
    const separatorX = marginX + columnWidth + columnGap / 2;

    page.drawLine({
        start: { x: separatorX, y: separatorTop },
        end: { x: separatorX, y: separatorBottom },
        thickness: 0.6,
        color: INFO_SEPARATOR_COLOR,
    });

    return Math.min(leftBottom, rightBottom);
};

const replaceLegacyPumpNames = (value) => {
    if (typeof value !== 'string') {
        return value;
    }
    return value.replace(/\bIBO\s*PRO\b/gi, 'KAMAN PRO');
};

const sanitizeRowEntry = (entry) => {
    if (Array.isArray(entry)) {
        return entry.map(replaceLegacyPumpNames);
    }
    if (entry && typeof entry === 'object') {
        return Object.fromEntries(
            Object.entries(entry).map(([key, val]) => [key, replaceLegacyPumpNames(val)])
        );
    }
    return replaceLegacyPumpNames(entry);
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

    const footerText = 'UWAGI: OPCJE DODATKOWE NIE SĄ WYMAGANE PRZEZ PRODUCENTÓW* DO PRACY INSTALACJI I O ICH ZASADNOŚCI KAŻDORAZOWO NALEŻY KONSULTOWAĆ SIĘ Z OPIEKUNEM HANDLOWYM LUB DORADCĄ TECHNICZNYM';
    const footerMaxWidth = pageWidth - 70;

    const layoutVariants = [
        {
            topBannerHeight: 36,
            tableConfig: {
                columnWidths: [28, 210, 175, 34, 68],
                headerHeight: 21,
                padding: { top: 6, bottom: 6, left: 4.5, right: 4.5 },
                headerFontSize: 9.2,
                contentFontSize: 8,
                descriptionFontSize: 7.1,
                lineHeight: 1.24,
                separatorHeight: 21,
                topSpacing: 16,
                bottomSpacing: 18,
            },
            footerFontSize: 7,
            footerLineHeightFactor: 1.22,
        },
        {
            topBannerHeight: 34,
            tableConfig: {
                columnWidths: [26, 210, 178, 32, 64],
                headerHeight: 20,
                padding: { top: 5, bottom: 5, left: 4, right: 4 },
                headerFontSize: 8.8,
                contentFontSize: 7.5,
                descriptionFontSize: 6.8,
                lineHeight: 1.2,
                separatorHeight: 20,
                topSpacing: 14,
                bottomSpacing: 16,
            },
            footerFontSize: 6.8,
            footerLineHeightFactor: 1.18,
        },
        {
            topBannerHeight: 32,
            tableConfig: {
                columnWidths: [24, 208, 180, 30, 62],
                headerHeight: 19,
                padding: { top: 4, bottom: 4, left: 3.5, right: 3.5 },
                headerFontSize: 8.5,
                contentFontSize: 7.1,
                descriptionFontSize: 6.5,
                lineHeight: 1.17,
                separatorHeight: 19,
                topSpacing: 13,
                bottomSpacing: 15,
            },
            footerFontSize: 6.6,
            footerLineHeightFactor: 1.16,
        },
    ];

    const computeLayoutMetrics = (variant) => {
        const { tableConfig, footerFontSize: variantFooterFontSize, footerLineHeightFactor, topBannerHeight } = variant;
        let bodyHeight = 0;

        data.forEach((row) => {
            if (row.type === 'separator') {
                bodyHeight += tableConfig.separatorHeight;
                return;
            }
            const [, name, description] = row;
            const nameLines = wrapText(name, regularFont, tableConfig.contentFontSize, tableConfig.columnWidths[1] - (tableConfig.padding.left + tableConfig.padding.right));
            const descLines = wrapText(description || '', regularFont, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - (tableConfig.padding.left + tableConfig.padding.right));
            const rowHeight = Math.max(
                nameLines.length * tableConfig.contentFontSize * tableConfig.lineHeight,
                descLines.length * tableConfig.descriptionFontSize * tableConfig.lineHeight,
            ) + tableConfig.padding.top + tableConfig.padding.bottom;
            bodyHeight += rowHeight;
        });

        const footerLines = wrapText(footerText, boldFont, variantFooterFontSize, footerMaxWidth);
        const footerLineHeight = variantFooterFontSize * footerLineHeightFactor;
        const bottomBannerHeight = (footerLines.length * footerLineHeight) + 16;

        const totalHeight = topBannerHeight + tableConfig.topSpacing + tableConfig.headerHeight + bodyHeight + tableConfig.bottomSpacing + bottomBannerHeight;

        return { totalHeight, footerLines, bottomBannerHeight, footerLineHeight };
    };

    let selectedVariant = layoutVariants[layoutVariants.length - 1];
    let metrics = computeLayoutMetrics(selectedVariant);
    for (const variant of layoutVariants) {
        const currentMetrics = computeLayoutMetrics(variant);
        if (currentMetrics.totalHeight <= pageHeight - 12) {
            selectedVariant = variant;
            metrics = currentMetrics;
            break;
        }
        metrics = currentMetrics;
    }

    const { tableConfig, topBannerHeight } = selectedVariant;
    const { footerLines, bottomBannerHeight, footerLineHeight } = metrics;
    const footerFontSize = selectedVariant.footerFontSize;

    const tableWidth = tableConfig.columnWidths.reduce((sum, value) => sum + value, 0);
    const tableX = (pageWidth - tableWidth) / 2;
    const columnPositions = [tableX];
    for (let i = 0; i < tableConfig.columnWidths.length; i++) {
        columnPositions.push(columnPositions[i] + tableConfig.columnWidths[i]);
    }

    let currentY = pageHeight;
    page.drawRectangle({ x: 0, y: currentY - topBannerHeight, width: pageWidth, height: topBannerHeight, color: maroonColor });
    const titleWidth = boldFont.widthOfTextAtSize(title, titleFontSize);
    page.drawText(title, {
        x: (pageWidth - titleWidth) / 2,
        y: currentY - topBannerHeight + (topBannerHeight - titleFontSize) / 2,
        font: boldFont,
        size: titleFontSize,
        color: whiteColor,
    });
    currentY -= topBannerHeight;
    currentY -= tableConfig.topSpacing;

    const tableStartY = currentY;
    const headerY = currentY - tableConfig.headerHeight;
    page.drawRectangle({ x: tableX, y: headerY, width: tableWidth, height: tableConfig.headerHeight, color: maroonColor });
    const headers = ['Lp.', 'Nazwa towaru', 'Opis', 'J.m.', 'Cena'];
    const headerTextY = headerY + (tableConfig.headerHeight - tableConfig.headerFontSize) / 2;
    headers.forEach((header, i) => {
        const textWidth = boldFont.widthOfTextAtSize(header, tableConfig.headerFontSize);
        page.drawText(header, {
            x: columnPositions[i] + (tableConfig.columnWidths[i] - textWidth) / 2,
            y: headerTextY,
            size: tableConfig.headerFontSize,
            font: boldFont,
            color: whiteColor,
        });
    });

    currentY = headerY;
    let segmentTopY = tableStartY;

    data.forEach((row, rowIndex) => {
        if (row.type === 'separator') {
            for (let i = 0; i <= tableConfig.columnWidths.length; i++) {
                page.drawLine({
                    start: { x: columnPositions[i], y: currentY },
                    end: { x: columnPositions[i], y: segmentTopY },
                    thickness: 0.5,
                    color: lineColor,
                });
            }
            currentY -= tableConfig.separatorHeight;
            page.drawRectangle({ x: tableX, y: currentY, width: tableWidth, height: tableConfig.separatorHeight, color: maroonColor });
            const separatorTitleWidth = boldFont.widthOfTextAtSize(row.title, tableConfig.headerFontSize);
            page.drawText(row.title, {
                x: tableX + (tableWidth - separatorTitleWidth) / 2,
                y: currentY + (tableConfig.separatorHeight - tableConfig.headerFontSize) / 2,
                font: boldFont,
                size: tableConfig.headerFontSize,
                color: whiteColor,
            });
            segmentTopY = currentY;
            return;
        }

        const [lp, name, description, unit, price] = row;
        const safeDescription = description || '';
        const safeUnit = unit || '';
        const safePrice = price != null ? price : '';
        const nameLines = wrapText(name, regularFont, tableConfig.contentFontSize, tableConfig.columnWidths[1] - (tableConfig.padding.left + tableConfig.padding.right));
        const descLines = wrapText(safeDescription, regularFont, tableConfig.descriptionFontSize, tableConfig.columnWidths[2] - (tableConfig.padding.left + tableConfig.padding.right));
        const rowHeight = Math.max(
            nameLines.length * tableConfig.contentFontSize * tableConfig.lineHeight,
            descLines.length * tableConfig.descriptionFontSize * tableConfig.lineHeight,
        ) + tableConfig.padding.top + tableConfig.padding.bottom;

        currentY -= rowHeight;

        if (rowIndex % 2 === 0) {
            page.drawRectangle({ x: tableX, y: currentY, width: tableWidth, height: rowHeight, color: evenRowBgColor });
        }

        const nameStartY = currentY + rowHeight - tableConfig.padding.top - tableConfig.contentFontSize;
        let nameY = nameStartY;
        nameLines.forEach((line) => {
            page.drawText(line, {
                x: columnPositions[1] + tableConfig.padding.left,
                y: nameY,
                size: tableConfig.contentFontSize,
                font: regularFont,
                color: textColor,
            });
            nameY -= tableConfig.contentFontSize * tableConfig.lineHeight;
        });

        const descStartY = currentY + rowHeight - tableConfig.padding.top - tableConfig.descriptionFontSize;
        let descY = descStartY;
        descLines.forEach((line) => {
            page.drawText(line, {
                x: columnPositions[2] + tableConfig.padding.left,
                y: descY,
                size: tableConfig.descriptionFontSize,
                font: regularFont,
                color: textColor,
            });
            descY -= tableConfig.descriptionFontSize * tableConfig.lineHeight;
        });

        const lpText = String(lp);
        page.drawText(lpText, {
            x: columnPositions[0] + (tableConfig.columnWidths[0] - regularFont.widthOfTextAtSize(lpText, tableConfig.contentFontSize)) / 2,
            y: nameStartY,
            size: tableConfig.contentFontSize,
            font: regularFont,
            color: textColor,
        });

        page.drawText(safeUnit, {
            x: columnPositions[3] + (tableConfig.columnWidths[3] - regularFont.widthOfTextAtSize(safeUnit, tableConfig.contentFontSize)) / 2,
            y: nameStartY,
            size: tableConfig.contentFontSize,
            font: regularFont,
            color: textColor,
        });

        const priceText = String(safePrice);
        page.drawText(priceText, {
            x: columnPositions[4] + (tableConfig.columnWidths[4] - regularFont.widthOfTextAtSize(priceText, tableConfig.contentFontSize)) / 2,
            y: nameStartY,
            size: tableConfig.contentFontSize,
            font: regularFont,
            color: textColor,
        });

        page.drawLine({
            start: { x: tableX, y: currentY },
            end: { x: tableX + tableWidth, y: currentY },
            thickness: 0.5,
            color: lineColor,
        });
    });

    for (let i = 0; i <= tableConfig.columnWidths.length; i++) {
        page.drawLine({
            start: { x: columnPositions[i], y: currentY },
            end: { x: columnPositions[i], y: segmentTopY },
            thickness: 0.5,
            color: lineColor,
        });
    }

    currentY = Math.max(bottomBannerHeight, currentY - tableConfig.bottomSpacing);
    page.drawRectangle({ x: 0, y: currentY - bottomBannerHeight, width: pageWidth, height: bottomBannerHeight, color: maroonColor });

    const totalFooterTextHeight = footerLines.length * footerLineHeight - (footerLineHeight - footerFontSize);
    let footerY = (currentY - bottomBannerHeight) + (bottomBannerHeight - totalFooterTextHeight) / 2 + (totalFooterTextHeight - footerFontSize);

    footerLines.forEach((line) => {
        const lineWidth = boldFont.widthOfTextAtSize(line, footerFontSize);
        page.drawText(line, {
            x: (pageWidth - lineWidth) / 2,
            y: footerY,
            font: boldFont,
            size: footerFontSize,
            color: whiteColor,
        });
        footerY -= footerLineHeight;
    });
}
function prepareTableData(deviceType, model, tankCapacity, bufferCapacity, systemType, offerOptions, isKotel, quantityOptions, isAc, acScopeSelection) {
    let mainTableData = getTableData(deviceType, model, tankCapacity, bufferCapacity, systemType, isAc, acScopeSelection).map(sanitizeRowEntry);
    let extrasTableData = (isKotel ? [...opcjeDlaKotlow] : [...opcjeDlaPompCiepla]).map(sanitizeRowEntry);
    quantityOptions = quantityOptions || {};

    const kotlospawDeviceTypes = ["Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "Kotlospaw In-pell", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid", "Kotlospaw duoko"];
    const isLazarDevice = deviceType.startsWith('LAZAR');
    let producerOptions = null;
    if (kotlospawDeviceTypes.includes(deviceType)) {
        producerOptions = [...opcjeKotlospawProducent].map(sanitizeRowEntry);
    } else if (isLazarDevice) {
        producerOptions = [...opcjeLazarProducent].map(sanitizeRowEntry);
    }

    if (producerOptions) {
        extrasTableData.push(sanitizeRowEntry({ type: 'separator', title: 'WYPOSAZENIE UZUPELNIAJACE (OPCJONALNIE) OD PRODUCENTA' }));
        extrasTableData.push(...producerOptions);
    }

    const normalizeQty = (value, fallback = 1) => {
        const parsed = parseInt(value, 10);
        if (Number.isNaN(parsed) || parsed < 1) return fallback;
        return parsed;
    };

    const normalizeName = (value) => {
        if (!value) return '';
        return value
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    if (!isKotel && !isAc && quantityOptions.isCustom) {
        const outdoorQty = normalizeQty(quantityOptions.outdoor, 1);
        const indoorQty = normalizeQty(quantityOptions.indoor, 1);
        const circuitsQty = normalizeQty(quantityOptions.heatingCircuits, 1);

        const outdoorUnitIndex = mainTableData.findIndex(row => {
            const name = normalizeName(row[1]);
            return name.includes('jednostka zewn');
        });
        if (outdoorUnitIndex !== -1) {
            mainTableData[outdoorUnitIndex][3] = String(outdoorQty);
        }

        const indoorUnitIndex = mainTableData.findIndex(row => {
            const name = normalizeName(row[1]);
            return name.includes('hydrobox') || name.includes('cylinder');
        });
        if (indoorUnitIndex !== -1) {
            mainTableData[indoorUnitIndex][3] = String(indoorQty);
        }

        const heatingCircuitsIndex = mainTableData.findIndex(row => normalizeName(row[1]).includes('pompa obiegowa co'));
        if (heatingCircuitsIndex !== -1) {
            mainTableData[heatingCircuitsIndex][3] = String(circuitsQty);
        }
    }
    if (!isKotel && !isAc) {
        const controllersQty = normalizeQty(quantityOptions.heatPumpControllers, 1);
        mainTableData.forEach((row, index) => {
            if (!Array.isArray(row)) return;
            const name = normalizeName(row[1]);
            if (name.includes('sterownik') || name.includes('regulator')) {
                mainTableData[index][3] = String(controllersQty);
            }
        });
    }


    if (isKotel) {
        const pumpQty = normalizeQty(quantityOptions.boilerCirculationPumps, 1);
        const controllerQty = normalizeQty(quantityOptions.boilerControllers, 1);
        const heatingCircuitsQty = normalizeQty(quantityOptions.boilerHeatingCircuits, 1);

        const updateQuantity = (predicate, qty) => {
            const index = mainTableData.findIndex(row => predicate(normalizeName(row[1])));
            if (index !== -1) {
                mainTableData[index][3] = String(qty);
            }
        };

        updateQuantity(name => name.includes('pompa obiegowa') && !name.includes('cwu'), pumpQty);
        updateQuantity(name => name.includes('regulator') || name.includes('sterownik'), controllerQty);

        const circuitsIndex = mainTableData.findIndex(row => {
            const name = normalizeName(row[1]);
            return name.includes('obieg') && name.includes('grzew');
        });
        if (circuitsIndex !== -1) {
            mainTableData[circuitsIndex][3] = String(heatingCircuitsQty);
        } else {
            const newRow = [
                '',
                'Konfiguracja obiegow grzewczych',
                'kpl.',
                String(heatingCircuitsQty),
                'Przygotowanie i uruchomienie wskazanej liczby obiegow grzewczych wraz z niezbedna armatura i regulacja.'
            ];
            const afterMontazIndex = mainTableData.findIndex(row => {
                const name = normalizeName(row[1]);
                return name.includes('monta') && name.includes('systemu grzewczego');
            });
            const targetIndex = afterMontazIndex !== -1 ? afterMontazIndex + 1 : mainTableData.length;
            mainTableData.splice(targetIndex, 0, newRow);
        }
    }

    const magneticSeparatorLabel = (() => {
        const entry = opcjeDlaPompCiepla.find(row => normalizeName(row[1]).includes('separator zanieczyszczen magnetyczny'));
        return entry ? entry[1] : 'Separator zanieczyszczen magnetyczny (odmulnik)';
    })();

    const movableItems = [
        { key: 'demontaz', name: 'Demontaz starego zrodla ciepla', applicable: () => !isAc },
        { key: 'podbudowa', name: 'Wykonanie podbudowy pod jednostke zewnetrzna', applicable: () => !isAc && !isKotel },
        { key: 'magneticSeparator', name: magneticSeparatorLabel, applicable: () => !isKotel && !isAc },
        { key: 'exhaustFan', name: 'Wentylator wyciagowy', applicable: () => isKotel },
        { key: 'returnProtection', name: 'Zastosowanie termostatycznej ochrony powrotu', applicable: () => isKotel && !isLazarDevice },
    ];
    
    movableItems.forEach(item => {
        if (offerOptions[item.key] && item.applicable()) {
            const itemNameNormalized = normalizeName(item.name);
            const itemIndexInExtras = extrasTableData.findIndex(row => Array.isArray(row) && normalizeName(row[1]) === itemNameNormalized);
            
            if (itemIndexInExtras > -1) {
                const [itemRow] = extrasTableData.splice(itemIndexInExtras, 1);
                // Struktura opcji dodatkowych: [lp, nazwa, opis, j.m., cena]
                // Struktura tabeli glownej: [lp, nazwa, j.m., ilosc, opis]
                const itemRowForMainTable = sanitizeRowEntry(['', itemRow[1], itemRow[3], '1', itemRow[2]]);
                
                const insertionKeywords = ['podlaczenie kominowe', 'montaz systemu grzewczego'];
                let insertAtIndex = mainTableData.findIndex(row => {
                    const normalized = normalizeName(row[1]);
                    return insertionKeywords.some(keyword => normalized.includes(keyword));
                });
                if (insertAtIndex === -1) {
                    insertAtIndex = mainTableData.findIndex(row => normalizeName(row[1]).includes('koci'));
                    insertAtIndex = insertAtIndex > -1 ? insertAtIndex + 1 : 1;
                } else {
                    insertAtIndex += 1;
                }
                mainTableData.splice(insertAtIndex, 0, itemRowForMainTable);
            }
        }
    });

    if (offerOptions.dotacja === false) {
        mainTableData = mainTableData.filter(row => !row[1] || !row[1].includes('Pomoc w uzyskaniu dotacji'));
    }

    mainTableData = mainTableData.map((row, index) => {
        row[0] = String(index + 1);
        return row;
    });
    
    mainTableData = mainTableData.map(sanitizeRowEntry);
    extrasTableData = extrasTableData.map(sanitizeRowEntry);
    
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
  quantityOptions,
  showPrice,
  investmentAddress = {},
  advisorInfo = {},
  offerNumber = '',
  vatRate = null,
  acScopeSelection = null
) {
    if (!userName?.trim()) {
        alert('Uzupełnij pole Imię i Nazwisko!');
        return null;
    }

    const kotlyDeviceTypes = ["LAZAR SmartFire", "LAZAR DSPELL", "LAZAR PelletFOCUS", "Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "Kotlospaw In-pell", "QMPELL", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid", "Kotlospaw duoko"];
    const acDeviceTypes = ['MITSUBISHI AY', 'MITSUBISHI HR', 'VIVAX Y-Design', 'VIVAX H-Design', 'VIVAX Q-Design', 'VIVAX N-Design'];
    const isKotel = kotlyDeviceTypes.includes(deviceType);
    const isAc = acDeviceTypes.includes(deviceType);
    const kotlospawDeviceTypes = ["Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "Kotlospaw In-pell", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid", "Kotlospaw duoko"];

    try {
        const selectedTemplatePaths = getTemplatePathsForDevice(deviceType, model);
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
        if (kamanLogoBytes) kamanLogoImage = await finalPdfDoc.embedPng(kamanLogoBytes);

        if (templatePdfBuffers[0]) {
            const okladkaDoc = await PDFDocument.load(templatePdfBuffers[0]);
            const [copiedPage] = await finalPdfDoc.copyPages(okladkaDoc, [0]);
            finalPdfDoc.addPage(copiedPage);
        }

        const dynamicPage = finalPdfDoc.addPage();
        const { width: pageWidth, height: pageHeight } = dynamicPage.getSize();
        
        const { mainTableData, extrasTableData } = prepareTableData(
            deviceType, model, tankCapacity, bufferCapacity, systemType, offerOptions, isKotel, quantityOptions, isAc, acScopeSelection
        );
        
        let currentY = pageHeight - 22;

        if (kamanLogoImage) {
            const logoDims = kamanLogoImage.scale(0.03);
            dynamicPage.drawImage(kamanLogoImage, { x: (pageWidth - logoDims.width) / 2, y: currentY - logoDims.height, width: logoDims.width, height: logoDims.height });
            currentY -= (logoDims.height + 16);
        }

        const leftEntries = [
            { label: 'Oferta dla', lines: [userName || '---'] },
            { label: 'Adres inwestycji', lines: formatAddressLines(investmentAddress) },
            { label: 'Waznosc oferty', lines: ['14 dni'] },
        ];

        const advisorName = advisorInfo?.label || advisorInfo?.name || '---';
        const advisorPhone = advisorInfo?.phone || '---';
        const advisorEmail = advisorInfo?.email || '---';

        const rightEntries = [
            { label: 'Oferte sporzadzil', lines: [advisorName || '---'] },
            { label: 'Telefon', lines: [advisorPhone || '---'] },
            { label: 'Email', lines: [advisorEmail || '---'] },
        ];

        const infoBlockBottom = drawOfferInfoBlock(dynamicPage, { regular: regularFont, bold: boldFont }, {
            leftEntries,
            rightEntries,
            startY: currentY,
        });
        currentY = infoBlockBottom - 1;

    const tableConfigOverrides = (() => {
    const rowCount = mainTableData.length;
    if (rowCount > 24) {
        return {
            contentFontSize: 6.8,
            descriptionFontSize: 6.4,
            lineHeight: 1.08,
            pageMargins: { top: 12, bottom: 16 },
        };
    }
    if (rowCount > 18) {
        return {
            contentFontSize: 7.1,
            descriptionFontSize: 6.6,
            lineHeight: 1.12,
            pageMargins: { top: 14, bottom: 18 },
        };
    }
    return {
        pageMargins: { top: 16, bottom: 20 },
    };
})();

        const tableResult = drawTable(finalPdfDoc, dynamicPage, { regular: regularFont, bold: boldFont }, mainTableData, currentY, tableConfigOverrides);
        let lastContentPage = tableResult.finalPage;
        let lastYPosAfterTable = tableResult.finalY;

                if (showPrice) {
            const priceSuffix = isNettoPrice ? 'PLN netto' : 'PLN brutto';
            const priceString = `Cena koncowa: ${cena} ${priceSuffix}`;
            const priceFontSize = 15;
            const priceTextWidth = boldFont.widthOfTextAtSize(priceString, priceFontSize);

            let pricePage = lastContentPage;
            let priceY = lastYPosAfterTable - 16;

            if (priceY < 80) {
                pricePage = finalPdfDoc.addPage();
                priceY = pricePage.getHeight() - 110;
            }

            pricePage.drawText(priceString, {
                x: (pricePage.getWidth() - priceTextWidth) / 2,
                y: priceY,
                size: priceFontSize,
                font: boldFont,
                color: rgb(0.7, 0, 0.16),
            });

            lastContentPage = pricePage;
            lastYPosAfterTable = priceY;
        }
        
        if (!isAc) {
            let finalExtrasData = [...extrasTableData];
            
            if (finalExtrasData.some(row => row.type !== 'separator' && row[1] && !row[1].includes('Wentylator wyciągowy'))) {
                let lpCounter = 1;
                const numberedExtrasData = finalExtrasData.map(row => {
                    if (row.type === 'separator') return row;
                    const newRow = [...row];
                    newRow[0] = String(lpCounter++);
                    return newRow;
                });
                
                if (numberedExtrasData.length > 0) {
                    const extrasPage = finalPdfDoc.addPage();
                    drawExtrasPage(extrasPage, {regular: regularFont, bold: boldFont}, numberedExtrasData, 'WYPOSAŻENIE UZUPEŁNIAJĄCE (OPCJONALNIE)');
                }
            }
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


















