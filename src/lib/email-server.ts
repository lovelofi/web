import { json } from '@sveltejs/kit';

export function jsonError(message: string, status: number) {
	return json({ ok: false, error: message }, { status });
}

export function asTrimmedString(value: unknown, maxLength: number): string {
	return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function asStringArray(value: unknown, maxItems: number, maxLength: number): string[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim().slice(0, maxLength))
		.filter(Boolean)
		.slice(0, maxItems);
}

export function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendFeedbackEmail(
	binding: { fetch(input: RequestInfo, init?: RequestInit): Promise<Response> },
	subject: string,
	body: string,
	replyEmail: string
) {
	const response = await binding.fetch('https://email-worker/send', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ subject, body, replyEmail })
	});

	if (!response.ok) {
		const err = await response.text();
		throw new Error(`Email worker returned ${response.status}: ${err}`);
	}
}
