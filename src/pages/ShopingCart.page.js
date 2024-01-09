const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class ShopingCartPage extends BaseSwagLabPage {
    url = '/cart.html';

    cartItemSelector = '.cart_item';

    removeItemSelector = '[id^="remove"]';

    get headerTitle() { return this.page.locator('.title'); }

    get cartItems() { return this.page.locator(this.cartItemSelector); }

    // async below added to show the function returns a promise
    async getCartItemByName(name) { return this.page.locator(this.cartItemSelector, { hasText: name }); }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    }

    //getting price of the product
    async productPrice(name) {

        const item = await this.getCartItemByName(name);
        const price = await item.locator('.inventory_item_price').textContent();
        return price;

    }

    //getting description of the product
    async productDescription(name) {

        const item = await this.getCartItemByName(name);
        const desc = await item.locator('.inventory_item_desc').textContent();
        return desc;

    }

    // get button to go to the Checkout One page
    get checkoutOnePage () { return this.page.locator('.checkout_button')  };

}
