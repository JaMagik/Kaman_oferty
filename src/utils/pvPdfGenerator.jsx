// src/utils/pvPdfGenerator.js
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {
  pvOfferCommons,
  pvRoofMountScope,
  pvGroundMountScope,
  pvStorageScope,
} from '../data/tables/photovoltaicsData';
import { drawTable, drawHeaderBlock } from './pdfUtils';

/* ------------------------------------------------------------------ */
/* helper: gwarantuje pojedynczy wiersz magazynu energii w tabeli      */
const applyStorageRowFix = (scopeArr, storageDetails, storageModules) => {
  if (!storageDetails) return scopeArr;

  const idx = scopeArr.findIndex(
    (row) =>
      Array.isArray(row) &&
      typeof row[1] === 'string' &&
      row[1].toLowerCase().includes('zestaw magazynowania energii')
  );

  const totalCap = (storageDetails.capacity * storageModules).toFixed(2);
  const newRow = [
    '', // lp – uzupełniane później
    `Zestaw magazynowania energii ${storageDetails.name} ${totalCap} kWh`,
    storageDetails.description,
    'kpl.',
    '1',
  ];

  if (idx !== -1) scopeArr[idx] = newRow;
  else scopeArr.unshift(newRow);

  return scopeArr;
};
/* ------------------------------------------------------------------ */

