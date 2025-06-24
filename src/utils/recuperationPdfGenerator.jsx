// Nowy plik: src/utils/recuperationPdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { drawTable, drawHeaderBlock } from './pdfUtils'; 
import { recuperationScopes } from '../data/tables/recuperationData';
import { pvOfferCommons } from '../data/tables/photovoltaicsData';

export async function generateRecuperationOfferPDF(formData) {
  const { userName, price, isNetto, showPrice, offerMode, deviceKey, surfaceArea } = formData;

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

    const coverPdfBytes = await fetch('/pdf_templates/common/8_grupa_kaman_uslugi_pdf.pdf').then(res => res.arrayBuffer());
    const contactPdfBytes = await fetch(pvOfferCommons.contactPage).then(res => res.arrayBuffer());
    
    const coverDoc = await PDFDocument.load(coverPdfBytes);
    const [copiedCoverPage] = await pdfDoc.copyPages(coverDoc, [0]);
    pdfDoc.addPage(copiedCoverPage);

    const offerPage = pdfDoc.addPage();
    let lastContentPage = offerPage;
    const { width, height } = offerPage.getSize();
    let currentY = height - 55;
    
    const offerDetails = [
      { type: 'title', value: 'OFERTA NA SYSTEM REKUPERACJI' },
      { label: 'Klient:', value: userName.toUpperCase() },
    ];
    if (offerMode === 'dobor') {
      offerDetails.push({ label: 'Powierzchnia domu:', value: `${surfaceArea} m²` });
    }
    
    currentY = drawHeaderBlock(offerPage, { regular: regularFont, bold: boldFont }, kamanLogoImage, offerDetails, currentY);
    
    // Pobranie odpowiedniego zakresu prac na podstawie wybranego urządzenia
    const scopeTableData = (recuperationScopes[deviceKey] || []).map((row, index) => {
      const newRow = [...row];
      newRow[0] = String(index + 1);
      return newRow;
    });
    
    currentY -= 15;
    let tableResult = await drawTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, scopeTableData, currentY, "Zakres prac i komponenty systemu");
    lastContentPage = tableResult.finalPage;

    if (showPrice) {
        let priceY = tableResult.finalY - 40;
        if (priceY < 80) {
            lastContentPage = pdfDoc.addPage();
            priceY = height - 100;
        }
        const priceSuffix = isNetto ? 'PLN netto' : 'PLN brutto';
        const priceText = `CENA KOŃCOWA: ${price} ${priceSuffix}`;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 16);
        lastContentPage.drawText(priceText, { 
            x: (width - priceTextWidth) / 2, y: priceY, font: boldFont, 
            size: 16, color: rgb(0.6, 0, 0.15) 
        });
    }

    const contactDoc = await PDFDocument.load(contactPdfBytes);
    const [copiedContactPage] = await pdfDoc.copyPages(contactDoc, [0]);
    pdfDoc.addPage(copiedContactPage);

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania oferty na rekuperację:', error);
    alert(`Wystąpił błąd: ${error.message}.`);
    return null;
  }
}