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
	} from 'lucide-svelte';
	import AudioDemo from '$lib/components/AudioDemo.svelte';
	import {
		FEATURES,
		PLANS,
		FAQ_ITEMS,
		CHROME_STORE_URL,
		FIREFOX_STORE_URL,
		DISCORD_URL,
	} from '$lib/constants';

	const iconMap: Record<string, typeof Radio> = {
		Radio,
		Sliders,
		Disc3,
		Headphones,
		Palette,
		Keyboard,
	};

	let openFaq = $state<number | null>(null);

	function toggleFaq(index: number) {
		openFaq = openFaq === index ? null : index;
	}
</script>

<svelte:head>
	<title>LoveLofi — Lo-Fi Audio Effects for Your Browser</title>
</svelte:head>

<!-- ===== HERO ===== -->
<section class="relative overflow-hidden py-20 sm:py-28">
	<div class="mx-auto max-w-6xl px-4 text-center sm:px-6">
		<div class="mx-auto max-w-3xl">
			<p
				class="mb-4 inline-flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-4 py-1.5 text-sm text-ink-secondary"
			>
				<Radio class="h-4 w-4 text-accent" />
				Browser Extension for Chrome & Firefox
			</p>
			<h1 class="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
				Turn any music into
				<span class="text-accent">lo-fi</span>
			</h1>
			<p class="mx-auto mt-6 max-w-xl text-lg text-ink-secondary">
				Real-time audio effects for your browser. Vinyl warmth, reverb, tape saturation — apply
				lo-fi magic to radio stations or any tab audio.
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
				<a
					href={CHROME_STORE_URL}
					class="flex items-center gap-2 rounded-button bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-accent-hover hover:shadow-lg"
				>
					<Chrome class="h-4 w-4" />
					Add to Chrome
				</a>
				<a
					href={FIREFOX_STORE_URL}
					class="flex items-center gap-2 rounded-button border border-border px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-1"
				>
					<Globe class="h-4 w-4" />
					Add to Firefox
				</a>
			</div>
			<p class="mt-4 text-sm text-ink-muted">Free forever — Premium from $2.99/mo</p>
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
		<div class="text-center">
			<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">
				Everything you need for the perfect lo-fi vibe
			</h2>
			<p class="mx-auto mt-3 max-w-2xl text-ink-tertiary">
				From curated radio stations to professional-grade audio effects, LoveLofi has it all.
			</p>
		</div>

		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each FEATURES as feature}
				{@const Icon = iconMap[feature.icon]}
				<div
					class="rounded-card border border-border-soft bg-surface-2 p-6 transition-shadow hover:shadow-md"
					style="box-shadow: var(--shadow-card)"
				>
					<div
						class="flex h-10 w-10 items-center justify-center rounded-button bg-accent-soft text-accent"
					>
						{#if Icon}
							<Icon class="h-5 w-5" />
						{/if}
					</div>
					<h3 class="mt-4 font-semibold text-ink">{feature.title}</h3>
					<p class="mt-2 text-sm text-ink-tertiary">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== AUDIO DEMO ===== -->
<section class="border-t border-border-soft bg-surface-1">
	<AudioDemo />
</section>

<!-- ===== PRICING ===== -->
<section id="pricing" class="border-t border-border-soft py-20">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="text-center">
			<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">
				Simple, transparent pricing
			</h2>
			<p class="mt-3 text-ink-tertiary">Start free. Upgrade when you want more.</p>
		</div>

		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each PLANS as plan}
				<div
					class="relative flex flex-col rounded-card border p-6 transition-shadow hover:shadow-md {plan.highlighted
						? 'border-accent bg-accent-soft'
						: 'border-border-soft bg-surface-2'}"
					style="box-shadow: var(--shadow-card)"
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
					<a
						href={plan.id === 'free' ? CHROME_STORE_URL : CHROME_STORE_URL}
						class="mt-6 block rounded-button py-2.5 text-center text-sm font-semibold transition-colors {plan.highlighted
							? 'bg-accent text-white hover:bg-accent-hover'
							: 'border border-border text-ink hover:bg-surface-1'}"
					>
						{plan.cta}
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== FAQ ===== -->
<section id="faq" class="border-t border-border-soft bg-surface-1 py-20">
	<div class="mx-auto max-w-3xl px-4 sm:px-6">
		<div class="text-center">
			<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">
				Frequently Asked Questions
			</h2>
		</div>

		<div class="mt-10 space-y-3">
			{#each FAQ_ITEMS as item, i}
				<div class="rounded-card border border-border-soft bg-surface-2 overflow-hidden">
					<button
						onclick={() => toggleFaq(i)}
						class="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:bg-surface-1"
					>
						{item.q}
						<ChevronDown
							class="h-4 w-4 shrink-0 text-ink-muted transition-transform {openFaq === i
								? 'rotate-180'
								: ''}"
						/>
					</button>
					{#if openFaq === i}
						<div class="border-t border-border-soft px-5 py-4 text-sm text-ink-tertiary">
							{item.a}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== CTA ===== -->
<section class="border-t border-border-soft py-20">
	<div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
		<h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">Ready to chill?</h2>
		<p class="mt-3 text-ink-tertiary">
			Install LoveLofi and transform your browser into a lo-fi listening station.
		</p>
		<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href={CHROME_STORE_URL}
				class="flex items-center gap-2 rounded-button bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-accent-hover hover:shadow-lg"
			>
				<Chrome class="h-4 w-4" />
				Add to Chrome — Free
			</a>
			<a
				href={DISCORD_URL}
				target="_blank"
				rel="noopener"
				class="rounded-button border border-border px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-1"
			>
				Join the Discord
			</a>
		</div>
	</div>
</section>
