const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class CheckoutOnePage extends BaseSwagLabPage {

    url = '/checkout-step-one.html';

    async fillContactData (firstName, lastName, zipCode) {

        await this.page.getByPlaceholder('First Name').fill(firstName);

        await this.page.getByPlaceholder('Last Name').fill(lastName);

        await this.page.getByPlaceholder('Zip/Postal Code').fill(zipCode);

    }

    get continue()  {

       return this.page.locator('.submit-button');

    }




}