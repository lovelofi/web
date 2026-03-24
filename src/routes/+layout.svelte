<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getThemeState } from '$lib/theme.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const SITE = 'https://lovelofi.app';
	const DEFAULT_TITLE = 'LoveLofi — Lo-Fi Audio Effects for Your Browser & Desktop';
	const DEFAULT_DESC =
		'Real-time lo-fi audio effects for your browser and desktop. Turn any music into a cozy listening experience with vinyl warmth, reverb, tape saturation, and more.';

	const theme = getThemeState();

	let { children } = $props();

	let canonicalUrl = $derived(`${SITE}${$page.url.pathname}`);

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head>
	<meta name="description" content={DEFAULT_DESC} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="LoveLofi" />
	<meta property="og:title" content={DEFAULT_TITLE} />
	<meta property="og:description" content={DEFAULT_DESC} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content="{SITE}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="LoveLofi — Lo-fi audio effects for your browser and desktop" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={DEFAULT_TITLE} />
	<meta name="twitter:description" content={DEFAULT_DESC} />
	<meta name="twitter:image" content="{SITE}/og-image.png" />
	<meta name="twitter:image:alt" content="LoveLofi — Lo-fi audio effects for your browser and desktop" />
</svelte:head>

<!-- Skip to content -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-button focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
>
	Skip to main content
</a>

<div class="flex min-h-screen flex-col">
	<Nav />
	<main id="main-content" class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
