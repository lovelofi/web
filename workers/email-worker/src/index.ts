import { EmailMessage } from 'cloudflare:email';

interface Env {
	SEND_EMAIL: { send(message: EmailMessage): Promise<void> };
}

const SENDER = 'feedback@lovelofi.app';
const RECIPIENT = 'lovelofiapp@gmail.com';

function buildRawEmail(subject: string, body: string, replyEmail: string): string {
	const headers = [
		`From: LoveLofi Feedback <${SENDER}>`,
		`To: ${RECIPIENT}`,
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

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			const { subject, body, replyEmail } = (await request.json()) as {
				subject: string;
				body: string;
				replyEmail: string;
			};

			if (!subject || !body) {
				return Response.json({ ok: false, error: 'Missing subject or body' }, { status: 400 });
			}

			const raw = buildRawEmail(subject, body, replyEmail || '');
			const message = new EmailMessage(SENDER, RECIPIENT, raw);
			await env.SEND_EMAIL.send(message);

			return Response.json({ ok: true });
		} catch (err) {
			console.error('Email worker error:', err);
			return Response.json({ ok: false, error: 'Failed to send email' }, { status: 500 });
		}
	}
};
