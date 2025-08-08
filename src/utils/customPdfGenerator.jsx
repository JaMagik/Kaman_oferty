import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {
  pvOfferCommons,
  pvRoofMountScope,
  pvGroundMountScope,
  pvStorageScope,
} from '../data/tables/photovoltaicsData';
import { drawTable, drawHeaderBlock } from './pdfUtils';

/** Bezpieczny helper — jeśli coś nie jest tablicą, zwróć pustą */
const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/** Podmiana wiersza magazynu energii w tabeli na nazwę/ilość z formularza */
const applyStorageRowFix = (scopeArr, storage) => {
  if (!storage) return scopeArr;
  const clone = scopeArr.map((r) => [...r]);
  const idx = clone.findIndex(
    (r) =>
      String(r?.[1] || '')
        .toLowerCase()
        .includes('zestaw magazynowania energii')
  );

  const name = storage?.name || 'Zestaw magazynowania energii';
  const qty = storage?.quantity ? String(storage.quantity) : '1';

  const newRow = [
    '', // LP
    name,
    'Zestaw magazynowania energii – komplet z okablowaniem i akcesoriami producenta.',
    'kpl.',
    qty,
  ];

  if (idx !== -1) clone[idx] = newRow;
  else clone.unshift(newRow);

  return clone;
};

export async function generateCustomOfferPDF(formData) {
  const {
    clientName,
    price,
    isNetto,
    installationType, // 'roof' | 'ground' | 'only-storage'
    panel,            // { name, quantity, power, datasheet } | null
    inverter,         // { name, quantity, datasheet } | null
    storage,          // { name, quantity, datasheet } | null
    showPrice,
  } = formData || {};

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // FONTY
    const regularFontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then((r) => r.arrayBuffer());
    const boldFontBytes = await fetch('/fonts/OpenSans-Bold.ttf').then((r) => r.arrayBuffer());
    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    const fonts = { regular: regularFont, bold: boldFont };

    // LOGO (opcjonalnie)
    let logoImg = null;
    try {
      const logoBytes = await fetch('/logos/kaman_logo.png').then((r) => (r.ok ? r.arrayBuffer() : null));
      if (logoBytes) logoImg = await pdfDoc.embedPng(logoBytes);
    } catch (_) {}

    // STRONY STAŁE – okładka i kontakt (jeśli brak – pomijamy, nie przerywamy)
    try {
      const coverBytes = await fetch(pvOfferCommons.coverPage).then((r) =>
        r.ok ? r.arrayBuffer() : Promise.reject(new Error('cover not found'))
      );
      const cover = await PDFDocument.load(coverBytes);
      const [coverPage] = await pdfDoc.copyPages(cover, [0]);
      pdfDoc.addPage(coverPage);
    } catch (_) {}

    // STRONA OFERTY (nagłówek + zakres)
    const offerPage = pdfDoc.addPage();
    const { height } = offerPage.getSize();

    // Nagłówek
    const headerDetails = [
      { type: 'title', value: 'Oferta – Fotowoltaika (wariant niestandardowy)' },
      { label: 'Klient:', value: (clientName || 'Klient').trim() },
      panel?.name && { label: 'Panele:', value: `${panel.name}${panel.power ? `, ${panel.power} kW/szt.` : ''}${panel.quantity ? ` × ${panel.quantity} szt.` : ''}` },
      inverter?.name && { label: 'Falownik/Ładowarka:', value: `${inverter.name}${inverter.quantity ? ` × ${inverter.quantity} szt.` : ''}` },
      storage?.name && { label: 'Magazyn energii:', value: `${storage.name}${storage.quantity ? ` × ${storage.quantity} kpl.` : ''}` },
    ].filter(Boolean);

    let y = drawHeaderBlock(offerPage, fonts, logoImg, headerDetails, height - 60);
    y -= 8;

    // Tabela „Zakres prac” – zależna od typu montażu
    let scope = [];
    if (installationType === 'roof') scope = pvRoofMountScope;
    else if (installationType === 'ground') scope = pvGroundMountScope;
    else if (installationType === 'only-storage') scope = pvStorageScope;
    else scope = pvRoofMountScope; // domyślnie dach

    // Jeśli jest magazyn, podmień wiersz zestawu na nazwę/ilość z formularza
    scope = applyStorageRowFix(scope, storage);

    // Render tabeli
    const scopeTitle = 'Szczegółowy zakres prac';
    const lastY = await drawTable(pdfDoc, offerPage, fonts, scope, y, scopeTitle);

    // Cena – tylko jeśli wybrano „Pokaż cenę do oferty” i wpisano wartość
    const showPriceBlock = !!showPrice && !!String(price || '').trim();
    if (showPriceBlock) {
      const label = isNetto ? 'Cena końcowa (NETTO):' : 'Cena końcowa (BRUTTO):';
      offerPage.drawText(`${label} ${price} PLN`, {
        x: 50,
        y: Math.max(60, lastY - 24),
        size: 11,
        font: boldFont,
        color: rgb(0.6, 0, 0.15),
      });
    }

    // Datasheety (opcjonalnie). Jeśli brak – pomijamy.
    const toAppend = [
      panel?.datasheet,
      inverter?.datasheet,
      storage?.datasheet,
    ].filter(Boolean);

    for (const file of toAppend) {
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const indices = doc.getPageIndices();
        const pages = await pdfDoc.copyPages(doc, indices);
        pages.forEach((p) => pdfDoc.addPage(p));
      } catch (_) {
        // Ignoruj błędy datasheetów, żeby nie przerwać generowania
      }
    }

    // Strona kontaktowa
    try {
      const contactBytes = await fetch(pvOfferCommons.contactPage).then((r) =>
        r.ok ? r.arrayBuffer() : Promise.reject(new Error('contact not found'))
      );
      const contact = await PDFDocument.load(contactBytes);
      const [contactPage] = await pdfDoc.copyPages(contact, [0]);
      pdfDoc.addPage(contactPage);
    } catch (_) {}

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Błąd podczas generowania oferty niestandardowej:', error);
    alert(`Wystąpił błąd podczas generowania oferty: ${error?.message || error}.`);
    return null;
  }
}
