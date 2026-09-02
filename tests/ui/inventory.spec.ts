import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { USERS } from '../../src/data/users';

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('six products are displayed', async () => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('products sort by price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('products sort by price high to low', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('products sort by name A to Z', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getNames();
    expect(names).toEqual([...names].sort());
  });
});