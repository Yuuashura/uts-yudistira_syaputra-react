import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotals, money, normalizePromo, PROMOS } from '../src/utils/pricing.js';
import { createInitialState, createCartReducer, transition, selectItems, parseCartState, restoreState, validateCartState } from '../src/utils/cartReducer.js';
import { readStoredValue, writeStoredValue } from '../src/hooks/useLocalStorage.js';

const catalog = Object.freeze([
  Object.freeze({ id: 'coffee', name: 'Kopi', category: 'Kopi', image: '/images/coffee.jpg', price: 25000, stock: 3 }),
  Object.freeze({ id: 'snack', name: 'Roti', category: 'Snack', image: '/images/snack.jpg', price: 15000, stock: 2 }),
  Object.freeze({ id: 'empty', name: 'Habis', category: 'Kopi', image: '/images/empty.jpg', price: 18000, stock: 0 }),
]);
const reducer = createCartReducer(catalog);
const initial = () => createInitialState(catalog);
const action = (type, payload = {}) => ({ type, payload });
const add = (state, id = 'coffee') => reducer(state, action('ADD', { id }));
const checkout = (state, id = 'KK-test') => transition(state, action('CHECKOUT', { id, createdAt: '2026-11-15T10:00:00.000Z' }), catalog);
const paid = () => checkout(add(initial())).state;
const clone = (value) => JSON.parse(JSON.stringify(value));

