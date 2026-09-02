import { test, expect } from '../../src/fixtures/pages';

const BACKPACK = 'Sauce Labs Backpack';

test.describe('Checkout', () => {
  test('a full purchase completes end to end', async ({ page, loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addItemToCart(BACKPACK);
    await loggedIn.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Ilma', 'Wafa', '10100');
    await checkoutPage.finish();

    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(page).toHaveURL(/checkout-complete.html/);
  });

  test('the order total includes tax on top of the subtotal', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addItemToCart(BACKPACK);
    await loggedIn.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Ilma', 'Wafa', '10100');

    const subtotal = await checkoutPage.getSubtotal();
    const totalText = await checkoutPage.summaryTotal.textContent();
    const total = parseFloat(totalText!.replace(/[^0-9.]/g, ''));

    expect(total).toBeGreaterThan(subtotal);
  });

  test('checkout is blocked when the first name is missing', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addItemToCart(BACKPACK);
    await loggedIn.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('', 'Wafa', '10100');

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('checkout is blocked when the postal code is missing', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addItemToCart(BACKPACK);
    await loggedIn.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Ilma', 'Wafa', '');

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });
});