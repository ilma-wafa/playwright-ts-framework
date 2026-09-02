import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { USERS } from '../../src/data/users';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('adding an item updates the cart badge', async () => {
    await inventoryPage.addItemToCart(BACKPACK);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('adding two items shows a count of two', async () => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.addItemToCart(BIKE_LIGHT);
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('added item appears in the cart', async () => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.getItemNames()).toContain(BACKPACK);
  });

  test('removing an item empties the cart', async () => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.removeItem(BACKPACK);
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});