export const normalizeProductRow = (row) => {
  const pick = (snake, camel) => (row && (row[snake] ?? row[camel]));

  const currency = String(pick('currency', 'currency') || '').trim();
  const priceLabel = String(pick('price_label', 'priceLabel') || '').trim();
  const priceAmount = pick('price_amount', 'priceAmount');
  const originalLabel = String(pick('original_price_label', 'originalPriceLabel') || '').trim();
  const originalAmount = pick('original_price_amount', 'originalPriceAmount');

  const toMoney = (label, amount) => {
    if (String(label || '').trim()) return String(label).trim();
    if (!Number.isFinite(Number(amount))) return '';
    const cur = String(currency || '').trim();
    return `${cur ? `${cur} ` : ''}${Number(amount)}`.trim();
  };

  const normalizeImageUrl = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && typeof value.uri === 'string') return value.uri;
    return '';
  };

  const imageUrl = normalizeImageUrl(pick('image_url', 'imageUrl') || pick('image', 'image'));

  const images = Array.isArray(pick('images', 'images'))
    ? pick('images', 'images')
        .map((v) => {
          if (typeof v === 'string') return v;
          if (v && typeof v === 'object' && typeof v.uri === 'string') return v.uri;
          return null;
        })
        .filter(Boolean)
    : imageUrl
      ? [imageUrl]
      : [];

  const leftRaw = pick('stock_left', 'left');
  const left = typeof leftRaw === 'number' ? leftRaw : Number.isFinite(Number(leftRaw)) ? Number(leftRaw) : undefined;

  return {
    id: pick('id', 'id'),
    slug: pick('slug', 'slug'),
    name: pick('name', 'name'),
    description: pick('description', 'description') || '',
    price: toMoney(priceLabel, priceAmount),
    originalPrice: toMoney(originalLabel, originalAmount),
    left,
    imageUrl,
    images,
  };
};
