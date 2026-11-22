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
	if (event.url.pathname.startsWith('/api/')) {
		event.setHeaders({
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
			'Access-Control-Allow-Headers':
				'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
		});
	}
	return resolve(event);
};
