<script lang="ts">
	import { ArrowRight, CheckCircle2, LoaderCircle, MessageSquareWarning, RotateCcw } from 'lucide-svelte';
	import { page } from '$app/state';
	import { CHROME_STORE_URL, FIREFOX_STORE_URL } from '$lib/constants';
	import MultiSelect from '$lib/components/ui/multi-select/MultiSelect.svelte';
	import * as Select from '$lib/components/ui/select';

	const installReasons = [
		'Lo-fi radio stations',
		'Tab audio mode',
		'Audio effects and presets',
		'Upload and export',
		'Themes and atmosphere',
		'Keyboard shortcuts'
	] as const;
	const uninstallReasons = [
		'I did not use it enough',
		'It was missing a feature I wanted',
		'Something was broken or confusing',
		'I only needed it temporarily',
		'Pricing was not a fit',
		'I prefer another tool'
	] as const;
	const installReasonOptions = installReasons.map((reason) => ({ label: reason, value: reason }));
	const uninstallReasonOptions = uninstallReasons.map((reason) => ({ label: reason, value: reason }));
	const planOptions = [
		{ label: 'Free only', value: 'free' },
		{ label: 'Monthly', value: 'monthly' },
		{ label: 'Annual', value: 'annual' },
		{ label: 'Lifetime', value: 'lifetime' },
		{ label: 'Not sure', value: 'not-sure' }
	] as const;

	let selectedInstallReasons = $state<string[]>([]);
	let uninstallReason = $state('');
	let feedback = $state('');
	let replyEmail = $state('');
	let planType = $state<'free' | 'monthly' | 'annual' | 'lifetime' | 'not-sure' | ''>('');
	let honeypot = $state('');
	let submitState = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let submitMessage = $state('');

	const source = $derived(page.url.searchParams.get('source') ?? 'extension-uninstall');
	const browserName = $derived(page.url.searchParams.get('browser') ?? '');

	async function submitFeedback() {
		submitState = 'submitting';
		submitMessage = '';
		try {
			const response = await fetch('/api/uninstall-feedback', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					source,
					browser: browserName,
					installReasons: selectedInstallReasons,
					uninstallReason,
					planType,
					replyEmail,
					feedback,
					honeypot
				})
			});

			const result = (await response.json().catch(() => null)) as
				| { ok?: boolean; error?: string }
				| null;

			if (response.ok && result?.ok) {
				submitState = 'success';
				submitMessage = 'Thanks for the feedback. Your message has been sent to LoveLofi.';
				return;
			}

			submitState = 'error';
			submitMessage = result?.error ?? 'Something went wrong while sending your feedback.';
		} catch {
			submitState = 'error';
			submitMessage = 'Unable to reach the feedback endpoint right now. Please try again.';
		}
	}
</script>

<svelte:head>
	<title>Sorry to see you go — LoveLofi</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="relative overflow-hidden py-16 sm:py-24">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 opacity-80"
		style="background:
			radial-gradient(circle at 20% 0%, var(--accent-soft) 0%, transparent 45%),
			radial-gradient(circle at 80% 10%, var(--surface-1) 0%, transparent 40%)"
	></div>

	<div class="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr]">
		<div class="space-y-6">
			<div
				class="inline-flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-4 py-1.5 text-sm text-ink-secondary"
			>
				<MessageSquareWarning class="h-4 w-4 text-accent" />
				Uninstall Feedback
			</div>

			<div>
				<h1 class="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
					Sorry to see you go
				</h1>
			</div>

			<div class="rounded-card border border-border-soft bg-surface-2 p-6" style="box-shadow: var(--shadow-card)">
				<p class="mt-4 max-w-lg text-lg text-ink-secondary">
					If you have thirty seconds, tell us what brought you in and what made you leave. Every
					response goes straight to the LoveLofi inbox and helps shape the next version.
				</p>
			</div>

			<div class="flex flex-wrap gap-3">
				<a
					href={CHROME_STORE_URL}
					class="inline-flex items-center justify-center gap-2 rounded-button border border-border px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-1"
				>
					<RotateCcw class="h-4 w-4" />
					Reinstall for Chrome
				</a>
				<a
					href={FIREFOX_STORE_URL}
					class="inline-flex items-center justify-center gap-2 rounded-button border border-border px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-1"
				>
					<RotateCcw class="h-4 w-4" />
					Reinstall for Firefox
				</a>
			</div>
		</div>

		<div class="rounded-3xl border border-border-soft bg-surface-2 p-6 sm:p-7" style="box-shadow: var(--shadow-card)">
			<form
				class="space-y-6"
				onsubmit={(event) => {
					event.preventDefault();
					void submitFeedback();
				}}
			>
				<div>
					<label class="text-sm font-semibold text-ink" for="reply-email">
						Email for follow-up
						<span class="text-ink-muted">(optional)</span>
					</label>
					<input
						id="reply-email"
						bind:value={replyEmail}
						type="email"
						class="mt-3 w-full rounded-card border border-border bg-surface-0 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<p class="text-sm font-semibold text-ink">What did you originally install LoveLofi for?</p>
					<p class="mt-2 text-sm text-ink-tertiary">Choose any that apply.</p>
					<MultiSelect
						class="mt-3"
						options={installReasonOptions}
						bind:value={selectedInstallReasons}
						placeholder="Select reasons"
					/>
				</div>

				<div>
					<label class="text-sm font-semibold text-ink" for="uninstall-reason">
						What was the biggest reason you uninstalled?
					</label>
					<div class="mt-3">
						<Select.Root
							type="single"
							value={uninstallReason || undefined}
							onValueChange={(value) => (uninstallReason = value)}
						>
							<Select.Trigger>
								{#if uninstallReason}
									{uninstallReason}
								{:else}
									<span class="text-ink-muted">Select a reason</span>
								{/if}
							</Select.Trigger>
							<Select.Content>
								{#each uninstallReasonOptions as option}
									<Select.Item value={option.value} label={option.label}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>

				<div>
					<p class="text-sm font-semibold text-ink">What plan were you on?</p>
					<p class="mt-2 text-sm text-ink-tertiary">Optional, but helpful.</p>
					<div class="mt-3">
						<Select.Root
							type="single"
							value={planType || undefined}
							onValueChange={(value) =>
								(planType = (value as 'free' | 'monthly' | 'annual' | 'lifetime' | 'not-sure' | undefined) ?? '')}
						>
							<Select.Trigger>
								{#if planType}
									{planOptions.find((option) => option.value === planType)?.label}
								{:else}
									<span class="text-ink-muted">Select a plan</span>
								{/if}
							</Select.Trigger>
							<Select.Content>
								{#each planOptions as option}
									<Select.Item value={option.value} label={option.label}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				
				<div>
					<label class="text-sm font-semibold text-ink" for="feedback">Anything you want us to know?</label>
					<textarea
						id="feedback"
						bind:value={feedback}
						rows="5"
						class="mt-3 w-full rounded-card border border-border bg-surface-0 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
						placeholder="Missing feature, bug, pricing feedback, what almost convinced you to stay..."
					>
					></textarea>
				</div>

				<div class="hidden" aria-hidden="true">
					<label for="company">Company</label>
					<input id="company" bind:value={honeypot} type="text" tabindex="-1" autocomplete="off" />
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
							Send Feedback
						{/if}
					</button>
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
