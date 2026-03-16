import { json } from '@sveltejs/kit';

export const FEEDBACK_RECIPIENT = 'lovelofiapp@gmail.com';
export const FEEDBACK_SENDER = 'feedback@lovelofi.app';

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

export function buildPlainTextEmail(subject: string, body: string, replyEmail: string): string {
	const headers = [
		`From: LoveLofi Feedback <${FEEDBACK_SENDER}>`,
		`To: ${FEEDBACK_RECIPIENT}`,
		`Subject: ${subject.replace(/[\r\n]+/g, ' ').trim()}`,
		`Date: ${new Date().toUTCString()}`,
		'MIME-Version: 1.0',
		'Content-Type: text/plain; charset=UTF-8',
		'Content-Transfer-Encoding: 8bit'
	];

	if (replyEmail) {
		headers.push(`Reply-To: ${replyEmail}`);
	}

	return `${headers.join('\r\n')}\r\n\r\n${body.replace(/\n/g, '\r\n')}`;
}

export async function sendFeedbackEmail(
	binding: { send(message: unknown): Promise<void> },
	subject: string,
	body: string,
	replyEmail: string
) {
	const { EmailMessage } = await import('cloudflare:email');
	const message = new EmailMessage(
		FEEDBACK_SENDER,
		FEEDBACK_RECIPIENT,
		buildPlainTextEmail(subject, body, replyEmail)
	);

	await binding.send(message);
}
