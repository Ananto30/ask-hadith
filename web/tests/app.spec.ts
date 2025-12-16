import { expect, test } from '@playwright/test';

test('app loads and displays the search box', async ({ page }) => {
	await page.goto('http://localhost:5173'); // Adjust the URL if necessary

	// Check if the search box is visible
	const searchBox = page.locator('input[placeholder="Search: Qadr, Bukhari 1029, Muslim 1763..."]');
	await expect(searchBox).toBeVisible();

	// Check if the search button is visible
	const searchButton = page.locator('button[aria-label="Search Hadiths"]');
	await expect(searchButton).toBeVisible();

	// Check if the navigation bar is visible
	const navBar = page.locator('nav');
	await expect(navBar).toBeVisible();
});
