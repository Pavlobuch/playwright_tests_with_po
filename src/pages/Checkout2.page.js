const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class CheckoutTwoPage extends BaseSwagLabPage {

    url = '/checkout-step-two.html';

    // get item by name
    async getCartItemByName(name) { return await this.page.locator('.cart_item', {hasText: name})};

    // get description of the item by name
    async productDescription (name) {

        const item = await this.getCartItemByName(name);
        const desc = await item.locator('.inventory_item_desc').textContent();
        return desc;

    }

    async productPrice (name) {

        const item = await this.getCartItemByName(name);
        const price = await item.locator('.inventory_item_price').textContent();
        return price;

    }

    get totalPrice() { return this.page.locator('.summary_total_label').textContent() };

    get taxes() { return this.page.locator('.summary_tax_label').textContent()};

}