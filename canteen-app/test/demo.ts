import { test, expect, Locator } from '@playwright/test';

test('has title', async ({ page }) => {
    // await page.goto('https://playwright.dev/');
    await page.goto('https://www.cloud77.top/');

    // eslint-disable-next-line testing-library/prefer-screen-queries

    // eslint-disable-next-line testing-library/prefer-screen-queries
    const codes = page.getByRole('code');
    expect(codes).toBeTruthy();

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Cloud77/);

    const l: Locator = page.getByText('Welcome Cloud77 (v0.5.4)', { exact: true }).first();
    expect(l).toBeTruthy();
});

// test('get started link', async ({ page }) => {
//     await page.goto('https://playwright.dev/');

//     // Click the get started link.
//     await page.getByRole('link', { name: 'Get started' }).click();

//     // Expects the URL to contain intro.
//     await expect(page).toHaveURL(/.*intro/);
// });