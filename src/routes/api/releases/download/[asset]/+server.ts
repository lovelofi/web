import type { RequestHandler } from './$types';

const GITHUB_REPO = 'lovelofi/desktop';

export const GET: RequestHandler = async ({ params, platform }) => {
	const token = platform?.env?.GITHUB_TOKEN;
	if (!token) {
		return new Response('Server misconfigured', { status: 500 });
	}

	const assetName = params.asset;
	if (!assetName) {
		return new Response('Missing asset name', { status: 400 });
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
			return new Response('Failed to fetch release', { status: 502 });
		}

		const release = await releaseRes.json();

		// Find the requested asset
		const asset = release.assets?.find(
			(a: { name: string }) => a.name === assetName
		);

		if (!asset) {
			return new Response('Asset not found', { status: 404 });
		}

		// Stream the asset from GitHub
		const assetRes = await fetch(asset.url, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/octet-stream',
				'User-Agent': 'lovelofi-web',
			},
		});

		if (!assetRes.ok || !assetRes.body) {
			return new Response('Failed to download asset', { status: 502 });
		}

		return new Response(assetRes.body, {
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': `attachment; filename="${assetName}"`,
				'Cache-Control': 'public, max-age=3600',
				...(assetRes.headers.get('content-length')
					? { 'Content-Length': assetRes.headers.get('content-length')! }
					: {}),
			},
		});
	} catch {
		return new Response('Internal error', { status: 500 });
	}
};
