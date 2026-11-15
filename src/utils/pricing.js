export const PROMOS = Object.freeze({ UTS25: 0.25, HEMAT10: 0.1, KOPI15: 0.15 });

export function normalizePromo(code) {
  return typeof code === 'string' ? code.trim().toUpperCase() : '';
}

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function money(value) {
  return rupiah.format(Number.isFinite(value) ? value : 0);
}

/** Prices stay numeric; rounding happens independently for discount and tax. */
export function calculateTotals(items = [], code = '') {
  if (!Array.isArray(items)) throw new TypeError('Daftar item tidak valid.');
  const subtotal = items.reduce((sum, item) => {
    if (!item || !Number.isSafeInteger(item.price) || item.price < 0
      || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      throw new TypeError('Harga atau jumlah item tidak valid.');
    }
    const next = sum + item.price * item.quantity;
    if (!Number.isSafeInteger(next)) throw new RangeError('Nilai transaksi terlalu besar.');
    return next;
  }, 0);
  const normalized = normalizePromo(code);
  const promoCode = Object.hasOwn(PROMOS, normalized) ? normalized : '';
  const discount = Math.round(subtotal * (PROMOS[promoCode] || 0));
  const tax = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + tax;
  if (!Number.isSafeInteger(total)) throw new RangeError('Nilai transaksi terlalu besar.');
  return { subtotal, discount, tax, total, promoCode };
}
