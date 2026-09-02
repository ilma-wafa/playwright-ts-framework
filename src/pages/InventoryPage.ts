import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly itemImages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.itemImages = page.locator('.inventory_item_img img');
  }

  async sortBy(value: string) {
    await this.sortDropdown.selectOption(value);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async getNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async addItemToCart(itemName: string) {
    const id = itemName.toLowerCase().replace(/\s+/g, '-');
    await this.page.locator(`[data-test="add-to-cart-${id}"]`).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}