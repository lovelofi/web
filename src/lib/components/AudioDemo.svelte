<script lang="ts">
	import { Play, Pause, Volume2, Loader } from 'lucide-svelte';
	import { getDemoState } from '$lib/audio-demo.svelte';
	import { DEMO_PRESETS, type PresetEffects } from '$lib/constants';
	import { onMount } from 'svelte';

	const demo = getDemoState();
	let audioEl: HTMLAudioElement | undefined = $state();
	let initialized = $state(false);
	let loading = $state(false);

	/** Lo-fi hip-hop station (Radio Record Lo-Fi — ad-free Icecast stream) */
	const DEMO_STREAM_URL = 'https://radiorecord.hostingradio.ru/lofi96.aacp';

	const EFFECT_LABELS: { key: keyof PresetEffects; label: string }[] = [
		{ key: 'lowPass', label: 'Low-Pass' },
		{ key: 'highPass', label: 'High-Pass' },
		{ key: 'tapeSaturation', label: 'Tape Saturation' },
		{ key: 'reverb', label: 'Reverb' },
		{ key: 'bitcrusher', label: 'Bitcrusher' },
		{ key: 'chorus', label: 'Chorus' },
		{ key: 'vinylCrackle', label: 'Vinyl Crackle' },
		{ key: 'pitchWobble', label: 'Pitch Wobble' },
		{ key: 'stereoDrift', label: 'Stereo Drift' },
		{ key: 'dropout', label: 'Dropout' },
		{ key: 'slowdown', label: 'Slowdown' },
		{ key: 'vocalCut', label: 'Vocal Cut' },
	];

	onMount(() => {
		return () => demo.destroy();
	});

	async function handlePlay() {
		if (!initialized && audioEl) {
			loading = true;
			await demo.init(audioEl);
			initialized = true;
		}
		if (!demo.isPlaying) {
			loading = true;
			await demo.play();
			loading = false;
		} else {
			demo.pause();
		}
	}

	function selectPreset(preset: (typeof DEMO_PRESETS)[number]) {
		demo.applyPreset(preset);
	}

	// Count active effects for a preset
	function activeEffectCount(effects: PresetEffects): number {
		return Object.values(effects).filter((e) => e.enabled).length;
	}
</script>

<section id="demo" class="py-20">
	<div class="mx-auto max-w-4xl px-4 sm:px-6">
		<div class="text-center">
			<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">Try It Now</h2>
			<p class="mt-3 text-ink-tertiary">
				Hear the effects live on a lo-fi hip-hop stream. No install needed.
			</p>
		</div>

		<div
			class="mt-10 rounded-card border border-border bg-surface-2 p-6 shadow-lg sm:p-8"
			style="box-shadow: var(--shadow-card)"
		>
			<!-- Hidden audio element -->
			<audio
				bind:this={audioEl}
				src={DEMO_STREAM_URL}
				crossorigin="anonymous"
				preload="none"
				onplaying={() => (loading = false)}
			></audio>

			<!-- Player controls -->
			<div class="flex items-center gap-4">
				<button
					onclick={handlePlay}
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-md transition-transform hover:scale-105 hover:bg-accent-hover active:scale-95"
					aria-label={demo.isPlaying ? 'Pause' : 'Play'}
					disabled={loading}
				>
					{#if loading}
						<Loader class="h-5 w-5 animate-spin" />
					{:else if demo.isPlaying}
						<Pause class="h-5 w-5" />
					{:else}
						<Play class="h-5 w-5 translate-x-0.5" />
					{/if}
				</button>

				<div class="flex-1">
					<p class="text-sm font-medium text-ink">Radio Record Lo-Fi</p>
					<p class="text-xs text-ink-muted">
						{#if loading}
							Connecting to stream...
						{:else if demo.isPlaying}
							<span
								class="inline-block h-2 w-2 animate-glow rounded-full bg-success"
							></span>
							Playing &mdash; {DEMO_PRESETS.find((p) => p.id === demo.currentPresetId)
								?.name ?? 'Clean'}
						{:else}
							Lo-fi hip-hop &middot; Press play to start
						{/if}
					</p>
				</div>

				<!-- Volume -->
				<div class="hidden items-center gap-2 sm:flex">
					<Volume2 class="h-4 w-4 text-ink-muted" />
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={demo.volume}
						oninput={(e) => demo.setVolume(Number(e.currentTarget.value))}
						class="slider-track w-20"
					/>
				</div>
			</div>

			<!-- Preset selector -->
			<div class="mt-6">
				<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
					Presets
				</p>
				<div class="flex flex-wrap gap-2">
					{#each DEMO_PRESETS as preset}
						<button
							onclick={() => selectPreset(preset)}
							class="rounded-pill border px-3 py-1.5 text-sm font-medium transition-all {demo.currentPresetId ===
							preset.id
								? 'border-accent bg-accent-soft text-accent'
								: 'border-border text-ink-secondary hover:border-accent-muted hover:text-ink'}"
						>
							{preset.name}
							{#if preset.id !== 'off'}
								<span class="ml-1 text-xs opacity-60"
									>{activeEffectCount(preset.effects)}</span
								>
							{/if}
						</button>
					{/each}
				</div>
				{#if demo.currentPresetId !== 'off'}
					{@const preset = DEMO_PRESETS.find((p) => p.id === demo.currentPresetId)}
					{#if preset}
						<p class="mt-3 text-sm text-ink-tertiary">
							{preset.description}
						</p>
					{/if}
				{/if}
			</div>

			<!-- Effect indicators -->
			{#if demo.currentPresetId !== 'off'}
				{@const preset = DEMO_PRESETS.find((p) => p.id === demo.currentPresetId)}
				{#if preset}
					<div class="mt-4 flex flex-wrap gap-2">
						{#each EFFECT_LABELS as { key, label }}
							{@const effect = preset.effects[key]}
							<div
								class="flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs {effect.enabled
									? 'bg-accent-soft text-accent'
									: 'bg-surface-1 text-ink-muted'}"
							>
								<span
									class="h-1.5 w-1.5 rounded-full {effect.enabled
										? 'bg-accent'
										: 'bg-ink-muted'}"
								></span>
								{label}{effect.enabled ? `: ${effect.intensity}%` : ''}
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>

		<p class="mt-4 text-center text-xs text-ink-muted">
			The extension includes 27 presets, the full 30-station library, tab audio mode, and keyboard shortcuts.
		</p>
	</div>
</section>
