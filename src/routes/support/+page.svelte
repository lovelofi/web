<script lang="ts">
	import { ArrowRight, CheckCircle2, LifeBuoy, LoaderCircle, MessageCircleMore } from 'lucide-svelte';
	import { page } from '$app/state';
	import { DISCORD_URL } from '$lib/constants';
	import * as Select from '$lib/components/ui/select';

	const supportReasons = [
		'Billing and licenses',
		'Bug report',
		'Feature request',
		'Extension setup help',
		'Account or purchase issue',
		'General question'
	] as const;

	let supportReason = $state<(typeof supportReasons)[number] | ''>('');
	let subject = $state('');
	let email = $state('');
	let message = $state('');
	let honeypot = $state('');
	let submitState = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let submitMessage = $state('');

	const source = $derived(page.url.searchParams.get('source') ?? 'web-support');
	const browserName = $derived(page.url.searchParams.get('browser') ?? '');
	const pageUrl = $derived(page.url.href);

	async function submitSupportRequest() {
		submitState = 'submitting';
		submitMessage = '';

		try {
			const response = await fetch('/api/support', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					source,
					browser: browserName,
					supportReason,
					subject,
					email,
					message,
					pageUrl,
					honeypot
				})
			});

			const result = (await response.json().catch(() => null)) as
				| { ok?: boolean; error?: string }
				| null;

			if (response.ok && result?.ok) {
				submitState = 'success';
				submitMessage = 'Your support message was sent. We will reply by email.';
				return;
			}

			submitState = 'error';
			submitMessage = result?.error ?? 'Something went wrong while sending your support request.';
		} catch {
			submitState = 'error';
			submitMessage = 'Unable to reach support right now. Please try again in a moment.';
		}
	}
</script>

<svelte:head>
	<title>Support — LoveLofi</title>
	<meta name="description" content="Get help with LoveLofi — billing, bug reports, feature requests, setup, and general questions. We typically reply within 24 hours." />
</svelte:head>

<section class="relative overflow-hidden py-16 sm:py-24">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 opacity-80"
		style="background:
			radial-gradient(circle at 20% 0%, var(--accent-soft) 0%, transparent 45%),
			radial-gradient(circle at 80% 10%, var(--surface-1) 0%, transparent 40%)"
	></div>

	<div class="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
		<div class="space-y-6">
			<div
				class="inline-flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-4 py-1.5 text-sm text-ink-secondary"
			>
				<LifeBuoy class="h-4 w-4 text-accent" />
				Support
			</div>

			<div>
				<h1 class="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
					Need help with LoveLofi?
				</h1>
				<p class="mt-4 max-w-xl text-lg text-ink-secondary">
					Send a support request and it will land in the same LoveLofi inbox we use for uninstall
					feedback. Pick a reason and we will use that as the email subject unless you write your own.
				</p>
			</div>

			<div class="rounded-card border border-border-soft bg-surface-2 p-6" style="box-shadow: var(--shadow-card)">
				<h2 class="text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted">
					Fastest paths
				</h2>
				<div class="mt-4 space-y-3 text-sm text-ink-tertiary">
					<p>If it is a billing or license issue, include the email you purchased with.</p>
					<p>If it is a bug report, tell us the browser, page, and what you expected to happen.</p>
					<p>
						If you prefer community help, you can also ask in
						<a href={DISCORD_URL} target="_blank" rel="noopener" class="text-accent hover:underline">
							Discord
						</a>.
					</p>
				</div>
			</div>
		</div>

		<div
			class="rounded-[24px] border border-border-soft bg-surface-2 p-6 sm:p-8"
			style="box-shadow: var(--shadow-card)"
		>
			<form
				class="space-y-8"
				onsubmit={(event) => {
					event.preventDefault();
					void submitSupportRequest();
				}}
			>
				<div>
					<p class="text-sm font-semibold text-ink">What do you need help with?</p>
					<div class="mt-3">
						<Select.Root
							type="single"
							value={supportReason || undefined}
							onValueChange={(value) => {
								supportReason = (value as (typeof supportReasons)[number] | undefined) ?? '';
								if (!subject.trim() && supportReason) {
									subject = supportReason;
								}
							}}
						>
							<Select.Trigger>
								{#if supportReason}
									{supportReason}
								{:else}
									<span class="text-ink-muted">Select a support topic</span>
								{/if}
							</Select.Trigger>
							<Select.Content>
								{#each supportReasons as reason}
									<Select.Item value={reason} label={reason}>
										{reason}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>

				<div>
					<label class="text-sm font-semibold text-ink" for="support-subject">Subject</label>
					<input
						id="support-subject"
						bind:value={subject}
						type="text"
						class="mt-3 w-full rounded-card border border-border bg-surface-0 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
						placeholder="Short summary of your issue"
					/>
				</div>

				<div>
					<label class="text-sm font-semibold text-ink" for="support-email">Your email</label>
					<input
						id="support-email"
						bind:value={email}
						type="email"
						class="mt-3 w-full rounded-card border border-border bg-surface-0 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<label class="text-sm font-semibold text-ink" for="support-message">How can we help?</label>
					<textarea
						id="support-message"
						bind:value={message}
						rows="8"
						class="mt-3 w-full rounded-card border border-border bg-surface-0 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
						placeholder="Tell us what happened, what you expected, and anything else that would help us troubleshoot."
					></textarea>
				</div>

				<div class="hidden" aria-hidden="true">
					<label for="support-company">Company</label>
					<input
						id="support-company"
						bind:value={honeypot}
						type="text"
						tabindex="-1"
						autocomplete="off"
					/>
				</div>

				<div class="flex flex-col gap-3 sm:flex-row">
					<button
						type="submit"
						class="inline-flex items-center justify-center gap-2 rounded-button bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
						disabled={submitState === 'submitting'}
					>
						{#if submitState === 'submitting'}
							<LoaderCircle class="h-4 w-4 animate-spin" />
							Sending...
						{:else if submitState === 'success'}
							<CheckCircle2 class="h-4 w-4" />
							Sent
						{:else}
							<ArrowRight class="h-4 w-4" />
							Send Support Request
						{/if}
					</button>
					<a
						href={DISCORD_URL}
						target="_blank"
						rel="noopener"
						class="inline-flex items-center justify-center gap-2 rounded-button border border-border px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-1"
					>
						<MessageCircleMore class="h-4 w-4" />
						Ask in Discord
					</a>
				</div>

				{#if submitMessage}
					<p
						class:text-success={submitState === 'success'}
						class:text-error={submitState === 'error'}
						class:text-ink-tertiary={submitState === 'idle' || submitState === 'submitting'}
						class="text-sm"
					>
						{submitMessage}
					</p>
				{/if}
			</form>
		</div>
	</div>
</section>
