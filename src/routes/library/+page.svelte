<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		ArrowRight,
		BookOpen,
		CloudRain,
		Disc3,
		Package2,
		Search,
		Sparkles,
		Waves,
	} from 'lucide-svelte';
	import { CHROME_STORE_URL } from '$lib/constants';
	import type { PageData } from './$types';

	type EffectSetting = {
		enabled?: boolean;
	};

	type LibraryPreset = {
		id: string;
		name: string;
		description: string;
		settings: Record<string, EffectSetting>;
	};

	type PackPreset = {
		id: string;
		name: string;
		description: string;
	};

	type PresetPack = {
		id: string;
		name: string;
		description: string;
		tier: 'free' | 'premium';
		featured: boolean;
		presets: PackPreset[];
	};

	type ScopeFilter = 'all' | 'presets' | 'packs';
	type QuickFilter =
		| 'all'
		| 'featured'
		| 'lofi'
		| 'atmosphere'
		| 'experimental'
		| 'free'
		| 'premium';

	type PresetCard = LibraryPreset & {
		tags: string[];
		effectCount: number;
	};

	type PackCard = PresetPack & {
		tags: string[];
		presetCount: number;
		presetNames: string[];
	};

	const SCOPE_FILTER_VALUES: ScopeFilter[] = ['all', 'presets', 'packs'];
	const QUICK_FILTER_VALUES: QuickFilter[] = [
		'all',
		'featured',
		'lofi',
		'atmosphere',
		'experimental',
		'free',
		'premium',
	];

	let { data }: { data: PageData } = $props();

	let presets = $derived((data.presets as LibraryPreset[]) ?? []);
	let packs = $derived((data.packs as PresetPack[]) ?? []);
	let featuredPresetIds = $derived(new Set(data.featuredPresetIds));
	let freePresetIds = $derived(new Set(data.freePresetIds));
	let searchQuery = $state('');
	let scopeFilter = $state<ScopeFilter>('all');
	let quickFilter = $state<QuickFilter>('all');

	const atmospherePackIds = new Set([
		'rainy-night',
		'sunday-morning',
		'city-lights',
		'strange-rooms',
		'after-hours',
	]);
	const experimentalPackIds = new Set([
		'radio-ghosts',
		'underwater-dreams',
		'digital-decay',
		'tape-dreams',
	]);
	const lofiFamilyIds = new Set([
		'classic-lofi',
		'lofi-hiphop',
		'lofi-jazz',
		'lofi-chill',
		'lofi-synthwave',
		'lofi-vaporwave',
	]);
	const atmospherePresetIds = new Set([
		'sunday-morning',
		'late-night-study',
		'rainy-cafe',
		'dreamy',
		'foggy-harbor',
		'underwater',
		'vintage-radio',
		'vhs-memories',
		'empty-apartment',
		'hotel-lobby',
		'parking-garage',
		'bathroom-tiles',
		'church-hall',
		'next-door',
		'pillow-fort',
		'upstairs-party',
		'haunted-ballroom',
	]);

	const scopeOptions: { id: ScopeFilter; label: string }[] = [
		{ id: 'all', label: 'All' },
		{ id: 'presets', label: 'Presets' },
		{ id: 'packs', label: 'Packs' },
	];

	const quickFilterOptions: { id: QuickFilter; label: string }[] = [
		{ id: 'all', label: 'Everything' },
		{ id: 'featured', label: 'Featured' },
		{ id: 'lofi', label: 'Lo-Fi' },
		{ id: 'atmosphere', label: 'Atmosphere' },
		{ id: 'experimental', label: 'Experimental' },
		{ id: 'free', label: 'Free' },
		{ id: 'premium', label: 'Premium' },
	];

	const quickJumpLinks = [
		{ href: '#featured-presets', label: 'Featured Presets' },
		{ href: '#lofi-foundations', label: 'Lo-Fi Foundations' },
		{ href: '#atmosphere-presets', label: 'Atmosphere Presets' },
		{ href: '#featured-packs', label: 'Featured Packs' },
		{ href: '#atmosphere-packs', label: 'Atmosphere Packs' },
		{ href: '#experimental-packs', label: 'Experimental Packs' },
		{ href: '#all-packs', label: 'All Packs' },
		{ href: '#all-presets', label: 'All Presets' },
	];

	function activeEffectCount(settings: Record<string, EffectSetting>): number {
		return Object.values(settings).filter((effect) => effect?.enabled).length;
	}

	function formatDate(value: string): string {
		if (!value) return 'recently';
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return 'recently';
		return parsed.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}

	function packTierClasses(tier: PresetPack['tier']): string {
		return tier === 'premium'
			? 'bg-accent-soft text-accent border-transparent'
			: 'border border-border bg-surface-0 text-ink-secondary';
	}

	function normalize(value: string): string {
		return value.trim().toLowerCase();
	}

	function isScopeFilter(value: string | null): value is ScopeFilter {
		return value !== null && SCOPE_FILTER_VALUES.includes(value as ScopeFilter);
	}

	function isQuickFilter(value: string | null): value is QuickFilter {
		return value !== null && QUICK_FILTER_VALUES.includes(value as QuickFilter);
	}

	function matchesSearch(parts: string[], query: string): boolean {
		const normalizedQuery = normalize(query);
		if (!normalizedQuery) return true;
		return parts.some((part) => normalize(part).includes(normalizedQuery));
	}

	function matchesQuickFilter(tags: string[], filter: QuickFilter): boolean {
		return filter === 'all' || tags.includes(filter);
	}

	function buildPresetTags(preset: LibraryPreset): string[] {
		const tags = ['preset', 'built-in'];
		if (featuredPresetIds.has(preset.id)) tags.push('featured');
		if (freePresetIds.has(preset.id)) tags.push('free');
		if (lofiFamilyIds.has(preset.id)) tags.push('lofi');
		if (atmospherePresetIds.has(preset.id)) tags.push('atmosphere');
		return tags;
	}

	function buildPackTags(pack: PresetPack): string[] {
		const tags = ['pack', pack.tier];
		if (pack.featured) tags.push('featured');
		if (atmospherePackIds.has(pack.id)) tags.push('atmosphere');
		if (experimentalPackIds.has(pack.id)) tags.push('experimental');
		return tags;
	}

	function clearFilters(): void {
		searchQuery = '';
		scopeFilter = 'all';
		quickFilter = 'all';
	}

	let presetCards = $derived(
		presets.map((preset) => ({
			...preset,
			tags: buildPresetTags(preset),
			effectCount: activeEffectCount(preset.settings),
		})),
	);

	let packCards = $derived(
		packs.map((pack) => ({
			...pack,
			tags: buildPackTags(pack),
			presetCount: pack.presets.length,
			presetNames: pack.presets.map((preset) => preset.name),
		})),
	);

	let filteredPresetCards = $derived(
		presetCards.filter((preset) => {
			if (scopeFilter === 'packs') return false;
			if (!matchesQuickFilter(preset.tags, quickFilter)) return false;
			return matchesSearch(
				[preset.name, preset.description, ...preset.tags],
				searchQuery,
			);
		}),
	);

	let filteredPackCards = $derived(
		packCards.filter((pack) => {
			if (scopeFilter === 'presets') return false;
			if (!matchesQuickFilter(pack.tags, quickFilter)) return false;
			return matchesSearch(
				[pack.name, pack.description, ...pack.tags, ...pack.presetNames],
				searchQuery,
			);
		}),
	);

	let hasActiveFilters = $derived(
		normalize(searchQuery).length > 0 || scopeFilter !== 'all' || quickFilter !== 'all',
	);

	let featuredPresets = $derived(presets.filter((preset) => featuredPresetIds.has(preset.id)));
	let lofiFamilyPresets = $derived(presets.filter((preset) => lofiFamilyIds.has(preset.id)));
	let atmospherePresets = $derived(presets.filter((preset) => atmospherePresetIds.has(preset.id)));
	let featuredPacks = $derived(packs.filter((pack) => pack.featured));
	let atmospherePacks = $derived(packs.filter((pack) => atmospherePackIds.has(pack.id)));
	let experimentalPacks = $derived(packs.filter((pack) => experimentalPackIds.has(pack.id)));
	let allPacks = $derived(
		[...packs].sort(
			(a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
		),
	);
	let totalPackPresets = $derived(packs.reduce((sum, pack) => sum + pack.presets.length, 0));
	let presetUpdatedLabel = $derived(formatDate(data.presetUpdatedAt));
	let packUpdatedLabel = $derived(formatDate(data.packUpdatedAt));

	$effect(() => {
		const nextQuery = $page.url.searchParams.get('q') ?? '';
		const nextScope = $page.url.searchParams.get('scope');
		const nextFilter = $page.url.searchParams.get('filter');

		if (searchQuery !== nextQuery) {
			searchQuery = nextQuery;
		}

		const normalizedScope = isScopeFilter(nextScope) ? nextScope : 'all';
		if (scopeFilter !== normalizedScope) {
			scopeFilter = normalizedScope;
		}

		const normalizedFilter = isQuickFilter(nextFilter) ? nextFilter : 'all';
		if (quickFilter !== normalizedFilter) {
			quickFilter = normalizedFilter;
		}
	});

	$effect(() => {
		const currentQuery = $page.url.searchParams.get('q') ?? '';
		const currentScope = $page.url.searchParams.get('scope') ?? 'all';
		const currentFilter = $page.url.searchParams.get('filter') ?? 'all';

		if (
			currentQuery === searchQuery &&
			currentScope === scopeFilter &&
			currentFilter === quickFilter
		) {
			return;
		}

		const url = new URL($page.url);
		if (searchQuery) {
			url.searchParams.set('q', searchQuery);
		} else {
			url.searchParams.delete('q');
		}

		if (scopeFilter === 'all') {
			url.searchParams.delete('scope');
		} else {
			url.searchParams.set('scope', scopeFilter);
		}

		if (quickFilter === 'all') {
			url.searchParams.delete('filter');
		} else {
			url.searchParams.set('filter', quickFilter);
		}

		goto(url.toString(), { replaceState: true, noScroll: true, keepFocus: true });
	});
</script>

<svelte:head>
	<title>Preset Library — LoveLofi</title>
	<meta
		name="description"
		content="Browse the full LoveLofi preset library, including built-in presets, atmosphere collections, and hosted preset packs for the extension."
	/>
</svelte:head>

<section class="relative overflow-hidden border-b border-border-soft bg-surface-1 py-18 sm:py-22">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="max-w-3xl">
			<p class="inline-flex items-center gap-2 rounded-pill border border-border bg-surface-0 px-4 py-1.5 text-sm text-ink-secondary">
				<BookOpen class="h-4 w-4 text-accent" />
				Preset Library
			</p>
			<h1 class="mt-5 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
				Explore the full LoveLofi preset and pack catalog
			</h1>
			<p class="mt-4 max-w-2xl text-lg text-ink-secondary">
				A faster way to browse the full shelf: search presets and packs, filter by mood or tier,
				and jump straight to the part of the catalog you want.
			</p>
			<div class="mt-8 grid gap-3 sm:grid-cols-3">
				<div class="rounded-card border border-border-soft bg-surface-2 p-4">
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Built-In</p>
					<p class="mt-2 font-display text-3xl font-bold text-ink">{presets.length}</p>
					<p class="mt-1 text-sm text-ink-tertiary">core presets on the shelf</p>
				</div>
				<div class="rounded-card border border-border-soft bg-surface-2 p-4">
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Pack Library</p>
					<p class="mt-2 font-display text-3xl font-bold text-ink">{packs.length}</p>
					<p class="mt-1 text-sm text-ink-tertiary">hosted themed collections</p>
				</div>
				<div class="rounded-card border border-border-soft bg-surface-2 p-4">
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Pack Presets</p>
					<p class="mt-2 font-display text-3xl font-bold text-ink">{totalPackPresets}</p>
					<p class="mt-1 text-sm text-ink-tertiary">importable library presets</p>
				</div>
			</div>
			<div class="mt-7 flex flex-wrap gap-3">
				<a
					href={CHROME_STORE_URL}
					class="btn-lift inline-flex items-center gap-2 rounded-button bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
				>
					Install Extension
					<ArrowRight class="h-4 w-4" />
				</a>
				<a
					href="/demo"
					class="btn-lift rounded-button border border-border px-5 py-3 text-sm font-semibold text-ink hover:bg-surface-0"
				>
					Open Live Demo
				</a>
			</div>
		</div>
	</div>
	<div
		class="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full opacity-15"
		style="background: radial-gradient(circle, var(--accent) 0%, transparent 72%)"
	></div>
</section>

<section class="border-b border-border-soft bg-surface-1 py-10">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="rounded-card border border-border-soft bg-surface-2 p-5 sm:p-6">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Find Faster</p>
					<h2 class="mt-2 font-display text-2xl font-bold text-ink">Search and filter the library</h2>
					<p class="mt-2 max-w-2xl text-sm text-ink-tertiary">
						Search by preset name, pack name, mood, description, or tags like `atmosphere`,
						`featured`, `free`, or `premium`.
					</p>
				</div>
				{#if hasActiveFilters}
					<button
						onclick={clearFilters}
						class="rounded-pill border border-border bg-surface-0 px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink"
					>
						Clear filters
					</button>
				{/if}
			</div>

			<div class="mt-5">
				<label class="relative block">
					<Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
					<input
						bind:value={searchQuery}
						type="search"
						placeholder="Search presets, packs, vibes, and tags..."
						class="w-full rounded-button border border-border bg-surface-0 py-3 pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
					/>
				</label>
			</div>

			<div class="mt-5">
				<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Scope</p>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each scopeOptions as option}
						<button
							onclick={() => (scopeFilter = option.id)}
							class="rounded-pill border px-3 py-1.5 text-sm font-medium transition-all {scopeFilter ===
							option.id
								? 'border-accent bg-accent-soft text-accent'
								: 'border-border bg-surface-0 text-ink-secondary hover:border-accent-muted hover:text-ink'}"
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="mt-5">
				<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Quick Filters</p>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each quickFilterOptions as option}
						<button
							onclick={() => (quickFilter = option.id)}
							class="rounded-pill border px-3 py-1.5 text-sm font-medium transition-all {quickFilter ===
							option.id
								? 'border-accent bg-accent-soft text-accent'
								: 'border-border bg-surface-0 text-ink-secondary hover:border-accent-muted hover:text-ink'}"
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			{#if !hasActiveFilters}
				<div class="mt-5 border-t border-border-soft pt-5">
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Jump To</p>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each quickJumpLinks as link}
							<a
								href={link.href}
								class="rounded-pill border border-border bg-surface-0 px-3 py-1.5 text-sm font-medium text-ink-secondary hover:border-accent-muted hover:text-ink"
							>
								{link.label}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

