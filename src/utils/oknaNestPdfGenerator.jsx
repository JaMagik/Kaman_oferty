// src/utils/oknaNestPdfGenerator.jsx
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {
  assemblyTypeOptions,
  getOptionLabel,
  hardwareThicknessOptions,
  windowOptionDefinitions,
  optionalFeatureGroups,
  installationExtras,
  demolitionOptions,
  demolitionTypeOptions,
  demolitionDirectionOptions,
  additionalOfferIds,
} from '../data/windowsOfferConfig';
import { HST_WINDOW_SURCHARGE_VALUE } from '../constants/pricing';

const additionalOfferIdSet = new Set(additionalOfferIds);

const OKNA_NEST_COVER_PATH = '/pdf_templates/okna_nest/1_okladka_okna_nest.pdf';
const COMMON_CONTACT_PAGE_PATH = '/pdf_templates/common/kontakt_NEST.pdf';
const LOGO_NEST_PATH = '/logos/Kaman%20Nest.png';
const LOGO_GROUP_PATH = '/logos/Grupa%20Kaman.png';
const ABOUT_GROUP_PATHS = [
  '/pdf_templates/common/O_grupie_NEST.pdf',
  '/pdf_templates/common/Co_robimy_NEST.pdf',
];
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

const resolveTextValue = (value) => {
  const trimmed = String(value ?? '').trim();
  return trimmed ? sanitizeNbsp(trimmed) : '---';
};

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

