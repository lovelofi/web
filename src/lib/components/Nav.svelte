<script lang="ts">
	import { Radio, Menu, X } from 'lucide-svelte';
	import { CHROME_STORE_URL } from '$lib/constants';

	let mobileOpen = $state(false);

	const links = [
		{ href: '/#features', label: 'Features' },
		{ href: '/library', label: 'Preset Library' },
		{ href: '/#pricing', label: 'Pricing' },
		{ href: '/#faq', label: 'FAQ' },
		{ href: '/docs', label: 'Docs' },
		{ href: '/changelog', label: 'Changelog' },
	];
</script>

<nav class="sticky top-0 z-50 border-b border-border bg-surface-0/90 backdrop-blur-md">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
		<a href="/" class="flex items-center gap-2 text-lg font-bold text-ink">
			<Radio class="h-5 w-5 text-accent" />
			<span class="font-display">LoveLofi</span>
		</a>

		<!-- Desktop links -->
		<div class="hidden items-center gap-6 md:flex">
			{#each links as link}
				<a
					href={link.href}
					class="text-sm font-medium text-ink-secondary transition-colors hover:text-accent"
				>
					{link.label}
				</a>
			{/each}

			<a
				href={CHROME_STORE_URL}
				class="btn-lift rounded-button bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
			>
				Install Extension
			</a>
		</div>

		<!-- Mobile menu button -->
		<div class="flex items-center gap-3 md:hidden">

			<button
			onclick={() => (mobileOpen = !mobileOpen)}
			class="text-ink-secondary"
			aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={mobileOpen}
		>
				{#if mobileOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	<div class="mobile-menu md:hidden {mobileOpen ? 'open' : ''}">
		<div>
			<div class="border-t border-border-soft bg-surface-0 px-4 pb-4 pt-2">
				{#each links as link}
					<a
						href={link.href}
						class="block py-2 text-sm font-medium text-ink-secondary transition-colors hover:text-accent"
						onclick={() => (mobileOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				<a
					href={CHROME_STORE_URL}
					class="mt-2 block rounded-button bg-accent px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
				>
					Install Extension
				</a>
			</div>
		</div>
	</div>
</nav>
