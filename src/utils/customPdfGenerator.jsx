import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { pvOfferCommons, pvRoofMountScope, pvGroundMountScope } from '../data/tables/photovoltaicsData';
// Importujemy reużywalne funkcje
import { drawTable, drawHeaderBlock } from './pdfUtils'; 

export async function generateCustomOfferPDF(formData) {
  const { clientName, price, isNetto, installationType, panel, inverter, storage } = formData;

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

    // Wczytanie statycznych szablonów
    const coverPdfBytes = await fetch(pvOfferCommons.coverPage).then(res => res.arrayBuffer());
    const contactPdfBytes = await fetch(pvOfferCommons.contactPage).then(res => res.arrayBuffer());

    // Wczytanie załączonych przez użytkownika kart katalogowych
    const inverterDatasheetBytes = inverter.datasheet ? await inverter.datasheet.arrayBuffer() : null;
    const panelDatasheetBytes = panel.datasheet ? await panel.datasheet.arrayBuffer() : null;
    const storageDatasheetBytes = storage?.datasheet ? await storage.datasheet.arrayBuffer() : null;

    const loadedTemplatePDFs = [];
    if(inverterDatasheetBytes) loadedTemplatePDFs.push(await PDFDocument.load(inverterDatasheetBytes));
    if(panelDatasheetBytes) loadedTemplatePDFs.push(await PDFDocument.load(panelDatasheetBytes));
    if(storageDatasheetBytes) loadedTemplatePDFs.push(await PDFDocument.load(storageDatasheetBytes));
    
    // 1. Dodaj okładkę
    const coverDoc = await PDFDocument.load(coverPdfBytes);
    const [copiedCoverPage] = await pdfDoc.copyPages(coverDoc, [0]);
    pdfDoc.addPage(copiedCoverPage);

    // 2. Dodaj załączone karty katalogowe
    for (const templateDoc of loadedTemplatePDFs) {
        const pageIndices = templateDoc.getPageIndices();
        for (const pageIndex of pageIndices) {
          const [copiedPage] = await pdfDoc.copyPages(templateDoc, [pageIndex]);
          pdfDoc.addPage(copiedPage);
        }
    }

    // 3. Stwórz dynamiczną stronę oferty
    const offerPage = pdfDoc.addPage();
    let { finalPage: lastContentPage } = offerPage;
    const { width, height } = offerPage.getSize();
    let currentY = height - 55;
    
    const totalPower = (panel.quantity * panel.power) / 1000;

    const mainOfferDetails = [
        { type: 'title', value: 'OFERTA INSTALACJI FOTOWOLTAICZNEJ' },
        { label: 'Klient:', value: clientName.toUpperCase() },
        { label: 'Moc instalacji:', value: `${totalPower.toFixed(2)} kWp` },
        { label: 'Typ instalacji:', value: installationType === 'dach' ? 'Dachowa' : 'Gruntowa' },
        { label: 'Panele:', value: panel.name },
        { label: 'Falownik/Ładowarka:', value: inverter.name }
    ];
    currentY = drawHeaderBlock(offerPage, { regular: regularFont, bold: boldFont }, kamanLogoImage, mainOfferDetails, currentY);
    
    // 4. Przygotuj i narysuj tabelę
    let mainTableData = [];
    mainTableData.push(['', panel.name, `Moc jednostkowa: ${panel.power} Wp`, 'szt.', String(panel.quantity)]);
    mainTableData.push(['', inverter.name, 'Falownik niestandardowy', 'szt.', String(inverter.quantity)]);
    if (storage) {
        mainTableData.push(['', storage.name, 'Magazyn niestandardowy', 'szt.', String(storage.quantity)]);
    }

    const scopeData = installationType === 'grunt' ? pvGroundMountScope : pvRoofMountScope;
    mainTableData.push(...scopeData);
    
    mainTableData = mainTableData.map((row, index) => { row[0] = String(index + 1); return row; });
    
    currentY -= 10;
    const tableResult = await drawTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, mainTableData, currentY, "Komponenty i zakres prac");
    lastContentPage = tableResult.finalPage;

    // 5. Dodaj cenę
    const priceSuffix = isNetto ? 'PLN netto' : 'PLN brutto (VAT 8%)';
    const priceText = `CENA KOŃCOWA: ${price} ${priceSuffix}`;
    const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 14);
    lastContentPage.drawText(priceText, { x: width - priceTextWidth - 50, y: 50, font: boldFont, size: 14, color: rgb(0.6, 0, 0.15) });
    lastContentPage.drawText(`Oferta ważna 14 dni.`, { x: 50, y: 50, font: regularFont, size: 9, color: rgb(0.4, 0.4, 0.4) });

    // 6. Dodaj stronę kontaktową
    const contactDoc = await PDFDocument.load(contactPdfBytes);
    const [copiedContactPage] = await pdfDoc.copyPages(contactDoc, [0]);
    pdfDoc.addPage(copiedContactPage);

    // Zapisz i zwróć PDF
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania oferty niestandardowej:', error);
    alert(`Wystąpił błąd: ${error.message}.`);
    return null;
  }
}