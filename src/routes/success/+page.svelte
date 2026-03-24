<script lang="ts">
	import { page } from '$app/state';
	import { CHROME_STORE_URL, FIREFOX_STORE_URL } from '$lib/constants';
	import { Check, Download, Chrome } from 'lucide-svelte';

	const checkoutId = $derived(page.url.searchParams.get('checkout_id'));
</script>

<svelte:head>
	<title>Welcome to Premium — LoveLofi</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex min-h-[70vh] items-center justify-center px-4">
	<div class="mx-auto max-w-lg text-center">
		<div
			class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/15"
		>
			<Check class="h-8 w-8 text-success" />
		</div>

		<h1 class="font-display text-3xl font-bold text-ink sm:text-4xl">You're Premium!</h1>

		<p class="mt-4 text-ink-secondary">
			Thank you for supporting LoveLofi. Your license key has been sent to your email.
		</p>

		{#if checkoutId}
			<p class="mt-2 text-xs text-ink-muted">
				Checkout ID: <code class="rounded bg-surface-1 px-1.5 py-0.5">{checkoutId}</code>
			</p>
		{/if}

		<div class="mt-8 space-y-3">
			<h2 class="text-sm font-semibold uppercase tracking-wider text-ink-muted">
				Getting Started
			</h2>
			<ol class="space-y-2 text-left text-sm text-ink-secondary">
				<li class="flex gap-3">
					<span
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent"
						>1</span
					>
					Install the extension if you haven't already
				</li>
				<li class="flex gap-3">
					<span
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent"
						>2</span
					>
					Open LoveLofi and go to Settings
				</li>
				<li class="flex gap-3">
					<span
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent"
						>3</span
					>
					Paste your license key to activate Premium
				</li>
			</ol>
		</div>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
			<a
				href={CHROME_STORE_URL}
				class="inline-flex items-center justify-center gap-2 rounded-pill bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
			>
				<Chrome class="h-4 w-4" />
				Install for Chrome
			</a>
			<a
				href={FIREFOX_STORE_URL}
				class="inline-flex items-center justify-center gap-2 rounded-pill border border-border px-5 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-1 hover:text-ink"
			>
				<Download class="h-4 w-4" />
				Install for Firefox
			</a>
		</div>

		<p class="mt-6 text-xs text-ink-muted">
			Need help? Join our <a href="https://discord.gg/lovelofi" class="text-accent hover:underline"
				>Discord</a
			> or check the <a href="/docs" class="text-accent hover:underline">docs</a>.
		</p>
	</div>
</div>
