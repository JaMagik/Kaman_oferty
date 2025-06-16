import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { drawTable, drawHeaderBlock } from './pdfUtils'; 
import { insulationMaterialTypes, wallWorkItems, roofScope, basementScope } from '../data/tables/insulationData';
import { pvOfferCommons } from '../data/tables/photovoltaicsData';

const jobTypeData = {
  sciany: { title: 'OCIEPLENIE ŚCIAN ZEWNĘTRZNYCH' },
  strop: { title: 'OCIEPLENIE STROPU / PODDASZA', scope: roofScope },
  piwnica: { title: 'IZOLACJA FUNDAMENTÓW / PIWNICY', scope: basementScope },
};

export async function generateInsulationOfferPDF(formData) {
  const { userName, price, isNetto, jobs, showPrice } = formData;

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

    const coverPdfBytes = await fetch('/pdf_templates/elevation/1_okladka_elewacje.pdf').then(res => res.arrayBuffer());
    const contactPdfBytes = await fetch(pvOfferCommons.contactPage).then(res => res.arrayBuffer());
    
    const requiredDatasheetPaths = [...new Set(jobs.flatMap(job => insulationMaterialTypes[job.materialKey]?.datasheets || []))];
    const datasheetPromises = requiredDatasheetPaths.map(path => fetch(path).then(res => res.arrayBuffer()).catch(() => null));
    const datasheetPdfBytesArray = (await Promise.all(datasheetPromises)).filter(Boolean);

    const coverDoc = await PDFDocument.load(coverPdfBytes);
    const [copiedCoverPage] = await pdfDoc.copyPages(coverDoc, [0]);
    pdfDoc.addPage(copiedCoverPage);

    let lastContentPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    
    for (const job of jobs) {
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      let currentY = height - 55;

      const details = jobTypeData[job.type];
      const material = insulationMaterialTypes[job.materialKey];
      
      const headerDetails = [
        { type: 'title', value: details.title },
        { label: 'Klient:', value: userName.toUpperCase() },
        { label: 'Powierzchnia:', value: `${job.area || 'b.d.'} m²` },
        { label: 'Materiał:', value: material.name },
      ];
      currentY = drawHeaderBlock(page, { regular: regularFont, bold: boldFont }, kamanLogoImage, headerDetails, currentY);
      
      // ZMIANA: Dynamiczne budowanie tabeli dla ścian
      let tableData = [];
      if (job.type === 'sciany') {
        Object.values(wallWorkItems).forEach(item => {
          if (item.appliesTo.includes(job.scopeType) || (item.appliesTo.includes('parapety') && job.includeSills)) {
            tableData.push(['', item.text, item.desc, item.appliesTo.includes('parapety') ? 'kpl.' : 'm²', job.area || '']);
          }
        });
      } else {
        tableData = JSON.parse(JSON.stringify(details.scope));
        tableData = tableData.map(row => {
            if (row[2].includes('m²')) { row[4] = job.area; }
            return row;
        });
      }
      
      tableData = tableData.map((row, index) => { row[0] = String(index + 1); return row; });
      
      currentY -= 10;
      const tableResult = await drawTable(pdfDoc, page, { regular: regularFont, bold: boldFont }, tableData, currentY, "Zakres prac i materiałów");
      lastContentPage = tableResult.finalPage;
    }

    if (showPrice) {
        const { width } = lastContentPage.getSize();
        const priceSuffix = isNetto ? 'PLN netto' : 'PLN brutto';
        const priceText = `CENA KOŃCOWA: ${price} ${priceSuffix}`;
        const priceTextWidth = boldFont.widthOfTextAtSize(priceText, 14);
        lastContentPage.drawText(priceText, { x: width - priceTextWidth - 50, y: 50, font: boldFont, size: 14, color: rgb(0.6, 0, 0.15) });
    }
    lastContentPage.drawText(`Oferta ważna 14 dni.`, { x: 50, y: 50, font: regularFont, size: 9, color: rgb(0.4, 0.4, 0.4) });

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
    console.error('Błąd podczas generowania oferty elewacji:', error);
    alert(`Wystąpił błąd: ${error.message}.`);
    return null;
  }
}