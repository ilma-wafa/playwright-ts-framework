import { test, expect } from '../../src/fixtures/pages';
import { USERS } from '../../src/data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials land on the inventory page', async ({ page, loginPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('locked out user is blocked with an error', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('empty credentials show a required field error', async ({ loginPage }) => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});