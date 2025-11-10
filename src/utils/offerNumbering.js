// src/utils/offerNumbering.js

const DEFAULT_STORAGE_KEY = 'offerNumberCounters';
const DEFAULT_INITIALS = 'OF';

const normalizeName = (value) => {
  if (!value) {
    return '';
  }
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getAdvisorInitials = (displayName, fallback = DEFAULT_INITIALS) => {
  const normalized = normalizeName(displayName);
  if (!normalized) {
    return fallback;
  }
  const parts = normalized.split(' ').filter(Boolean);
  if (!parts.length) {
    return fallback;
  }
  const firstInitial = parts[0][0] || '';
  const lastInitial =
    parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || '';
  const initials = `${firstInitial}${lastInitial || ''}`.toUpperCase();
  return initials || fallback;
};

export const reserveOfferNumber = (
  displayName,
  {
    storageKey = DEFAULT_STORAGE_KEY,
    fallbackInitials = DEFAULT_INITIALS,
    categoryCode = '',
  } = {}
) => {
  const initials = getAdvisorInitials(displayName, fallbackInitials);
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const normalizedCategory =
    typeof categoryCode === 'string' && categoryCode.trim().length > 0
      ? categoryCode.trim().toUpperCase()
      : '';
  const bucketKey = `${initials}-${normalizedCategory || 'GEN'}-${year}-${month}`;
  const fallbackNumber = normalizedCategory
    ? `${initials}/${normalizedCategory}/${month}/1`
    : `${initials}/${month}/1`;

  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      offerNumber: fallbackNumber,
      meta: { initials, month, year, value: 1 },
    };
  }

  let counters = {};
  try {
    const stored = window.localStorage.getItem(storageKey);
    counters = stored ? JSON.parse(stored) : {};
  } catch (error) {
    counters = {};
  }

  const nextValue = (Number(counters[bucketKey]) || 0) + 1;
  counters[bucketKey] = nextValue;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(counters));
  } catch (error) {
    // Ignore persistence errors to avoid blocking offer generation
  }

  return {
    offerNumber: normalizedCategory
      ? `${initials}/${normalizedCategory}/${month}/${nextValue}`
      : `${initials}/${month}/${nextValue}`,
    meta: { initials, month, year, value: nextValue, category: normalizedCategory },
  };
};
