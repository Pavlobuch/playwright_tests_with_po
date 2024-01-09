const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const { InventoryPage } = require('../pages/Inventory.page');

test.describe('my Test suite', () => {

    test('Sorting by name', async ({ inventoryPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();

        // Sorting by name asc
        await inventoryPage.selectSorting('az');
        const inventoryItemsAZ = await inventoryPage.inventoryItems.allTextContents();
        const sortedAZ = inventoryItemsAZ.slice().sort((a, b) => {
            const textA = a.replace(/\$\d+\.\d+/, '').toLowerCase();
            const textB = b.replace(/\$\d+\.\d+/, '').toLowerCase();
            return textA.localeCompare(textB);
        });
        await expect(inventoryItemsAZ).toEqual(sortedAZ);

        // Sorting by name desc
        await inventoryPage.selectSorting('za');
        const inventoryItemsZA = await inventoryPage.inventoryItems.allTextContents();
        const sortedZA = inventoryItemsZA.slice().sort((a, b) => {
            const textA = a.replace(/\$\d+\.\d+/, '').toLowerCase();
            const textB = b.replace(/\$\d+\.\d+/, '').toLowerCase();
            return textB.localeCompare(textA);
        });
        await expect(inventoryItemsZA).toEqual(sortedZA);
    });

    test('Sorting by price', async ({ inventoryPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();

        // Sorting by price asc
        await inventoryPage.selectSorting('lohi');
        const pricesLohi = await inventoryPage.prices.allTextContents();
        const onlyPricesLohi = pricesLohi.map(price => Number(price.replace('$', '')));
        const sortedLohi = onlyPricesLohi.slice().sort((a, b) => a - b);
        await expect(onlyPricesLohi).toEqual(sortedLohi);

        // Sorting by price desc
        await inventoryPage.selectSorting('hilo');
        const pricesHilo = await inventoryPage.prices.allTextContents();
        const onlyPricesHilo = pricesHilo.map(price => Number(price.replace('$', '')));
        const sortedHilo = onlyPricesHilo.slice().sort((a, b) => b - a);
        await expect(onlyPricesHilo).toEqual(sortedHilo);
    });

    test('Add random products', async ({ inventoryPage, shopingCartPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();

        // Create array of random item's ids
        const itemsCount = await inventoryPage.inventoryItems.count();
        const randomItems = inventoryPage.randomItems(2, itemsCount);

        // Create array of products info and adding items to the cart
        let inventoryProductsInfo = [];
        for (let id of randomItems) {
            const data = await inventoryPage.productInfo(id);
            inventoryProductsInfo.push(data);
            await inventoryPage.inventoryItems.nth(id).locator('[id^="add-to-cart"]').click();
        }

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toEqual(2);

        // Check products info and return true in case of matching
        for (let product of inventoryProductsInfo) {
            const desc = await shopingCartPage.productDescription(product.name);
            expect(product.desc).toEqual(desc);

            const price = await shopingCartPage.productPrice(product.name);
            expect(product.price).toEqual(price);
        }
    });

    test('Verify checkout', async ({ inventoryPage, shopingCartPage, checkoutOnePage, checkoutTwoPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();

        // Create array of random item's ids
        const itemsCount = await inventoryPage.inventoryItems.count();
        const randomItems = inventoryPage.randomItems(2, itemsCount);

        // Create array of products info and adding items to the cart
        let inventoryProductsInfo = [];
        for (let id of randomItems) {
            const data = await inventoryPage.productInfo(id);
            inventoryProductsInfo.push(data);
            await inventoryPage.inventoryItems.nth(id).locator('[id^="add-to-cart"]').click();
        }

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toEqual(2);

        // Navigate to the Checkout step One page
        await shopingCartPage.checkoutOnePage.click();
        

        // Fill contact data
        checkoutOnePage.fillContactData('Pavlo', 'Automation Guru', '77100');

        // Navigate to the next page
        await checkoutOnePage.continue.click();

        // Here general price of all items should be consolidated
        let generalPrice = 0;

        // Compare description and price
        for (let item of inventoryProductsInfo) {
            const desc = await checkoutTwoPage.productDescription(item.name);
            expect(desc).toEqual(item.desc);

            const price = await checkoutTwoPage.productPrice(item.name);
            expect(price).toEqual(item.price);
            generalPrice += parseFloat(item.price.replace('$', ''))
        };

        //check total price
        let priceWithText = await checkoutTwoPage.totalPrice;
        let totalPrice = parseFloat(priceWithText.replace(/[^\d.]/g, ''))
        let taxWithText = await checkoutTwoPage.taxes;
        let tax = parseFloat(taxWithText.replace(/[^\d.]/g, ''));

        expect(generalPrice).toEqual(+totalPrice - +tax);
    });

});
