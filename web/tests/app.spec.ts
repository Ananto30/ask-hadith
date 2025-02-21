import { test, expect } from '@playwright/test';

test('app loads and displays the search box', async ({ page }) => {
    await page.goto('http://localhost:5173'); // Adjust the URL if necessary

    // Check if the search box is visible
    const searchBox = page.locator('input[placeholder="Qadr, bukhari 1029, muslim 1763 etc..."]');
    await expect(searchBox).toBeVisible();

    // Check if the search button is visible
    const searchButton = page.locator('button[aria-label="Search Hadiths"]');
    await expect(searchButton).toBeVisible();

    // Check if the navigation bar is visible
    const navBar = page.locator('nav');
    await expect(navBar).toBeVisible();
});

test('search for qadr and match specific hadith', async ({ page }) => {
    await page.goto('http://localhost:5173'); // Adjust the URL if necessary

    // Enter 'qadr' in the search box
    const searchBox = page.locator('input[placeholder="Qadr, bukhari 1029, muslim 1763 etc..."]');
    await searchBox.fill('qadr');

    // Click the search button
    const searchButton = page.locator('button[aria-label="Search Hadiths"]');
    await searchButton.click();

    // Wait for the results to load and check for the specific hadith
    const hadithText = page.locator('text=Look for (the Night of Qadr)');
    await expect(hadithText).toBeVisible();
});