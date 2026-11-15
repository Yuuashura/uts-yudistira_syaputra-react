import { calculateTotals, normalizePromo, PROMOS } from './pricing.js';

export const CART_VERSION = 1;
const MAX_QUANTITY = 1_000_000;
const MAX_PRICE = 1_000_000_000_000;
const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const integer = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;
const text = (value, max = 200) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const validCode = (code) => code === '' || (typeof code === 'string' && Object.hasOwn(PROMOS, code));
const validDate = (value) => typeof value === 'string' && value.length <= 30
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;

export function createInitialState(catalog) {
  return {
    version: CART_VERSION,
    cart: [],
    stock: Object.fromEntries(catalog.map((item) => [item.id, item.stock])),
    orders: [],
    promoCode: '',
  };
}

export function selectItems(state, catalog) {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  return state.cart.flatMap(({ menuId, quantity }) => {
    const item = byId.get(menuId);
    return item ? [{ ...item, stock: state.stock[menuId], menuId, quantity }] : [];
  });
}

/** Returns a clean snapshot or null. Only stale cart IDs and excess qty are repaired. */
export function parseCartState(value, catalog) {
  try {
    if (!record(value) || value.version !== CART_VERSION || !record(value.stock)
      || !Array.isArray(value.cart) || !Array.isArray(value.orders)
      || value.cart.length > 10_000 || value.orders.length > 10_000 || !validCode(value.promoCode)) return null;
    const byId = new Map(catalog.map((item) => [item.id, item]));
    if (Object.keys(value.stock).length !== catalog.length) return null;
    const stock = {};
    for (const item of catalog) {
      if (!Object.hasOwn(value.stock, item.id) || !integer(value.stock[item.id], 0, item.stock)) return null;
      stock[item.id] = value.stock[item.id];
    }
    const sold = Object.fromEntries(catalog.map((item) => [item.id, 0]));
    const orderIds = new Set();
    const orders = [];
    for (const order of value.orders) {
      if (!record(order) || !text(order.id, 128) || orderIds.has(order.id)
        || !validDate(order.createdAt) || order.status !== 'Dibayar (simulasi)'
        || !validCode(order.promoCode) || !Array.isArray(order.items)
        || !order.items.length || order.items.length > catalog.length) return null;
      orderIds.add(order.id);
      const ids = new Set();
      const items = [];
      for (const item of order.items) {
        if (!record(item) || !byId.has(item.menuId) || item.id !== item.menuId || ids.has(item.menuId)
          || !text(item.name) || !text(item.category) || !text(item.image, 1000)
          || !integer(item.price, 0, MAX_PRICE) || !integer(item.quantity, 1, MAX_QUANTITY)) return null;
        ids.add(item.menuId);
        sold[item.menuId] += item.quantity;
        if (sold[item.menuId] > byId.get(item.menuId).stock) return null;
        items.push({ id: item.id, menuId: item.menuId, name: item.name, category: item.category,
          image: item.image, price: item.price, quantity: item.quantity });
      }
      const totals = calculateTotals(items, order.promoCode);
      if (['subtotal', 'discount', 'tax', 'total'].some((key) => !Number.isSafeInteger(order[key]) || order[key] !== totals[key])) return null;
      orders.push({ id: order.id, createdAt: order.createdAt, status: order.status, items, ...totals });
    }
    // A restored stock balance must agree with its paid receipts, not merely be in range.
    if (catalog.some((item) => stock[item.id] + sold[item.id] !== item.stock)) return null;
    const cart = [];
    const cartIds = new Set();
    for (const entry of value.cart) {
      if (!record(entry) || !text(entry.menuId, 128) || !integer(entry.quantity, 1, MAX_QUANTITY)
        || cartIds.has(entry.menuId)) return null;
      cartIds.add(entry.menuId);
      if (!byId.has(entry.menuId)) continue;
      const quantity = Math.min(entry.quantity, stock[entry.menuId]);
      if (quantity > 0) cart.push({ menuId: entry.menuId, quantity });
    }
    return { version: CART_VERSION, cart, stock, orders, promoCode: value.promoCode };
  } catch {
    return null;
  }
}

