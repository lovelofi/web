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
				UNINSTALL_EMAIL?: {
					send(message: unknown): Promise<void>;
				};
				POSTHOG_API_KEY?: string;
				POSTHOG_HOST?: string;
				GITHUB_TOKEN?: string;
			};
		}
	}
}

export {};
