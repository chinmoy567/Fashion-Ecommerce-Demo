const COLUMNS = ['sku', 'name', 'category', 'price', 'discountPrice', 'stock', 'material', 'sizes', 'colors', 'status'];

// Escape a value for safe inclusion in a CSV cell (RFC 4180 quoting)
const escapeCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

// Serialize products (with populated categoryId) into a CSV string
export const productsToCsv = (products) => {
  const rows = products.map((p) => [
    p.sku,
    p.name,
    p.categoryId?.name || '',
    p.price,
    p.discountPrice ?? '',
    p.stock,
    p.material || '',
    (p.sizes || []).join('|'),
    (p.colors || []).join('|'),
    p.status,
  ]);

  return [COLUMNS.join(','), ...rows.map((row) => row.map(escapeCell).join(','))].join('\r\n');
};

// Parse one CSV line respecting double-quoted cells (handles embedded commas/escaped quotes)
const parseLine = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
};

// Parse a CSV file buffer into an array of row objects keyed by header name.
// Returns { rows, errors } where errors are { line, message } for malformed rows.
export const parseProductCsv = (text) => {
  const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { rows: [], errors: [{ line: 0, message: 'CSV file is empty' }] };
  }

  const header = parseLine(lines[0]).map((h) => h.trim());
  const rows = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    if (cells.length !== header.length) {
      errors.push({ line: i + 1, message: `Expected ${header.length} columns, got ${cells.length}` });
      continue;
    }
    const row = {};
    header.forEach((key, idx) => {
      row[key] = cells[idx];
    });
    rows.push({ line: i + 1, data: row });
  }

  return { rows, errors };
};

export const PRODUCT_CSV_COLUMNS = COLUMNS;
