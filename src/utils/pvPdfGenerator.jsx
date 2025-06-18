// Pełna, zaktualizowana zawartość pliku: src/utils/pvPdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { inverterTypesData, pvOfferCommons, pvRoofMountScope, pvGroundMountScope, pvStorageScope, panelTypesData } from '../data/tables/photovoltaicsData';
import { drawTable, drawHeaderBlock } from './pdfUtils'; 

export async function generatePhotovoltaicsOfferPDF(formData) {
  // --- ZMIANA 1: Odczytanie nowego parametru ---
  const { userName, price, isNetto, installationType, panelDetails, inverterDetails, inverterQuantity, storageDetails, storageModules, showPrice, isBracketMount } = formData;

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

    const pdfOrder = [
        pvOfferCommons.coverPage,
        ...(inverterDetails?.datasheets || []),
        ...(panelDetails?.datasheets || []),
        ...(storageDetails?.datasheets || []),
        pvOfferCommons.contactPage,
    ].filter(Boolean);

    const loadedTemplatePDFs = [];
    for (const path of pdfOrder) {
        try {
            const response = await fetch(path);
            if (!response.ok) { console.error(`Nie udało się pobrać pliku: ${path}. Plik pominięty.`); continue; }
            const pdfBytes = await response.arrayBuffer();
            try { loadedTemplatePDFs.push({doc: await PDFDocument.load(pdfBytes), path}); } 
            catch (parsingError) { console.error(`Błąd parsowania PDF: ${path}. Plik pominięty.`); }
        } catch (fetchError) { console.error(`Błąd sieci: ${path}. Plik pominięty.`); }
    }
    
    const findAndAddPage = async (pathFragment) => {
        const index = loadedTemplatePDFs.findIndex(p => p.path.includes(pathFragment));
        if (index > -1) {
            const pdfToCopy = loadedTemplatePDFs.splice(index, 1)[0];
            if (pdfToCopy) {
                const [copiedPage] = await pdfDoc.copyPages(pdfToCopy.doc, [0]);
                pdfDoc.addPage(copiedPage);
            }
        }
    };
    
    await findAndAddPage(pvOfferCommons.coverPage);

    const offerPage = pdfDoc.addPage();
    let lastContentPage = offerPage;
    const { width, height } = offerPage.getSize();
    let currentY = height - 55;
    
    const isStorageOnly = installationType === 'only-storage';
    const mainTitle = isStorageOnly ? "OFERTA NA MODERNIZACJĘ O MAGAZYN ENERGII" : "OFERTA INSTALACJI FOTOWOLTAICZNEJ";
    
    const mainOfferDetails = [
        { type: 'title', value: mainTitle },
        { label: 'Klient:', value: userName.toUpperCase() },
        { label: 'Moc instalacji:', value: !isStorageOnly && panelDetails ? `${panelDetails.totalPower.toFixed(2)} kWp` : null },
        { label: 'Typ instalacji:', value: isStorageOnly ? 'Modernizacja (Retrofit)' : (installationType === 'dach' ? 'Dachowa' : 'Gruntowa') },
        { label: 'Panele:', value: panelDetails?.name },
        { label: 'Falownik/Ładowarka:', value: inverterDetails?.name }
    ];
    currentY = drawHeaderBlock(offerPage, { regular: regularFont, bold: boldFont }, kamanLogoImage, mainOfferDetails, currentY);
    
    let mainTableData = [];
    if (!isStorageOnly) {
        mainTableData.push(['', panelDetails.name, panelDetails.description, 'szt.', panelDetails.count]);
        mainTableData.push(['', inverterDetails.name, inverterDetails.description, 'szt.', String(inverterQuantity)]);
        if (storageDetails) {
            const totalCapacity = (storageDetails.capacity * storageModules).toFixed(2);
            mainTableData.push(['', `${storageDetails.name} ${totalCapacity} kWh`, storageDetails.description, 'kpl.', '1']);
        }
        
        // --- ZMIANA 2: Warunkowa modyfikacja zakresu prac ---
        let scopeData;
        if (installationType === 'grunt') {
            scopeData = JSON.parse(JSON.stringify(pvGroundMountScope));
        } else { // Dach
            scopeData = JSON.parse(JSON.stringify(pvRoofMountScope));
            if (isBracketMount) {
                const systemRowIndex = scopeData.findIndex(row => row[1].includes('Dostarczenie systemu montażowego'));
                if (systemRowIndex > -1) {
                    scopeData[systemRowIndex][1] = 'Dostarczenie systemu montażowego na ekierkach';
                    scopeData[systemRowIndex][2] = 'Kompletny, certyfikowany zestaw konstrukcyjny na ekierkach, przeznaczony do montażu na dachu płaskim lub o niewielkim spadku.';
                }
            }
        }
        mainTableData.push(...scopeData);
        // --------------------------------------------------

    } else {
        mainTableData = JSON.parse(JSON.stringify(pvStorageScope));
        mainTableData.unshift(['', inverterDetails.name, inverterDetails.description, 'szt.', String(inverterQuantity)]);
        const storageRowIndex = mainTableData.findIndex(row => row[1].includes('Zestaw magazynowania energii'));
        if(storageRowIndex > -1) {
            const totalCapacity = (storageDetails.capacity * storageModules).toFixed(2);
            mainTableData.splice(storageRowIndex, 0, ['', `${storageDetails.name} (${totalCapacity} kWh)`, storageDetails.description, 'kpl.', '1']);
            mainTableData.splice(storageRowIndex + 1, 1);
        }
    }
    
    mainTableData = mainTableData.map((row, index) => { row[0] = String(index + 1); return row; });
    
    currentY -= 10; 
    let tableResult = await drawTable(pdfDoc, offerPage, { regular: regularFont, bold: boldFont }, mainTableData, currentY, "Komponenty i zakres prac");
    lastContentPage = tableResult.finalPage;

    if (storageDetails && !isStorageOnly) {
        const storageScopePage = pdfDoc.addPage();
        lastContentPage = storageScopePage;
        let scopeY = height - 60;
        const totalCapacity = (storageDetails.capacity * storageModules).toFixed(2);
        const storageDetailsList = [
            { type: 'title', value: "Zakres prac – instalacja magazynu energii" },
            { label: 'Klient:', value: userName.toUpperCase() },
            { label: 'Pojemność magazynu:', value: `${totalCapacity} kWh` },
            { label: 'Moc ładowania/rozł.:', value: `${(storageDetails.capacity * storageModules / 2).toFixed(2)} kW` },
        ];
        scopeY = drawHeaderBlock(storageScopePage, { regular: regularFont, bold: boldFont }, kamanLogoImage, storageDetailsList, scopeY);
        let scopeTableData = JSON.parse(JSON.stringify(pvStorageScope));
        scopeTableData[1][4] = String(storageModules);
        scopeTableData = scopeTableData.map((row, index) => { row[0] = String(index + 1); return row; });
        scopeY -= 20;
        tableResult = await drawTable(pdfDoc, storageScopePage, { regular: regularFont, bold: boldFont }, scopeTableData, scopeY, "Szczegółowy zakres prac");
        lastContentPage = tableResult.finalPage;
    }
    
    if (showPrice) {
        const priceSuffix = isNetto ? 'PLN netto' : 'PLN brutto (VAT 8%)';
        const priceText = `CENA KOŃCOWA: ${price} ${priceSuffix}`;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 14);
        lastContentPage.drawText(priceText, { x: width - priceTextWidth - 50, y: 50, font: boldFont, size: 14, color: rgb(0.6, 0, 0.15) });
    }
    lastContentPage.drawText(`Oferta ważna 14 dni.`, { x: 50, y: 50, font: regularFont, size: 9, color: rgb(0.4, 0.4, 0.4) });
    
    for (const templateDoc of loadedTemplatePDFs) {
      const pageIndices = templateDoc.doc.getPageIndices();
      for (const pageIndex of pageIndices) {
        const [copiedPage] = await pdfDoc.copyPages(templateDoc.doc, [pageIndex]);
        pdfDoc.addPage(copiedPage);
      }
    }

    // NOWA WERSJA
const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania PDF dla fotowoltaiki:', error);
    alert(`Wystąpił błąd podczas generowania oferty PV: ${error.message}.`);
    return null;
  }
}