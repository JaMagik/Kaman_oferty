import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { drawTable, drawHeaderBlock } from './pdfUtils'; 
import { radiatorHierarchy, radiatorTypesData, radiatorsBaseScope } from '../data/tables/radiatorsData';
import { pvOfferCommons } from '../data/tables/photovoltaicsData';

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

export async function generateRadiatorsOfferPDF(formData) {
  const { userName, price, isNetto, rooms } = formData;

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

    const coverPdfBytes = await fetch('/pdf_templates/diamond/1_okladka.pdf').then(res => res.arrayBuffer());
    const contactPdfBytes = await fetch(pvOfferCommons.contactPage).then(res => res.arrayBuffer());
    
    const requiredDatasheetPaths = new Set();
    rooms.forEach(room => {
      const materialData = radiatorHierarchy[room.material];
      if (materialData?.datasheets) {
        materialData.datasheets.forEach(path => requiredDatasheetPaths.add(path));
      }
    });

    const datasheetPromises = Array.from(requiredDatasheetPaths).map(path => 
        fetch(path).then(res => res.arrayBuffer()).catch(err => {
            console.error(`Błąd pobierania karty ${path}:`, err);
            return null;
        })
    );
    const datasheetPdfBytesArray = (await Promise.all(datasheetPromises)).filter(Boolean);

    // Strona 1: Okładka
    const coverDoc = await PDFDocument.load(coverPdfBytes);
    const [copiedCoverPage] = await pdfDoc.copyPages(coverDoc, [0]);
    pdfDoc.addPage(copiedCoverPage);

    // Strona 2: Ogólny zakres prac
    const offerPage = pdfDoc.addPage();
    const { width, height } = offerPage.getSize();
    let currentY = height - 55;
    const mainOfferDetails = [
        { type: 'title', value: 'OFERTA NA INSTALACJĘ GRZEJNIKOWĄ' },
        { label: 'Klient:', value: userName.toUpperCase() },
        { label: 'Liczba pomieszczeń:', value: rooms.length },
    ];
    currentY = drawHeaderBlock(offerPage, { regular: regularFont, bold: boldFont }, kamanLogoImage, mainOfferDetails, currentY);
    const scopeTableData = radiatorsBaseScope.map((row, index) => {
        const newRow = [...row]; newRow[0] = String(index + 1); return newRow;
    });
    currentY -= 10;
    await drawTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, scopeTableData, currentY, "Ogólny zakres prac instalacyjnych");

    // Strona 3 (i kolejne): Dobór grzejników - ZMIENIONY LAYOUT
    let detailsPage = pdfDoc.addPage();
    let detailsY = height - 60; // Główny punkt startowy dla treści
    const contentStartX = 50;
    const contentBlockWidth = width - 100;

    // ZMIANA: Logo w prawym górnym rogu, niezależnie od reszty treści
    if (kamanLogoImage) {
        const logoDims = kamanLogoImage.scale(0.035);
        detailsPage.drawImage(kamanLogoImage, {
            x: width - logoDims.width - 50,
            y: height - logoDims.height - 40,
            width: logoDims.width,
            height: logoDims.height,
        });
    }
    
    // Tytuł strony po lewej
    const title = "Dobór grzejników";
    detailsPage.drawText(title, { x: contentStartX, y: detailsY, font: boldFont, size: 14, color: rgb(0.1, 0.1, 0.25) });
    detailsY -= 40;

    // Pętla rysująca sekcje dla każdego grzejnika
    for (const [index, room] of rooms.entries()) {
        const radiatorDetails = radiatorTypesData[room.radiatorKey];
        const radiatorInfo = [
            { label: 'Model grzejnika:', value: radiatorDetails?.name || 'Nie wybrano' },
            { label: 'Opis techniczny:', value: radiatorDetails?.description || '' },
        ];
        
        const sectionHeight = 50 + (radiatorInfo.length * 20);

        if (detailsY < sectionHeight) {
            detailsPage = pdfDoc.addPage();
            detailsY = height - 70;
        }

        const bannerHeight = 25;
        const bannerY = detailsY - bannerHeight;
        detailsPage.drawRectangle({
            x: contentStartX, y: bannerY, width: contentBlockWidth, height: bannerHeight,
            color: rgb(0.6, 0, 0.15)
        });
        const bannerText = `${index + 1}. ${room.name.toUpperCase()}, Metraż: ${room.area || 'b.d.'} m²`;
        detailsPage.drawText(bannerText, {
            x: contentStartX + 10, y: bannerY + (bannerHeight - 11) / 2,
            font: boldFont, size: 11, color: rgb(1, 1, 1)
        });
        detailsY -= (bannerHeight + 15);

        const tableX = contentStartX + 10;
        const labelWidth = 110;
        const valueX = tableX + labelWidth;

        for (const item of radiatorInfo) {
            detailsPage.drawText(item.label, { x: tableX, y: detailsY, font: boldFont, size: 9 });
            const valueLines = wrapText(item.value, regularFont, 9, contentBlockWidth - labelWidth - 20);
            valueLines.forEach(line => {
                 detailsPage.drawText(line, { x: valueX, y: detailsY, font: regularFont, size: 9 });
                 detailsY -= 12;
            });
            detailsY += 12;
            detailsY -= 18;
        }
        detailsY -= 20;
    }
    
    // Rysowanie ceny pod ostatnim elementem
    detailsY -= 10;
    if (detailsY < 80) {
        detailsPage = pdfDoc.addPage();
        detailsY = height - 100;
    }
    const priceSuffix = isNetto ? 'PLN netto' : 'PLN brutto';
    const priceText = `CENA KOŃCOWA: ${price} ${priceSuffix}`;
    const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 16);
    detailsPage.drawText(priceText, { 
        x: (width - priceTextWidth) / 2, y: detailsY, font: boldFont, 
        size: 16, color: rgb(0.6, 0, 0.15) 
    });
    detailsY -= 15;
    const validityText = `Oferta ważna 14 dni.`;
    const validityTextWidth = regularFont.widthOfTextAtSize(validityText, 9);
    detailsPage.drawText(validityText, {
        x: (width - validityTextWidth) / 2, y: detailsY, font: regularFont,
        size: 9, color: rgb(0.4, 0.4, 0.4)
    });

    // Dodawanie kart katalogowych i strony kontaktowej
    for (const pdfBytes of datasheetPdfBytesArray) {
      const templateDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await pdfDoc.copyPages(templateDoc, templateDoc.getPageIndices());
      copiedPages.forEach(page => pdfDoc.addPage(page));
    }

    const contactDoc = await PDFDocument.load(contactPdfBytes);
    const [copiedContactPage] = await pdfDoc.copyPages(contactDoc, [0]);
    pdfDoc.addPage(copiedContactPage);

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania oferty na grzejniki:', error);
    alert(`Wystąpił błąd: ${error.message}.`);
    return null;
  }
}