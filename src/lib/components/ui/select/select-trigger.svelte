<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		children?: Snippet;
		class?: string;
		ref?: HTMLButtonElement | null;
	}

	let { children, class: className, ref = $bindable(null), ...restProps }: Props = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		'flex h-11 w-full items-center justify-between rounded-card border border-border bg-surface-0 px-3.5 py-2.5',
		'text-sm text-ink',
		'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'transition-colors',
		className
	)}
	{...restProps}
>
	<div class="min-w-0 flex-1 text-left">
		{#if children}
			{@render children()}
		{/if}
	</div>
	<ChevronDown size={16} class="ml-2 shrink-0 text-ink-muted" />
</SelectPrimitive.Trigger>