function memoryStorage() {
  const data = new Map();
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('promo definitions, normalization, and Rupiah formatting', () => {
  assert.deepEqual(PROMOS, { UTS25: 0.25, HEMAT10: 0.1, KOPI15: 0.15 });
  assert.equal(normalizePromo('  uts25 '), 'UTS25');
  assert.equal(normalizePromo(null), '');
  assert.match(money(100000), /Rp\s*100\.000/);
  assert.match(money(NaN), /Rp\s*0/);
});

test('documented Rp100,000 promo and tax example', () => {
  assert.deepEqual(calculateTotals([{ price: 25000, quantity: 4 }], ' uts25 '), {
    subtotal: 100000, discount: 25000, tax: 7500, total: 82500, promoCode: 'UTS25',
  });
});

test('odd Rupiah subtotal rounds discount and post-discount tax separately', () => {
  assert.deepEqual(calculateTotals([{ price: 100001, quantity: 1 }], 'UTS25'), {
    subtotal: 100001, discount: 25000, tax: 7500, total: 82501, promoCode: 'UTS25',
  });
  assert.equal(calculateTotals([{ price: 100006, quantity: 1 }], 'UTS25').discount, 25002);
});

test('other promos, unknown codes, and empty totals', () => {
  const items = [{ price: 100000, quantity: 1 }];
  assert.equal(calculateTotals(items, 'HEMAT10').total, 99000);
  assert.equal(calculateTotals(items, 'KOPI15').total, 93500);
  assert.equal(calculateTotals(items, '__proto__').total, 110000);
  assert.equal(calculateTotals(items, 'toString').promoCode, '');
  assert.deepEqual(calculateTotals([]), { subtotal: 0, discount: 0, tax: 0, total: 0, promoCode: '' });
});

test('pricing refuses malformed or unsafe numeric inputs', () => {
  for (const item of [{ price: -1, quantity: 1 }, { price: '100', quantity: 1 },
    { price: 100, quantity: 0 }, { price: 100, quantity: 1.5 }, { price: Infinity, quantity: 1 },
    { price: Number.MAX_SAFE_INTEGER, quantity: 2 }]) {
    assert.throws(() => calculateTotals([item]));
  }
  assert.throws(() => calculateTotals(null));
});

test('adding is immutable, leaves physical stock alone, and respects stock', () => {
  const start = initial();
  const before = clone(start);
  const state = add(add(add(start)));
  assert.deepEqual(start, before);
  assert.equal(state.cart[0].quantity, 3);
  assert.equal(state.stock.coffee, 3);
  const full = transition(state, action('ADD', { id: 'coffee' }), catalog);
  assert.equal(full.result.ok, false);
  assert.equal(full.state, state);
  assert.equal(transition(start, action('ADD', { id: 'empty' }), catalog).result.ok, false);
  assert.equal(transition(start, action('ADD', { id: 'unknown' }), catalog).result.ok, false);
  assert.equal(catalog[0].stock, 3);
});

test('decrement removes final unit; remove removes an entire line', () => {
  let state = add(add(initial()));
  state = reducer(state, action('DECREMENT', { id: 'coffee' }));
  assert.equal(state.cart[0].quantity, 1);
  state = reducer(state, action('DECREMENT', { id: 'coffee' }));
  assert.deepEqual(state.cart, []);
  assert.equal(transition(state, action('REMOVE', { id: 'coffee' }), catalog).result.ok, false);
  assert.deepEqual(reducer(add(add(state)), action('REMOVE', { id: 'coffee' })).cart, []);
});

test('invalid promo preserves valid promo; replacement does not stack', () => {
  let state = reducer(initial(), action('PROMO', { code: ' uts25 ' }));
  assert.equal(state.promoCode, 'UTS25');
  for (const code of ['bad', '', 'constructor', null]) {
    const result = transition(state, action('PROMO', { code }), catalog);
    assert.equal(result.result.ok, false);
    assert.equal(result.state, state);
  }
  state = reducer(state, action('PROMO', { code: 'hemat10' }));
  assert.equal(state.promoCode, 'HEMAT10');
  assert.equal(reducer(state, action('CLEAR_PROMO')).promoCode, '');
});

test('checkout atomically snapshots receipt, consumes stock, clears cart and promo', () => {
  const state = reducer(add(add(initial()), 'snack'), action('PROMO', { code: 'UTS25' }));
  const before = clone(state);
  const output = checkout(state);
  assert.equal(output.result.ok, true);
  assert.deepEqual(state, before);
  assert.deepEqual(output.state.stock, { coffee: 2, snack: 1, empty: 0 });
  assert.deepEqual(output.state.cart, []);
  assert.equal(output.state.promoCode, '');
  assert.equal(output.state.orders.length, 1);
  assert.equal(output.result.order, output.state.orders[0]);
  assert.equal(output.result.order.total, 33000);
  assert.equal(output.result.order.status, 'Dibayar (simulasi)');
  assert.equal(output.result.order.items[0].price, 25000);
  assert.notEqual(output.result.order.items[0], catalog[0]);
  assert.equal(validateCartState(output.state, catalog), true);
});

test('reducer is deterministic and duplicate checkout against latest state fails', () => {
  const state = add(initial());
  assert.deepEqual(checkout(state), checkout(state));
  let latest = state;
  const first = checkout(latest);
  latest = first.state;
  const second = checkout(latest, 'KK-second');
  assert.equal(second.result.ok, false);
  assert.equal(second.state.orders.length, 1);
  assert.equal(checkout(add(latest)).result.ok, false, 'duplicate receipt ID is rejected');
});

test('checkout rejects empty, duplicate, unknown, fractional, negative, or excess quantities', () => {
  assert.equal(checkout(initial()).result.ok, false);
  for (const cart of [
    [{ menuId: 'coffee', quantity: 4 }], [{ menuId: 'coffee', quantity: 0 }],
    [{ menuId: 'coffee', quantity: -1 }], [{ menuId: 'coffee', quantity: 0.5 }],
    [{ menuId: 'unknown', quantity: 1 }],
    [{ menuId: 'coffee', quantity: 1 }, { menuId: 'coffee', quantity: 1 }],
  ]) assert.equal(checkout({ ...initial(), cart }).result.ok, false);
  assert.equal(transition(add(initial()), action('CHECKOUT'), catalog).result.ok, false);
});

test('selectors enrich menu and count units; reset fully restores only cart state', () => {
  const state = add(add(add(initial()), 'snack'));
  const items = selectItems(state, catalog);
  assert.equal(items.length, 2);
  assert.equal(items.reduce((sum, item) => sum + item.quantity, 0), 3);
  assert.equal(items[0].name, 'Kopi');
  assert.deepEqual(reducer(paid(), action('RESET')), initial());
  assert.equal(transition(state, action('UNKNOWN'), catalog).state, state);
});

test('restoration accepts round-tripped receipt snapshots and normalizes stale cart entries', () => {
  const state = paid();
  assert.deepEqual(restoreState(clone(state), catalog), state);
  state.cart = [{ menuId: 'coffee', quantity: 99 }, { menuId: 'removed-menu', quantity: 1 }, { menuId: 'empty', quantity: 1 }];
  assert.deepEqual(restoreState(state, catalog).cart, [{ menuId: 'coffee', quantity: 2 }]);
});

test('restoration rejects malformed versions, stock, promo, and cart bounds', () => {
  for (const change of [
    (s) => { s.version = 2; }, (s) => { s.stock.coffee = -1; },
    (s) => { s.stock.coffee = 4; }, (s) => { delete s.stock.snack; },
    (s) => { s.stock.unknown = 1; }, (s) => { s.stock.coffee = 2; },
    (s) => { s.promoCode = 'BOGUS'; }, (s) => { s.cart = [{ menuId: 'coffee', quantity: '2' }]; },
    (s) => { s.cart = [{ menuId: 'coffee', quantity: 1000001 }]; },
    (s) => { s.cart = [{ menuId: 'coffee', quantity: 1 }, { menuId: 'coffee', quantity: 1 }]; },
  ]) {
    const state = initial(); change(state);
    assert.equal(parseCartState(state, catalog), null);
    assert.deepEqual(restoreState(state, catalog), initial());
  }
  for (const value of [null, [], {}, 'text']) assert.equal(validateCartState(value, catalog), false);
});

test('restoration deeply validates receipts, totals, metadata, IDs, and stock ledger', () => {
  for (const change of [
    (s) => { s.orders[0].total += 1; }, (s) => { s.orders[0].tax = '2500'; },
    (s) => { s.orders[0].createdAt = 'yesterday'; }, (s) => { s.orders[0].id = ''; },
    (s) => { s.orders[0].status = 'pending'; }, (s) => { s.orders[0].items = []; },
    (s) => { s.orders[0].items[0].quantity = -1; }, (s) => { s.orders[0].items[0].price = NaN; },
    (s) => { s.orders[0].items[0].name = {}; }, (s) => { s.orders[0].items[0].menuId = 'unknown'; },
    (s) => { s.orders[0].items.push(s.orders[0].items[0]); },
    (s) => { s.orders.push(s.orders[0]); }, (s) => { s.stock.coffee = 3; },
  ]) {
    const state = paid(); change(state);
    assert.equal(validateCartState(state, catalog), false);
  }
});

test('versioned storage roundtrip and missing-value fallback', () => {
  const storage = memoryStorage();
  const fallback = initial();
  assert.deepEqual(readStoredValue(storage, 'cart', fallback), { value: fallback, error: null });
  assert.equal(writeStoredValue(storage, 'cart', paid()), null);
  assert.equal(JSON.parse(storage.getItem('cart')).version, 1);
  assert.deepEqual(readStoredValue(storage, 'cart', fallback, (value) => validateCartState(value, catalog)), {
    value: paid(), error: null,
  });
});

test('corrupt, incompatible, rejected, or throwing validation recovers safely with error', () => {
  const storage = memoryStorage();
  for (const raw of ['{broken', 'null', '[]', '{}', '{"version":2,"value":[]}', '{"version":1,"value":{}}']) {
    storage.setItem('cart', raw);
    const result = readStoredValue(storage, 'cart', initial(), (value) => validateCartState(value, catalog));
    assert.deepEqual(result.value, initial());
    assert.equal(typeof result.error, 'string');
  }
  writeStoredValue(storage, 'cart', paid());
  assert.ok(readStoredValue(storage, 'cart', initial(), () => { throw new Error('bad validator'); }).error);
});

test('blocked storage, serialization, and quota failures surface errors without throwing', () => {
  const blocked = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceededError'); } };
  const result = readStoredValue(blocked, 'cart', initial());
  assert.deepEqual(result.value, initial());
  assert.ok(result.error);
  assert.ok(writeStoredValue(blocked, 'cart', paid()));
  const cyclic = {}; cyclic.self = cyclic;
  assert.ok(writeStoredValue(memoryStorage(), 'cart', cyclic));
});
