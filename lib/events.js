export const normalizeEventRow = (row) => {
  const pick = (snake, camel) => (row && (row[snake] ?? row[camel]));

  const normalizeImageSource = (value) => {
    if (!value) return null;
    if (typeof value === 'string') return { uri: value };
    if (typeof value === 'object' && typeof value.uri === 'string') return { uri: value.uri };
    return null;
  };

  const normalizeImageArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map(normalizeImageSource).filter(Boolean);
  };

  const img = normalizeImageSource(pick('image', 'image'));
  const imgs = normalizeImageArray(pick('images', 'images'));
  const hero = img || imgs[0] || null;

  const priceLabel = String(pick('price_label', 'priceLabel') || '').trim();
  const priceAmount = pick('price_amount', 'priceAmount');
  const currency = String(pick('currency', 'currency') || '').trim();
  const price =
    priceLabel ||
    (Number.isFinite(Number(priceAmount)) ? `${currency ? `${currency} ` : ''}${Number(priceAmount)}`.trim() : '');

  return {
    id: pick('id', 'id'),
    slug: pick('slug', 'slug'),
    title: pick('title', 'title'),
    description: pick('description', 'description') || pick('summary', 'summary') || '',
    date: pick('date_label', 'dateLabel') || pick('date', 'date') || '',
    startAt: pick('start_at', 'startAt') || null,
    endAt: pick('end_at', 'endAt') || null,
    location: pick('location', 'location') || '',
    price,
    image: hero,
    images: imgs.length > 0 ? imgs : hero ? [hero] : [],
    requirements: Array.isArray(pick('requirements', 'requirements')) ? pick('requirements', 'requirements') : [],
    venueHint: pick('venue_hint', 'venueHint') || '',
  };
};
