/** Store links — update these when published */
export const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/lovelofi';
export const FIREFOX_STORE_URL = 'https://addons.mozilla.org/en-US/firefox/addon/lovelofi';
export const DISCORD_URL = 'https://discord.gg/pVxNeycE';

/** Pricing */
export const PLANS = [
	{
		id: 'free',
		name: 'Free',
		price: '$0',
		period: 'forever',
		description: 'Get started with lo-fi basics',
		features: [
			'6 curated radio stations',
			'Low-Pass Filter & Reverb effects',
			'4 built-in presets',
			'5 favorite stations',
			'2 themes (Cafe light & dark)',
		],
		cta: 'Install Free',
		highlighted: false,
	},
	{
		id: 'monthly',
		name: 'Premium',
		price: '$2.99',
		period: '/month',
		description: 'Flexible monthly access',
		features: [
			'20+ curated radio stations across 7 genres',
			'Full preset library + advanced effect rack',
			'Tab audio mode for any browser tab',
			'Upload audio and export processed tracks',
			'Unlimited favorite stations',
			'All 16 themes',
			'Up to 10 custom station URLs',
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
		features: ['Everything in Premium', 'Save $16.88/year'],
		cta: 'Go Annual',
		highlighted: true,
	},
	{
		id: 'lifetime',
		name: 'Lifetime',
		price: '$39',
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
		a: 'The free tier includes Low-Pass Filter and Reverb effects, 4 built-in presets (Sunday Morning, Late Night Study, Rainy Cafe, Dreamy), and 6 curated radio stations.',
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
		title: 'Lo-Fi Radio',
		description: 'Curated stations across lo-fi hip-hop, chillhop, jazz, ambient, synthwave, and more.',
		icon: 'Radio',
	},
	{
		title: '12 Audio Effects',
		description: 'Low-pass, reverb, tape saturation, vinyl crackle, bitcrusher, chorus, and more.',
		icon: 'Sliders',
	},
	{
		title: '20+ Presets',
		description: 'From "Sunday Morning" to "Broken Walkman" — instant atmosphere with one click.',
		icon: 'Disc3',
	},
	{
		title: 'Tab Audio Mode',
		description: 'Apply lo-fi effects to any browser tab. Spotify, YouTube, anything.',
		icon: 'Headphones',
	},
	{
		title: '16 Themes',
		description: 'Cafe Nocturne, Midnight Session, Sakura Study, Neon Tokyo, and more.',
		icon: 'Palette',
	},
	{
		title: 'Keyboard Shortcuts',
		description: 'Play, pause, skip, adjust volume — all without leaving your keyboard.',
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
		name: 'Sunday Morning',
		description: 'Barely-there warmth — just enough to soften the edges',
		effects: {
			lowPass: { enabled: true, intensity: 18 },
			highPass: OFF,
			tapeSaturation: { enabled: true, intensity: 8 },
			reverb: { enabled: true, intensity: 20 },
			bitcrusher: OFF,
			chorus: { enabled: true, intensity: 10 },
			vinylCrackle: { enabled: true, intensity: 10 },
			pitchWobble: OFF,
			stereoDrift: OFF,
			dropout: OFF,
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'late-night-study',
		name: 'Late Night Study',
		description: 'The classic lo-fi study beat sound — warm, cozy, focused',
		effects: {
			lowPass: { enabled: true, intensity: 38 },
			highPass: OFF,
			tapeSaturation: { enabled: true, intensity: 12 },
			reverb: { enabled: true, intensity: 40 },
			bitcrusher: OFF,
			chorus: { enabled: true, intensity: 15 },
			vinylCrackle: { enabled: true, intensity: 22 },
			pitchWobble: { enabled: true, intensity: 6 },
			stereoDrift: OFF,
			dropout: OFF,
			slowdown: OFF,
			vocalCut: OFF,
		},
	},
	{
		id: 'rainy-cafe',
		name: 'Rainy Cafe',
		description: 'Vinyl crackle through a warm speaker — like overhearing a record next door',
		effects: {
			lowPass: { enabled: true, intensity: 42 },
			highPass: OFF,
			tapeSaturation: { enabled: true, intensity: 15 },
			reverb: { enabled: true, intensity: 18 },
			bitcrusher: OFF,
			chorus: OFF,
			vinylCrackle: { enabled: true, intensity: 40 },
			pitchWobble: OFF,
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