export async function generatePhotovoltaicsOfferPDF(formData) {
  const {
    userName,
    price,
    isNetto,
    installationType,
    showPrice,
    panelDetails,
    inverterDetails, // może być null
    inverterQuantity,
    storageDetails,  // może być null
    storageModules,
    isBracketMount,
  } = formData;

  try {
    /* === przygotowanie dokumentu === */
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const [regularFontBytes, boldFontBytes] = await Promise.all([
      fetch('/fonts/OpenSans-Regular.ttf').then((r) => r.arrayBuffer()),
      fetch('/fonts/OpenSans-Bold.ttf').then((r) => r.arrayBuffer()),
    ]);
    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);

    const logoBytes = await fetch('/logos/kaman_logo.png').then((r) =>
      r.ok ? r.arrayBuffer() : null
    );
    const logoImg = logoBytes ? await pdfDoc.embedPng(logoBytes) : null;

    /* === kolejność szablonów PDF === */
    const pdfOrder = [
      pvOfferCommons.coverPage,
      ...(inverterDetails ? inverterDetails.datasheets : []),
      ...(panelDetails ? panelDetails.datasheets : []),
      ...(storageDetails ? storageDetails.datasheets : []),
      pvOfferCommons.contactPage,
    ].filter(Boolean);

    const templates = [];
    for (const path of pdfOrder) {
      try {
        const buf = await fetch(path).then((r) => r.arrayBuffer());
        templates.push({ path, doc: await PDFDocument.load(buf) });
      } catch {
        console.error(`Nie można otworzyć ${path} – pomijam.`);
      }
    }

    /* === okładka === */
    const coverIdx = templates.findIndex((t) =>
      t.path.includes(pvOfferCommons.coverPage)
    );
    if (coverIdx > -1) {
      const [cover] = await pdfDoc.copyPages(templates[coverIdx].doc, [0]);
      pdfDoc.addPage(cover);
      templates.splice(coverIdx, 1);
    }

    /* === strona oferty === */
    const offerPage = pdfDoc.addPage();
    let lastPage = offerPage;
    const { width, height } = offerPage.getSize();
    let y = height - 55;

    const isStorageOnly = installationType === 'only-storage';
    const title = isStorageOnly
      ? 'OFERTA NA MODERNIZACJĘ O MAGAZYN ENERGII'
      : 'OFERTA INSTALACJI FOTOWOLTAICZNEJ';

    const headerLines = [
      { type: 'title', value: title },
      { label: 'Klient:', value: userName.toUpperCase() },
      {
        label: 'Moc instalacji:',
        value:
          !isStorageOnly && panelDetails
            ? `${panelDetails.totalPower.toFixed(2)} kWp`
            : null,
      },
      {
        label: 'Typ instalacji:',
        value: isStorageOnly
          ? 'Modernizacja (Retrofit)'
          : installationType === 'dach'
          ? 'Dachowa'
          : 'Gruntowa',
      },
      { label: 'Panele:', value: panelDetails?.name },
      { label: 'Falownik/Ładowarka:', value: inverterDetails?.name },
    ];
    y = drawHeaderBlock(
      offerPage,
      { regular: regularFont, bold: boldFont },
      logoImg,
      headerLines,
      y
    );

    /* === tabela główna === */
    let table = [];

    /* komponenty */
    if (panelDetails)
      table.push([
        '',
        panelDetails.name,
        panelDetails.description,
        'szt.',
        panelDetails.count,
      ]);

    if (inverterDetails)
      table.push([
        '',
        inverterDetails.name,
        inverterDetails.description,
        'szt.',
        String(inverterQuantity || 1),
      ]);

    if (storageDetails) {
      const cap = (storageDetails.capacity * storageModules).toFixed(2);
      table.push([
        '',
        `${storageDetails.name} ${cap} kWh`,
        storageDetails.description,
        'kpl.',
        '1',
      ]);
    }

    /* zakres prac */
    if (!isStorageOnly) {
      const baseScope =
        installationType === 'grunt'
          ? JSON.parse(JSON.stringify(pvGroundMountScope))
          : JSON.parse(JSON.stringify(pvRoofMountScope));

      if (installationType === 'dach' && isBracketMount) {
        const idx = baseScope.findIndex((r) =>
          r[1].includes('Dostarczenie systemu montażowego')
        );
        if (idx > -1) {
          baseScope[idx][1] = 'Dostarczenie systemu montażowego na ekierkach';
          baseScope[idx][2] =
            'Kompletny, certyfikowany zestaw na ekierkach do dachu płaskiego.';
        }
      }
      table.push(...baseScope);
    } else {
      /* gałąź modernizacji */
      table = JSON.parse(JSON.stringify(pvStorageScope));
      table = applyStorageRowFix(table, storageDetails, storageModules);
      if (inverterDetails)
        table.unshift([
          '',
          inverterDetails.name,
          inverterDetails.description,
          'szt.',
          String(inverterQuantity || 1),
        ]);
    }

    /* numeracja Lp. */
    table = table.map((r, i) => {
      r[0] = String(i + 1);
      return r;
    });

    y -= 10;
    const res = await drawTable(
      pdfDoc,
      offerPage,
      { regular: regularFont, bold: boldFont },
      table,
      y,
      'Komponenty i zakres prac'
    );
    lastPage = res.finalPage;

    /* === osobna strona zakresu magazynu (tylko w nowych instalacjach) === */
    if (storageDetails && !isStorageOnly) {
      const page = pdfDoc.addPage();
      lastPage = page;
      let sy = height - 60;

      const totalCap = (storageDetails.capacity * storageModules).toFixed(2);

      sy = drawHeaderBlock(
        page,
        { regular: regularFont, bold: boldFont },
        logoImg,
        [
          { type: 'title', value: 'Zakres prac – instalacja magazynu energii' },
          { label: 'Klient:', value: userName.toUpperCase() },
          { label: 'Pojemność magazynu:', value: `${totalCap} kWh` },
          {
            label: 'Moc ładowania/rozł.:',
            value: `${(
              (storageDetails.capacity * storageModules) /
              2
            ).toFixed(2)} kW`,
          },
        ],
        sy
      );

      let scope = JSON.parse(JSON.stringify(pvStorageScope));
      scope = applyStorageRowFix(scope, storageDetails, storageModules);

      const verIdx = scope.findIndex(
        (r) =>
          typeof r[1] === 'string' &&
          r[1].toLowerCase().includes('weryfikacja możliwości')
      );
      if (verIdx !== -1) scope[verIdx][4] = String(storageModules);

      scope = scope.map((r, i) => {
        r[0] = String(i + 1);
        return r;
      });

      sy -= 20;
      await drawTable(
        pdfDoc,
        page,
        { regular: regularFont, bold: boldFont },
        scope,
        sy,
        'Szczegółowy zakres prac'
      );
    }

    /* === cena końcowa + stopka === */
    if (showPrice) {
      const label = isNetto ? 'PLN netto' : 'PLN brutto (VAT 8%)';
      const txt = `CENA KOŃCOWA: ${price} ${label}`;
      const w = boldFont.widthOfTextAtSize(txt, 14);
      lastPage.drawText(txt, {
        x: width - w - 50,
        y: 50,
        font: boldFont,
        size: 14,
        color: rgb(0.6, 0, 0.15),
      });
    }
    lastPage.drawText('Oferta ważna 14 dni.', {
      x: 50,
      y: 50,
      font: regularFont,
      size: 9,
      color: rgb(0.4, 0.4, 0.4),
    });

    /* === doczep pozostałe szablony (datasheety + kontakt) === */
    for (const t of templates) {
      for (const pIdx of t.doc.getPageIndices()) {
        const [p] = await pdfDoc.copyPages(t.doc, [pIdx]);
        pdfDoc.addPage(p);
      }
    }

    /* === save === */
    const bytes = await pdfDoc.save({ useObjectStreams: false });
    return new Blob([bytes], { type: 'application/pdf' });
  } catch (err) {
    console.error('Błąd PDF PV:', err);
    alert(`Błąd generowania oferty PV: ${err.message}`);
    return null;
  }
}
