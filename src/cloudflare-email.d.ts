declare module 'cloudflare:email' {
	export class EmailMessage {
		constructor(
			from: string,
			to: string,
			message: string | ReadableStream | ArrayBuffer | ArrayBufferView
		);
	}
}
