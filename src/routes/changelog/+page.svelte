<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	type Platform = 'all' | 'extension' | 'desktop';

	interface ChangelogEntry {
		version: string;
		date: string;
		platform: 'extension' | 'desktop';
		latest?: boolean;
		sections: {
			title: string;
			items: string[];
		}[];
	}

	const entries: ChangelogEntry[] = [
		{
			version: 'v0.1.1',
			date: 'March 2026',
			platform: 'desktop',
			latest: true,
			sections: [
				{
					title: 'Initial Release',
					items: [
						'System audio capture via CoreAudio ProcessTap (macOS 14.2+)',
						'Per-app audio capture targets',
						'Now playing metadata and media controls via MediaRemote',
						'Lo-fi radio player with 38 curated stations',
						'12 real-time audio effects with Web Audio API',
						'27 built-in presets',
						'System tray app with detachable floating window',
						'Global keyboard shortcuts (system-wide)',
						'Rich tray menu with stations, presets, and playback controls',
						'16 themes in 8 light/dark pairs',
						'Sleep timer with fade-out',
						'Audio file upload and export (MP3/WAV)',
						'Auto-update support',
						'Launch at login',
						'macOS, Windows, and Linux support',
					],
				},
			],
		},
		{
			version: 'v1.0.0',
			date: 'March 2026',
			platform: 'extension',
			latest: true,
			sections: [
				{
					title: 'Initial Release',
					items: [
						'Lo-fi radio player with 38 curated stations across 7 categories',
						'12 real-time audio effects with Web Audio API',
						'27 built-in presets',
						'Tab audio capture — apply effects to any browser tab',
						'16 themes in 8 light/dark pairs',
						'Custom presets and custom stations (premium)',
						'Keyboard shortcuts for playback control',
						'Sleep timer',
						'Mini player via content script',
						'Chrome and Firefox support (Manifest V3)',
					],
				},
			],
		},
	];

	let filter = $state<Platform>('all');

	// Read initial filter from URL query param
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
</script>

<svelte:head>
	<title>Changelog — LoveLofi</title>
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
				<div class="mt-3 space-y-3 text-sm text-ink-secondary">
					{#each entry.sections as section}
						<div>
							<h3 class="font-medium text-ink">{section.title}</h3>
							<ul class="mt-1 list-disc space-y-1 pl-5">
								{#each section.items as item}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</article>
		{/each}

		{#if filteredEntries.length === 0}
			<div class="py-8 text-center text-sm text-ink-muted">
				<p>No entries for this platform yet.</p>
			</div>
		{/if}

		<div class="py-8 text-center text-sm text-ink-muted">
			<p>More updates coming soon. Stay tuned!</p>
		</div>
	</div>
</div>
