<script lang="ts">
	import { onMount } from 'svelte';
	import { GITHUB_RELEASES_URL, DESKTOP_DOWNLOAD_BASE, CHROME_STORE_URL, FIREFOX_STORE_URL } from '$lib/constants';
	import Monitor from 'lucide-svelte/icons/monitor';
	import Apple from 'lucide-svelte/icons/apple';
	import Download from 'lucide-svelte/icons/download';
	import ExternalLink from 'lucide-svelte/icons/external-link';

	type Platform = 'macos-arm' | 'macos-intel' | 'windows' | 'linux' | 'unknown';

	const downloads = [
		{
			id: 'macos-arm' as Platform,
			label: 'macOS (Apple Silicon)',
			description: 'For M1, M2, M3, M4 Macs',
			file: 'LoveLofi_aarch64.dmg',
			requirement: 'macOS 14.2+',
		},
		{
			id: 'macos-intel' as Platform,
			label: 'macOS (Intel)',
			description: 'For older Intel-based Macs',
			file: 'LoveLofi_x64.dmg',
			requirement: 'macOS 14.2+',
		},
		{
			id: 'windows' as Platform,
			label: 'Windows',
			description: 'Installer (.msi)',
			file: 'LoveLofi_x64_en-US.msi',
			requirement: 'Windows 10+',
		},
		{
			id: 'linux' as Platform,
			label: 'Linux (AppImage)',
			description: 'Universal Linux package',
			file: 'LoveLofi_amd64.AppImage',
			requirement: 'Ubuntu 22.04+',
		},
		{
			id: 'linux' as Platform,
			label: 'Linux (Debian)',
			description: '.deb package',
			file: 'LoveLofi_amd64.deb',
			requirement: 'Debian/Ubuntu',
		},
	];

	let detectedPlatform = $state<Platform>('unknown');

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		const platform = navigator.platform?.toLowerCase() ?? '';

		if (platform.includes('mac') || ua.includes('macintosh')) {
			// Check for Apple Silicon vs Intel
			// navigator.platform is 'MacIntel' even on Apple Silicon in some browsers
			// Use GPU renderer as a heuristic
			const canvas = document.createElement('canvas');
			const gl = canvas.getContext('webgl');
			const renderer = gl?.getParameter(gl.RENDERER)?.toLowerCase() ?? '';
			detectedPlatform = renderer.includes('apple') ? 'macos-arm' : 'macos-intel';
		} else if (platform.includes('win') || ua.includes('windows')) {
			detectedPlatform = 'windows';
		} else if (platform.includes('linux') || ua.includes('linux')) {
			detectedPlatform = 'linux';
		}
	});

	function getDownloadUrl(file: string): string {
		return `${DESKTOP_DOWNLOAD_BASE}/${file}`;
	}

	let primaryDownload = $derived(
		downloads.find((d) => d.id === detectedPlatform) ?? downloads[0]
	);
</script>

<svelte:head>
	<title>Download LoveLofi Desktop</title>
	<meta name="description" content="Download LoveLofi for macOS, Windows, or Linux. Lo-fi radio, real-time audio effects, and system audio capture — right from your menu bar." />
</svelte:head>

<div class="min-h-screen bg-surface-0">
	<div class="max-w-2xl mx-auto px-6 py-16">
		<!-- Header -->
		<div class="text-center mb-12">
			<div class="w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-4">
				<Monitor size={32} class="text-accent" />
			</div>
			<h1 class="text-3xl font-bold text-ink mb-2">Download LoveLofi</h1>
			<p class="text-ink-secondary text-lg">
				Lo-fi radio, real-time audio effects, and system audio capture — right from your menu bar.
			</p>
		</div>

		<!-- Primary download -->
		<div class="mb-8">
			<a
				href={getDownloadUrl(primaryDownload.file)}
				class="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-accent text-white font-semibold text-lg
					hover:bg-accent/90 transition-colors shadow-lg"
			>
				<Download size={22} />
				Download for {primaryDownload.label}
			</a>
			<p class="text-center text-sm text-ink-tertiary mt-2">
				Requires {primaryDownload.requirement} · v0.1.0
			</p>
		</div>

		<!-- All platforms -->
		<div class="mb-12">
			<h2 class="text-sm font-semibold text-ink-tertiary uppercase tracking-wider mb-3">All platforms</h2>
			<div class="grid gap-2">
				{#each downloads as download}
					<a
						href={getDownloadUrl(download.file)}
						class="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-border-soft bg-surface-1
							hover:border-border hover:bg-surface-2 transition-colors"
					>
						<div>
							<p class="text-sm font-medium text-ink">{download.label}</p>
							<p class="text-xs text-ink-tertiary">{download.description} · {download.requirement}</p>
						</div>
						<Download size={16} class="text-ink-tertiary shrink-0" />
					</a>
				{/each}
			</div>
		</div>

		<!-- What's included -->
		<div class="mb-12">
			<h2 class="text-sm font-semibold text-ink-tertiary uppercase tracking-wider mb-3">Desktop features</h2>
			<div class="grid grid-cols-2 gap-3">
				{#each [
					{ title: 'System Audio Capture', desc: 'Apply lo-fi effects to any app\'s audio' },
					{ title: 'Menu Bar App', desc: 'Always accessible from the system tray' },
					{ title: '38 Curated Stations', desc: 'Lo-fi hip-hop, chillhop, jazz, ambient' },
					{ title: '12 Real-time Effects', desc: 'Low-pass, reverb, vinyl crackle & more' },
					{ title: 'Global Shortcuts', desc: 'Control playback from any app' },
					{ title: 'Auto Updates', desc: 'Always on the latest version' },
				] as feature}
					<div class="px-3 py-2 rounded-lg bg-surface-1 border border-border-soft">
						<p class="text-xs font-semibold text-ink">{feature.title}</p>
						<p class="text-[11px] text-ink-tertiary">{feature.desc}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Also available as extension -->
		<div class="text-center border-t border-border pt-8">
			<p class="text-sm text-ink-secondary mb-3">Also available as a browser extension</p>
			<div class="flex items-center justify-center gap-3">
				<a
					href={CHROME_STORE_URL}
					class="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-soft bg-surface-1
						text-sm text-ink-secondary hover:text-ink hover:bg-surface-2 transition-colors"
				>
					Chrome
					<ExternalLink size={12} />
				</a>
				<a
					href={FIREFOX_STORE_URL}
					class="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-soft bg-surface-1
						text-sm text-ink-secondary hover:text-ink hover:bg-surface-2 transition-colors"
				>
					Firefox
					<ExternalLink size={12} />
				</a>
			</div>
		</div>

		<!-- GitHub -->
		<div class="text-center mt-6">
			<a
				href={GITHUB_RELEASES_URL}
				class="text-xs text-ink-tertiary hover:text-accent transition-colors"
			>
				View all releases on GitHub →
			</a>
		</div>
	</div>
</div>
