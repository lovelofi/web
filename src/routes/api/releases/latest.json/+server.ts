import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const GITHUB_REPO = 'lovelofi/desktop';
const CACHE_TTL_SECONDS = 300; // 5 minutes
const PROXY_BASE = 'https://lovelofi.app/api/releases/download';

/**
 * Rewrite GitHub release download URLs to go through our proxy,
 * since the repo is private and GitHub returns 404 for unauthenticated requests.
 */
function rewriteUrls(manifest: Record<string, unknown>): Record<string, unknown> {
	const platforms = manifest.platforms as Record<string, { url?: string }> | undefined;
	if (!platforms) return manifest;

	for (const platform of Object.values(platforms)) {
		if (platform.url && typeof platform.url === 'string') {
			// Extract the filename from the GitHub URL
			const filename = platform.url.split('/').pop();
			if (filename) {
				platform.url = `${PROXY_BASE}/${filename}`;
			}
		}
	}

	return manifest;
}

export const GET: RequestHandler = async ({ platform }) => {
	const token = platform?.env?.GITHUB_TOKEN;
	if (!token) {
		return json({ error: 'Server misconfigured' }, { status: 500 });
	}

	try {
		// Get the latest release
		const releaseRes = await fetch(
			`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/vnd.github.v3+json',
					'User-Agent': 'lovelofi-web',
				},
			}
		);

		if (!releaseRes.ok) {
			return json({ error: 'Failed to fetch release' }, { status: 502 });
		}

		const release = await releaseRes.json();

		// Find the latest.json asset
		const asset = release.assets?.find(
			(a: { name: string }) => a.name === 'latest.json'
		);

		if (!asset) {
			return json({ error: 'No updater manifest found' }, { status: 404 });
		}

		// Download the asset
		const assetRes = await fetch(asset.url, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/octet-stream',
				'User-Agent': 'lovelofi-web',
			},
		});

		if (!assetRes.ok) {
			return json({ error: 'Failed to download manifest' }, { status: 502 });
		}

		const manifest = await assetRes.json();

		return json(rewriteUrls(manifest), {
			headers: {
				'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
			},
		});
	} catch {
		return json({ error: 'Internal error' }, { status: 500 });
	}
};
