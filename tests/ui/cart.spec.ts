import { test, expect } from '../../src/fixtures/pages';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart', () => {
  test('adding an item updates the cart badge', async ({ loggedIn }) => {
    await loggedIn.addItemToCart(BACKPACK);
    await expect(loggedIn.cartBadge).toHaveText('1');
  });

  test('adding two items shows a count of two', async ({ loggedIn }) => {
    await loggedIn.addItemToCart(BACKPACK);
    await loggedIn.addItemToCart(BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toHaveText('2');
  });

  test('added item appears in the cart', async ({ loggedIn, cartPage }) => {
    await loggedIn.addItemToCart(BACKPACK);
    await loggedIn.goToCart();
    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.getItemNames()).toContain(BACKPACK);
  });

  test('removing an item empties the cart', async ({ loggedIn, cartPage }) => {
    await loggedIn.addItemToCart(BACKPACK);
    await loggedIn.goToCart();
    await cartPage.removeItem(BACKPACK);
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(loggedIn.cartBadge).toBeHidden();
  });
});