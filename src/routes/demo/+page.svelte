<script lang="ts">
	import { onMount } from 'svelte';
	import { Disc3, ArrowRight } from 'lucide-svelte';
	import AudioDemo from '$lib/components/AudioDemo.svelte';
	import {
		type EffectSetting as DemoEffectSetting,
		type PresetEffects,
		CHROME_STORE_URL,
	} from '$lib/constants';

	type RawEffectSetting = {
		enabled?: boolean;
		intensity?: number;
	};

	type PackPreset = {
		id: string;
		name: string;
		description: string;
		settings: Record<string, RawEffectSetting>;
	};

	type PresetPack = {
		id: string;
		name: string;
		description: string;
		tier: 'free' | 'premium';
		presets: PackPreset[];
	};

	type DemoPlayerPreset = {
		id: string;
		name: string;
		description: string;
		collectionName?: string;
		effects: PresetEffects;
	};

	type DemoPackSection = {
		id: string;
		label: string;
		description: string;
		packs: Array<{
			id: string;
			name: string;
			tier: 'free' | 'premium';
			presets: DemoPlayerPreset[];
		}>;
	};

	let packs = $state<PresetPack[]>([]);

	const atmospherePackIds = new Set(['rainy-night', 'sunday-morning', 'city-lights', 'strange-rooms', 'after-hours']);
	const experimentalPackIds = new Set(['radio-ghosts', 'underwater-dreams', 'digital-decay', 'tape-dreams']);

	function effectFrom(
		settings: Record<string, RawEffectSetting>,
		key: keyof PresetEffects,
	): DemoEffectSetting {
		return {
			enabled: Boolean(settings[key]?.enabled),
			intensity: settings[key]?.intensity ?? 0,
		};
	}

	function toDemoPreset(pack: PresetPack, preset: PackPreset): DemoPlayerPreset {
		return {
			id: `pack:${pack.id}:${preset.id}`,
			name: preset.name,
			description: `${preset.description} From the ${pack.name}.`,
			collectionName: pack.name,
			effects: {
				lowPass: effectFrom(preset.settings, 'lowPass'),
				highPass: effectFrom(preset.settings, 'highPass'),
				tapeSaturation: effectFrom(preset.settings, 'tapeSaturation'),
				reverb: effectFrom(preset.settings, 'reverb'),
				bitcrusher: effectFrom(preset.settings, 'bitcrusher'),
				chorus: effectFrom(preset.settings, 'chorus'),
				vinylCrackle: effectFrom(preset.settings, 'vinylCrackle'),
				pitchWobble: effectFrom(preset.settings, 'pitchWobble'),
				stereoDrift: effectFrom(preset.settings, 'stereoDrift'),
				dropout: effectFrom(preset.settings, 'dropout'),
				slowdown: effectFrom(preset.settings, 'slowdown'),
				vocalCut: effectFrom(preset.settings, 'vocalCut'),
			},
		};
	}

	onMount(async () => {
		try {
			const response = await fetch('/config/preset-packs.json');
			if (!response.ok) return;
			const data = await response.json();
			packs = Array.isArray(data?.packs) ? data.packs : [];
		} catch {}
	});

	let atmospherePacks = $derived(packs.filter((pack) => atmospherePackIds.has(pack.id)));
	let experimentalPacks = $derived(packs.filter((pack) => experimentalPackIds.has(pack.id)));
	let demoPackSections = $derived<DemoPackSection[]>([
		{
			id: 'atmosphere',
			label: 'Atmosphere',
			description: 'Rain, room tone, city glow, and scene-forward presets that lean cozy and immersive.',
			packs: atmospherePacks.map((pack) => ({
				id: pack.id,
				name: pack.name,
				tier: pack.tier,
				presets: pack.presets.map((preset) => toDemoPreset(pack, preset)),
			})),
		},
		{
			id: 'experimental',
			label: 'Experimental',
			description: 'Stranger textures, heavier degradation, and more stylized color shifts.',
			packs: experimentalPacks.map((pack) => ({
				id: pack.id,
				name: pack.name,
				tier: pack.tier,
				presets: pack.presets.map((preset) => toDemoPreset(pack, preset)),
			})),
		},
	].filter((section) => section.packs.length > 0));
</script>

<svelte:head>
	<title>Preset Demo Library — LoveLofi</title>
	<meta
		name="description"
		content="Browse the full LoveLofi preset demo library, including atmosphere packs and experimental packs, all from one page."
	/>
</svelte:head>

<section class="border-b border-border-soft bg-surface-1 py-18 sm:py-22">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="max-w-3xl">
			<p class="inline-flex items-center gap-2 rounded-pill border border-border bg-surface-0 px-4 py-1.5 text-sm text-ink-secondary">
				<Disc3 class="h-4 w-4 text-accent" />
				Full Demo Library
			</p>
			<h1 class="mt-5 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
				Browse every demo preset, pack, and atmosphere in one place
			</h1>
			<p class="mt-4 max-w-2xl text-lg text-ink-secondary">
				This page expands the homepage demo with the full starting library: built-in presets,
				atmosphere collections, and the more experimental corners of LoveLofi.
			</p>
			<div class="mt-7 flex flex-wrap gap-3">
				<a
					href={CHROME_STORE_URL}
					class="btn-lift rounded-button bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
				>
					Install Extension
				</a>
				<a
					href="/#demo"
					class="btn-lift rounded-button border border-border px-5 py-3 text-sm font-semibold text-ink hover:bg-surface-0"
				>
					Back To Homepage Demo
				</a>
			</div>
		</div>
	</div>
</section>

<section class="border-b border-border-soft bg-surface-1">
	<AudioDemo packSections={demoPackSections} />
</section>

<section class="py-18">
	<div class="mx-auto max-w-6xl px-4 text-center sm:px-6">
		<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">Take the full library into your own listening setup</h2>
		<p class="mx-auto mt-4 max-w-2xl text-ink-tertiary">
			The web demo gives you a taste. The extension adds the full preset workflow, radio, tab audio,
			ambient layers, and premium pack imports.
		</p>
		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<a
				href={CHROME_STORE_URL}
				class="btn-lift inline-flex items-center rounded-button bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
			>
				Install Extension
			</a>
			<a
				href="/download"
				class="btn-lift inline-flex items-center rounded-button border border-border gap-2 px-5 py-3 text-sm font-semibold text-ink hover:bg-surface-1"
			>
				Download App
				<ArrowRight class="h-4 w-4" />
			</a>
			<a
				href="/"
				class="btn-lift rounded-button border border-border px-5 py-3 text-sm font-semibold text-ink hover:bg-surface-1"
			>
				Back To Home
			</a>
		</div>
	</div>
</section>
