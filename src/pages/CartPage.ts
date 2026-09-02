import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async removeItem(itemName: string) {
    const id = itemName.toLowerCase().replace(/\s+/g, '-');
    await this.page.locator(`[data-test="remove-${id}"]`).click();
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}