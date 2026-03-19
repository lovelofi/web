import { json } from '@sveltejs/kit';

const VALID_EVENTS = new Set([
	'app_opened',
	'station_played',
	'preset_applied',
	'locked_feature_clicked',
	'paywall_opened',
	'plan_selected',
	'checkout_started',
	'purchase_completed'
]);

const MAX_EVENTS_PER_REQUEST = 50;
const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com';

type AnalyticsPrimitive = string | number | boolean | null;

type AnalyticsCaptureEvent = {
	event?: unknown;
	distinct_id?: unknown;
	timestamp?: unknown;
	properties?: unknown;
};

type AnalyticsPayload = {
	events?: unknown;
};

function isPrimitive(value: unknown): value is AnalyticsPrimitive {
	return (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	);
}

function isPropertiesRecord(value: unknown): value is Record<string, AnalyticsPrimitive> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	return Object.values(value).every(isPrimitive);
}

function isValidAnalyticsEvent(value: unknown): value is {
	event: string;
	distinct_id: string;
	timestamp: string;
	properties: Record<string, AnalyticsPrimitive>;
} {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const event = value as AnalyticsCaptureEvent;
	if (typeof event.event !== 'string' || !VALID_EVENTS.has(event.event)) return false;
	if (typeof event.distinct_id !== 'string' || !event.distinct_id.trim()) return false;
	if (typeof event.timestamp !== 'string' || Number.isNaN(Date.parse(event.timestamp))) return false;
	if (!isPropertiesRecord(event.properties)) return false;
	return true;
}

export async function POST({ request, platform, fetch }) {
	const payload = (await request.json().catch(() => null)) as AnalyticsPayload | null;
	const events = Array.isArray(payload?.events) ? payload.events : null;

	if (!events || events.length === 0) {
		return json({ error: 'No analytics events supplied.' }, { status: 400 });
	}

	if (events.length > MAX_EVENTS_PER_REQUEST) {
		return json({ error: 'Too many analytics events in one request.' }, { status: 413 });
	}

	const validEvents = events.filter(isValidAnalyticsEvent);
	if (validEvents.length !== events.length) {
		return json({ error: 'Invalid analytics event payload.' }, { status: 400 });
	}

	const apiKey = platform?.env?.POSTHOG_API_KEY?.trim();
	if (!apiKey) {
		return json({ error: 'Analytics backend is not configured yet.' }, { status: 503 });
	}

	const host = (platform?.env?.POSTHOG_HOST?.trim() || DEFAULT_POSTHOG_HOST).replace(/\/$/, '');
	const response = await fetch(`${host}/batch/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			api_key: apiKey,
			batch: validEvents.map((event) => ({
				event: event.event,
				timestamp: event.timestamp,
				properties: {
					distinct_id: event.distinct_id,
					$process_person_profile: false,
					...event.properties
				}
			}))
		})
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => '');
		return json(
			{ error: 'Analytics forwarding failed.', detail: errorText || undefined },
			{ status: 502 }
		);
	}

	return json({ ok: true, accepted: validEvents.length, forwarded: validEvents.length });
}