const resolveAttachmentBytes = async (file) => {
  if (!file) {
    return null;
  }
  if (typeof file.arrayBuffer === 'function') {
    return await file.arrayBuffer();
  }
  if (file instanceof ArrayBuffer) {
    return file;
  }
  if (file && file.buffer instanceof ArrayBuffer) {
    return file.buffer;
  }
  return null;
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
    titleSize = 19,
    subtitleSize = 9.5,
    titleColor = rgb(0.72, 0.0, 0.16),
    subtitleColor = rgb(0.32, 0.32, 0.32),
    marginX = 48,
    topMargin = 44,
    brandSpacing = 16,
    extraSpacing = 14,
    nestMaxWidth = 150,
    nestMaxHeight = 42,
    showLogo = true,
    showGroupLogo = true,
    groupMaxWidth = 110,
    groupMaxHeight = 28,
    groupMarginY = 18,
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

  if (showGroupLogo && logos?.group) {
    const groupDims = scaleImageToFit(logos.group, groupMaxWidth, groupMaxHeight);
    page.drawImage(logos.group, {
      x: marginX,
      y: groupMarginY,
      width: groupDims.width,
      height: groupDims.height,
    });
  }

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

    const headers = ['Lp.', 'Zakres', 'Opis', 'Ilość', 'Cena'];
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

const drawFlexibleTable = (
  pdfDoc,
  startPage,
  fonts,
  rows,
  columns,
  startY,
  customConfig = {},
  onNewPage,
) => {
  if (!rows || rows.length === 0) {
    return { page: startPage, y: startY };
  }

  const config = {
    headerHeight: 22,
    headerFontSize: 9,
    rowFontSize: 9,
    lineHeight: 1.3,
    paddingX: 8,
    paddingY: 6,
    headerBgColor: rgb(0.72, 0.0, 0.16),
    headerFontColor: rgb(1, 1, 1),
    rowFontColor: rgb(0.12, 0.12, 0.12),
    evenRowBgColor: rgb(0.98, 0.96, 0.96),
    lineColor: rgb(0.82, 0.82, 0.82),
    topMargin: 60,
    bottomMargin: 60,
    align: 'left',
    widthMode: 'center',
    rowStyleResolver: null,
    ...customConfig,
  };

  let page = startPage;
  let cursorY = typeof startY === 'number' ? startY : page.getSize().height - config.topMargin;
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  const computeStartX = () => {
    if (config.widthMode === 'left') {
      return config.leftMargin || 60;
    }
    const { width } = page.getSize();
    return (width - tableWidth) / 2;
  };

  let tableStartX = computeStartX();

  const drawHeader = () => {
    cursorY -= config.headerHeight;
    page.drawRectangle({
      x: tableStartX,
      y: cursorY,
      width: tableWidth,
      height: config.headerHeight,
      color: config.headerBgColor,
    });

    let columnX = tableStartX;
    columns.forEach((column) => {
      const headerText = column.header || '';
      const textWidth = fonts.bold.widthOfTextAtSize(headerText, config.headerFontSize);
      let textX = columnX + config.paddingX;
      const alignment = column.align || config.align;
      if (alignment === 'center') {
        textX = columnX + (column.width - textWidth) / 2;
      } else if (alignment === 'right') {
        textX = columnX + column.width - config.paddingX - textWidth;
      }
      page.drawText(headerText, {
        x: textX,
        y: cursorY + (config.headerHeight - config.headerFontSize) / 2,
        size: config.headerFontSize,
        font: fonts.bold,
        color: config.headerFontColor,
      });
      columnX += column.width;
    });
  };

  const ensureSpace = (requiredHeight) => {
    if (cursorY - requiredHeight < config.bottomMargin) {
      const newPage = pdfDoc.addPage();
      cursorY =
        typeof onNewPage === 'function'
          ? onNewPage(newPage)
          : newPage.getSize().height - config.topMargin;
      page = newPage;
      tableStartX = computeStartX();
      drawHeader();
    }
  };

  drawHeader();

  const resolveRowStyle =
    typeof config.rowStyleResolver === 'function' ? config.rowStyleResolver : () => ({});

  rows.forEach((row, rowIndex) => {
    const rowStyle = resolveRowStyle(row, rowIndex) || {};
    const rowFont = rowStyle.font === 'bold' ? fonts.bold : fonts.regular;
    const rowFontSize = Number(rowStyle.fontSize) > 0 ? rowStyle.fontSize : config.rowFontSize;
    const rowFontColor = rowStyle.fontColor || config.rowFontColor;
    const rowLineHeightFactor =
      Number(rowStyle.lineHeight) > 0 ? rowStyle.lineHeight : config.lineHeight;
    const rowBgColor =
      rowStyle.bgColor !== undefined
        ? rowStyle.bgColor
        : rowIndex % 2 === 1
          ? config.evenRowBgColor
          : null;

    const columnContent = columns.map((column) => {
      const raw = row[column.key];
      const text = raw === null || raw === undefined ? '' : String(raw);
      const maxWidth = column.width - config.paddingX * 2;
      const lines = wrapText(rowFont, text, rowFontSize, Math.max(maxWidth, 10));
      return { lines };
    });

    const lineHeight = rowFontSize * rowLineHeightFactor;
    const contentHeight = columnContent.reduce(
      (max, entry) => Math.max(max, entry.lines.length * lineHeight),
      rowFontSize,
    );
    const rowHeight = contentHeight + config.paddingY * 2;

    ensureSpace(rowHeight);

    const rowBottomY = cursorY - rowHeight;
    if (rowBgColor) {
      page.drawRectangle({
        x: tableStartX,
        y: rowBottomY,
        width: tableWidth,
        height: rowHeight,
        color: rowBgColor,
      });
    }

    let columnX = tableStartX;
    columnContent.forEach((entry, columnIndex) => {
      let textY = cursorY - config.paddingY - rowFontSize;
      entry.lines.forEach((line) => {
        const textWidth = rowFont.widthOfTextAtSize(line, rowFontSize);
        let textX = columnX + config.paddingX;
        const alignment = columns[columnIndex].align || 'left';
        if (alignment === 'center') {
          textX = columnX + (columns[columnIndex].width - textWidth) / 2;
        } else if (alignment === 'right') {
          textX = columnX + columns[columnIndex].width - config.paddingX - textWidth;
        }
        page.drawText(line, {
          x: textX,
          y: textY,
          size: rowFontSize,
          font: rowFont,
          color: rowFontColor,
        });
        textY -= lineHeight;
      });
      columnX += columns[columnIndex].width;
    });

    page.drawLine({
      start: { x: tableStartX, y: cursorY },
      end: { x: tableStartX + tableWidth, y: cursorY },
      thickness: 0.5,
      color: config.lineColor,
    });

    cursorY = rowBottomY;
  });

  page.drawLine({
    start: { x: tableStartX, y: cursorY },
    end: { x: tableStartX + tableWidth, y: cursorY },
    thickness: 0.5,
    color: config.lineColor,
  });

  return { page, y: cursorY - 16 };
};

const fetchAsset = async (path, label, { optional = false } = {}) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      if (optional) {
        console.warn(`Nie udało się pobrać zasobu ${label}: ${path}`);
        return null;
      }
      throw new Error(`Brak zasobu ${label}: ${path}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    if (!optional) {
      throw error;
    }
    console.warn(`Pominięto zasób opcjonalny ${label}:`, error);
    return null;
  }
};

export async function generateOknaNestPDF(formData) {
  const {
    userName,
    investmentAddress,
    investmentAddressDetails = {},
    clientAdvisor = {},
    preparedBy,
    preparedByLabel,
    offerNumber = '',
    catalogPrice,
    discountPercent,
    marginPercent,
    installationPrice,
    installationPricingMode = 'flat',
    installationRatePerMeter,
    installationPerMeterExtra = '',
    installationPriceComputed,
    installationPriceOverride,
    windowPerimeter,
    windowArea,
    hstWindowCount = '0',
    hstWindowsSurcharge = '0',
    profileType,
    hardwareThickness,
    assemblyType,
    profileColor,
    glassProducer = 'Glass Shift',
    glassType = 'Pakiet standard (2 uszczelki)',
    gasketPackage = 'standard-2',
    hingeType = '',
    hingeLabel,
    warmSpacer = 'yes',
    rcPackage = 'no',
    lazikIncluded = 'na',
    demolitionMode = 'na',
    demolitionType = 'na',
    demolitionDirection = 'na',
    selectedOptionIds,
    additionalNotes,
    featureSelections = {},
    installationExtras: installationExtrasState = {},
    optionPrices: optionPricesState = {},
    vatRate,
  attachmentFile,
} = formData || {};

  if (!userName || !investmentAddress) {
    alert('Brakuje podstawowych danych klienta.');
    return null;
  }

  const catalogPriceNumber = parseInputNumber(catalogPrice);
  const discountPercentRaw = Math.max(parseInputNumber(discountPercent), 0);
  const discountPercentNumber = Math.min(discountPercentRaw, 100);
  const marginPercentNumber = Math.max(parseInputNumber(marginPercent), 0);
  const windowPerimeterNumber = parseInputNumber(windowPerimeter);
  const windowAreaNumber = parseInputNumber(windowArea);
  const installationRateNumber = parseInputNumber(installationRatePerMeter);
  const installationPerMeterExtraNumber = parseInputNumber(installationPerMeterExtra);
  const explicitComputedInstallation = parseInputNumber(installationPriceComputed);
  const installationOverrideNumber = parseInputNumber(installationPriceOverride);
  const baseComputedInstallation =
    explicitComputedInstallation > 0
      ? explicitComputedInstallation
      : windowPerimeterNumber > 0 && installationRateNumber > 0
        ? windowPerimeterNumber * installationRateNumber
        : 0;
  const installationPriceNumberRaw = parseInputNumber(installationPrice);
  const normalizedPricingMode = (installationPricingMode || '').toLowerCase();
  const fallbackInstallationPrice =
    normalizedPricingMode === 'per-meter'
      ? baseComputedInstallation + installationPerMeterExtraNumber
      : installationOverrideNumber > 0
        ? installationOverrideNumber
        : baseComputedInstallation;
  const installationPriceNumber =
    installationPriceNumberRaw > 0 ? installationPriceNumberRaw : fallbackInstallationPrice;
  const vatRateNumber = Math.max(parseInputNumber(vatRate), 0);
  const hstWindowCountNumber = Math.max(Math.floor(parseInputNumber(hstWindowCount)), 0);
  const providedHstSurcharge = parseInputNumber(hstWindowsSurcharge);
  const hstWindowsSurchargeNumber =
    hstWindowCountNumber > 0
      ? providedHstSurcharge > 0
        ? providedHstSurcharge
        : hstWindowCountNumber * HST_WINDOW_SURCHARGE_VALUE
      : 0;

  if (windowPerimeterNumber <= 0 || windowAreaNumber <= 0) {
    alert('Podaj łączną powierzchnię oraz obwód okien.');
    return null;
  }

  if (installationPriceNumber <= 0) {
    alert('Brakuje informacji o łącznej cenie montażu.');
    return null;
  }

  const windowsDiscountAmount = catalogPriceNumber * (discountPercentNumber / 100);
  const discountedWindowsPrice = Math.max(catalogPriceNumber - windowsDiscountAmount, 0);
  const netAfterDiscount = discountedWindowsPrice + installationPriceNumber + hstWindowsSurchargeNumber;
  const marginValueNumber = discountedWindowsPrice * (marginPercentNumber / 100);
  const finalNetPrice = netAfterDiscount + marginValueNumber;
  const vatAmount = finalNetPrice * (vatRateNumber / 100);
  const finalGrossPrice = finalNetPrice + vatAmount;

  const includedOptions = windowOptionDefinitions.filter((option) => selectedOptionIds?.includes(option.id));
  const optionalOptions = windowOptionDefinitions.filter((option) => !selectedOptionIds?.includes(option.id));

  const excludedFeatureIds = new Set([
    'feature-premium-color',
    'feature-muntins',
    'feature-acoustic',
    'feature-warm-spacer',
    'feature-hinge-brake',
    'feature-rc2',
  ]);

  const featureStatusRows = [];
  optionalFeatureGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (excludedFeatureIds.has(item.id)) {
        return;
      }
      const selection = featureSelections[item.id] || {};
      const enabled = Boolean(selection.enabled);
      const detail = (selection.detail || '').trim();
      const summaryLabel = item.summaryLabel || item.label;
      featureStatusRows.push({
        group: group.label,
        label: `${group.label} - ${summaryLabel}`,
        status: enabled ? 'TAK' : 'NIE',
        detail: enabled && detail ? detail : '',
      });
    });
  });

  const profileLabel = resolveTextValue(profileType);
  const hardwareLabel = findOptionLabel(hardwareThicknessOptions, hardwareThickness);
  const assemblyLabel = resolveTextValue(
    assemblyTypeOptions.find((option) => option.value === assemblyType)?.label || assemblyType,
  );
  const colorLabel = resolveTextValue(profileColor);
  const hingeDisplay = resolveTextValue(hingeLabel || hingeType);
  const reinforcementLabel =
    hardwareThickness === 'standard-12'
      ? 'Standard: wzmocnienie profilu 1,2-2,0 mm'
      : hardwareThickness === 'reinforced-20'
        ? 'Pakiet Premium: stal 2,0 mm w kazdym oknie'
        : hardwareLabel;
  const warmSpacerLabel = warmSpacer === 'yes' ? 'Tak' : 'Nie';
  const glazingLabel = 'Pakiet 3-szybowy (standard)';
  const glassTypeLabel = resolveTextValue(glassType || 'Pakiet standard (2 uszczelki)');
  const rcLabel = rcPackage === 'yes' ? 'Tak' : 'Nie';
  const glassProducerLabel = resolveTextValue(glassProducer || 'Glass Shift');
  const gasketLabel =
    gasketPackage === 'premium-3'
      ? 'Pakiet premium (3 uszczelki)'
      : gasketPackage === 'standard-2'
        ? 'Pakiet standard (2 uszczelki)'
        : resolveTextValue(gasketPackage);
  const microventEnabled = Boolean(featureSelections['feature-microvent']?.enabled);
  const microventLabel = microventEnabled
    ? 'W zestawie: klamka z funkcją mikrowentylacji'
    : 'Opcjonalnie: klamka z funkcją mikrowentylacji';
  const lazikLabel =
    lazikIncluded === 'yes' ? 'Tak' : lazikIncluded === 'na' ? 'Nie dotyczy' : resolveTextValue(lazikIncluded);
  const { name: advisorName = '', phone: advisorPhone = '', email: advisorEmail = '' } = clientAdvisor || {};
  const preparedByDisplay = resolveTextValue(preparedByLabel || preparedBy);
  const themeBlue = rgb(0.04, 0.33, 0.58);
  const themeBlueLight = rgb(0.9, 0.95, 0.99);
  const themeText = rgb(0.12, 0.18, 0.24);
  const themeHighlight = rgb(1, 0.95, 0.85);
  const formatOptionalPrice = (value) => {
    const priceNumber = parseInputNumber(value);
    return priceNumber > 0 ? formatCurrency(priceNumber) : 'na indywidualną wycenę';
  };
  const normalizeExtraState = (value) => {
    if (value && typeof value === 'object') {
      return {
        selected: Boolean(value.selected),
        price: value.price ?? '',
        quantity: value.quantity ?? '',
      };
    }
    return { selected: Boolean(value), price: '', quantity: '' };
  };
  const normalizeOptionPrice = (entry) => {
    if (entry && typeof entry === 'object') {
      return entry.price ?? '';
    }
    return entry ?? '';
  };

  try {
    const [
      coverBytes,
      contactBytes,
      regularFontBytes,
      boldFontBytes,
      nestLogoBytes,
      groupLogoBytes,
    ] = await Promise.all([
      fetchAsset(OKNA_NEST_COVER_PATH, 'okladka Okna Nest'),
      fetchAsset(COMMON_CONTACT_PAGE_PATH, 'strona kontaktowa'),
      fetchAsset(FONT_REGULAR_PATH, 'OpenSans Regular'),
      fetchAsset(FONT_BOLD_PATH, 'OpenSans Bold'),
      fetchAsset(LOGO_NEST_PATH, 'logo KAMAN Nest'),
      fetchAsset(LOGO_GROUP_PATH, 'logo Grupa KAMAN'),
    ]);

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const regularFont = await pdfDoc.embedFont(regularFontBytes, { subset: false });
    const boldFont = await pdfDoc.embedFont(boldFontBytes, { subset: false });
    const fonts = { regular: regularFont, bold: boldFont };
    const logos = {
      nest: await pdfDoc.embedPng(nestLogoBytes),
      group: groupLogoBytes ? await pdfDoc.embedPng(groupLogoBytes) : null,
    };

    if (coverBytes) {
      const coverDoc = await PDFDocument.load(coverBytes);
      const [coverPage] = await pdfDoc.copyPages(coverDoc, [0]);
      pdfDoc.addPage(coverPage);
    }

    const offerDate = sanitizeNbsp(new Intl.DateTimeFormat('pl-PL').format(new Date()));
    const offerNumberDisplay = sanitizeNbsp(String(offerNumber || '').trim());
    const offerSubtitle = offerNumberDisplay
      ? `Data oferty: ${offerDate}     Nr oferty: ${offerNumberDisplay}`
      : `Data oferty: ${offerDate}`;
    const offerRecipient = resolveTextValue(userName);
    const headerTitle = '';
    const addressTown = resolveTextValue(investmentAddressDetails.town);
    const addressStreet = resolveTextValue(investmentAddressDetails.street);
    const addressPostalCode = resolveTextValue(investmentAddressDetails.postalCode);
    const addressCity = resolveTextValue(investmentAddressDetails.city);
    const addressSegments = [];
    if (addressTown && addressTown !== '---') {
      addressSegments.push(addressTown);
    }
    if (addressStreet && addressStreet !== '---') {
      addressSegments.push(addressStreet);
    }
    const postalCityLine = [addressPostalCode, addressCity].filter((part) => part && part !== '---').join(' ');
    if (postalCityLine) {
      addressSegments.push(postalCityLine);
    }
    const investmentAddressDisplay =
      addressSegments.length > 0 ? addressSegments.join('\n') : resolveTextValue(investmentAddress);
    let tablePage = pdfDoc.addPage();
    let currentY = drawPageBranding(tablePage, fonts, logos, {
      title: headerTitle,
      subtitle: offerSubtitle,
      titleSize: 22,
      subtitleSize: 11,
      extraSpacing: 10,
      showLogo: false,
      showGroupLogo: false,
    });

    const leftColumnEntries = [
      { label: 'Oferta dla', value: offerRecipient },
      { label: 'Adres inwestycji', value: investmentAddressDisplay },
      { label: 'Waznosc oferty', value: '14 dni' },
    ];

    const rightColumnEntries = [
      { label: 'Ofertę sporządził', value: preparedByDisplay || advisorName || '---' },
      { label: 'Telefon', value: advisorPhone || '---' },
      { label: 'Email', value: advisorEmail || '---' },
    ];

    const separatorColor = rgb(0.82, 0.82, 0.82);
    const infoBlockTop = currentY + 4;

    const drawInfoColumn = (entries, startX, startY, columnWidth) => {
      let y = startY;
      entries.forEach(({ label, value }, index) => {
        tablePage.drawText(label, {
          x: startX,
          y,
          size: 11,
          font: boldFont,
          color: rgb(0.15, 0.15, 0.15),
        });
        const rawValue = resolveTextValue(value);
        const blockSegments = rawValue.split('\n').filter(Boolean);
        let valueY = y - 11;
        if (blockSegments.length === 0) {
          blockSegments.push('---');
        }
        blockSegments.forEach((segment, segmentIndex) => {
          const segmentLines = wrapText(regularFont, segment, 10, Math.max(columnWidth - 8, 40));
          segmentLines.forEach((line) => {
            tablePage.drawText(line, {
              x: startX,
              y: valueY,
              size: 10,
              font: regularFont,
              color: rgb(0.18, 0.18, 0.18),
            });
            valueY -= 11;
          });
          if (segmentIndex < blockSegments.length - 1) {
            valueY -= 4;
          }
        });
        y = valueY - 4;

        if (index < entries.length - 1) {
          const lineY = y + 6;
          tablePage.drawLine({
            start: { x: startX, y: lineY },
            end: { x: startX + columnWidth, y: lineY },
            thickness: 0.5,
            color: separatorColor,
          });
          y -= 6;
        }
      });
      return y;
    };

    const infoColumnWidth = (tablePage.getSize().width - 148) / 2;
    const leftStartX = 60;
    const rightStartX = tablePage.getSize().width / 2 + 14;

    const leftBottom = drawInfoColumn(leftColumnEntries, leftStartX, currentY, infoColumnWidth);
    const rightBottom = drawInfoColumn(rightColumnEntries, rightStartX, currentY, infoColumnWidth);

    const infoBottom = Math.min(leftBottom, rightBottom);

    tablePage.drawLine({
      start: { x: leftStartX + infoColumnWidth + 20, y: infoBlockTop + 6 },
      end: { x: leftStartX + infoColumnWidth + 20, y: infoBottom - 8 },
      thickness: 0.5,
      color: separatorColor,
    });

    let logoAnchorY = infoBottom - 14;
    const { width: pageWidth } = tablePage.getSize();

    if (logos?.nest) {
      const nestDims = scaleImageToFit(logos.nest, 150, 42);
      const nestY = logoAnchorY - nestDims.height;
      tablePage.drawImage(logos.nest, {
        x: (pageWidth - nestDims.width) / 2,
        y: nestY,
        width: nestDims.width,
        height: nestDims.height,
      });
      logoAnchorY = nestY - 10;
    }

    if (logos?.group) {
      const groupDims = scaleImageToFit(logos.group, 110, 28);
      const groupY = logoAnchorY - groupDims.height;
      tablePage.drawImage(logos.group, {
        x: (pageWidth - groupDims.width) / 2,
        y: groupY,
        width: groupDims.width,
        height: groupDims.height,
      });
      logoAnchorY = groupY - 14;
    }

    currentY = logoAnchorY - 24;
    if (currentY < 200) {
      tablePage = pdfDoc.addPage();
      currentY = drawPageBranding(tablePage, fonts, logos, {
        title: headerTitle,
        subtitle: offerSubtitle,
        titleSize: 22,
        subtitleSize: 11,
        extraSpacing: 10,
      });
    }

    const demolitionLabel =
      demolitionOptions.find((option) => option.value === demolitionMode)?.label ||
      resolveTextValue(demolitionMode);
    const demolitionTypeLabel =
      findOptionLabel(demolitionTypeOptions, demolitionType) || resolveTextValue(demolitionType);
    const demolitionDirectionLabel =
      findOptionLabel(demolitionDirectionOptions, demolitionDirection) ||
      resolveTextValue(demolitionDirection);

    const configurationRows = [
      { parameter: 'Profil', value: profileLabel },
      { parameter: 'Kolor profilu', value: colorLabel },
      { parameter: 'Pakiet szklenia', value: glazingLabel },
      { parameter: 'Rodzaj szyby', value: glassTypeLabel },
      { parameter: 'Producent szyb', value: glassProducerLabel },
      { parameter: 'Wzmocnienie profilu', value: reinforcementLabel },
      { parameter: 'Zawiasy', value: hingeDisplay },
      { parameter: 'Pakiet uszczelek', value: gasketLabel },
      { parameter: 'Klamka z mikrowentylacją', value: microventLabel },
      { parameter: 'Ciepła ramka', value: warmSpacerLabel },
      { parameter: 'Pakiet RC', value: rcLabel },
      { parameter: 'Demontaż starych okien', value: demolitionLabel },
      { parameter: 'Rodzaj demontażu', value: demolitionTypeLabel },
      { parameter: 'Kierunek demontażu', value: demolitionDirectionLabel },
      { parameter: 'Rodzaj montażu', value: assemblyLabel },
      { parameter: 'Lazik', value: lazikLabel },
    ];

    currentY -= 10;

    tablePage.drawText('Parametry zestawu', {
      x: 60,
      y: currentY,
      size: 12,
      font: boldFont,
      color: themeBlue,
    });
    currentY -= 16;

    const parametersTableResult = drawFlexibleTable(
      pdfDoc,
      tablePage,
      fonts,
      configurationRows,
      [
        { key: 'parameter', header: 'Parametr', width: 240 },
        { key: 'value', header: 'Wartosc', width: 300 },
      ],
      currentY,
      {
        topMargin: 70,
        bottomMargin: 50,
        paddingY: 5,
        headerBgColor: themeBlue,
        headerFontColor: rgb(1, 1, 1),
        rowFontColor: themeText,
        evenRowBgColor: themeBlueLight,
        lineColor: rgb(0.78, 0.86, 0.94),
      },
      (newPage) =>
        drawPageBranding(newPage, fonts, logos, {
          title: headerTitle,
          subtitle: offerSubtitle,
          titleSize: 22,
          subtitleSize: 11,
          extraSpacing: 10,
        }),
    );
    tablePage = parametersTableResult.page;
    currentY = parametersTableResult.y - 20;

    const boxPaddingX = 18;
    const boxHeight = 34;
    const metricsPageWidth = tablePage.getSize().width;
    const boxWidth = metricsPageWidth - 96;
    const boxX = 48;
    currentY -= 8;
    const boxBottomY = currentY - boxHeight;

    tablePage.drawRectangle({
      x: boxX,
      y: boxBottomY,
      width: boxWidth,
      height: boxHeight,
      borderColor: themeBlue,
      borderWidth: 1.2,
      color: rgb(0.93, 0.97, 1),
    });

    const baselineY = boxBottomY + (boxHeight - 12) / 2 + 2;
    const areaText = `Powierzchnia okien: ${formatNumber(windowAreaNumber)} m2`;
    tablePage.drawText(areaText, {
      x: boxX + boxPaddingX,
      y: baselineY,
      size: 12,
      font: boldFont,
      color: themeBlue,
    });

    const perimeterText = `Obwod okien: ${formatNumber(windowPerimeterNumber)} mb`;
    const perimeterWidth = boldFont.widthOfTextAtSize(perimeterText, 12);
    tablePage.drawText(perimeterText, {
      x: boxX + boxWidth - boxPaddingX - perimeterWidth,
      y: baselineY,
      size: 12,
      font: boldFont,
      color: themeBlue,
    });
    currentY = boxBottomY - 18;

    const scopeSummaryRows = [];
    let scopeIndex = 1;
    const seenScopeLabels = new Set();

    windowOptionDefinitions.forEach((option) => {
      if (additionalOfferIdSet.has(option.id)) {
        return;
      }
      const selected = selectedOptionIds?.includes(option.id);
      const normalized = option.label.trim().toLowerCase();
      if (seenScopeLabels.has(normalized)) {
        return;
      }
      seenScopeLabels.add(normalized);
      scopeSummaryRows.push({
        lp: String(scopeIndex++),
        label: option.label,
        status: selected ? 'TAK' : 'NIE',
        detail: selected ? 'W cenie' : 'Poza zakresem',
      });
    });

    featureStatusRows.forEach((row) => {
      const normalized = row.label.trim().toLowerCase();
      if (seenScopeLabels.has(normalized)) {
        return;
      }
      seenScopeLabels.add(normalized);
      scopeSummaryRows.push({
        lp: String(scopeIndex++),
        label: row.label,
        status: row.status,
        detail: row.detail || '---',
      });
    });

    scopeSummaryRows.push({
      lp: String(scopeIndex++),
      label: 'Demontaż starych okien',
      status: demolitionLabel || '---',
      detail: '---',
    });

    const deferredParapetRows = [];
    const extraStateMap = new Map();
    installationExtras.forEach((item) => {
      extraStateMap.set(item.id, normalizeExtraState(installationExtrasState?.[item.id]));
    });

    const getExtraState = (id) => extraStateMap.get(id) || normalizeExtraState();

    const combinedExtrasConfig = [
      { id: 'install-sealed-tape', label: 'Szczelny montaż (taśmy)' },
      { id: 'install-titan-wings', label: 'Szczelny montaż (Titan Wings)' },
      { id: 'install-threshold-seal', label: 'Szczelny montaż progów (EPDM)' },
      {
        id: 'install-reveal-prep-combined',
        label: 'Przygotowanie glifów pod szczelny montaż - zagruntowanie i wyrównanie klejem',
      },
      { id: 'install-warm-parapets', label: 'Ciepłe parapety XPS 700 KPA' },
      { id: 'install-purenit-extensions', label: 'Poszerzenia pod okna Purenit' },
      { id: 'install-system-extensions', label: 'Poszerzenia systemowe / podwaliny systemowe' },
      { id: 'install-full-window-demolition', label: 'Demontaż okien w całości', type: 'demolition' },
      { id: 'install-outer-sills', label: 'Montaż parapetów zewnętrznych (stal powlekana)', type: 'parapet' },
      { id: 'install-inner-sills', label: 'Montaż parapetów wewnętrznych (kamień)', type: 'parapet' },
    ];

    const combinedRowsData = [];

    combinedExtrasConfig.forEach((config) => {
      if (config.id === 'install-reveal-prep-combined') {
        const prepState = getExtraState('install-reveal-prep');
        const primeState = getExtraState('install-prime-level');
        const combinedSelected = prepState.selected || primeState.selected;
        const combinedPriceNumber =
          parseInputNumber(prepState.price) + parseInputNumber(primeState.price);
        combinedRowsData.push({
          label: config.label,
          status: combinedSelected ? 'TAK' : 'Opcja',
          quantity: '---',
          price: formatOptionalPrice(combinedPriceNumber),
        });
        return;
      }

      const extraState = getExtraState(config.id);
      const isParapetExtra = config.type === 'parapet';
      const isDemolitionExtra = config.type === 'demolition';

      if (isDemolitionExtra && demolitionType !== 'na') {
        return;
      }

      if (isDemolitionExtra && !extraState.selected) {
        return;
      }

      const quantityValue =
        isParapetExtra || isDemolitionExtra
          ? extraState.quantity?.toString().trim() || 'wg projektu'
          : '---';
      const priceValue = isDemolitionExtra
        ? (() => {
            const priceNumber = parseInputNumber(extraState.price);
            return priceNumber > 0 ? formatCurrency(priceNumber) : 'wedlug projektu';
          })()
        : formatOptionalPrice(extraState.price);
      const row = {
        label: config.label,
        status: extraState.selected ? 'TAK' : 'Opcja',
        quantity: quantityValue,
        price: priceValue,
        isParapet: isParapetExtra,
        selected: extraState.selected,
        detailId: config.id,
      };

      if (isParapetExtra && !extraState.selected) {
        deferredParapetRows.push(row);
        return;
      }

      combinedRowsData.push(row);
    });

    const mountingRows = combinedRowsData.map((row, index) => ({
      lp: String(index + 1),
      label: row.label,
      status: row.status,
      quantity: row.quantity,
      price: row.price,
    }));

    currentY -= 12;

    const priceTableRows = [
      { element: 'CENA NETTO OFERTY Z MONTAŻEM', amount: formatCurrency(finalNetPrice) },
      { element: `VAT (${formatNumber(vatRateNumber, 0)})`, amount: formatCurrency(vatAmount) },
      { element: 'CENA BRUTTO OFERTY Z MONTAŻEM', amount: formatCurrency(finalGrossPrice), emphasize: true },
    ];

    if (hstWindowsSurchargeNumber > 0) {
      priceTableRows.unshift({
        element: `Dopłata HST (${hstWindowCountNumber} szt.)`,
        amount: formatCurrency(hstWindowsSurchargeNumber),
      });
    }

    tablePage = pdfDoc.addPage();
    currentY = drawPageBranding(tablePage, fonts, logos, {
      title: headerTitle,
      subtitle: offerSubtitle,
      titleSize: 22,
      subtitleSize: 11,
      extraSpacing: 10,
    });

    tablePage.drawText('Podsumowanie cenowe', {
      x: 60,
      y: currentY,
      size: 12,
      font: boldFont,
      color: themeBlue,
    });
    currentY -= 16;

    const priceTableResult = drawFlexibleTable(
      pdfDoc,
      tablePage,
      fonts,
      priceTableRows,
      [
        { key: 'element', header: 'Element', width: 290 },
        { key: 'amount', header: 'Kwota (PLN)', width: 180, align: 'right' },
      ],
      currentY,
      {
        topMargin: 70,
        bottomMargin: 50,
        paddingY: 5,
        headerHeight: 20,
        widthMode: 'left',
        leftMargin: 60,
        headerBgColor: themeBlue,
        headerFontColor: rgb(1, 1, 1),
        rowFontColor: themeText,
        evenRowBgColor: themeBlueLight,
        lineColor: rgb(0.78, 0.86, 0.94),
        rowStyleResolver: (row) =>
          row.emphasize
            ? {
                font: 'bold',
                fontSize: 11,
                bgColor: themeHighlight,
                fontColor: themeText,
                lineHeight: 1.35,
              }
            : null,
      },
      (newPage) =>
        drawPageBranding(newPage, fonts, logos, {
          title: headerTitle,
          subtitle: offerSubtitle,
          titleSize: 22,
          subtitleSize: 11,
          extraSpacing: 10,
        }),
    );
    tablePage = priceTableResult.page;
    currentY = priceTableResult.y - 20;

    if (mountingRows.length > 0) {
      if (currentY < 140) {
        tablePage = pdfDoc.addPage();
        currentY = drawPageBranding(tablePage, fonts, logos, {
          title: headerTitle,
          subtitle: offerSubtitle,
          titleSize: 22,
          subtitleSize: 11,
          extraSpacing: 10,
        });
      }

      tablePage.drawText('Opcje dodatkowe', {
        x: 60,
        y: currentY,
        size: 12,
        font: boldFont,
        color: themeBlue,
      });
      currentY -= 16;
      const mountingNote =
        'Opcje dodatkowe nie są wliczone w cenę! Pozycje obejmują rekomendowane warianty montażowe i przygotowanie stolarki.';
      const mountingNoteLines = wrapText(regularFont, mountingNote, 9.5, tablePage.getSize().width - 120);
      mountingNoteLines.forEach((line) => {
        tablePage.drawText(line, {
          x: 60,
          y: currentY,
          size: 9.5,
          font: regularFont,
          color: themeText,
        });
        currentY -= 12;
      });
      currentY -= 4;

      const mountingTableResult = drawFlexibleTable(
        pdfDoc,
        tablePage,
        fonts,
        mountingRows,
        [
          { key: 'lp', header: 'Lp.', width: 36, align: 'center' },
          { key: 'label', header: 'Pozycja', width: 240 },
          { key: 'quantity', header: 'Sztuk', width: 70, align: 'center' },
          { key: 'price', header: 'Cena (PLN)', width: 110, align: 'right' },
        ],
        currentY,
        {
          topMargin: 70,
          bottomMargin: 50,
          paddingY: 5,
          headerBgColor: themeBlue,
          headerFontColor: rgb(1, 1, 1),
          rowFontColor: themeText,
          evenRowBgColor: themeBlueLight,
          lineColor: rgb(0.78, 0.86, 0.94),
        },
        (newPage) =>
          drawPageBranding(newPage, fonts, logos, {
            title: headerTitle,
            subtitle: offerSubtitle,
            titleSize: 22,
            subtitleSize: 11,
            extraSpacing: 10,
          }),
      );
      tablePage = mountingTableResult.page;
      currentY = mountingTableResult.y - 12;

      const complianceTitle = 'Wazna informacja';
      const complianceNote =
        'Klient zobowiazany jest do sprawdzenia oferty pod katem zgodnosci z zapytaniem.';
      const complianceLines = wrapText(regularFont, complianceNote, 9.5, tablePage.getSize().width - 120);

      const drawComplianceBlock = () => {
        tablePage.drawText(complianceTitle, {
          x: 60,
          y: currentY,
          size: 11,
          font: boldFont,
          color: themeBlue,
        });
        currentY -= 14;
        complianceLines.forEach((line) => {
          tablePage.drawText(line, {
            x: 60,
            y: currentY,
            size: 9.5,
            font: regularFont,
            color: themeText,
          });
          currentY -= 12;
        });
        currentY -= 8;
      };

      if (currentY < 120) {
        tablePage = pdfDoc.addPage();
        currentY = drawPageBranding(tablePage, fonts, logos, {
          title: headerTitle,
          subtitle: offerSubtitle,
          titleSize: 22,
          subtitleSize: 11,
          extraSpacing: 10,
        });
        currentY -= 12;
        drawComplianceBlock();
      } else {
        drawComplianceBlock();
      }
    }

    if (additionalNotes) {
      if (currentY < 100) {
        tablePage = pdfDoc.addPage();
        currentY = drawPageBranding(tablePage, fonts, logos, {
          title: headerTitle,
          subtitle: offerSubtitle,
          titleSize: 22,
          subtitleSize: 11,
          extraSpacing: 14,
        });
      }
      tablePage.drawText('Uwagi do oferty', {
        x: 60,
        y: currentY,
        size: 12,
        font: boldFont,
        color: themeBlue,
      });
      currentY -= 16;
      const noteLines = wrapText(regularFont, additionalNotes, 10, tablePage.getSize().width - 120);
      noteLines.forEach((line) => {
        if (currentY < 80) {
          tablePage = pdfDoc.addPage();
          currentY = drawPageBranding(tablePage, fonts, logos, {
            title: headerTitle,
            subtitle: offerSubtitle,
            titleSize: 22,
            subtitleSize: 11,
            extraSpacing: 14,
          });
        }
        tablePage.drawText(line, {
          x: 60,
          y: currentY,
          size: 10,
          font: regularFont,
          color: rgb(0.12, 0.12, 0.12),
        });
        currentY -= 12;
      });
    }

    const optionLookup = new Map(windowOptionDefinitions.map((item) => [item.id, item]));
    const complementaryCandidates = [];

    const isOptionSelected = (id) => Boolean(selectedOptionIds?.includes(id));
    const getOptionDetail = (id, fallback) => {
      const option = optionLookup.get(id);
      return option?.summaryBullet || option?.description || option?.label || fallback || '';
    };
    const getOptionPriceNumber = (id) => parseInputNumber(normalizeOptionPrice(optionPricesState?.[id]));
    const formatPriceDisplay = (priceNumber, selected) => {
      if (priceNumber > 0) {
        return formatCurrency(priceNumber);
      }
      return selected ? 'w cenie' : 'na indywidualną wycenę';
    };

    const outerSillsExtra = getExtraState('install-outer-sills');
    const innerSillsExtra = getExtraState('install-inner-sills');

    const outerSillsPriceNumber = parseInputNumber(outerSillsExtra.price) + getOptionPriceNumber('external-sills');
    const outerSillsQuantity = String(outerSillsExtra.quantity ?? '').trim();
    const outerSillsDetailBase = getOptionDetail(
      'external-sills',
      'Parapety zewnętrzne dopasowane do koloru stolarki i elewacji.',
    );
    const outerSillsDetail = outerSillsQuantity
      ? `${outerSillsDetailBase}${outerSillsDetailBase.endsWith('.') ? '' : '.'} Ilość: ${outerSillsQuantity}.`
      : outerSillsDetailBase;

    if (!outerSillsExtra.selected) {
      complementaryCandidates.push({
        priority: 1.0,
        label: 'Parapety zewnętrzne',
        status: 'Opcja',
        price: formatPriceDisplay(outerSillsPriceNumber, false),
        detail: outerSillsDetail,
      });
    }

    const internalSillsPriceNumber =
      parseInputNumber(innerSillsExtra.price) + getOptionPriceNumber('internal-sills');
    const internalSillsQuantity = String(innerSillsExtra.quantity ?? '').trim();
    const internalSillsDetailBase = getOptionDetail(
      'internal-sills',
      'Parapety wewnętrzne docinane na wymiar i osadzane po montażu stolarki.',
    );
    const internalSillsDetail = internalSillsQuantity
      ? `${internalSillsDetailBase}${internalSillsDetailBase.endsWith('.') ? '' : '.'} Ilość: ${internalSillsQuantity}.`
      : internalSillsDetailBase;

    if (!innerSillsExtra.selected) {
      complementaryCandidates.push({
        priority: 1.1,
        label: 'Parapety wewnętrzne',
        status: 'Opcja',
        price: formatPriceDisplay(internalSillsPriceNumber, false),
        detail: internalSillsDetail,
      });
    }

    const internalBlindsExtra = getExtraState('install-internal-blinds');
    const internalBlindsSelected = internalBlindsExtra.selected || isOptionSelected('internal-blinds');
    const internalBlindsPriceNumber =
      parseInputNumber(internalBlindsExtra.price) + getOptionPriceNumber('internal-blinds');
    const internalBlindsDetail = getOptionDetail(
      'internal-blinds',
      'Rolety wewnętrzne, plisy lub żaluzje dopasowane do profilu okna.',
    );

    complementaryCandidates.push({
      priority: 1.2,
      label: 'Rolety wewnętrzne',
      status: internalBlindsSelected ? 'TAK' : 'Opcja',
      price: formatPriceDisplay(internalBlindsPriceNumber, internalBlindsSelected),
      detail: internalBlindsDetail,
    });

    const externalBlindsSelected = isOptionSelected('external-blinds');
    const externalBlindsPriceNumber = getOptionPriceNumber('external-blinds');
    const externalBlindsDetail = getOptionDetail(
      'external-blinds',
      'Rolety zewnętrzne, screeny lub żaluzje fasadowe z integracją sterowania.',
    );

    complementaryCandidates.push({
      priority: 1.3,
      label: 'Rolety zewnętrzne / screeny / żaluzje zewnętrzne',
      status: externalBlindsSelected ? 'TAK' : 'Opcja',
      price: formatPriceDisplay(externalBlindsPriceNumber, externalBlindsSelected),
      detail: externalBlindsDetail,
    });

    const mosquitoSelected = isOptionSelected('insect-screens') || isOptionSelected('insect-screens-plisse');
    const mosquitoPriceNumber =
      getOptionPriceNumber('insect-screens') + getOptionPriceNumber('insect-screens-plisse');
    const mosquitoDetail =
      'Moskitiery ramkowe oraz plisowane dopasowane do okien i drzwi tarasowych.';

    complementaryCandidates.push({
      priority: 1.4,
      label: 'Moskitiery',
      status: mosquitoSelected ? 'TAK' : 'Opcja',
      price: formatPriceDisplay(mosquitoPriceNumber, mosquitoSelected),
      detail: mosquitoDetail,
    });

    const smartControlSelected = isOptionSelected('smart-control');
    const smartControlPriceNumber = getOptionPriceNumber('smart-control');
    const smartControlDetail = getOptionDetail(
      'smart-control',
      'Sterowanie napedami okien i oslon za pomoca aplikacji mobilnej.',
    );

    complementaryCandidates.push({
      priority: 1.5,
      label: 'Sterowanie inteligentne',
      status: smartControlSelected ? 'TAK' : 'Opcja',
      price: formatPriceDisplay(smartControlPriceNumber, smartControlSelected),
      detail: smartControlDetail,
    });

    const purenitExtra = getExtraState('install-purenit-extensions');
    const systemExtensionsExtra = getExtraState('install-system-extensions');
    const poszerzeniaSelected =
      purenitExtra.selected || systemExtensionsExtra.selected || isOptionSelected('system-extensions');
    const poszerzeniaPriceNumber =
      parseInputNumber(purenitExtra.price) +
      parseInputNumber(systemExtensionsExtra.price) +
      getOptionPriceNumber('system-extensions');
    const poszerzeniaDetail = getOptionDetail(
      'system-extensions',
      'Poszerzenia progowe i podwaliny stabilizujące montaż stolarki.',
    );

    complementaryCandidates.push({
      priority: 1.6,
      label: 'Poszerzenia progowe',
      status: poszerzeniaSelected ? 'TAK' : 'Opcja',
      price: formatPriceDisplay(poszerzeniaPriceNumber, poszerzeniaSelected),
      detail: poszerzeniaDetail,
    });

    complementaryCandidates.sort((a, b) => a.priority - b.priority);

    const complementaryRows = complementaryCandidates.map((candidate, index) => ({
      lp: String(index + 1),
      label: candidate.label,
      status: candidate.status,
      price: candidate.price,
      detail: candidate.detail || '',
    }));

    if (complementaryRows.length > 0) {
      tablePage = pdfDoc.addPage();
      currentY = drawPageBranding(tablePage, fonts, logos, {
        title: headerTitle,
        subtitle: offerSubtitle,
        titleSize: 22,
        subtitleSize: 11,
        extraSpacing: 12,
      });

      tablePage.drawText('Dodatkowe doposazenie stolarki', {
        x: 48,
        y: currentY,
        size: 12,
        font: boldFont,
        color: themeBlue,
      });
      currentY -= 16;

      const complementaryTableResult = drawFlexibleTable(
        pdfDoc,
        tablePage,
        fonts,
        complementaryRows,
        [
          { key: 'lp', header: 'Lp.', width: 36, align: 'center' },
          { key: 'label', header: 'Pozycja', width: 165 },
          { key: 'status', header: 'Status', width: 60, align: 'center' },
          { key: 'price', header: 'Cena (PLN)', width: 95, align: 'left' },
          { key: 'detail', header: 'Opis', width: 150 },
        ],
        currentY,
        {
          topMargin: 70,
          bottomMargin: 40,
          paddingY: 6,
          widthMode: 'left',
          leftMargin: 48,
          headerBgColor: themeBlue,
          headerFontColor: rgb(1, 1, 1),
          rowFontColor: themeText,
          evenRowBgColor: themeBlueLight,
          lineColor: rgb(0.78, 0.86, 0.94),
        },
        (newPage) =>
          drawPageBranding(newPage, fonts, logos, {
            title: headerTitle,
            subtitle: offerSubtitle,
            titleSize: 22,
            subtitleSize: 11,
            extraSpacing: 12,
          }),
      );
      tablePage = complementaryTableResult.page;
      currentY = Math.min(complementaryTableResult.y - 24, 90);

      if (currentY < 70) {
        tablePage = pdfDoc.addPage();
        currentY = drawPageBranding(tablePage, fonts, logos, {
          title: headerTitle,
          subtitle: offerSubtitle,
          titleSize: 22,
          subtitleSize: 11,
          extraSpacing: 12,
        });
        currentY = 90;
      }

      const pageWidth = tablePage.getSize().width;
      const headline = 'Grupa Kaman to nie tylko okna...';
      const subline = 'Znajdziesz u nas rowniez';
      const headlineSize = 13;
      const sublineSize = 11;
      const headlineWidth = boldFont.widthOfTextAtSize(headline, headlineSize);
      const sublineWidth = regularFont.widthOfTextAtSize(subline, sublineSize);
      const headlineX = (pageWidth - headlineWidth) / 2;
      const sublineX = (pageWidth - sublineWidth) / 2;

      tablePage.drawText(headline, {
        x: headlineX,
        y: currentY,
        size: headlineSize,
        font: boldFont,
        color: themeBlue,
      });
      currentY -= headlineSize + 6;

      tablePage.drawText(subline, {
        x: sublineX,
        y: currentY,
        size: sublineSize,
        font: regularFont,
        color: themeBlue,
      });
      currentY -= sublineSize + 12;

      const centerX = pageWidth / 2;
      const arrowHeight = 14;
      const arrowHalfWidth = 8;
      const arrowTopY = currentY;

      tablePage.drawLine({
        start: { x: centerX, y: arrowTopY },
        end: { x: centerX, y: arrowTopY - arrowHeight },
        thickness: 1.4,
        color: themeBlue,
      });
      tablePage.drawLine({
        start: { x: centerX - arrowHalfWidth, y: arrowTopY - arrowHeight + 4 },
        end: { x: centerX, y: arrowTopY - arrowHeight },
        thickness: 1.4,
        color: themeBlue,
      });
      tablePage.drawLine({
        start: { x: centerX + arrowHalfWidth, y: arrowTopY - arrowHeight + 4 },
        end: { x: centerX, y: arrowTopY - arrowHeight },
        thickness: 1.4,
        color: themeBlue,
      });
      currentY = arrowTopY - arrowHeight - 12;
    }

    if (attachmentFile) {
      try {
        const attachmentBytes = await resolveAttachmentBytes(attachmentFile);
        if (attachmentBytes) {
          const attachmentDoc = await PDFDocument.load(attachmentBytes);
          const attachmentPageCount = attachmentDoc.getPageCount();
          for (let index = 0; index < attachmentPageCount; index += 1) {
            const [copiedPage] = await pdfDoc.copyPages(attachmentDoc, [index]);
            pdfDoc.addPage(copiedPage);
          }
        }
      } catch (error) {
        console.warn('Nie udało się dodać załącznika formularza:', error);
      }
    }

    for (const pdfPath of ABOUT_GROUP_PATHS) {
      try {
        const aboutBytes = await fetchAsset(pdfPath, `material informacyjny ${pdfPath}`, { optional: true });
        if (aboutBytes) {
          const aboutDoc = await PDFDocument.load(aboutBytes);
          const aboutPages = aboutDoc.getPageCount();
          for (let index = 0; index < aboutPages; index += 1) {
            const [copiedPage] = await pdfDoc.copyPages(aboutDoc, [index]);
            pdfDoc.addPage(copiedPage);
          }
        }
      } catch (error) {
        console.warn(`Nie udało się dodać PDF ${pdfPath}:`, error);
      }
    }

    const optionalPdfBuffers = await Promise.all(
      optionalOptions
        .filter((option) => option.pdfPath)
        .map(async (option) => {
          try {
            const buffer = await fetchAsset(option.pdfPath, `opis opcji ${option.label}`, { optional: true });
            return buffer ? { buffer, option } : null;
          } catch (error) {
            console.warn(`Pominięto załącznik PDF dla opcji ${option.label}:`, error);
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
        console.warn('Nie udało się dodać załącznika PDF:', error);
      }
    }
    if (contactBytes) {
      try {
        const contactDoc = await PDFDocument.load(contactBytes);
        const [contactPage] = await pdfDoc.copyPages(contactDoc, [0]);
        pdfDoc.addPage(contactPage);
      } catch (error) {
        console.warn('Nie udało się dodać strony kontaktowej:', error);
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
