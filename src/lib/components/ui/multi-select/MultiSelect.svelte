<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { cn } from '$lib/utils';

	type Option = {
		label: string;
		value: string;
	};

	interface Props {
		options: Option[];
		value?: string[];
		placeholder?: string;
		class?: string;
	}

	let {
		options,
		value = $bindable([]),
		placeholder = 'Select options',
		class: className
	}: Props = $props();

	let open = $state(false);
	let root = $state<HTMLDivElement | null>(null);

	const selectedLabels = $derived(
		options.filter((option) => value.includes(option.value)).map((option) => option.label)
	);
	const summary = $derived(
		selectedLabels.length === 0
			? placeholder
			: selectedLabels.length <= 2
				? selectedLabels.join(', ')
				: `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}`
	);

	function toggleOption(nextValue: string) {
		value = value.includes(nextValue)
			? value.filter((entry) => entry !== nextValue)
			: [...value, nextValue];
	}

	function handleDocumentClick(event: MouseEvent) {
		if (!open || !root) return;
		if (event.target instanceof Node && !root.contains(event.target)) {
			open = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
		}
	}
</script>

<svelte:document onclick={handleDocumentClick} onkeydown={handleKeydown} />

<div class={cn('relative', className)} bind:this={root}>
	<button
		type="button"
		class={cn(
			'flex h-11 w-full items-center justify-between rounded-card border border-border bg-surface-0 px-3.5 py-2.5 text-left text-sm text-ink transition-colors',
			'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent'
		)}
		onclick={() => (open = !open)}
		aria-haspopup="listbox"
		aria-expanded={open}
	>
		<span class={cn('truncate', selectedLabels.length === 0 && 'text-ink-muted')}>{summary}</span>
		<ChevronDown size={16} class={cn('ml-2 shrink-0 text-ink-muted transition-transform', open && 'rotate-180')} />
	</button>

	{#if open}
		<div
			class="absolute z-50 mt-2 w-full overflow-hidden rounded-card border border-border bg-surface-0 p-1.5 shadow-lg"
			role="listbox"
			aria-multiselectable="true"
		>
			<div class="max-h-64 overflow-y-auto">
				{#each options as option}
					<button
						type="button"
						class={cn(
							'flex w-full items-center gap-3 rounded-button px-3 py-2 text-left text-sm text-ink transition-colors',
							value.includes(option.value) ? 'bg-accent-soft' : 'hover:bg-surface-1'
						)}
						onclick={() => toggleOption(option.value)}
						role="option"
						aria-selected={value.includes(option.value)}
					>
						<span
							class={cn(
								'flex h-4 w-4 items-center justify-center rounded-sm border border-border',
								value.includes(option.value) && 'border-accent bg-accent text-white'
							)}
						>
							{#if value.includes(option.value)}
								<Check size={12} />
							{/if}
						</span>
						<span class="min-w-0 flex-1 truncate">{option.label}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
