import { json } from '@sveltejs/kit';
import {
	asStringArray,
	asTrimmedString,
	isValidEmail,
	jsonError,
	sendFeedbackEmail
} from '$lib/email-server';

const VALID_PLAN_TYPES = new Set(['free', 'monthly', 'annual', 'lifetime', 'not-sure', '']);

type UninstallFeedbackPayload = {
	source?: unknown;
	browser?: unknown;
	installReasons?: unknown;
	uninstallReason?: unknown;
	planType?: unknown;
	replyEmail?: unknown;
	feedback?: unknown;
	honeypot?: unknown;
};

function formatBody(payload: {
	source: string;
	browser: string;
	installReasons: string[];
	uninstallReason: string;
	planType: string;
	replyEmail: string;
	feedback: string;
}): string {
	const lines = [
		'LoveLofi uninstall feedback',
		'',
		`Source: ${payload.source || 'unknown'}`,
		`Browser: ${payload.browser || 'unknown'}`,
		`Installed for: ${payload.installReasons.length ? payload.installReasons.join(', ') : 'Not specified'}`,
		`Reason for uninstalling: ${payload.uninstallReason || 'Not specified'}`,
		`Plan type: ${payload.planType || 'Not specified'}`,
		`Reply email: ${payload.replyEmail || 'Not provided'}`,
		'',
		'Feedback:',
		payload.feedback || 'No additional feedback provided.'
	];

	return lines.join('\n');
}

export async function POST({ request, platform, getClientAddress }) {
	const binding = platform?.env?.UNINSTALL_EMAIL;

	if (!binding) {
		return jsonError('Email backend is not configured yet.', 503);
	}

	const payload = (await request.json()) as UninstallFeedbackPayload;
	const honeypot = asTrimmedString(payload.honeypot, 50);

	if (honeypot) {
		return json({ ok: true });
	}

	const source = asTrimmedString(payload.source, 120);
	const browser = asTrimmedString(payload.browser, 120);
	const installReasons = asStringArray(payload.installReasons, 8, 80);
	const uninstallReason = asTrimmedString(payload.uninstallReason, 160);
	const planType = asTrimmedString(payload.planType, 20);
	const replyEmail = asTrimmedString(payload.replyEmail, 160);
	const feedback = asTrimmedString(payload.feedback, 4000);

	if (!VALID_PLAN_TYPES.has(planType)) {
		return jsonError('Invalid plan selection.', 400);
	}

	if (!uninstallReason && !feedback && installReasons.length === 0) {
		return jsonError('Please share at least one reason or a little feedback.', 400);
	}

	if (replyEmail && !isValidEmail(replyEmail)) {
		return jsonError('Please provide a valid follow-up email.', 400);
	}

	const subjectParts = ['LoveLofi uninstall feedback'];
	if (browser) {
		subjectParts.push(`(${browser})`);
	}
	if (source) {
		subjectParts.push(`- ${source}`);
	}

	const feedbackWithIp = `${feedback}${feedback ? '\n\n' : ''}Client IP: ${getClientAddress()}`;
	const body = formatBody({
		source,
		browser,
		installReasons,
		uninstallReason,
		planType,
		replyEmail,
		feedback: feedbackWithIp
	});

	await sendFeedbackEmail(binding, subjectParts.join(' '), body, replyEmail);

	return json({ ok: true });
}
