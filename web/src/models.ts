export type HadithModel = {
	body_en: string;
	book_en: string;
	book_no: string;
	book_ref_no: string;
	chapter_en: string;
	chapter_no: string;
	collection: string;
	collection_id: string;
	hadith_grade: string;
	hadith_no: string;
	highlights: string[];
	narrator_en: string;
	score: number;
	base64?: string;
};

export type CollectionCounter = {
	collection: string;
	count: number;
};

export type CollectionResponse = {
	collection: string;
	count: number;
	hadiths: HadithModel[];
};

export type SearchResponse = {
	data: CollectionResponse[];
	first_hadith_base64: string;
};

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * @deprecated Only supported on Chrome and Android Webview.
 */
export interface BeforeInstallPromptEvent extends Event {
	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: Array<string>;

	/**
	 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
	 */
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;

	/**
	 * Allows a developer to show the install prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>;
}
