<script lang="ts">
	import {
		Radio,
		Sliders,
		Disc3,
		Headphones,
		Palette,
		Keyboard,
		ChevronDown,
		Chrome,
		Globe,
		Monitor,
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import AudioDemo from '$lib/components/AudioDemo.svelte';
	import InView from '$lib/components/InView.svelte';
	import {
		FEATURES,
		PLANS,
		FAQ_ITEMS,
		CHROME_STORE_URL,
		FIREFOX_STORE_URL,
		DISCORD_URL,
		POLAR_CHECKOUT_MONTHLY,
		POLAR_CHECKOUT_ANNUAL,
		POLAR_CHECKOUT_LIFETIME,
	} from '$lib/constants';

	const CHECKOUT_URLS: Record<string, string> = {
		monthly: POLAR_CHECKOUT_MONTHLY,
		annual: POLAR_CHECKOUT_ANNUAL,
		lifetime: POLAR_CHECKOUT_LIFETIME,
	};

	const iconMap: Record<string, typeof Radio> = {
		Radio,
		Sliders,
		Disc3,
		Headphones,
		Palette,
		Keyboard,
	};

	let openFaq = $state<number | null>(null);
	let heroVisible = $state(false);

	function toggleFaq(index: number) {
		openFaq = openFaq === index ? null : index;
	}

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) {
			heroVisible = true;
			return;
		}
		// Small delay so the browser paints first, then animate in
		requestAnimationFrame(() => {
			heroVisible = true;
		});
	});
</script>

