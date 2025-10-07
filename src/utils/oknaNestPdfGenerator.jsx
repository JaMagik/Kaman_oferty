// src/utils/oknaNestPdfGenerator.jsx
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {
  assemblyTypeOptions,
  getOptionLabel,
  hardwareThicknessOptions,
  profileColorOptions,
  profileTypeOptions,
  windowOptionDefinitions,
  optionalFeatureGroups,
  installationVariants,
  installationExtras,
} from '../data/windowsOfferConfig';

const OKNA_NEST_COVER_PATH = '/pdf_templates/okna_nest/1_okladka_okna_nest.pdf';
const COMMON_CONTACT_PAGE_PATH = '/pdf_templates/common/5_kontakt_nest.pdf';
const LOGO_NEST_PATH = '/logos/Kaman%20Nest.png';
const FONT_REGULAR_PATH = '/fonts/OpenSans-Regular.ttf';
const FONT_BOLD_PATH = '/fonts/OpenSans-Bold.ttf';

const wrapText = (font, text, size, maxWidth) => {
  const normalized = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return [''];
  }
  const words = normalized.split(' ');
  const lines = [];
  let current = words[0];
  for (let index = 1; index < words.length; index += 1) {
    const candidate = `${current} ${words[index]}`;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[index];
    }
  }
  lines.push(current);
  return lines;
};

const sanitizeNbsp = (value) => String(value).replace(/\u00a0/g, ' ');

const ensureSentence = (value) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return '';
  }
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

const formatNumber = (value, fractionDigits = 2) => {
  const formatter = new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return sanitizeNbsp(formatter.format(value));
};

const formatCurrency = (value) => `${formatNumber(value, 2)} PLN`;

const parseInputNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  const normalized = String(value).replace(/\s+/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const findOptionLabel = (options, value) => getOptionLabel(options, value) || value;

const buildOptionTableDescription = (option) => {
  const base = ensureSentence(option.description || option.summaryBullet || option.label);
  if (option.details && option.details.length > 0) {
    const detailSentence = ensureSentence(`Zakres szczegolowy: ${option.details.join('; ')}`);
    return `${base} ${detailSentence}`;
  }
  return base;
};

const scaleImageToFit = (image, maxWidth, maxHeight) => {
  const widthScale = maxWidth / image.width;
  const heightScale = maxHeight / image.height;
  const scale = Math.min(widthScale, heightScale);
  return image.scale(scale);
};

const drawPageBranding = (page, fonts, logos, options = {}) => {
  const { width, height } = page.getSize();
  const {
    title,
    subtitle,
    alignTitle = 'left',
    titleSize = 20,
    subtitleSize = 10,
    titleColor = rgb(0.72, 0.0, 0.16),
    subtitleColor = rgb(0.32, 0.32, 0.32),
    marginX = 48,
    topMargin = 46,
    brandSpacing = 22,
    extraSpacing = 24,
    nestMaxWidth = 175,
    nestMaxHeight = 54,
    showLogo = true,
  } = options;

  let cursorY = height - topMargin;
  let bannerHeight = 0;

  if (showLogo && logos?.nest) {
    const dims = scaleImageToFit(logos.nest, nestMaxWidth, nestMaxHeight);
    page.drawImage(logos.nest, {
      x: marginX,
      y: cursorY - dims.height,
      width: dims.width,
      height: dims.height,
    });
    bannerHeight = Math.max(bannerHeight, dims.height);
  }

  cursorY -= bannerHeight;
  if (bannerHeight > 0) {
    cursorY -= brandSpacing;
  }

  if (title) {
    const titleWidth = fonts.bold.widthOfTextAtSize(title, titleSize);
    let titleX = marginX;
    if (alignTitle === 'center') {
      titleX = (width - titleWidth) / 2;
    } else if (alignTitle === 'right') {
      titleX = width - marginX - titleWidth;
    }
    page.drawText(title, {
      x: titleX,
      y: cursorY,
      size: titleSize,
      font: fonts.bold,
      color: titleColor,
    });
    cursorY -= titleSize + 8;
  }

  if (subtitle) {
    const subtitleLines = wrapText(fonts.regular, subtitle, subtitleSize, width - marginX * 2);
    subtitleLines.forEach((line) => {
      const lineWidth = fonts.regular.widthOfTextAtSize(line, subtitleSize);
      let lineX = marginX;
      if (alignTitle === 'center') {
        lineX = (width - lineWidth) / 2;
      } else if (alignTitle === 'right') {
        lineX = width - marginX - lineWidth;
      }
      page.drawText(line, {
        x: lineX,
        y: cursorY,
        size: subtitleSize,
        font: fonts.regular,
        color: subtitleColor,
      });
      cursorY -= subtitleSize + 4;
    });
  }

  cursorY -= extraSpacing;
  return cursorY;
};

const drawSimpleTable = (pdfDoc, startPage, fonts, rows, startY, customConfig = {}, onNewPage) => {
  const config = {
    columnWidths: [32, 172, 250, 54, 74],
    headerHeight: 24,
    padding: { top: 6, bottom: 6, left: 6, right: 6 },
    headerFontSize: 10,
    contentFontSize: 8.5,
    descriptionFontSize: 7.5,
    lineHeight: 1.3,
    lineColor: rgb(0.82, 0.82, 0.82),
    headerBgColor: rgb(0.72, 0.0, 0.16),
    headerFontColor: rgb(1, 1, 1),
    rowFontColor: rgb(0.12, 0.12, 0.12),
    evenRowBgColor: rgb(0.98, 0.96, 0.96),
    pageMargins: { top: 60, bottom: 52 },
    ...customConfig,
  };

  const tableWidth = config.columnWidths.reduce((sum, value) => sum + value, 0);
  let page = startPage;
  let y = typeof startY === 'number' ? startY : page.getSize().height - config.pageMargins.top;

  const drawHeader = () => {
    const { width } = page.getSize();
    const tableStartX = (width - tableWidth) / 2;
    page.drawRectangle({
      x: tableStartX,
      y: y - config.headerHeight,
      width: tableWidth,
      height: config.headerHeight,
      color: config.headerBgColor,
    });

    const headers = ['Lp.', 'Zakres', 'Opis', 'Ilosc', 'Cena'];
    let cursor = tableStartX;
    headers.forEach((header, columnIndex) => {
      const columnWidth = config.columnWidths[columnIndex];
      const textWidth = fonts.bold.widthOfTextAtSize(header, config.headerFontSize);
      page.drawText(header, {
        x: cursor + (columnWidth - textWidth) / 2,
        y: y - config.headerHeight + (config.headerHeight - config.headerFontSize) / 2 + 1,
        size: config.headerFontSize,
        font: fonts.bold,
        color: config.headerFontColor,
      });
      cursor += columnWidth;
    });
    y -= config.headerHeight;
  };

  const beginPage = (isFirst = false) => {
    if (!isFirst) {
      page = pdfDoc.addPage();
      y = typeof onNewPage === 'function' ? onNewPage(page) : page.getSize().height - config.pageMargins.top;
    }
    drawHeader();
  };

  beginPage(true);

  rows.forEach((row, rowIndex) => {
    const { width } = page.getSize();
    const tableStartX = (width - tableWidth) / 2;

    const nameLines = wrapText(fonts.bold, row.name, config.contentFontSize, config.columnWidths[1] - config.padding.left * 2);
    const descriptionLines = wrapText(
      fonts.regular,
      row.description || '',
      config.descriptionFontSize,
      config.columnWidths[2] - config.padding.left * 2,
    );

    const priceLines = wrapText(fonts.regular, row.price, config.contentFontSize, config.columnWidths[4] - (config.padding.left + config.padding.right));

    const nameHeight = nameLines.length * config.contentFontSize * config.lineHeight;
    const descriptionHeight = descriptionLines.length * config.descriptionFontSize * config.lineHeight;
    const priceHeight = priceLines.length * config.contentFontSize * config.lineHeight;
    const rowHeight = Math.max(nameHeight, descriptionHeight, priceHeight) + config.padding.top + config.padding.bottom;

    if (y - rowHeight < config.pageMargins.bottom) {
      beginPage();
    }

    if (rowIndex % 2 === 1) {
      page.drawRectangle({
        x: tableStartX,
        y: y - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: config.evenRowBgColor,
      });
    }

    let cursor = tableStartX;
    config.columnWidths.forEach((columnWidth, columnIndex) => {
      const key = ['lp', 'name', 'description', 'quantity', 'price'][columnIndex];
      const font = columnIndex === 1 ? fonts.bold : fonts.regular;
      const fontSize = columnIndex === 2 ? config.descriptionFontSize : config.contentFontSize;
      const availableWidth = columnWidth - (config.padding.left + config.padding.right);
      const cellX = cursor + config.padding.left;
      const cellY = y - config.padding.top - fontSize;

      let lines;
      if (key === 'name') {
        lines = nameLines;
      } else if (key === 'description') {
        lines = descriptionLines;
      } else if (key === 'price') {
        lines = priceLines;
      } else {
        lines = wrapText(font, String(row[key] ?? ''), fontSize, availableWidth);
      }

      lines.forEach((line, index) => {
        const lineOffset = (lines.length - index - 1) * fontSize * config.lineHeight;
        let textX = cellX;
        if (columnIndex === 0 || columnIndex === 3) {
          const textWidth = font.widthOfTextAtSize(line, fontSize);
          textX = cursor + (columnWidth - textWidth) / 2;
        }
        if (columnIndex === 4) {
          const textWidth = font.widthOfTextAtSize(line, fontSize);
          textX = cursor + columnWidth - textWidth - config.padding.right;
        }
        page.drawText(line, {
          x: textX,
          y: cellY - lineOffset,
          size: fontSize,
          font,
          color: config.rowFontColor,
        });
      });

      cursor += columnWidth;
    });

    page.drawLine({
      start: { x: tableStartX, y },
      end: { x: tableStartX + tableWidth, y },
      thickness: 0.35,
      color: config.lineColor,
    });

    page.drawLine({
      start: { x: tableStartX, y: y - rowHeight },
      end: { x: tableStartX + tableWidth, y: y - rowHeight },
      thickness: 0.3,
      color: config.lineColor,
    });

    y -= rowHeight;
  });

  return { finalPage: page, yPosition: y };
};

const drawKeyValueSection = (page, fonts, entries, startX, startY, rowHeight = 18) => {
  let y = startY;
  entries.forEach((entry) => {
    page.drawText(entry.label, {
      x: startX,
      y,
      size: 10,
      font: fonts.bold,
      color: rgb(0.18, 0.18, 0.18),
    });
    page.drawText(entry.value, {
      x: startX + 190,
      y,
      size: 10,
      font: fonts.regular,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= rowHeight;
  });
  return y;
};

const renderOptionsSection = (pdfDoc, fonts, logos, options, config) => {
  if (!options || options.length === 0) {
    return null;
  }

  const {
    heading,
    subtitle,
    continuationSubtitle = `${heading} - kontynuacja`,
    intro,
    numberingStart = 1,
    priceLabel = 'Informacja cenowa',
  } = config;

  let page = pdfDoc.addPage();
  let pageIndex = 0;
  let y = drawPageBranding(page, fonts, logos, {
    title: heading,
    subtitle,
    titleSize: 18,
    subtitleSize: 10,
    extraSpacing: 18,
  });

  const contentWidth = page.getSize().width - 120;

  const ensureSpace = (requiredSpace = 160) => {
    if (y < requiredSpace) {
      page = pdfDoc.addPage();
      pageIndex += 1;
      y = drawPageBranding(page, fonts, logos, {
        title: heading,
        subtitle: continuationSubtitle,
        titleSize: 18,
        subtitleSize: 10,
        extraSpacing: 18,
      });
    }
  };

  if (intro) {
    const introLines = wrapText(fonts.regular, intro, 10, contentWidth);
    introLines.forEach((line) => {
      page.drawText(line, {
        x: 60,
        y,
        size: 10,
        font: fonts.regular,
        color: rgb(0.14, 0.14, 0.14),
      });
      y -= 13;
    });
    y -= 10;
  }

  options.forEach((option, index) => {
    ensureSpace();

    const numberLabel = `${numberingStart + index}. ${option.label}`;
    page.drawText(numberLabel, {
      x: 60,
      y,
      size: 12,
      font: fonts.bold,
      color: rgb(0.18, 0.18, 0.18),
    });
    y -= 16;

    const narrativeBlocks = [];
    if (option.summaryBullet) {
      narrativeBlocks.push(option.summaryBullet);
    }
    if (option.description && option.description !== option.summaryBullet) {
      narrativeBlocks.push(option.description);
    }

    narrativeBlocks.forEach((block) => {
      const lines = wrapText(fonts.regular, block, 10, contentWidth);
      lines.forEach((line) => {
        page.drawText(line, {
          x: 70,
          y,
          size: 10,
          font: fonts.regular,
          color: rgb(0.12, 0.12, 0.12),
        });
        y -= 12;
      });
      y -= 5;
    });

    if (option.details && option.details.length > 0) {
      option.details.forEach((detail) => {
        const bulletLines = wrapText(fonts.regular, `- ${detail}`, 9.5, contentWidth - 20);
        bulletLines.forEach((line) => {
          page.drawText(line, {
            x: 80,
            y,
            size: 9.5,
            font: fonts.regular,
            color: rgb(0.28, 0.28, 0.28),
          });
          y -= 11;
        });
      });
      y -= 6;
    }

    if (option.priceNote) {
      const priceLines = wrapText(fonts.regular, `${priceLabel}: ${option.priceNote}`, 9.5, contentWidth);
      priceLines.forEach((line) => {
        page.drawText(line, {
          x: 70,
          y,
          size: 9.5,
          font: fonts.regular,
          color: rgb(0.32, 0.32, 0.32),
        });
        y -= 11;
      });
    }

    y -= 16;
  });

  return page;
};

const fetchAsset = async (path, label, { optional = false } = {}) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      if (optional) {
        console.warn(`Nie udalo sie pobrac zasobu ${label}: ${path}`);
        return null;
      }
      throw new Error(`Brak zasobu ${label}: ${path}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    if (!optional) {
      throw error;
    }
    console.warn(`Pominieto zasob opcjonalny ${label}:`, error);
    return null;
  }
};

export async function generateOknaNestPDF(formData) {
  const {
    userName,
    investmentAddress,
    catalogPrice,
    discountPercent,
    installationPrice,
    windowPerimeter,
    windowArea,
    profileType,
    hardwareThickness,
    assemblyType,
    profileColor,
    selectedOptionIds,
    additionalNotes,
    featureSelections = {},
    installationVariant: selectedInstallationVariant,
    installationExtras: installationExtrasState = {},
  } = formData || {};

  if (!userName || !investmentAddress) {
    alert('Brakuje podstawowych danych klienta.');
    return null;
  }

  const catalogPriceNumber = parseInputNumber(catalogPrice);
  const discountPercentNumber = parseInputNumber(discountPercent);
  const installationPriceNumber = parseInputNumber(installationPrice);
  const windowPerimeterNumber = parseInputNumber(windowPerimeter);
  const windowAreaNumber = parseInputNumber(windowArea);

  if (windowPerimeterNumber <= 0 || windowAreaNumber <= 0) {
    alert('Podaj laczna powierzchnie oraz obwod okien.');
    return null;
  }

  const discountedPrice = catalogPriceNumber * (1 - discountPercentNumber / 100);
  const discountValue = catalogPriceNumber - discountedPrice;
  const finalPrice = discountedPrice + installationPriceNumber;

  const includedOptions = windowOptionDefinitions.filter((option) => selectedOptionIds?.includes(option.id));
  const optionalOptions = windowOptionDefinitions.filter((option) => !selectedOptionIds?.includes(option.id));

  const featureSummaryEntries = [];
  optionalFeatureGroups.forEach((group) => {
    group.items.forEach((item) => {
      const selection = featureSelections[item.id] || {};
      const enabled = Boolean(selection.enabled);
      const detail = (selection.detail || '').trim();
      const summaryLabel = item.summaryLabel || item.label;
      let valueText = enabled ? 'TAK' : 'NIE';
      if (enabled && detail) {
        valueText = `${valueText} (${detail})`;
      }
      featureSummaryEntries.push(`${summaryLabel}: ${valueText}`);
    });
  });

  const resolvedInstallationVariantValue = selectedInstallationVariant || installationVariants[0]?.value || '';
  const installationVariantSummary =
    installationVariants.find((variant) => variant.value === resolvedInstallationVariantValue)?.summaryLabel ||
    installationVariants[0]?.summaryLabel ||
    resolvedInstallationVariantValue;

  const installationExtrasEntries = installationExtras.map((extra) => {
    const enabled = Boolean(installationExtrasState[extra.id]);
    return `${extra.summaryLabel}: ${enabled ? 'TAK' : 'NIE'}`;
  });

  const profileLabel = findOptionLabel(profileTypeOptions, profileType);
  const hardwareLabel = findOptionLabel(hardwareThicknessOptions, hardwareThickness);
  const assemblyLabel = findOptionLabel(assemblyTypeOptions, assemblyType);
  const colorLabel = findOptionLabel(profileColorOptions, profileColor);

  const tableRows = [
    {
      lp: '1',
      name: 'Okna Nest',
      description: ensureSentence(`Profil ${profileLabel} w kolorze ${colorLabel} z okuciami ${hardwareLabel}. Powierzchnia: ${formatNumber(windowAreaNumber)} m2, obwod: ${formatNumber(windowPerimeterNumber)} mb. Rabat: ${formatNumber(discountPercentNumber, 1)}%.`),
      quantity: formatNumber(windowAreaNumber),
      price: formatCurrency(discountedPrice),
    },
    {
      lp: '2',
      name: `Montaz - ${assemblyLabel}`,
      description: ensureSentence('Zakres obejmuje przygotowanie otworow, ustawienie, kotwienie, piankowanie, zastosowanie tasm uszczelniajacych oraz regulacje i odbior stolarki.'),
      quantity: formatNumber(windowPerimeterNumber),
      price: formatCurrency(installationPriceNumber),
    },
  ];

  includedOptions.forEach((option, index) => {
    tableRows.push({
      lp: String(index + 3),
      name: option.label,
      description: buildOptionTableDescription(option),
      quantity: option.quantity || '1',
      price: option.priceNote || 'w zakresie',
    });
  });

  try {
    const [
      coverBytes,
      contactBytes,
      regularFontBytes,
      boldFontBytes,
      nestLogoBytes,
    ] = await Promise.all([
      fetchAsset(OKNA_NEST_COVER_PATH, 'okladka Okna Nest'),
      fetchAsset(COMMON_CONTACT_PAGE_PATH, 'strona kontaktowa'),
      fetchAsset(FONT_REGULAR_PATH, 'OpenSans Regular'),
      fetchAsset(FONT_BOLD_PATH, 'OpenSans Bold'),
      fetchAsset(LOGO_NEST_PATH, 'logo KAMAN Nest'),
    ]);

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    const fonts = { regular: regularFont, bold: boldFont };
    const logos = {
      nest: await pdfDoc.embedPng(nestLogoBytes),
    };

    if (coverBytes) {
      const coverDoc = await PDFDocument.load(coverBytes);
      const [coverPage] = await pdfDoc.copyPages(coverDoc, [0]);
      pdfDoc.addPage(coverPage);
    }

    const offerDate = sanitizeNbsp(new Intl.DateTimeFormat('pl-PL').format(new Date()));
    const tablePage = pdfDoc.addPage();
    let currentY = drawPageBranding(tablePage, fonts, logos, {
      title: 'Oferta Okna Nest',
      subtitle: `Data oferty: ${offerDate}`,
      titleSize: 22,
      subtitleSize: 11,
      extraSpacing: 22,
    });

    const introLines = [
      `Oferta dla: ${userName}`,
      `Adres inwestycji: ${investmentAddress}`,
      `Profil i kolor: ${profileLabel} / ${colorLabel}`,
      `Okucia i montaz: ${hardwareLabel} / ${assemblyLabel}`,
    ];

    introLines.forEach((line) => {
      tablePage.drawText(line, {
        x: 60,
        y: currentY,
        size: 11,
        font: regularFont,
        color: rgb(0.18, 0.18, 0.18),
      });
      currentY -= 16;
    });

    currentY -= 12;

    if (featureSummaryEntries.length > 0) {
      const featureSummaryText = `Opcje dodatkowe: ${featureSummaryEntries.join(' | ')}`;
      const featureLines = wrapText(regularFont, featureSummaryText, 9.5, tablePage.getSize().width - 120);
      featureLines.forEach((line) => {
        tablePage.drawText(line, {
          x: 60,
          y: currentY,
          size: 9.5,
          font: regularFont,
          color: rgb(0.16, 0.16, 0.16),
        });
        currentY -= 12;
      });
      currentY -= 10;
    }

    drawSimpleTable(
      pdfDoc,
      tablePage,
      fonts,
      tableRows,
      currentY,
      tableRows.length > 16
        ? {
            contentFontSize: 7.5,
            descriptionFontSize: 7,
            lineHeight: 1.2,
            pageMargins: { top: 58, bottom: 50 },
          }
        : {},
      (newPage) => drawPageBranding(newPage, fonts, logos, {
        title: 'Oferta Okna Nest',
        subtitle: 'Tabela zakresu (kontynuacja)',
        titleSize: 20,
        subtitleSize: 10,
        extraSpacing: 18,
      }),
    );

    renderOptionsSection(pdfDoc, fonts, logos, includedOptions, {
      heading: 'Zakres uslug w cenie',
      subtitle: 'Elementy potwierdzone w generatorze oferty',
      intro: 'Materialy i czynnosci ponizej sa juz uwzglednione w wartosci glownej oferty. Pokazuja one standard wykonania w ramach zamowionej uslugi.',
      priceLabel: 'Rozliczenie',
    });

    renderOptionsSection(pdfDoc, fonts, logos, optionalOptions, {
      heading: 'Opcje dodatkowe rekomendowane klientowi',
      subtitle: 'Elementy dostepne jako rozbudowa zakresu',
      continuationSubtitle: 'Opcje dodatkowe - kontynuacja',
      intro: 'Opcje ponizej pozostaja poza zakresem podstawowym. Po ich zaznaczeniu w generatorze zostana przeniesione do glownej tabeli wraz z aktualizacja cen i opisem.',
      priceLabel: 'Informacja cenowa',
    });

    const optionalPdfBuffers = await Promise.all(
      optionalOptions
        .filter((option) => option.pdfPath)
        .map(async (option) => {
          try {
            const buffer = await fetchAsset(option.pdfPath, `opis opcji ${option.label}`, { optional: true });
            return buffer ? { buffer, option } : null;
          } catch (error) {
            console.warn(`Pominieto zalacznik PDF dla opcji ${option.label}:`, error);
            return null;
          }
        })
    );

    const filteredOptionalBuffers = optionalPdfBuffers.filter(Boolean);
    for (const item of filteredOptionalBuffers) {
      try {
        const annexDoc = await PDFDocument.load(item.buffer);
        const pageCount = annexDoc.getPageCount();
        for (let index = 0; index < pageCount; index += 1) {
          const [copiedPage] = await pdfDoc.copyPages(annexDoc, [index]);
          pdfDoc.addPage(copiedPage);
        }
      } catch (error) {
        console.warn('Nie udalo sie dodac zalacznika PDF:', error);
      }
    }

    const summaryPage = pdfDoc.addPage();
    let summaryY = drawPageBranding(summaryPage, fonts, logos, {
      title: 'Podsumowanie finansowe i parametry',
      subtitle: `Oferta dla: ${userName}`,
      titleSize: 18,
      subtitleSize: 10,
      extraSpacing: 24,
    });

    const summaryIntro = 'Zestawienie obejmuje wartosci po rabacie, koszt montazu oraz kluczowe parametry techniczne zaproponowanej konfiguracji.';
    const summaryIntroLines = wrapText(regularFont, summaryIntro, 10, summaryPage.getSize().width - 120);
    summaryIntroLines.forEach((line) => {
      summaryPage.drawText(line, {
        x: 60,
        y: summaryY,
        size: 10,
        font: regularFont,
        color: rgb(0.12, 0.12, 0.12),
      });
      summaryY -= 13;
    });

    summaryY -= 12;

    summaryPage.drawText('Montaz - jak wykonujemy', {
      x: 60,
      y: summaryY,
      size: 12,
      font: boldFont,
      color: rgb(0.18, 0.18, 0.18),
    });
    summaryY -= 16;

    const variantLine = `Wybrany wariant: ${installationVariantSummary}`;
    const extrasLine = `W tej ofercie: ${installationExtrasEntries.join(' | ')}`;
    const variantLines = wrapText(regularFont, variantLine, 10, summaryPage.getSize().width - 120);
    variantLines.forEach((line) => {
      summaryPage.drawText(line, {
        x: 60,
        y: summaryY,
        size: 10,
        font: regularFont,
        color: rgb(0.12, 0.12, 0.12),
      });
      summaryY -= 12;
    });
    const extrasWrapped = wrapText(regularFont, extrasLine, 10, summaryPage.getSize().width - 120);
    extrasWrapped.forEach((line) => {
      summaryPage.drawText(line, {
        x: 60,
        y: summaryY,
        size: 10,
        font: regularFont,
        color: rgb(0.12, 0.12, 0.12),
      });
      summaryY -= 12;
    });

    summaryY -= 14;

    summaryY = drawKeyValueSection(
      summaryPage,
      fonts,
      [
        { label: 'Cena katalogowa', value: formatCurrency(catalogPriceNumber) },
        { label: `Rabat (${formatNumber(discountPercentNumber, 1)}%)`, value: `-${formatCurrency(discountValue)}` },
        { label: 'Cena po rabacie', value: formatCurrency(discountedPrice) },
        { label: 'Cena montazu', value: formatCurrency(installationPriceNumber) },
      ],
      60,
      summaryY,
    ) - 10;

    summaryPage.drawText(`Cena koncowa oferty: ${formatCurrency(finalPrice)}`, {
      x: 60,
      y: summaryY,
      size: 16,
      font: boldFont,
      color: rgb(0.72, 0.0, 0.16),
    });

    summaryY -= 32;

    summaryY = drawKeyValueSection(
      summaryPage,
      fonts,
      [
        { label: 'Profil', value: profileLabel },
        { label: 'Kolor', value: colorLabel },
        { label: 'Okucia', value: hardwareLabel },
        { label: 'Rodzaj montazu', value: assemblyLabel },
        { label: 'Powierzchnia okien', value: `${formatNumber(windowAreaNumber)} m2` },
        { label: 'Obwod okien', value: `${formatNumber(windowPerimeterNumber)} mb` },
      ],
      60,
      summaryY,
    ) - 12;

    if (additionalNotes) {
      summaryPage.drawText('Uwagi do oferty', {
        x: 60,
        y: summaryY,
        size: 12,
        font: boldFont,
        color: rgb(0.18, 0.18, 0.18),
      });
      summaryY -= 16;
      const noteLines = wrapText(regularFont, additionalNotes, 10, summaryPage.getSize().width - 120);
      noteLines.forEach((line) => {
        summaryPage.drawText(line, {
          x: 60,
          y: summaryY,
          size: 10,
          font: regularFont,
          color: rgb(0.12, 0.12, 0.12),
        });
        summaryY -= 12;
      });
    }

    if (contactBytes) {
      try {
        const contactDoc = await PDFDocument.load(contactBytes);
        const [contactPage] = await pdfDoc.copyPages(contactDoc, [0]);
        pdfDoc.addPage(contactPage);
      } catch (error) {
        console.warn('Nie udalo sie dodac strony kontaktowej:', error);
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Blad podczas generowania PDF dla Okien Nest:', error);
    alert(`Wystapil blad podczas generowania oferty Okna Nest: ${error.message}`);
    return null;
  }
}

