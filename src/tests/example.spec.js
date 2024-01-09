// @ts-check
const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('', () => {
    test('Perform login', async ({ inventoryPage }) => {
        
    
        await expect(inventoryPage.headerTitle).toBeVisible();

        expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({inventoryPage, shopingCartPage }) => {
        await inventoryPage.addItemToCartById(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        await shopingCartPage.removeCartItemById(0);
        await expect(shopingCartPage.cartItems).not.toBeAttached();
        
    });
});
