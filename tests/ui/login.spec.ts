import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { USERS } from '../../src/data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid credentials land on the inventory page', async ({ page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('locked out user is blocked with an error', async () => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('wrong password is rejected', async () => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('empty credentials show a required field error', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});