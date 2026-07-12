const SKIPPED_KEYS = new Set(['password', 'passwordHash', 'token', 'authorization']);

const sanitizeText = (value) =>
  value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim();

const sanitizeValue = (value, key) => {
  if (typeof value === 'string') {
    return SKIPPED_KEYS.has(key) ? value : sanitizeText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, key));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([nestedKey, nestedValue]) => [nestedKey, sanitizeValue(nestedValue, nestedKey)]));
  }

  return value;
};

export const sanitizeInputs = (req, _res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  next();
};