{#if hasActiveFilters}
	<section class="py-18">
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<div class="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Results</p>
					<h2 class="mt-2 font-display text-3xl font-bold text-ink">Filtered Library Results</h2>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						Showing the fastest path through the catalog based on your current search and filters.
					</p>
				</div>
				<p class="text-sm text-ink-muted">
					{filteredPresetCards.length} presets • {filteredPackCards.length} packs
				</p>
			</div>

			{#if filteredPresetCards.length === 0 && filteredPackCards.length === 0}
				<div class="mt-8 rounded-card border border-border-soft bg-surface-2 p-6 text-center">
					<p class="font-medium text-ink">No matching presets or packs</p>
					<p class="mt-2 text-sm text-ink-tertiary">
						Try a broader search or clear one of the quick filters.
					</p>
				</div>
			{:else}
				{#if filteredPresetCards.length > 0}
					<div class="mt-8">
						<div class="flex items-center justify-between gap-3">
							<h3 class="font-display text-2xl font-bold text-ink">Matching Presets</h3>
							<p class="text-sm text-ink-muted">{filteredPresetCards.length} presets</p>
						</div>
						<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
							{#each filteredPresetCards as preset}
								<div class="rounded-card border border-border-soft bg-surface-2 p-5">
									<div class="flex items-start justify-between gap-3">
										<div>
											<div class="flex flex-wrap items-center gap-2">
												<h4 class="font-semibold text-ink">{preset.name}</h4>
												{#if preset.tags.includes('featured')}
													<span class="rounded-pill bg-accent-soft px-2 py-1 text-[11px] font-medium text-accent">Featured</span>
												{/if}
												{#if preset.tags.includes('free')}
													<span class="rounded-pill border border-border bg-surface-0 px-2 py-1 text-[11px] font-medium text-ink-secondary">Free</span>
												{/if}
											</div>
											<p class="mt-1 text-xs text-ink-muted">{preset.effectCount} active effects</p>
										</div>
									</div>
									<p class="mt-3 text-sm leading-relaxed text-ink-tertiary">{preset.description}</p>
									<div class="mt-4 flex flex-wrap gap-2">
										{#each preset.tags.filter((tag) => tag !== 'preset' && tag !== 'built-in') as tag}
											<span class="rounded-pill border border-border bg-surface-0 px-2 py-1 text-[11px] font-medium text-ink-secondary">
												{tag}
											</span>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if filteredPackCards.length > 0}
					<div class="mt-10">
						<div class="flex items-center justify-between gap-3">
							<h3 class="font-display text-2xl font-bold text-ink">Matching Packs</h3>
							<p class="text-sm text-ink-muted">{filteredPackCards.length} packs</p>
						</div>
						<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
							{#each filteredPackCards as pack}
								<div class="rounded-card border border-border-soft bg-surface-2 p-5">
									<div class="flex items-start justify-between gap-3">
										<div>
											<div class="flex flex-wrap items-center gap-2">
												<h4 class="font-semibold text-ink">{pack.name}</h4>
												<span class={`rounded-pill px-2 py-1 text-[11px] font-medium ${packTierClasses(pack.tier)}`}>
													{pack.tier === 'premium' ? 'Premium' : 'Free'}
												</span>
												{#if pack.featured}
													<span class="rounded-pill bg-accent-soft px-2 py-1 text-[11px] font-medium text-accent">Featured</span>
												{/if}
											</div>
											<p class="mt-1 text-xs text-ink-muted">{pack.presetCount} presets</p>
										</div>
										<Package2 class="mt-0.5 h-5 w-5 text-accent" />
									</div>
									<p class="mt-3 text-sm leading-relaxed text-ink-tertiary">{pack.description}</p>
									<div class="mt-4 flex flex-wrap gap-2">
										{#each pack.presetNames as presetName}
											<span class="rounded-pill border border-border bg-surface-0 px-2.5 py-1 text-xs text-ink-secondary">
												{presetName}
											</span>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</section>
{:else}
	<section id="featured-presets" class="border-b border-border-soft py-18">
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<div class="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Highlights</p>
					<h2 class="mt-2 font-display text-3xl font-bold text-ink">Featured Built-In Presets</h2>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						A quick pass through the presets that best represent the everyday LoveLofi sound.
					</p>
				</div>
				<p class="text-sm text-ink-muted">Updated {presetUpdatedLabel}</p>
			</div>

			<div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{#each featuredPresets as preset}
					<div class="rounded-card border border-border-soft bg-surface-2 p-5">
						<div class="flex items-start justify-between gap-3">
							<div>
								<h3 class="font-semibold text-ink">{preset.name}</h3>
								<p class="mt-1 text-xs text-ink-muted">{activeEffectCount(preset.settings)} active effects</p>
							</div>
							<span class="rounded-pill border border-border bg-surface-0 px-2 py-1 text-[11px] font-medium text-ink-secondary">
								{freePresetIds.has(preset.id) ? 'Free' : 'Built-in'}
							</span>
						</div>
						<p class="mt-3 text-sm leading-relaxed text-ink-tertiary">{preset.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="border-b border-border-soft py-18">
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<div class="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
				<div id="lofi-foundations">
					<div class="flex items-center gap-2">
						<Disc3 class="h-5 w-5 text-accent" />
						<h2 class="font-display text-3xl font-bold text-ink">Lo-Fi Foundations</h2>
					</div>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						The built-in family that sets the product voice: classic, hip-hop, jazz, chill, synthwave,
						and vaporwave variants.
					</p>
					<div class="mt-6 grid gap-4 sm:grid-cols-2">
						{#each lofiFamilyPresets as preset}
							<div class="rounded-card border border-border-soft bg-surface-2 p-5">
								<div class="flex items-center justify-between gap-3">
									<h3 class="font-semibold text-ink">{preset.name}</h3>
									<span class="text-xs text-ink-muted">{activeEffectCount(preset.settings)} effects</span>
								</div>
								<p class="mt-2 text-sm text-ink-tertiary">{preset.description}</p>
							</div>
						{/each}
					</div>
				</div>

				<div id="atmosphere-presets">
					<div class="flex items-center gap-2">
						<CloudRain class="h-5 w-5 text-accent" />
						<h2 class="font-display text-3xl font-bold text-ink">Atmosphere Built-Ins</h2>
					</div>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						Rooms, distance, weather, and late-night scene presets that push mood more than genre.
					</p>
					<div class="mt-6 grid gap-4">
						{#each atmospherePresets.slice(0, 8) as preset}
							<div class="rounded-card border border-border-soft bg-surface-2 p-5">
								<div class="flex items-center justify-between gap-3">
									<h3 class="font-semibold text-ink">{preset.name}</h3>
									<span class="text-xs text-ink-muted">{activeEffectCount(preset.settings)} effects</span>
								</div>
								<p class="mt-2 text-sm text-ink-tertiary">{preset.description}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="featured-packs" class="border-b border-border-soft py-18">
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<div class="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Hosted Packs</p>
					<h2 class="mt-2 font-display text-3xl font-bold text-ink">Featured Packs</h2>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						Hosted collections let the extension grow without shipping a new release every time you add a new mood world.
					</p>
				</div>
				<p class="text-sm text-ink-muted">Updated {packUpdatedLabel}</p>
			</div>

			<div class="mt-8 grid gap-4 lg:grid-cols-2">
				{#each featuredPacks as pack}
					<div class="rounded-card border border-border-soft bg-surface-2 p-5">
						<div class="flex items-start justify-between gap-3">
							<div>
								<div class="flex flex-wrap items-center gap-2">
									<h3 class="font-semibold text-ink">{pack.name}</h3>
									<span class={`rounded-pill px-2 py-1 text-[11px] font-medium ${packTierClasses(pack.tier)}`}>
										{pack.tier === 'premium' ? 'Premium' : 'Free'}
									</span>
								</div>
								<p class="mt-2 text-sm leading-relaxed text-ink-tertiary">{pack.description}</p>
							</div>
							<Package2 class="mt-0.5 h-5 w-5 text-accent" />
						</div>
						<div class="mt-4 flex flex-wrap gap-2">
							{#each pack.presets as preset}
								<span class="rounded-pill border border-border bg-surface-0 px-2.5 py-1 text-xs text-ink-secondary">
									{preset.name}
								</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="border-b border-border-soft py-18">
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<div class="grid gap-10 lg:grid-cols-2">
				<div id="atmosphere-packs">
					<div class="flex items-center gap-2">
						<Waves class="h-5 w-5 text-accent" />
						<h2 class="font-display text-3xl font-bold text-ink">Atmosphere Packs</h2>
					</div>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						Rainy rooms, city glow, quiet mornings, and stranger interior scenes that extend the cozy side of the library.
					</p>
					<div class="mt-6 grid gap-4">
						{#each atmospherePacks as pack}
							<div class="rounded-card border border-border-soft bg-surface-2 p-5">
								<div class="flex items-center justify-between gap-3">
									<h3 class="font-semibold text-ink">{pack.name}</h3>
									<span class="text-xs text-ink-muted">{pack.presets.length} presets</span>
								</div>
								<p class="mt-2 text-sm text-ink-tertiary">{pack.description}</p>
							</div>
						{/each}
					</div>
				</div>

				<div id="experimental-packs">
					<div class="flex items-center gap-2">
						<Sparkles class="h-5 w-5 text-accent" />
						<h2 class="font-display text-3xl font-bold text-ink">Experimental Packs</h2>
					</div>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						More stylized degradation, submerged color, digital decay, and dream-state processing for listeners who want stranger textures.
					</p>
					<div class="mt-6 grid gap-4">
						{#each experimentalPacks as pack}
							<div class="rounded-card border border-border-soft bg-surface-2 p-5">
								<div class="flex items-center justify-between gap-3">
									<h3 class="font-semibold text-ink">{pack.name}</h3>
									<span class="text-xs text-ink-muted">{pack.presets.length} presets</span>
								</div>
								<p class="mt-2 text-sm text-ink-tertiary">{pack.description}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="all-packs" class="border-b border-border-soft py-18">
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<div class="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Catalog</p>
					<h2 class="mt-2 font-display text-3xl font-bold text-ink">All Hosted Packs</h2>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						The full current pack shelf, including free starters, atmosphere collections, and more
						experimental premium sets.
					</p>
				</div>
				<p class="text-sm text-ink-muted">{packs.length} packs</p>
			</div>

			<div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each allPacks as pack}
					<div class="rounded-card border border-border-soft bg-surface-2 p-5">
						<div class="flex items-start justify-between gap-3">
							<div>
								<div class="flex flex-wrap items-center gap-2">
									<h3 class="font-semibold text-ink">{pack.name}</h3>
									<span class={`rounded-pill px-2 py-1 text-[11px] font-medium ${packTierClasses(pack.tier)}`}>
										{pack.tier === 'premium' ? 'Premium' : 'Free'}
									</span>
									{#if pack.featured}
										<span class="rounded-pill bg-accent-soft px-2 py-1 text-[11px] font-medium text-accent">
											Featured
										</span>
									{/if}
								</div>
								<p class="mt-2 text-sm leading-relaxed text-ink-tertiary">{pack.description}</p>
							</div>
							<span class="text-xs text-ink-muted">{pack.presets.length} presets</span>
						</div>
						<div class="mt-4 flex flex-wrap gap-2">
							{#each pack.presets as preset}
								<span class="rounded-pill border border-border bg-surface-0 px-2.5 py-1 text-xs text-ink-secondary">
									{preset.name}
								</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section id="all-presets" class="py-18">
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<div class="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Everything</p>
					<h2 class="mt-2 font-display text-3xl font-bold text-ink">All Built-In Presets</h2>
					<p class="mt-3 max-w-2xl text-ink-tertiary">
						The full current built-in catalog, from subtle everyday presets to rooms, distance, nostalgia, and more degraded color.
					</p>
				</div>
				<p class="text-sm text-ink-muted">{presets.length} presets</p>
			</div>

			<div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each presets as preset}
					<div class="rounded-card border border-border-soft bg-surface-2 p-5">
						<div class="flex items-start justify-between gap-3">
							<div>
								<h3 class="font-semibold text-ink">{preset.name}</h3>
								<p class="mt-1 text-xs text-ink-muted">{activeEffectCount(preset.settings)} active effects</p>
							</div>
							{#if featuredPresetIds.has(preset.id)}
								<span class="rounded-pill bg-accent-soft px-2 py-1 text-[11px] font-medium text-accent">Featured</span>
							{:else}
								<span class="rounded-pill border border-border bg-surface-0 px-2 py-1 text-[11px] font-medium text-ink-secondary">
									{freePresetIds.has(preset.id) ? 'Free' : 'Built-in'}
								</span>
							{/if}
						</div>
						<p class="mt-3 text-sm leading-relaxed text-ink-tertiary">{preset.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}
