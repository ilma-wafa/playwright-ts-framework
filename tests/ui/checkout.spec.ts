import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { USERS } from '../../src/data/users';

const BACKPACK = 'Sauce Labs Backpack';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('a full purchase completes end to end', async ({ page }) => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Ilma', 'Wafa', '10100');
    await checkoutPage.finish();

    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(page).toHaveURL(/checkout-complete.html/);
  });

  test('the order total includes tax on top of the subtotal', async () => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Ilma', 'Wafa', '10100');

    const subtotal = await checkoutPage.getSubtotal();
    const totalText = await checkoutPage.summaryTotal.textContent();
    const total = parseFloat(totalText!.replace(/[^0-9.]/g, ''));

    expect(total).toBeGreaterThan(subtotal);
  });

  test('checkout is blocked when the first name is missing', async () => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('', 'Wafa', '10100');

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('checkout is blocked when the postal code is missing', async () => {
    await inventoryPage.addItemToCart(BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Ilma', 'Wafa', '');

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });
});