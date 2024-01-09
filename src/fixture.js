import { test as base } from '@playwright/test';
import { LoginPage } from './pages/Login.page';
import { InventoryPage } from './pages/Inventory.page';
import { ShopingCartPage } from './pages/ShopingCart.page';
import {CheckoutOnePage} from './pages/Checkout1.page';
import {CheckoutTwoPage} from './pages/Checkout2.page';

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    shopingCartPage: async ({ page }, use) => {
        await use(new ShopingCartPage(page));
    },
    checkoutOnePage: async ({page}, use) => {
        await use(new CheckoutOnePage(page))
    },
    checkoutTwoPage: async ({page}, use) => {
        await use(new CheckoutTwoPage(page))
    },

    performLogin: [async ({ loginPage }, use) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        await use();
    },{auto:true}]
});
