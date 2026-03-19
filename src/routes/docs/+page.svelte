<script lang="ts">
	import { Radio, Headphones, Sliders, Disc3, Keyboard, Palette, Settings, Download } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Documentation — LoveLofi</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6">
	<h1 class="font-display text-3xl font-bold text-ink sm:text-4xl">Documentation</h1>
	<p class="mt-3 text-ink-tertiary">Everything you need to get the most out of LoveLofi.</p>

	<div class="prose mt-12 space-y-12">
		<!-- Getting Started -->
		<section id="getting-started">
			<div class="flex items-center gap-3">
				<Download class="h-6 w-6 text-accent" />
				<h2 class="font-display text-2xl font-bold text-ink">Getting Started</h2>
			</div>
			<div class="mt-4 space-y-4 text-sm text-ink-secondary">
				<p>
					Install LoveLofi from the <a href="https://chromewebstore.google.com" class="text-accent hover:underline">Chrome Web Store</a> or
					<a href="https://addons.mozilla.org" class="text-accent hover:underline">Firefox Add-ons</a>.
					After installing, click the extension icon in your toolbar to open the popup player.
				</p>
				<ol class="list-decimal space-y-2 pl-6">
					<li>Click the LoveLofi icon in your browser toolbar</li>
					<li>Choose a radio station from the station list</li>
					<li>Press play — you're listening to lo-fi radio!</li>
					<li>Explore presets or tweak individual effects</li>
				</ol>
			</div>
		</section>

		<!-- Radio -->
		<section id="radio">
			<div class="flex items-center gap-3">
				<Radio class="h-6 w-6 text-accent" />
				<h2 class="font-display text-2xl font-bold text-ink">Radio Stations</h2>
			</div>
			<div class="mt-4 space-y-4 text-sm text-ink-secondary">
				<p>
					LoveLofi includes 30 built-in radio stations tuned toward lo-fi, chillhop, ambient,
					lounge, synthwave, and late-night focus listening.
				</p>
				<p>
					<strong>Free tier:</strong> 6 curated stations.<br />
					<strong>Premium:</strong> Full station library + up to 10 custom stations via direct Icecast/Shoutcast URLs.
				</p>
				<p>
					The built-in station catalog can also be refreshed remotely, which lets LoveLofi replace dead streams and improve the lineup without waiting for a browser store release.
				</p>
				<h3 class="mt-6 font-semibold text-ink">Adding Custom Stations</h3>
				<p>
					Premium users can add custom stations by providing a direct stream URL (Icecast or Shoutcast format).
					Navigate to the station list, click "Add Custom Station", and enter your stream URL and station name.
				</p>
			</div>
		</section>

		<!-- Effects -->
		<section id="effects">
			<div class="flex items-center gap-3">
				<Sliders class="h-6 w-6 text-accent" />
				<h2 class="font-display text-2xl font-bold text-ink">Audio Effects</h2>
			</div>
			<div class="mt-4 space-y-4 text-sm text-ink-secondary">
				<p>
					LoveLofi processes audio through a chain of 12 real-time effects using the Web Audio API.
					Each effect has an enable toggle and an intensity slider (0-100%).
				</p>

				<h3 class="mt-6 font-semibold text-ink">Free Effects</h3>
				<ul class="list-disc space-y-1 pl-6">
					<li><strong>Low-Pass Filter</strong> — Rolls off high frequencies for warmth. Higher intensity = more muffled.</li>
					<li><strong>Reverb</strong> — Adds room ambience using a synthetic impulse response.</li>
				</ul>

				<h3 class="mt-6 font-semibold text-ink">Premium Effects</h3>
				<ul class="list-disc space-y-1 pl-6">
					<li><strong>High-Pass Filter</strong> — Cuts low frequencies for a thinner, "through the wall" sound.</li>
					<li><strong>Tape Saturation</strong> — Adds warm analog-style harmonic distortion.</li>
					<li><strong>Bitcrusher</strong> — Reduces bit depth for retro digital crunch.</li>
					<li><strong>Chorus</strong> — Gentle pitch modulation for shimmer and width.</li>
					<li><strong>Vinyl Crackle</strong> — Adds vinyl surface noise (mixes in parallel).</li>
					<li><strong>Pitch Wobble</strong> — Simulates tape wow and flutter.</li>
					<li><strong>Stereo Drift</strong> — Subtle stereo field movement.</li>
					<li><strong>Dropout</strong> — Random brief volume dips, like worn tape.</li>
					<li><strong>Slowdown</strong> — Simulates slowing/dying tape speed.</li>
					<li><strong>Vocal Cut</strong> — Attenuates center-panned vocals.</li>
				</ul>

				<h3 class="mt-6 font-semibold text-ink">Effects Chain Order</h3>
				<p>
					Effects are processed in a fixed chain:
					Low-Pass → High-Pass → Vocal Cut → Tape Saturation → Bitcrusher → Reverb → Chorus
					→ Pitch Wobble → Stereo Drift → Dropout → Slowdown → Output.
					Vinyl Crackle mixes into the output in parallel.
				</p>
			</div>
		</section>

		<!-- Presets -->
		<section id="presets">
			<div class="flex items-center gap-3">
				<Disc3 class="h-6 w-6 text-accent" />
				<h2 class="font-display text-2xl font-bold text-ink">Presets</h2>
			</div>
			<div class="mt-4 space-y-4 text-sm text-ink-secondary">
				<p>
					Presets are pre-configured effect combinations that instantly set a mood. LoveLofi includes
					27 built-in presets across subtle, tape, vinyl, room, dreamy, degraded, and atmospheric
					categories.
				</p>
				<p>
					<strong>Free tier:</strong> 4 presets — Classic Lo-Fi, Late Night Study, Rainy Cafe, Dreamy.<br />
					<strong>Premium:</strong> All 27 presets + save up to 20 custom presets.
				</p>
				<p>
					LoveLofi also suggests a preset based on the time of day: Dreamy in the morning,
					Rainy Cafe in the afternoon, Late Night Study in the evening, and Old Cassette late at night.
				</p>
			</div>
		</section>

		<!-- Tab Audio -->
		<section id="tab-audio">
			<div class="flex items-center gap-3">
				<Headphones class="h-6 w-6 text-accent" />
				<h2 class="font-display text-2xl font-bold text-ink">Tab Audio Mode</h2>
			</div>
			<div class="mt-4 space-y-4 text-sm text-ink-secondary">
				<p>
					Tab Audio is a premium feature that captures audio from any browser tab and routes it
					through the LoveLofi effects chain. Listen to Spotify, YouTube, SoundCloud, or any
					website with lo-fi effects applied in real-time.
				</p>
				<ol class="list-decimal space-y-2 pl-6">
					<li>Open the LoveLofi popup and switch to the "Tab Audio" tab</li>
					<li>Click "Capture Tab Audio" — the current tab's audio will be captured</li>
					<li>Apply presets or tweak effects as usual</li>
					<li>Click "Stop Capture" when done</li>
				</ol>
				<p class="text-xs text-ink-muted">
					Note: Tab capture uses the <code>tabCapture</code> permission and runs through an
					offscreen document as required by Manifest V3.
				</p>
			</div>
		</section>

		<!-- Keyboard Shortcuts -->
		<section id="shortcuts">
			<div class="flex items-center gap-3">
				<Keyboard class="h-6 w-6 text-accent" />
				<h2 class="font-display text-2xl font-bold text-ink">Keyboard Shortcuts</h2>
			</div>
			<div class="mt-4 space-y-4 text-sm text-ink-secondary">
				<p>Premium users can control playback without opening the popup.</p>
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr class="border-b border-border text-xs font-semibold uppercase tracking-wider text-ink-muted">
								<th class="py-2 pr-4">Action</th>
								<th class="py-2">Default Shortcut</th>
							</tr>
						</thead>
						<tbody class="text-ink-secondary">
							<tr class="border-b border-border-soft"><td class="py-2 pr-4">Play / Pause</td><td><kbd class="rounded bg-surface-1 px-2 py-0.5 text-xs">Space</kbd></td></tr>
							<tr class="border-b border-border-soft"><td class="py-2 pr-4">Next Station</td><td><kbd class="rounded bg-surface-1 px-2 py-0.5 text-xs">→</kbd></td></tr>
							<tr class="border-b border-border-soft"><td class="py-2 pr-4">Previous Station</td><td><kbd class="rounded bg-surface-1 px-2 py-0.5 text-xs">←</kbd></td></tr>
							<tr class="border-b border-border-soft"><td class="py-2 pr-4">Volume Up</td><td><kbd class="rounded bg-surface-1 px-2 py-0.5 text-xs">↑</kbd></td></tr>
							<tr class="border-b border-border-soft"><td class="py-2 pr-4">Volume Down</td><td><kbd class="rounded bg-surface-1 px-2 py-0.5 text-xs">↓</kbd></td></tr>
							<tr><td class="py-2 pr-4">Toggle Mute</td><td><kbd class="rounded bg-surface-1 px-2 py-0.5 text-xs">M</kbd></td></tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>

		<!-- Themes -->
		<section id="themes">
			<div class="flex items-center gap-3">
				<Palette class="h-6 w-6 text-accent" />
				<h2 class="font-display text-2xl font-bold text-ink">Themes</h2>
			</div>
			<div class="mt-4 space-y-4 text-sm text-ink-secondary">
				<p>
					LoveLofi includes 16 themes organized as 8 light/dark pairs:
				</p>
				<ul class="list-disc space-y-1 pl-6">
					<li>Cafe Nocturne / Cafe Eclipse</li>
					<li>Midnight Session / Morning Session</li>
					<li>Sakura Study / Sakura Night</li>
					<li>Vinyl Noir / Ivory Brass</li>
					<li>Forest Cabin / Forest Night</li>
					<li>Ocean Drift / Coastal Breeze</li>
					<li>Lavender Haze / Lavender Dusk</li>
					<li>Neon Tokyo / Neon Dawn</li>
				</ul>
				<p>
					All 16 themes are included for everyone. Premium does not lock themes.
				</p>
			</div>
		</section>

		<!-- License -->
		<section id="license">
			<div class="flex items-center gap-3">
				<Settings class="h-6 w-6 text-accent" />
				<h2 class="font-display text-2xl font-bold text-ink">License & Account</h2>
			</div>
			<div class="mt-4 space-y-4 text-sm text-ink-secondary">
				<p>
					Premium licenses are managed through Polar.sh. After purchase, you'll receive a license
					key that you can activate in the extension settings.
				</p>
				<ul class="list-disc space-y-1 pl-6">
					<li>License keys sync across all Chrome profiles via <code>chrome.storage.sync</code></li>
					<li>Validation happens weekly with a 7-day grace period if you're offline</li>
					<li>Monthly and annual plans can be cancelled anytime through your Polar.sh dashboard</li>
					<li>Lifetime purchases include all future updates at no additional cost</li>
				</ul>
			</div>
		</section>
	</div>

	<!-- Sidebar navigation (sticky on desktop) -->
	<nav class="fixed right-8 top-24 hidden w-48 xl:block">
		<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">On this page</p>
		<ul class="space-y-2 text-sm">
			{#each [
				['getting-started', 'Getting Started'],
				['radio', 'Radio Stations'],
				['effects', 'Audio Effects'],
				['presets', 'Presets'],
				['tab-audio', 'Tab Audio Mode'],
				['shortcuts', 'Keyboard Shortcuts'],
				['themes', 'Themes'],
				['license', 'License & Account'],
			] as [id, label]}
				<li>
					<a href="#{id}" class="text-ink-tertiary transition-colors hover:text-accent">{label}</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>
