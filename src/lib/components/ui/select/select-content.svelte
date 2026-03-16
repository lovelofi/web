<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		children?: Snippet;
		class?: string;
		sideOffset?: number;
		side?: 'top' | 'bottom' | 'left' | 'right';
	}

	let { children, class: className, sideOffset = 6, side = 'bottom', ...restProps }: Props = $props();
</script>

<SelectPrimitive.Portal>
	<SelectPrimitive.Content
		{side}
		{sideOffset}
		class={cn(
			'relative z-50 min-w-(--bits-select-anchor-width) overflow-hidden rounded-card border border-border bg-surface-0 shadow-lg',
			'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
			'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
			className
		)}
		{...restProps}
	>
		<SelectPrimitive.Viewport class="max-h-72 p-1.5">
			{#if children}
				{@render children()}
			{/if}
		</SelectPrimitive.Viewport>
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>
