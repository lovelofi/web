<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import Check from 'lucide-svelte/icons/check';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		value: string;
		label?: string;
		disabled?: boolean;
		children?: Snippet;
		class?: string;
	}

	let { value, label, disabled = false, children, class: className, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Item
	{value}
	{label}
	{disabled}
	class={cn(
		'group relative flex w-full cursor-pointer select-none items-center rounded-button py-2 pl-8 pr-3',
		'text-sm text-ink outline-none',
		'data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...restProps}
>
	<span class="absolute left-2.5 flex h-4 w-4 items-center justify-center invisible group-data-[state=checked]:visible">
		<Check size={14} class="text-accent" />
	</span>
	{#if children}
		{@render children()}
	{:else}
		{label ?? value}
	{/if}
</SelectPrimitive.Item>
