const BUSINESS_TIME_ZONE = "America/Manaus";
const BUSINESS_TIME_ZONE_OFFSET = "-04:00";
const LEGACY_UTC_MIDNIGHT =
  /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.0+)?(?:Z|[+-]00:00)?$/;

const getBusinessDateParts = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
};

export const toDateInputValue = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const legacyDate = value.match(LEGACY_UTC_MIDNIGHT);
    if (legacyDate) return legacyDate[1];
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  }

  const parts = getBusinessDateParts(value);
  return parts ? `${parts.year}-${parts.month}-${parts.day}` : "";
};

export const formatCalendarDate = (value) => {
  const date = toDateInputValue(value);
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

export const toBusinessDayISOString = (date, endOfDay = false) => {
  if (!date) return null;

  const time = endOfDay ? "23:59:59.999" : "00:00:00.000";
  return new Date(`${date}T${time}${BUSINESS_TIME_ZONE_OFFSET}`).toISOString();
};

export const getTodayInputValue = () => toDateInputValue(new Date());
