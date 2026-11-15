import { test, expect } from '@playwright/test';

const card = (page, name) => page.getByRole('article', { name, exact: true });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('catalogue, local photos, and no external asset requests', async ({ page }) => {
  const errors = [];
  const external = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => {
    const url = new URL(request.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname) && !url.protocol.startsWith('data')) external.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('.menu-card')).toHaveCount(15);
  await page.locator('.menu-card').last().scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.menu-photo img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  await page.waitForTimeout(400);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('search, category counts, favourites, and favourite sorting', async ({ page }) => {
  const search = page.getByLabel('Cari menu');
  await search.fill('  LATTE  ');
  await expect(page.locator('.menu-card')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Kopi 2', exact: true })).toBeVisible();
  await search.fill('');

  const espresso = card(page, 'Espresso');
  await espresso.getByRole('button', { name: 'Favorit Espresso' }).click();
  await expect(espresso.getByRole('button', { name: 'Favorit Espresso' })).toHaveAttribute('aria-pressed', 'true');
  await card(page, 'Cappuccino').getByRole('button', { name: 'Favorit Cappuccino' }).click();
  await page.getByRole('button', { name: 'Favorit 2', exact: true }).click();
  await expect(page.locator('.menu-card')).toHaveCount(2);
  const names = await page.locator('.menu-card h3').allTextContents();
  expect(names[0]).toBe('Cappuccino');
  await page.locator('.sort-control select').selectOption('favorite-old');
  const oldFirst = await page.locator('.menu-card h3').first().textContent();
  expect(oldFirst).toBe('Espresso');
  await expect(page.getByRole('button', { name: /Notifikasi/ })).toContainText('2');
});

test('detail, review validation, and successful review without closing popup', async ({ page }) => {
  await card(page, 'Espresso').getByRole('button', { name: 'Info Espresso' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Belum ada ulasan untuk menu ini');
  await dialog.getByRole('button', { name: 'Tulis ulasan' }).click();
  await expect(page.getByRole('dialog')).toContainText('Ulasan Espresso');
  await page.getByRole('button', { name: 'Kirim ulasan' }).click();
  await expect(page.locator('#review-error')).toHaveText('Pilih rating 1–5 dan tulis komentar minimal 5 karakter.');
  await page.getByLabel('5 bintang').check();
  await page.getByLabel('Komentar', { exact: true }).fill('Aroma dan rasanya sangat seimbang.');
  await page.getByRole('button', { name: 'Kirim ulasan' }).click();
  await expect(page.getByRole('dialog')).toContainText('Aroma dan rasanya sangat seimbang.');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.toast').last()).toContainText('Ulasan untuk Espresso berhasil dikirim.');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(card(page, 'Espresso')).toContainText('5.0');
});

test('stock-limited cart, promo, checkout, receipt, history, and reset', async ({ page }) => {
  const espresso = card(page, 'Espresso');
  await espresso.getByRole('button', { name: 'Tambah Espresso' }).click();
  await espresso.getByRole('button', { name: 'Tambah Espresso' }).click();
  await expect(page.getByRole('button', { name: /Keranjang, 2 item/ })).toBeVisible();
  await page.getByRole('button', { name: /Keranjang, 2 item/ }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toContainText(/Rp\s?36\.000/);
  await drawer.locator('#promo-code').fill('hemat10');
  await drawer.getByRole('button', { name: 'Terapkan' }).click();
  await expect(drawer).toContainText('HEMAT10 diterapkan');
  await expect(drawer).toContainText(/Rp\s?3\.600/);
  await expect(drawer).toContainText(/Rp\s?3\.240/);
  await expect(drawer).toContainText(/Rp\s?35\.640/);
  await drawer.getByRole('button', { name: /Bayar \(simulasi\)/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Dibayar (simulasi)');
  await expect(page.getByRole('dialog')).toContainText(/Rp\s?35\.640/);
  await page.getByRole('button', { name: 'Kembali menikmati menu' }).click();
  await expect(card(page, 'Espresso')).toContainText('Tersedia 23');

  await page.getByRole('button', { name: 'Riwayat transaksi' }).click();
  await expect(page.getByRole('dialog')).toContainText('Total belanja');
  await page.getByRole('button', { name: /Reset stok \+ riwayat/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Mulai kembali?');
  await page.getByRole('button', { name: 'Batal' }).click();
  await expect(page.getByRole('dialog')).toContainText('Total belanja');
  await page.getByRole('button', { name: /Reset stok \+ riwayat/ }).click();
  await page.getByRole('button', { name: 'Ya, reset sekarang' }).click();
  await expect(page.getByRole('dialog')).toContainText('Belum ada transaksi');
  await page.keyboard.press('Escape');
  await expect(card(page, 'Espresso')).toContainText('Tersedia 25');
});

test('stock limit disables add when remaining stock is one', async ({ page }) => {
  await page.waitForFunction(() => localStorage.getItem('kopiku-cart'));
  await page.evaluate(() => {
    const envelope = JSON.parse(localStorage.getItem('kopiku-cart'));
    envelope.value.stock.espresso = 1;
    envelope.value.orders = [{
      id: 'uts-stok-tersisa-satu',
      createdAt: new Date().toISOString(),
      status: 'Dibayar (simulasi)',
      promoCode: '',
      items: [{ id: 'espresso', menuId: 'espresso', name: 'Espresso', category: 'Kopi', image: '/images/espresso.jpg', price: 18000, quantity: 24 }],
      subtotal: 432000,
      discount: 0,
      tax: 43200,
      total: 475200,
    }];
    localStorage.setItem('kopiku-cart', JSON.stringify(envelope));
  });
  await page.reload();
  const espresso = card(page, 'Espresso');
  await expect(espresso).toContainText('Tersedia 1');
  await espresso.getByRole('button', { name: 'Tambah Espresso' }).click();
  await expect(page.getByRole('button', { name: /Keranjang, 1 item/ })).toBeVisible();
  const add = espresso.getByRole('button', { name: 'Tambah Espresso' });
  await expect(add).toBeDisabled();
  await expect(add).toContainText('Batas stok');
  await page.getByRole('button', { name: /Keranjang, 1 item/ }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Tambah jumlah Espresso' })).toBeDisabled();
});

test('reload restores cart, favourites, reviews, and notifications', async ({ page }) => {
  await card(page, 'Cappuccino').getByRole('button', { name: 'Favorit Cappuccino' }).click();
  await card(page, 'Cappuccino').getByRole('button', { name: 'Tambah Cappuccino' }).click();
  await card(page, 'Cappuccino').getByRole('button', { name: 'Komentar Cappuccino' }).click();
  await page.getByLabel('4 bintang').check();
  await page.getByLabel('Komentar', { exact: true }).fill('Lembut dan tidak terlalu manis.');
  await page.getByRole('button', { name: 'Kirim ulasan' }).click();
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByRole('button', { name: /Keranjang, 1 item/ })).toBeVisible();
  await expect(card(page, 'Cappuccino').getByRole('button', { name: 'Favorit Cappuccino' })).toHaveAttribute('aria-pressed', 'true');
  await expect(card(page, 'Cappuccino')).toContainText('4.0');
  await expect(page.getByRole('button', { name: /Notifikasi/ })).toContainText('3');
});

test('notifications mark visible entries read and new entries stay unread', async ({ page }) => {
  await card(page, 'Espresso').getByRole('button', { name: 'Favorit Espresso' }).click();
  await page.getByRole('button', { name: /Notifikasi/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Espresso ditambahkan ke favorit.');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: /Notifikasi/ })).not.toContainText('1');
  await card(page, 'Cappuccino').getByRole('button', { name: 'Favorit Cappuccino' }).click();
  await expect(page.getByRole('button', { name: /Notifikasi/ })).toContainText('1');
});

test('mobile layout stays inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('.menu-card')).toHaveCount(15);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await card(page, 'Espresso').getByRole('button', { name: 'Tambah Espresso' }).click();
  await page.getByRole('button', { name: /Keranjang, 1 item/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const drawerOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(drawerOverflow).toBe(false);
});
