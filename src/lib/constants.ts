/** Store links — update these when published */
export const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/lovelofi';
export const FIREFOX_STORE_URL = 'https://addons.mozilla.org/en-US/firefox/addon/lovelofi';
export const DISCORD_URL = 'https://discord.gg/pVxNeycE';
export const SUPPORT_URL = '/support';

/** Desktop app */
export const GITHUB_REPO = 'lovelofi/desktop';
export const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases/latest`;
export const DESKTOP_DOWNLOAD_BASE = `https://github.com/${GITHUB_REPO}/releases/latest/download`;

/** Polar.sh checkout URLs */
export const POLAR_CHECKOUT_MONTHLY = 'https://buy.polar.sh/polar_cl_an3DN2R3ZTI0Hg4fUbxdpe9vOq1inbgjJZZod4VikOa';
export const POLAR_CHECKOUT_ANNUAL = 'https://buy.polar.sh/polar_cl_Fti7QOPCJSiZjqrUgbXev0BrBUcoVrWw4nfwM0KWR8R';
export const POLAR_CHECKOUT_LIFETIME = 'https://buy.polar.sh/polar_cl_o9732ZhPtn0LH6qAKFNEvHOmTgIextxRjlQCZ3OP7uL';

/** Pricing */
export const PLANS = [
	{
		id: 'free',
		name: 'Free',
		price: '$0',
		period: 'forever',
		description: 'Start with the core LoveLofi experience',
		features: [
			'6 curated radio stations',
			'Low-Pass + Reverb effects',
			'4 featured presets',
			'All 8 themes',
			'Station and preset favorites',
		],
		cta: 'Get Started Free',
		highlighted: false,
	},
	{
		id: 'monthly',
		name: 'Premium',
		price: '$1.99',
		period: '/month',
		description: 'Try everything',
		features: [
			'Full 30-station library',
			'25+ built-in presets + custom presets',
			'All 12 audio effects',
			'Tab audio capture',
			'Upload audio and export tracks',
		],
		cta: 'Go Premium',
		highlighted: false,
	},
	{
		id: 'annual',
		name: 'Premium Annual',
		price: '$19',
		period: '/year',
		description: 'Best value for daily listening',
		features: ['Everything in Premium', 'Best value'],
		cta: 'Go Annual',
		highlighted: true,
	},
	{
		id: 'lifetime',
		name: 'Lifetime',
		price: '$49',
		period: 'one-time',
		description: 'Support the product with a one-time unlock',
		features: ['Everything in Premium', 'All future updates included', 'Best for longtime supporters'],
		cta: 'Get Lifetime',
		highlighted: false,
	},
] as const;

/** FAQ */
export const FAQ_ITEMS = [
	{
		q: 'What is LoveLofi?',
		a: 'LoveLofi is a browser extension that combines a lo-fi radio player with real-time audio effects. Apply vinyl warmth, reverb, tape saturation, and more to curated lo-fi stations — or to any audio playing in your browser tabs.',
	},
	{
		q: 'Which browsers are supported?',
		a: 'LoveLofi works on Chrome and Firefox. It uses Manifest V3 (MV3) for Chrome and the equivalent for Firefox.',
	},
	{
		q: 'What effects are included for free?',
		a: 'The free tier includes Low-Pass and Reverb, 4 featured presets (Classic Lo-Fi, Late Night Study, Rainy Cafe, Dreamy), and 6 curated radio stations.',
	},
	{
		q: 'What does "Tab Audio" mode do?',
		a: 'Tab Audio is a premium feature that captures audio from any browser tab and routes it through the effects chain. Listen to Spotify, YouTube, or any website with lo-fi effects applied in real-time.',
	},
	{
		q: 'How does the license work?',
		a: 'Premium licenses are validated through Polar.sh. Your license syncs across all Chrome profiles via chrome.storage.sync. It re-validates weekly with a 7-day grace period if offline.',
	},
	{
		q: 'Can I add my own radio stations?',
		a: 'Yes! Premium users can add up to 10 custom radio stations using direct Icecast/Shoutcast stream URLs.',
	},
	{
		q: 'Can I update the built-in station list without a new extension release?',
		a: 'Yes. LoveLofi can refresh its built-in station catalog remotely, which lets us replace dead streams and improve the curation without waiting for a store update.',
	},
	{
		q: 'Can I cancel anytime?',
		a: 'Yes. Monthly and annual subscriptions can be cancelled anytime. The lifetime plan is a one-time purchase for supporters with no recurring charges.',
	},
] as const;

