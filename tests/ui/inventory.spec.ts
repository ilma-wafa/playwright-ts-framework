import { test, expect } from '../../src/fixtures/pages';

test.describe('Inventory', () => {
  test('six products are displayed', async ({ loggedIn }) => {
    await expect(loggedIn.items).toHaveCount(6);
  });

  test('products sort by price low to high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('products sort by price high to low', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('products sort by name A to Z', async ({ loggedIn }) => {
    await loggedIn.sortBy('az');
    const names = await loggedIn.getNames();
    expect(names).toEqual([...names].sort());
  });
});