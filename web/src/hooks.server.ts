import type { Handle } from '@sveltejs/kit/hooks';

export const handle: Handle = ({ event, resolve }) => {
	if (event.url.hostname === 'askhadith.com') {
		return new Response(null, {
			status: 301,
			headers: { Location: `https://www.askhadith.com${event.url.pathname}${event.url.search}` }
		});
	}

	event.setHeaders({
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'X-Frame-Options': 'SAMEORIGIN',
		'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
	});
	return resolve(event);
};
