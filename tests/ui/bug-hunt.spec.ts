import { test, expect } from '../../src/fixtures/pages';

const BACKPACK = 'Sauce Labs Backpack';

test.describe('Defect detection — problem_user', () => {
  test('BUG-01: each product should have a distinct image', async ({ problemUser }) => {
    const sources = await problemUser.itemImages.evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).src)
    );
    const unique = new Set(sources);
    expect(unique.size).toBe(sources.length);
  });

  test('BUG-02: the last name field should accept input at checkout', async ({
    problemUser,
    cartPage,
    checkoutPage,
  }) => {
    await problemUser.addItemToCart(BACKPACK);
    await problemUser.goToCart();
    await cartPage.checkout();
    await checkoutPage.lastNameInput.fill('Wafa');
    await expect(checkoutPage.lastNameInput).toHaveValue('Wafa');
  });

  test('BUG-03: checkout should complete with valid information', async ({
    page,
    problemUser,
    cartPage,
    checkoutPage,
  }) => {
    await problemUser.addItemToCart(BACKPACK);
    await problemUser.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('Ilma', 'Wafa', '10100');
    await expect(page).toHaveURL(/checkout-step-two.html/);
  });
});