export function validateCartState(value, catalog) {
  return parseCartState(value, catalog) !== null;
}

export function restoreState(value, catalog) {
  return parseCartState(value, catalog) || createInitialState(catalog);
}

/** All metadata (including checkout ID/time) is supplied by the caller. No side effects. */
export function transition(state, action, catalog) {
  const fail = (message) => ({ state, result: { ok: false, message } });
  const succeed = (next, message, order) => ({ state: next, result: { ok: true, message, ...(order ? { order } : {}) } });
  const payload = action?.payload || {};
  const item = catalog.find((entry) => entry.id === payload.id);
  const line = state.cart.find((entry) => entry.menuId === payload.id);
  switch (action?.type) {
    case 'ADD': {
      if (!item) return fail('Menu tidak ditemukan.');
      if ((line?.quantity || 0) >= state.stock[item.id]) return fail('Jumlah sudah mencapai batas stok.');
      const cart = line
        ? state.cart.map((entry) => entry.menuId === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry)
        : [...state.cart, { menuId: item.id, quantity: 1 }];
      return succeed({ ...state, cart }, `${item.name} ditambahkan ke keranjang.`);
    }
    case 'DECREMENT':
      if (!line) return fail('Menu tidak ada di keranjang.');
      return succeed({ ...state, cart: state.cart.flatMap((entry) => entry.menuId !== payload.id
        ? [entry] : entry.quantity > 1 ? [{ ...entry, quantity: entry.quantity - 1 }] : []) }, 'Jumlah menu dikurangi.');
    case 'REMOVE':
      if (!line) return fail('Menu tidak ada di keranjang.');
      return succeed({ ...state, cart: state.cart.filter((entry) => entry.menuId !== payload.id) }, 'Menu dihapus dari keranjang.');
    case 'PROMO': {
      const code = normalizePromo(payload.code);
      if (!Object.hasOwn(PROMOS, code)) return fail('Kode promo tidak dikenal. Gunakan UTS25, HEMAT10, atau KOPI15.');
      return succeed({ ...state, promoCode: code }, `Promo ${code} berhasil diterapkan.`);
    }
    case 'CLEAR_PROMO':
      return succeed({ ...state, promoCode: '' }, 'Promo dihapus.');
    case 'CHECKOUT': {
      if (!state.cart.length) return fail('Keranjang masih kosong.');
      const ids = new Set();
      for (const entry of state.cart) {
        const product = catalog.find((menu) => menu.id === entry.menuId);
        if (!product || ids.has(entry.menuId) || !integer(entry.quantity, 1, MAX_QUANTITY)
          || !integer(state.stock[entry.menuId], 0, product.stock)
          || entry.quantity > state.stock[entry.menuId]) return fail('Jumlah atau stok menu tidak valid. Periksa keranjang.');
        ids.add(entry.menuId);
      }
      if (!validCode(state.promoCode) || !text(payload.id, 128) || !validDate(payload.createdAt)
        || state.orders.some((order) => order.id === payload.id)) return fail('Data pembayaran tidak valid atau transaksi sudah diproses.');
      const items = selectItems(state, catalog).map(({ id, name, category, image, price, quantity }) => ({
        id, menuId: id, name, category, image, price, quantity,
      }));
      let totals;
      try { totals = calculateTotals(items, state.promoCode); } catch { return fail('Nilai transaksi tidak valid.'); }
      const order = { id: payload.id, createdAt: payload.createdAt, status: 'Dibayar (simulasi)', items, ...totals };
      const stock = { ...state.stock };
      for (const entry of state.cart) stock[entry.menuId] -= entry.quantity;
      return succeed({ ...state, stock, orders: [order, ...state.orders], cart: [], promoCode: '' }, 'Pembayaran simulasi berhasil. Pesananmu siap diproses.', order);
    }
    case 'RESET':
      return succeed(createInitialState(catalog), 'Stok dipulihkan. Riwayat, keranjang, dan promo dikosongkan.');
    default:
      return fail('Aksi tidak dikenal.');
  }
}

export function cartReducer(state, action, catalog) {
  return transition(state, action, catalog).state;
}

export function createCartReducer(catalog) {
  return (state, action) => cartReducer(state, action, catalog);
}
