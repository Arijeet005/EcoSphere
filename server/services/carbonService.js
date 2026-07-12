export const calculateManualEmission = (quantity, co2PerUnit) => Number(quantity) * Number(co2PerUnit);

export const parseDateRange = (dateRange) => {
  if (!dateRange) {
    return null;
  }

  const [startRaw, endRaw] = dateRange.split(',');
  const start = startRaw ? new Date(startRaw) : null;
  const end = endRaw ? new Date(endRaw) : null;

  if (!start || Number.isNaN(start.getTime()) || !end || Number.isNaN(end.getTime())) {
    return null;
  }

  return { start, end };
};