/** Features for the landing page */
export const FEATURES = [
	{
		title: 'Lo-Fi Any Tab',
		description: 'Turn Spotify, YouTube, or any browser tab into a lo-fi listening session. One click.',
		icon: 'Headphones',
	},
	{
		title: 'Built-In Radio',
		description: '30 ad-free stations across lo-fi hip-hop, chillhop, ambient, synthwave, and more. Always playing.',
		icon: 'Radio',
	},
	{
		title: '12 Audio Effects',
		description: 'Low-pass, reverb, tape saturation, vinyl crackle, bitcrusher, chorus — shape your own sound.',
		icon: 'Sliders',
	},
	{
		title: 'Instant Presets',
		description: 'From Sunday Morning to Haunted Ballroom — 25+ atmospheres, one click each.',
		icon: 'Disc3',
	},
	{
		title: '8 Themes',
		description: 'Sakura Study, Forest Cabin, Lavender Haze, and more — light and dark pairs that match your mood.',
		icon: 'Palette',
	},
	{
		title: 'Keyboard Shortcuts',
		description: 'Play, pause, skip, volume — without leaving your keyboard.',
		icon: 'Keyboard',
	},
] as const;

/** Effect setting shared by extension and demo */
export interface EffectSetting {
	enabled: boolean;
	intensity: number;
}

/** All 12 effects — identical shape to the extension's EffectSettings */
export interface PresetEffects {
	lowPass: EffectSetting;
	highPass: EffectSetting;
	tapeSaturation: EffectSetting;
	reverb: EffectSetting;
	bitcrusher: EffectSetting;
	chorus: EffectSetting;
	vinylCrackle: EffectSetting;
	pitchWobble: EffectSetting;
	stereoDrift: EffectSetting;
	dropout: EffectSetting;
	slowdown: EffectSetting;
	vocalCut: EffectSetting;
}

export interface DemoPreset {
	id: string;
	name: string;
	description: string;
	effects: PresetEffects;
}

const OFF: EffectSetting = { enabled: false, intensity: 0 };

