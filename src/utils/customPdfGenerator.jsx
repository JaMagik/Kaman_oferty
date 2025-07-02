import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
// ZMIANA: Import dodatkowego zakresu prac dla magazynów energii
import { pvOfferCommons, pvRoofMountScope, pvGroundMountScope, pvStorageScope } from '../data/tables/photovoltaicsData';
import { drawTable, drawHeaderBlock } from './pdfUtils'; 

export async function generateCustomOfferPDF(formData) {
  const { clientName, price, isNetto, installationType, panel, inverter, storage, showPrice } = formData;

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

    const coverPdfBytes = await fetch(pvOfferCommons.coverPage).then(res => res.arrayBuffer());
    const contactPdfBytes = await fetch(pvOfferCommons.contactPage).then(res => res.arrayBuffer());

    const inverterDatasheetBytes = inverter?.datasheet ? await inverter.datasheet.arrayBuffer() : null;
    const panelDatasheetBytes = panel?.datasheet ? await panel.datasheet.arrayBuffer() : null;
    const storageDatasheetBytes = storage?.datasheet ? await storage.datasheet.arrayBuffer() : null;

    const loadedTemplatePDFs = [];
    if(inverterDatasheetBytes) loadedTemplatePDFs.push(await PDFDocument.load(inverterDatasheetBytes));
    if(panelDatasheetBytes) loadedTemplatePDFs.push(await PDFDocument.load(panelDatasheetBytes));
    if(storageDatasheetBytes) loadedTemplatePDFs.push(await PDFDocument.load(storageDatasheetBytes));
    
    const coverDoc = await PDFDocument.load(coverPdfBytes);
    const [copiedCoverPage] = await pdfDoc.copyPages(coverDoc, [0]);
    pdfDoc.addPage(copiedCoverPage);

    for (const templateDoc of loadedTemplatePDFs) {
        const pageIndices = templateDoc.getPageIndices();
        for (const pageIndex of pageIndices) {
          const [copiedPage] = await pdfDoc.copyPages(templateDoc, [pageIndex]);
          pdfDoc.addPage(copiedPage);
        }
    }

    const offerPage = pdfDoc.addPage();
    let lastContentPage = offerPage;
    const { width, height } = offerPage.getSize();
    let currentY = height - 55;
    
    const totalPower = panel ? (panel.quantity * panel.power) / 1000 : 0;

    const mainOfferDetails = [
        { type: 'title', value: 'OFERTA INSTALACJI FOTOWOLTAICZNEJ' },
        { label: 'Klient:', value: clientName.toUpperCase() },
    ];
    if (panel) {
        mainOfferDetails.push({ label: 'Moc instalacji:', value: `${totalPower.toFixed(2)} kWp` });
    }
    mainOfferDetails.push({ label: 'Typ instalacji:', value: installationType === 'dach' ? 'Dachowa' : 'Gruntowa' });
    if (panel) {
        mainOfferDetails.push({ label: 'Panele:', value: panel.name });
    }
    if (inverter) {
        mainOfferDetails.push({ label: 'Falownik/Ładowarka:', value: inverter.name });
    }

    currentY = drawHeaderBlock(offerPage, { regular: regularFont, bold: boldFont }, kamanLogoImage, mainOfferDetails, currentY);
    
    let mainTableData = [];
    
    // Dodawanie komponentów
    if(panel) mainTableData.push(['', panel.name, `Moc jednostkowa: ${panel.power} Wp`, 'szt.', String(panel.quantity)]);
    if(inverter) mainTableData.push(['', inverter.name, 'Falownik niestandardowy', 'szt.', String(inverter.quantity)]);
    if (storage) {
        mainTableData.push(['', storage.name, 'Magazyn niestandardowy', 'szt.', String(storage.quantity)]);
    }
    
    // Dodawanie zakresu prac
    if(panel || inverter) {
        const scopeData = installationType === 'grunt' ? pvGroundMountScope : pvRoofMountScope;
        mainTableData.push(...scopeData);
    }
    
    // ZMIANA: Inteligentne dodawanie zakresu prac dla magazynu
    if (storage) {
        // Filtrujemy, aby nie duplikować pozycji samego urządzenia, którą już dodaliśmy
        const storageScopeToAdd = pvStorageScope.filter(row => !row[1].includes('Zestaw magazynowania energii'));
        mainTableData.push(...storageScopeToAdd);
    }
    
    mainTableData = mainTableData.map((row, index) => { row[0] = String(index + 1); return row; });
    
    currentY -= 10;
    const tableResult = await drawTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, mainTableData, currentY, "Komponenty i zakres prac");
    lastContentPage = tableResult.finalPage;

    if (showPrice) {
        const priceSuffix = isNetto ? 'PLN netto' : 'PLN brutto (VAT 8%)';
        const priceText = `CENA KOŃCOWA: ${price} ${priceSuffix}`;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 14);
        lastContentPage.drawText(priceText, { x: width - priceTextWidth - 50, y: 50, font: boldFont, size: 14, color: rgb(0.6, 0, 0.15) });
    }
    lastContentPage.drawText(`Oferta ważna 14 dni.`, { x: 50, y: 50, font: regularFont, size: 9, color: rgb(0.4, 0.4, 0.4) });

    const contactDoc = await PDFDocument.load(contactPdfBytes);
    const [copiedContactPage] = await pdfDoc.copyPages(contactDoc, [0]);
    pdfDoc.addPage(copiedContactPage);

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania oferty niestandardowej:', error);
    alert(`Wystąpił błąd: ${error.message}.`);
    return null;
  }
}