<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { getThemeState, THEMES, type ThemeId } from '$lib/theme.svelte';

	const theme = getThemeState();

	let open = $state(false);

	function select(id: ThemeId) {
		theme.set(id);
		open = false;
	}
</script>

<div class="relative">
	<button
		onclick={() => (open = !open)}
		class="rounded-button p-2 text-ink-secondary transition-colors hover:bg-surface-1 hover:text-ink"
		aria-label="Switch theme"
	>
		{#if theme.isDark}
			<Moon class="h-4 w-4" />
		{:else}
			<Sun class="h-4 w-4" />
		{/if}
	</button>

	{#if open}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			class="absolute right-0 top-full mt-2 w-44 rounded-card border border-border bg-surface-0 p-1 shadow-lg"
			role="menu"
			onmouseleave={() => (open = false)}
		>
			{#each THEMES as t}
				<button
					class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors {t.id ===
					theme.current
						? 'bg-accent-soft text-accent'
						: 'text-ink-secondary hover:bg-surface-1 hover:text-ink'}"
					onclick={() => select(t.id)}
					role="menuitem"
				>
					{#if t.isDark}
						<Moon class="h-3.5 w-3.5" />
					{:else}
						<Sun class="h-3.5 w-3.5" />
					{/if}
					{t.name}
				</button>
			{/each}
		</div>
	{/if}
</div>
