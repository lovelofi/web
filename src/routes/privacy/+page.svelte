<svelte:head>
	<title>Privacy Policy — LoveLofi</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
	<h1 class="font-display text-3xl font-bold text-ink sm:text-4xl">Privacy Policy</h1>
	<p class="mt-2 text-sm text-ink-muted">Last updated: March 2026</p>

	<div class="mt-10 space-y-8 text-sm leading-relaxed text-ink-secondary">
		<section>
			<h2 class="text-lg font-semibold text-ink">Overview</h2>
			<p class="mt-2">
				LoveLofi is a browser extension that processes audio locally on your device. We are
				committed to protecting your privacy and being transparent about what data we collect.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold text-ink">Data We Collect</h2>
			<h3 class="mt-3 font-medium text-ink">License Data</h3>
			<p class="mt-1">
				If you purchase a premium license, we store your license key in
				<code class="rounded bg-surface-1 px-1">chrome.storage.sync</code> so it syncs across
				your browser profiles. License keys are validated against the Polar.sh API.
			</p>

			<h3 class="mt-4 font-medium text-ink">User Preferences</h3>
			<p class="mt-1">
				Your theme selection, custom presets, custom stations, favorite stations, and keyboard
				shortcut bindings are stored locally in
				<code class="rounded bg-surface-1 px-1">chrome.storage.sync</code>. This data never
				leaves your browser's sync storage.
			</p>

			<h3 class="mt-4 font-medium text-ink">Audio Data</h3>
			<p class="mt-1">
				All audio processing happens entirely on your device using the Web Audio API. Audio
				streams are processed in real-time and are never recorded, stored, or transmitted to any
				server. Tab audio capture (premium feature) processes audio locally in an offscreen
				document.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold text-ink">Data We Do NOT Collect</h2>
			<ul class="mt-2 list-disc space-y-1 pl-6">
				<li>Browsing history or URLs you visit</li>
				<li>Audio content (we never record or transmit audio)</li>
				<li>Personal information beyond your license key</li>
				<li>Analytics or tracking data</li>
				<li>Cookies on websites you visit</li>
			</ul>
		</section>

		<section>
			<h2 class="text-lg font-semibold text-ink">Permissions</h2>
			<p class="mt-2">LoveLofi requests the following browser permissions:</p>
			<ul class="mt-2 list-disc space-y-1 pl-6">
				<li><strong>tabs</strong> — To display tab information and capture tab audio</li>
				<li><strong>tabCapture</strong> — To capture audio from browser tabs (premium)</li>
				<li><strong>storage</strong> — To save your preferences and license key</li>
				<li><strong>offscreen</strong> — To run audio processing (required by Manifest V3)</li>
				<li><strong>activeTab</strong> — To interact with the current tab for audio capture</li>
				<li><strong>alarms</strong> — For periodic license validation and sleep timer</li>
				<li><strong>scripting</strong> — To inject the mini-player into web pages</li>
			</ul>
		</section>

		<section>
			<h2 class="text-lg font-semibold text-ink">Third-Party Services</h2>
			<p class="mt-2">
				<strong>Polar.sh</strong> — Used for license key validation and payment processing.
				When validating your license, we send only your license key to Polar.sh's API. See
				<a href="https://polar.sh/legal/privacy" class="text-accent hover:underline" target="_blank" rel="noopener">Polar.sh's Privacy Policy</a>.
			</p>
			<p class="mt-2">
				<strong>Radio streams</strong> — When you play a radio station, your browser connects
				directly to the stream URL (Icecast/Shoutcast). LoveLofi does not proxy these
				connections.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold text-ink">Data Retention</h2>
			<p class="mt-2">
				All user data is stored in your browser's sync storage and persists until you uninstall
				the extension or clear your browser data. We do not maintain any server-side database of
				user data.
			</p>
		</section>

		<section>
			<h2 class="text-lg font-semibold text-ink">Contact</h2>
			<p class="mt-2">
				If you have questions about this privacy policy, please reach out via our
				<a href="https://discord.gg/lovelofi" class="text-accent hover:underline">Discord server</a>.
			</p>
		</section>
	</div>
</div>
