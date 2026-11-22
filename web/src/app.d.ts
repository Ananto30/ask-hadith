/// <reference path="../worker-configuration.d.ts" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

declare module '*.woff' {
	const content: Uint8Array<ArrayBuffer>;
	export default content;
}
