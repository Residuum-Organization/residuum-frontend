const UNLABELED_NOTE = "Embalagem sem rótulo.";
const BARCODE_PREFIX = "Código de barras:";

export const parseResidueIdentification = (item = {}) => {
  const observation = String(item.observacao || "");
  const barcodeMatch = observation.match(/Código de barras:\s*([^\n.]+)/i);
  const barcode = String(item.codigo_barras || barcodeMatch?.[1] || "").trim();
  const withoutLabel = Boolean(item.sem_rotulo) || /Embalagem sem rótulo\.?/i.test(observation);
  const cleanObservation = observation
    .replace(/Embalagem sem rótulo\.?/gi, "")
    .replace(/Código de barras:\s*[^\n.]+\.?/gi, "")
    .replace(/^\s*[.·-]\s*/gm, "")
    .trim();

  return { barcode, withoutLabel, cleanObservation };
};

export const buildResidueObservation = ({ observation, barcode, withoutLabel }) => {
  const parts = [];
  if (withoutLabel) parts.push(UNLABELED_NOTE);
  if (barcode) parts.push(`${BARCODE_PREFIX} ${barcode}.`);
  if (observation?.trim()) parts.push(observation.trim());
  return parts.join("\n");
};
