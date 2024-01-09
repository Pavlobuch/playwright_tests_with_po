const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); } 

    // get list of all items
    get inventoryItems() { return this.page.locator('.inventory_item')};

    // get list of all prices
    get prices() { return this.page.locator('.inventory_item_price')};

    // get product name by id
    async productName(id) { return this.inventoryItems.nth(id).locator('.inventory_item_name').textContent()};

    // get product description by id
    async productDescription(id) { return this.inventoryItems.nth(id).locator('.inventory_item_desc').textContent()};

    // get product price by id 
    async productPrice(id) { return this.inventoryItems.nth(id).locator('.inventory_item_price').textContent()};

    // get all product info by id
    async productInfo (id) {

        let name = await this.productName(id);
        let desc = await this.productDescription(id);
        let price = await this.productPrice(id);
        return {name : name, desc : desc, price : price};

    }

    get addItemToCartBtns() { return this.page.locator('[id^="add-to-cart"]'); }
    
    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    }

    get sortList () { return this.page.locator('.product_sort_container'); }

    async selectSorting(sortingValue) { await this.sortList.selectOption({value: sortingValue})}

    //select random items from inventory page. This func
    randomItems (neededValue, itemsCount) {
        
        let randomArray = [];
        for (let counter = 1; randomArray.length < neededValue; counter++) {
            let number = Math.floor(Math.random() * (itemsCount - 1) );
            if (!randomArray.includes(number)) {
                randomArray.push(number);
            }
        }
        return randomArray;
     
    }



}
