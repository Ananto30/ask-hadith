import { COLLECTIONS, ORIGIN } from '#lib/site.ts';

// One child sitemap per collection keeps every file far below the 50k URL limit as the corpus grows.
export const GET = () => {
	const names = ['main', ...COLLECTIONS.map((c) => c.id)];
	const items = names.map((n) => `<sitemap><loc>${ORIGIN}/sitemap/${n}.xml</loc></sitemap>`);

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items.join('')}</sitemapindex>`,
		{
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, s-maxage=86400'
			}
		}
	);
};
