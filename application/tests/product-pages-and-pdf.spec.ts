import { test, expect } from '@playwright/test';

test.describe('Product Page and PDF should work', () => {
    test('Product Page', async ({ page, baseURL }) => {
        await page.goto(baseURL ?? '');
        await page.getByTestId('product-link').first().click();
        await page.getByTestId('add-to-cart-button').waitFor({ state: 'visible' });
        const productPageUrl = page.url();
        let pagesToCheck = [productPageUrl + '.pdf', productPageUrl + '.pdf?preview=true'];
        const parts = productPageUrl.split('/');
        parts.pop();
        pagesToCheck.push(parts.join('/') + '.pdf');
        pagesToCheck.push(parts.join('/') + '.pdf?preview=true');

        for (const pageToCheck of pagesToCheck) {
            const response = await fetch(pageToCheck);
            expect(response.status).toBe(200);
        }
    });
});
