import { test, expect, Page, Response } from '@playwright/test';

async function getLocalStorage(page: Page) {
    return await page.evaluate(() => window.localStorage);
}

test.describe('Main Navigation Flow', () => {
    test('Starting /', async ({ page, browser, baseURL }) => {
        const BASE_URL = `${baseURL}`;
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
        const localStorageCheckout = await getLocalStorage(page);
        expect(localStorageCheckout).toHaveProperty('cart');

        await page.waitForResponse(async (response: Response) => {
            if (response.url().includes('/api/cart')) {
                return response.status() === 200;
            }
            return false;
        });

        const localStorageCartAtCheckout = await getLocalStorage(page);
        const localCartAtCheckout = JSON.parse(localStorageCartAtCheckout.cart);
        expect(localCartAtCheckout.state).toBe('cart');
        const cartId = localCartAtCheckout.cartId;
        expect(cartId.length).toBeGreaterThan(0);
        // Click on Checkout button
        await page.click('text=Guest Checkout');
        await page.type('input[name=firstname]', 'Play');
        await page.type('input[name=lastname]', 'Wright');
        await page.type('input[name=email]', 'automatedtest@crystallize.com');
        await page.type('input[name=streetAddress]', 'Somewhere in the cloud');
        await page.type('input[name=country]', 'Norway');
        await page.type('input[name=city]', 'San Francisco');
        await page.type('input[name=zipCode]', '80000');
        await page.type(
            'input[name=additionalInfo]',
            'Please knock on the door 1 time and then 2 times and then ring the bell 3 times',
        );
        await page.click('text=Next');
        await page.click('text=Pay with Crystal Coin');

        // test don't have access to API but we can test that the cart is placed
        await page.waitForResponse(async (response: Response) => {
            if (response.url().includes('/api/cart/place')) {
                return response.status() === 200;
            }
            return false;
        });

        const response = await page.request.fetch(`${BASE_URL}/api/cart/${cartId}`);
        const placedCartWrapper = await response.json();
        expect(placedCartWrapper.state).toBe('placed');

        expect(placedCartWrapper.cart.cart.items.length).toBeGreaterThan(0);
        expect(placedCartWrapper.customer.firstname).toBe('Play');
        expect(placedCartWrapper.customer.lastname).toBe('Wright');
        expect(placedCartWrapper.customer.customerIdentifier).toBe('automatedtest@crystallize.com');
    });
});
