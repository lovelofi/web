import type { PageServerLoad } from './$types';
import { GITHUB_REPO } from '$lib/constants';

const SUFFIXES = [
	'_aarch64.dmg',
	'_x64.dmg',
	'_x64-setup.exe',
	'_amd64.AppImage',
	'_amd64.deb',
] as const;

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const token = platform?.env?.GITHUB_TOKEN;
	if (!token) {
		return { version: null, assets: {}, error: true };
	}

	try {
		const res = await fetch(
			`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/vnd.github.v3+json',
					'User-Agent': 'lovelofi-web',
				},
			}
		);

		if (!res.ok) {
			return { version: null, assets: {}, error: true };
		}

		const release = await res.json();
		const version = release.tag_name ?? null;

		const assets: Record<string, string> = {};
		for (const suffix of SUFFIXES) {
			const match = release.assets?.find(
				(a: { name: string }) => a.name.endsWith(suffix)
			);
			if (match) {
				assets[suffix] = match.browser_download_url;
			}
		}

		setHeaders({ 'cache-control': 'public, max-age=300' });

		return { version, assets, error: false };
	} catch {
		return { version: null, assets: {}, error: true };
	}
};
