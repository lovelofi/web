import { json } from '@sveltejs/kit';
import {
	asTrimmedString,
	isValidEmail,
	jsonError,
	sendFeedbackEmail
} from '$lib/email-server';

const SUPPORT_REASONS = new Set([
	'Billing and licenses',
	'Bug report',
	'Feature request',
	'Extension setup help',
	'Account or purchase issue',
	'General question',
	''
]);

type SupportPayload = {
	source?: unknown;
	browser?: unknown;
	supportReason?: unknown;
	subject?: unknown;
	email?: unknown;
	message?: unknown;
	pageUrl?: unknown;
	honeypot?: unknown;
};

function formatBody(payload: {
	source: string;
	browser: string;
	supportReason: string;
	subject: string;
	email: string;
	pageUrl: string;
	message: string;
}): string {
	return [
		'LoveLofi support request',
		'',
		`Source: ${payload.source || 'unknown'}`,
		`Browser: ${payload.browser || 'unknown'}`,
		`Support reason: ${payload.supportReason || 'Not specified'}`,
		`Subject: ${payload.subject || 'Not specified'}`,
		`Reply email: ${payload.email || 'Not provided'}`,
		`Page URL: ${payload.pageUrl || 'Not provided'}`,
		'',
		'Message:',
		payload.message
	].join('\n');
}

export async function POST({ request, platform, getClientAddress }) {
	const binding = platform?.env?.UNINSTALL_EMAIL;

	if (!binding) {
		return jsonError('Email backend is not configured yet.', 503);
	}

	const payload = (await request.json()) as SupportPayload;
	const honeypot = asTrimmedString(payload.honeypot, 50);

	if (honeypot) {
		return json({ ok: true });
	}

	const source = asTrimmedString(payload.source, 120);
	const browser = asTrimmedString(payload.browser, 120);
	const supportReason = asTrimmedString(payload.supportReason, 120);
	const subject = asTrimmedString(payload.subject, 160);
	const email = asTrimmedString(payload.email, 160);
	const pageUrl = asTrimmedString(payload.pageUrl, 400);
	const message = asTrimmedString(payload.message, 4000);

	if (!SUPPORT_REASONS.has(supportReason)) {
		return jsonError('Invalid support reason.', 400);
	}

	if (!email || !isValidEmail(email)) {
		return jsonError('Please provide a valid email address.', 400);
	}

	if (!message) {
		return jsonError('Please include a short message so we know how to help.', 400);
	}

	const finalSubject = subject || supportReason || 'General support request';
	const body = formatBody({
		source,
		browser,
		supportReason,
		subject: finalSubject,
		email,
		pageUrl,
		message: `${message}\n\nClient IP: ${getClientAddress()}`
	});

	await sendFeedbackEmail(binding, `LoveLofi support: ${finalSubject}`, body, email);

	return json({ ok: true });
}
