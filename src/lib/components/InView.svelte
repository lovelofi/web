<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLDivElement | undefined = $state();
	let visible = $state(false);

	let {
		class: className = '',
		threshold = 0.15,
		once = true,
		children,
	} = $props();

	onMount(() => {
		if (!el) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) {
			visible = true;
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					if (once) observer.disconnect();
				}
			},
			{ threshold }
		);

		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div bind:this={el} class="{className} fade-up{visible ? ' in-view' : ''}">
	{@render children()}
</div>
