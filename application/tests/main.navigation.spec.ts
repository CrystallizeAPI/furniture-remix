import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

async function getLocalStorage(page: Page) {
    return await page.evaluate(() => window.localStorage);
}

test.describe('Main Navigation Flow', () => {
    test('Starting /', async ({ page, browser }) => {
        const home = await page.goto(BASE_URL);
        expect(home!.status()).toBe(200);
        await page.click('text=See our big sale');
        await page.locator('a.category-link').first().click();
        await page.locator('a.product-link').first().click();
        await page.locator('button.variant-option').nth(1).click();
        await page.click('text=Add to cart');
        await page.click('text=Cart');

        const cart = await page.goto(`${BASE_URL}/cart`);
        expect(cart!.status()).toBe(200);
        const localStorageCart = await getLocalStorage(page);
        expect(localStorageCart).toHaveProperty('cart');

        const checkout = await page.goto(`${BASE_URL}/checkout`);
        expect(checkout!.status()).toBe(200);

        // const localStorageCheckout = await getLocalStorage(page);
        // console.log(localStorageCheckout);
        // expect(localStorageCheckout).toHaveProperty('cart');
        // const realCart = JSON.parse(localStorageCheckout.cart);
        // expect(realCart).toHaveProperty('cartId');
        // expect(realCart.cartId.length).toBeGreaterThan(0); // it has to empty at first
    });
});