/** Presets with the exact same effect values as the extension */
export const DEMO_PRESETS: DemoPreset[] = [
	{
		id: 'off',
		name: 'Clean',
		description: 'No effects — original audio',
		effects: {
			lowPass: OFF,
			highPass: OFF,
			tapeSaturation: OFF,
			reverb: OFF,
			bitcrusher: OFF,
			chorus: OFF,
			vinylCrackle: OFF,
			pitchWobble: OFF,
			stereoDrift: OFF,
			dropout: OFF,
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'sunday-morning',
		name: 'Classic Lo-Fi',
		description: 'The everyday signature: rounded highs, soft studio air, and just enough tape dust to feel familiar.',
		effects: {
			lowPass: { enabled: true, intensity: 34 },
			highPass: OFF,
			tapeSaturation: { enabled: true, intensity: 18 },
			reverb: { enabled: true, intensity: 18 },
			bitcrusher: OFF,
			chorus: OFF,
			vinylCrackle: { enabled: true, intensity: 12 },
			pitchWobble: { enabled: true, intensity: 4 },
			stereoDrift: OFF,
			dropout: OFF,
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'late-night-study',
		name: 'Late Night Study',
		description: 'Focused, soft, and late-hour friendly — the clearest “study mode” preset in the library.',
		effects: {
			lowPass: { enabled: true, intensity: 32 },
			highPass: OFF,
			tapeSaturation: { enabled: true, intensity: 14 },
			reverb: { enabled: true, intensity: 22 },
			bitcrusher: OFF,
			chorus: { enabled: true, intensity: 6 },
			vinylCrackle: { enabled: true, intensity: 16 },
			pitchWobble: { enabled: true, intensity: 4 },
			stereoDrift: OFF,
			dropout: OFF,
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'rainy-cafe',
		name: 'Rainy Cafe',
		description: 'Soft room tone, dusty warmth, and the feeling of music drifting through a rainy window.',
		effects: {
			lowPass: { enabled: true, intensity: 36 },
			highPass: OFF,
			tapeSaturation: { enabled: true, intensity: 14 },
			reverb: { enabled: true, intensity: 26 },
			bitcrusher: OFF,
			chorus: OFF,
			vinylCrackle: { enabled: true, intensity: 18 },
			pitchWobble: { enabled: true, intensity: 3 },
			stereoDrift: OFF,
			dropout: OFF,
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'old-cassette',
		name: 'Old Cassette',
		description: 'Worn-out tape — saturated, wobbly, dropping out',
		effects: {
			lowPass: { enabled: true, intensity: 32 },
			highPass: { enabled: true, intensity: 10 },
			tapeSaturation: { enabled: true, intensity: 38 },
			reverb: OFF,
			bitcrusher: OFF,
			chorus: OFF,
			vinylCrackle: { enabled: true, intensity: 15 },
			pitchWobble: { enabled: true, intensity: 28 },
			stereoDrift: { enabled: true, intensity: 22 },
			dropout: { enabled: true, intensity: 8 },
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'dreamy',
		name: 'Dreamy',
		description: 'Floating in reverb — soft, washed out, weightless',
		effects: {
			lowPass: { enabled: true, intensity: 28 },
			highPass: OFF,
			tapeSaturation: OFF,
			reverb: { enabled: true, intensity: 62 },
			bitcrusher: OFF,
			chorus: { enabled: true, intensity: 28 },
			vinylCrackle: OFF,
			pitchWobble: { enabled: true, intensity: 8 },
			stereoDrift: { enabled: true, intensity: 18 },
			dropout: OFF,
			slowdown: { enabled: true, intensity: 25 },
			vocalCut: OFF,
		},
	},
	{
		id: 'foggy-harbor',
		name: 'Foggy Harbor',
		description: 'Distant, muffled, drifting through dense fog',
		effects: {
			lowPass: { enabled: true, intensity: 52 },
			highPass: OFF,
			tapeSaturation: { enabled: true, intensity: 8 },
			reverb: { enabled: true, intensity: 70 },
			bitcrusher: OFF,
			chorus: { enabled: true, intensity: 22 },
			vinylCrackle: OFF,
			pitchWobble: { enabled: true, intensity: 5 },
			stereoDrift: { enabled: true, intensity: 20 },
			dropout: OFF,
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'vintage-radio',
		name: 'Vintage Radio',
		description: 'AM radio through an old speaker — narrow, crackly, warm',
		effects: {
			lowPass: { enabled: true, intensity: 58 },
			highPass: { enabled: true, intensity: 40 },
			tapeSaturation: { enabled: true, intensity: 22 },
			reverb: OFF,
			bitcrusher: { enabled: true, intensity: 18 },
			chorus: OFF,
			vinylCrackle: { enabled: true, intensity: 20 },
			pitchWobble: OFF,
			stereoDrift: OFF,
			dropout: { enabled: true, intensity: 10 },
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'hotel-lobby',
		name: 'Hotel Lobby',
		description: 'Marble floors, high ceiling — lush ambient reverb, elegant haze',
		effects: {
			lowPass: { enabled: true, intensity: 25 },
			highPass: OFF,
			tapeSaturation: OFF,
			reverb: { enabled: true, intensity: 50 },
			bitcrusher: OFF,
			chorus: { enabled: true, intensity: 12 },
			vinylCrackle: OFF,
			pitchWobble: OFF,
			stereoDrift: { enabled: true, intensity: 14 },
			dropout: OFF,
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
];
