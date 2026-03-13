<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getThemeState } from '$lib/theme.svelte';
	import { onMount } from 'svelte';

	const theme = getThemeState();

	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head>
	<meta
		name="description"
		content="LoveLofi — Real-time lo-fi audio effects for your browser. Turn any music into a cozy listening experience with vinyl warmth, reverb, tape saturation, and more."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Nav />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
