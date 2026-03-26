<script lang="ts">
	import { Radio, Heart } from 'lucide-svelte';
	import { CHROME_STORE_URL, DISCORD_URL, SUPPORT_URL } from '$lib/constants';
</script>

<footer class="border-t border-border bg-surface-1">
	<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Brand -->
			<div>
				<a href="/" class="flex items-center gap-2 text-lg font-bold text-ink">
					<Radio class="h-5 w-5 text-accent" />
					<span class="font-display">LoveLofi</span>
				</a>
				<p class="mt-3 text-sm text-ink-tertiary">
					Real-time lo-fi audio effects for your browser. Turn any music into a cozy
					listening experience.
				</p>
			</div>

			<!-- Product -->
			<div>
				<h3 class="mb-3 text-sm font-semibold text-ink">Product</h3>
				<ul class="space-y-2 text-sm text-ink-tertiary">
					<li><a href="/#features" class="hover:text-accent">Features</a></li>
					<li><a href="/#pricing" class="hover:text-accent">Pricing</a></li>
					<li><a href="/#demo" class="hover:text-accent">Demo</a></li>
					<li><a href="/changelog" class="hover:text-accent">Changelog</a></li>
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<h3 class="mb-3 text-sm font-semibold text-ink">Resources</h3>
				<ul class="space-y-2 text-sm text-ink-tertiary">
					<li><a href="/docs" class="hover:text-accent">Documentation</a></li>
					<li><a href={SUPPORT_URL} class="hover:text-accent">Support</a></li>
					<li>
						<a href={DISCORD_URL} target="_blank" rel="noopener" class="hover:text-accent">Discord</a>
					</li>
					<li>
						<a href={CHROME_STORE_URL} target="_blank" rel="noopener" class="hover:text-accent">Chrome Web Store</a>
					</li>
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<h3 class="mb-3 text-sm font-semibold text-ink">Legal</h3>
				<ul class="space-y-2 text-sm text-ink-tertiary">
					<li><a href="/privacy" class="hover:text-accent">Privacy Policy</a></li>
					<li><a href="/terms" class="hover:text-accent">Terms of Service</a></li>
				</ul>
			</div>
		</div>

		<div class="mt-10 flex flex-col items-center gap-2 border-t border-border-soft pt-6 text-center text-sm text-ink-muted sm:flex-row sm:justify-between">
			<p>&copy; {new Date().getFullYear()} LoveLofi. All rights reserved.</p>
			<p class="flex items-center gap-1">
				Made with <Heart class="h-3.5 w-3.5 text-accent" /> for lo-fi lovers
			</p>
		</div>
	</div>
</footer>