<svelte:head>
	<title>LoveLofi — Lo-Fi Audio Effects for Your Browser & Desktop</title>

	<!-- Organization -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "LoveLofi",
		"url": "https://lovelofi.app",
		"logo": "https://lovelofi.app/favicon.png",
		"sameAs": ["https://discord.gg/pVxNeycE"]
	})}</script>`}

	<!-- SoftwareApplication -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "LoveLofi",
		"applicationCategory": "MultimediaApplication",
		"operatingSystem": "Chrome, Firefox, macOS, Windows, Linux",
		"url": "https://lovelofi.app",
		"description": "Real-time lo-fi audio effects for your browser and desktop. Curated radio stations, vinyl warmth, reverb, tape saturation, and more.",
		"offers": [
			{
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD",
				"description": "Free tier with core effects and 6 stations"
			},
			{
				"@type": "Offer",
				"price": "1.99",
				"priceCurrency": "USD",
				"description": "Premium monthly — all effects, stations, and features",
				"priceValidUntil": "2027-12-31"
			},
			{
				"@type": "Offer",
				"price": "19",
				"priceCurrency": "USD",
				"description": "Premium annual — best value",
				"priceValidUntil": "2027-12-31"
			}
		]
	})}</script>`}

	<!-- FAQPage -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": FAQ_ITEMS.map(item => ({
			"@type": "Question",
			"name": item.q,
			"acceptedAnswer": {
				"@type": "Answer",
				"text": item.a
			}
		}))
	})}</script>`}
</svelte:head>

<!-- ===== HERO ===== -->
<section class="relative overflow-hidden py-20 sm:py-28">
	<div class="mx-auto max-w-6xl px-4 text-center sm:px-6">
		<div class="mx-auto max-w-3xl hero-stagger">
			<p
				class="fade-up mb-4 inline-flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-4 py-1.5 text-sm text-ink-secondary"
				class:in-view={heroVisible}
			>
				<Radio class="h-4 w-4 text-accent" />
				Desktop App & Browser Extension
			</p>
			<h1
				class="fade-up font-display text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl"
				class:in-view={heroVisible}
			>
				Your cozy corner for
				<span class="text-accent">lo-fi listening</span>
			</h1>
			<p
				class="fade-up mx-auto mt-6 max-w-xl text-lg text-ink-secondary"
				class:in-view={heroVisible}
			>
				Curated radio stations, real-time lo-fi effects, and system audio capture.
				Available as a desktop app for macOS, Windows, and Linux — or as a browser extension.
			</p>
			<div
				class="fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
				class:in-view={heroVisible}
			>
				<a
					href="/download"
					class="btn-lift flex items-center gap-2 rounded-button bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-accent-hover"
				>
					<Monitor class="h-4 w-4" />
					Download Desktop App
				</a>
				<a
					href={CHROME_STORE_URL}
					class="btn-lift flex items-center gap-2 rounded-button border border-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-1"
				>
					<Chrome class="h-4 w-4" />
					Add to Chrome
				</a>
				<a
					href={FIREFOX_STORE_URL}
					class="btn-lift flex items-center gap-2 rounded-button border border-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-1"
				>
					<Globe class="h-4 w-4" />
					Add to Firefox
				</a>
			</div>
			<p
				class="fade-up mt-4 text-sm text-ink-muted"
				class:in-view={heroVisible}
			>
				Free forever — Premium from $1.99/mo or $19/year
			</p>
		</div>
	</div>

	<!-- Decorative gradient -->
	<div
		class="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full opacity-20"
		style="background: radial-gradient(circle, var(--accent) 0%, transparent 70%)"
	></div>
</section>

<!-- ===== FEATURES ===== -->
<section id="features" class="border-t border-border-soft py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<InView class="text-center">
			<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">
				Everything you need for the perfect lo-fi vibe
			</h2>
			<p class="mx-auto mt-3 max-w-2xl text-ink-tertiary">
				From curated stations to tasteful real-time audio styling, LoveLofi gives you instant atmosphere without a complicated studio workflow.
			</p>
		</InView>

		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger">
			{#each FEATURES as feature}
				{@const Icon = iconMap[feature.icon]}
				<InView class="card-hover rounded-card border border-border-soft bg-surface-2 p-6" >
					<div
						class="flex h-10 w-10 items-center justify-center rounded-button bg-accent-soft text-accent"
					>
						{#if Icon}
							<Icon class="h-5 w-5" />
						{/if}
					</div>
					<h3 class="mt-4 font-semibold text-ink">{feature.title}</h3>
					<p class="mt-2 text-sm text-ink-tertiary">{feature.description}</p>
				</InView>
			{/each}
		</div>
	</div>
</section>

<!-- ===== AUDIO DEMO ===== -->
<section class="border-t border-border-soft bg-surface-1">
	<InView>
		<AudioDemo />
	</InView>
</section>

<!-- ===== PRICING ===== -->
<section id="pricing" class="border-t border-border-soft py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<InView class="text-center">
			<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">
				Simple, transparent pricing
			</h2>
			<p class="mt-3 text-ink-tertiary">Start free. Upgrade when you want more.</p>
		</InView>

		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger">
			{#each PLANS as plan}
				<InView
					class="card-hover relative flex flex-col rounded-card border p-6 {plan.highlighted
						? 'border-accent bg-accent-soft'
						: 'border-border-soft bg-surface-2'}"
				>
					{#if plan.highlighted}
						<span
							class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-accent px-3 py-1 text-xs font-semibold text-white"
						>
							Most Popular
						</span>
					{/if}
					<h3 class="font-semibold text-ink">{plan.name}</h3>
					<div class="mt-2">
						<span class="text-3xl font-bold text-ink">{plan.price}</span>
						<span class="text-sm text-ink-muted">{plan.period}</span>
					</div>
					<p class="mt-2 text-sm text-ink-tertiary">{plan.description}</p>
					<ul class="mt-4 flex-1 space-y-2">
						{#each plan.features as feature}
							<li class="flex items-start gap-2 text-sm text-ink-secondary">
								<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
								{feature}
							</li>
						{/each}
					</ul>
					{#if plan.id === 'free'}
						<div class="mt-6 flex flex-col gap-2">
							<a
								href="/download"
								class="btn-lift flex items-center justify-center gap-2 rounded-button py-2.5 text-center text-sm font-semibold border border-border text-ink hover:bg-surface-1"
							>
								<Monitor class="h-3.5 w-3.5" />
								Desktop App
							</a>
							<div class="flex gap-2">
								<a
									href={CHROME_STORE_URL}
									class="flex-1 flex items-center justify-center gap-1.5 rounded-button py-2 text-center text-xs font-medium border border-border text-ink-secondary hover:bg-surface-1 transition-colors"
								>
									<Chrome class="h-3 w-3" />
									Chrome
								</a>
								<a
									href={FIREFOX_STORE_URL}
									class="flex-1 flex items-center justify-center gap-1.5 rounded-button py-2 text-center text-xs font-medium border border-border text-ink-secondary hover:bg-surface-1 transition-colors"
								>
									<Globe class="h-3 w-3" />
									Firefox
								</a>
							</div>
						</div>
					{:else}
						<a
							href={CHECKOUT_URLS[plan.id] ?? POLAR_CHECKOUT_MONTHLY}
							class="btn-lift mt-6 block rounded-button py-2.5 text-center text-sm font-semibold {plan.highlighted
								? 'bg-accent text-white hover:bg-accent-hover'
								: 'border border-border text-ink hover:bg-surface-1'}"
						>
							{plan.cta}
						</a>
					{/if}
				</InView>
			{/each}
		</div>
	</div>
</section>

<!-- ===== FAQ ===== -->
<section id="faq" class="border-t border-border-soft bg-surface-1 py-20">
	<div class="mx-auto max-w-3xl px-4 sm:px-6">
		<InView class="text-center">
			<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">
				Frequently Asked Questions
			</h2>
		</InView>

		<div class="mt-10 space-y-3">
			{#each FAQ_ITEMS as item, i}
				<InView class="rounded-card border border-border-soft bg-surface-2 overflow-hidden">
					<button
						onclick={() => toggleFaq(i)}
						aria-expanded={openFaq === i}
						aria-controls="faq-answer-{i}"
						class="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:bg-surface-1"
					>
						{item.q}
						<ChevronDown
							class="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 {openFaq === i
								? 'rotate-180'
								: ''}"
						/>
					</button>
					<div
						id="faq-answer-{i}"
						class="faq-answer {openFaq === i ? 'open' : ''}"
					>
						<div>
							<div class="border-t border-border-soft px-5 py-4 text-sm text-ink-tertiary">
								{item.a}
							</div>
						</div>
					</div>
				</InView>
			{/each}
		</div>
	</div>
</section>

<!-- ===== CTA ===== -->
<section class="border-t border-border-soft py-20">
	<InView class="mx-auto max-w-3xl px-4 text-center sm:px-6">
		<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">Ready to chill?</h2>
		<p class="mt-3 text-ink-tertiary">
			Get LoveLofi for your desktop or browser — free to start.
		</p>
		<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href="/download"
				class="btn-lift flex items-center gap-2 rounded-button bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-accent-hover"
			>
				<Monitor class="h-4 w-4" />
				Download Desktop App
			</a>
			<a
				href={CHROME_STORE_URL}
				class="btn-lift flex items-center gap-2 rounded-button border border-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-1"
			>
				<Chrome class="h-4 w-4" />
				Add to Chrome
			</a>
			<a
				href={DISCORD_URL}
				target="_blank"
				rel="noopener"
				class="btn-lift rounded-button border border-border px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-1"
			>
				Join the Discord
			</a>
		</div>
	</InView>
</section>
