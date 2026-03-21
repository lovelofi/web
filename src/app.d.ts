// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				EMAIL_WORKER?: Fetcher;
				POSTHOG_API_KEY?: string;
				POSTHOG_HOST?: string;
				GITHUB_TOKEN?: string;
			};
		}
	}
}

export {};
