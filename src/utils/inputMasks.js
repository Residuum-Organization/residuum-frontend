export function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

export function limitLength(value = "", max = 255) {
  return String(value).slice(0, max);
}

export function applyPhoneMask(value = "") {
  const digits = limitLength(onlyDigits(value), 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
