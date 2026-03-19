<script lang="ts">
	import {
		Pin,
		Radio,
		SlidersHorizontal,
		Music,
		Upload,
		Chrome,
		Globe,
		BookOpen
	} from 'lucide-svelte';
	import { CHROME_STORE_URL, FIREFOX_STORE_URL } from '$lib/constants';

	type Feature = {
		title: string;
		description: string;
		icon: 'pin' | 'radio' | 'effects' | 'tab' | 'upload';
	};

	const features: Feature[] = [
		{
			title: 'Pin LoveLofi to Your Toolbar',
			description:
				'Click the puzzle piece icon in your browser toolbar, then pin LoveLofi so it is always one click away.',
			icon: 'pin'
		},
		{
			title: 'Start With Lo-Fi Radio',
			description:
				'Jump into curated stations across lo-fi hip-hop, chillhop, ambient, lounge, synthwave, and more. Press play and the vibe is ready.',
			icon: 'radio'
		},
		{
			title: 'Shape the Sound in Real Time',
			description:
				'Blend low-pass, reverb, vinyl crackle, tape saturation, bitcrusher, and more while audio is already playing.',
			icon: 'effects'
		},
		{
			title: 'Use Tab Audio Mode',
			description:
				'Run LoveLofi on Spotify, YouTube, Bandcamp, or any site with browser audio and turn it into a cozy session.',
			icon: 'tab'
		},
		{
			title: 'Upload and Export',
			description:
				'Premium unlocks upload and export, so you can process your own tracks and save them as MP3 or WAV.',
			icon: 'upload'
		}
	];

	let step = $state(0);
	let currentFeature = $derived(features[step]);

	function next() {
		if (step < features.length - 1) {
			step += 1;
		}
	}

	function prev() {
		if (step > 0) {
			step -= 1;
		}
	}
</script>

<svelte:head>
	<title>Welcome to LoveLofi</title>
</svelte:head>

<section class="relative overflow-hidden py-16 sm:py-24">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-80"
		style="background: radial-gradient(circle at top, var(--accent-soft) 0%, transparent 70%)"
	></div>

	<div class="mx-auto max-w-5xl px-4 sm:px-6">
		<div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
			<div>
				<p
					class="inline-flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-4 py-1.5 text-sm text-ink-secondary"
				>
					<Pin class="h-4 w-4 text-accent" />
					Quick Start Guide
				</p>
				<h1 class="mt-5 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
					Welcome to LoveLofi
				</h1>
				<p class="mt-4 max-w-xl text-lg text-ink-secondary">
					Your extension is installed. Here is the fastest way to get from first click to full cozy
					listening mode.
				</p>

				<div class="mt-8 flex flex-wrap gap-3">
					<a
						href="/docs"
						class="inline-flex items-center justify-center gap-2 rounded-button bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
					>
						<BookOpen class="h-4 w-4" />
						Open Quick Start
					</a>
					<a
						href={CHROME_STORE_URL}
						class="inline-flex items-center justify-center gap-2 rounded-button border border-border px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-1"
					>
						<Chrome class="h-4 w-4" />
						Chrome Listing
					</a>
					<a
						href={FIREFOX_STORE_URL}
						class="inline-flex items-center justify-center gap-2 rounded-button border border-border px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-1"
					>
						<Globe class="h-4 w-4" />
						Firefox Listing
					</a>
				</div>

				<p class="mt-4 text-sm text-ink-muted">
					You can close this tab any time after you are set.
				</p>
			</div>

			<div
				class="rounded-card border border-border-soft bg-surface-2 p-6 shadow-md sm:p-8"
				style="box-shadow: var(--shadow-card)"
			>
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent"
				>
					{#if currentFeature.icon === 'pin'}
						<Pin class="h-8 w-8" stroke-width={1.5} />
					{:else if currentFeature.icon === 'radio'}
						<Radio class="h-8 w-8" stroke-width={1.5} />
					{:else if currentFeature.icon === 'effects'}
						<SlidersHorizontal class="h-8 w-8" stroke-width={1.5} />
					{:else if currentFeature.icon === 'tab'}
						<Music class="h-8 w-8" stroke-width={1.5} />
					{:else}
						<Upload class="h-8 w-8" stroke-width={1.5} />
					{/if}
				</div>

				<div class="mt-6">
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
						Step {step + 1} of {features.length}
					</p>
					<h2 class="mt-3 text-2xl font-semibold text-ink">{currentFeature.title}</h2>
					<p class="mt-3 text-sm leading-6 text-ink-tertiary">{currentFeature.description}</p>
				</div>

				<div class="mt-8 flex gap-2">
					{#each features as _, i}
						<button
							class={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-accent' : 'w-2 bg-border'}`}
							onclick={() => (step = i)}
							aria-label={`Go to step ${i + 1}`}
						></button>
					{/each}
				</div>

				<div class="mt-8 flex items-center justify-between gap-3">
					{#if step > 0}
						<button
							class="rounded-button px-4 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-1 hover:text-ink"
							onclick={prev}
						>
							Back
						</button>
					{:else}
						<div></div>
					{/if}

					{#if step < features.length - 1}
						<button
							class="rounded-button bg-ink px-5 py-2.5 text-sm font-semibold text-surface-0 transition-opacity hover:opacity-90"
							onclick={next}
						>
							Next
						</button>
					{:else}
						<a
							href="/docs"
							class="rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
						>
							Read the Docs
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>
