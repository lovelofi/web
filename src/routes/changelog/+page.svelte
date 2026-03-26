<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { ChangelogEntry } from './+page.server';
	import ExternalLink from 'lucide-svelte/icons/external-link';

	type Platform = 'all' | 'extension' | 'desktop';

	let { data } = $props();
	const entries: ChangelogEntry[] = data.entries;

	let filter = $state<Platform>('all');

	$effect(() => {
		const param = $page.url.searchParams.get('platform');
		if (param === 'extension' || param === 'desktop') {
			filter = param;
		}
	});

	function setFilter(next: Platform): void {
		filter = next;
		const url = new URL($page.url);
		if (next === 'all') {
			url.searchParams.delete('platform');
		} else {
			url.searchParams.set('platform', next);
		}
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	let filteredEntries = $derived(
		filter === 'all' ? entries : entries.filter((e) => e.platform === filter),
	);

	/** Convert release-please markdown body into simple HTML */
	function renderBody(body: string): string {
		return body
			// Headers: ### Foo → <h4>Foo</h4>
			.replace(/^###\s+(.+)$/gm, '<h4 class="font-medium text-ink mt-3">$1</h4>')
			.replace(/^##\s+.+$/gm, '') // strip ## version headers (redundant)
			// List items: * foo or - foo → <li>foo</li>
			.replace(/^\*\s+(.+)$/gm, '<li>$1</li>')
			.replace(/^-\s+(.+)$/gm, '<li>$1</li>')
			// Wrap consecutive <li> runs in <ul>
			.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul class="mt-1 list-disc space-y-1 pl-5">$1</ul>')
			// Links: [text](url) → <a>text</a>
			.replace(
				/\[([^\]]+)\]\(([^)]+)\)/g,
				'<a href="$2" class="text-accent hover:underline">$1</a>',
			)
			// Bold: **text** → <strong>text</strong>
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			// Clean up empty lines
			.replace(/\n{3,}/g, '\n\n')
			.trim();
	}
</script>

<svelte:head>
	<title>Changelog — LoveLofi</title>
	<meta name="description" content="What's new in LoveLofi. Release notes for the desktop app and browser extension — new features, improvements, and bug fixes." />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
	<h1 class="font-display text-3xl font-bold text-ink sm:text-4xl">Changelog</h1>
	<p class="mt-3 text-ink-tertiary">What's new and improved in LoveLofi.</p>

	<!-- Platform filter -->
	<div class="mt-6 flex gap-2">
		{#each [
			{ id: 'all', label: 'All' },
			{ id: 'extension', label: 'Extension' },
			{ id: 'desktop', label: 'Desktop' },
		] as tab (tab.id)}
			<button
				class="rounded-pill px-4 py-1.5 text-sm font-medium transition-colors
					{filter === tab.id
					? 'bg-accent text-white'
					: 'bg-surface-1 text-ink-secondary hover:text-ink hover:bg-surface-2'}"
				onclick={() => setFilter(tab.id as Platform)}
				aria-pressed={filter === tab.id}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="mt-10 space-y-10">
		{#each filteredEntries as entry (entry.version + entry.platform)}
			<article class="relative border-l-2 border-accent-soft pl-6">
				<div class="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-accent"></div>
				<div class="flex items-center gap-3">
					<h2 class="text-lg font-semibold text-ink">{entry.version}</h2>
					<span class="rounded-pill bg-surface-1 border border-border-soft px-2 py-0.5 text-xs font-medium text-ink-secondary capitalize">
						{entry.platform}
					</span>
					{#if entry.latest}
						<span class="rounded-pill bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
							Latest
						</span>
					{/if}
				</div>
				<p class="mt-1 text-sm text-ink-muted">{entry.date}</p>
				{#if entry.body}
					<div class="mt-3 text-sm text-ink-secondary">
						{@html renderBody(entry.body)}
					</div>
				{/if}
				<a
					href={entry.url}
					target="_blank"
					rel="noopener"
					class="mt-3 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-accent transition-colors"
				>
					View on GitHub
					<ExternalLink size={11} />
				</a>
			</article>
		{/each}

		{#if filteredEntries.length === 0}
			<div class="py-8 text-center text-sm text-ink-muted">
				<p>No releases yet for this platform.</p>
			</div>
		{/if}
	</div>
</div>
