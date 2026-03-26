import type { PageServerLoad } from './$types';
import { GITHUB_DESKTOP_REPO, GITHUB_EXT_REPO } from '$lib/constants';

export interface ChangelogEntry {
	version: string;
	date: string;
	publishedAt: string;
	platform: 'extension' | 'desktop';
	latest: boolean;
	body: string;
	url: string;
}

interface GitHubRelease {
	tag_name: string;
	name: string;
	published_at: string;
	body: string | null;
	html_url: string;
	draft: boolean;
	prerelease: boolean;
}

const PLACEHOLDER_BODIES = ['see the assets below to download and install.', ''];

function parseBody(body: string | null): string {
	if (!body) return '';
	if (PLACEHOLDER_BODIES.includes(body.trim().toLowerCase())) return '';
	return body;
}

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
}

async function fetchReleases(
	repo: string,
	platform: 'extension' | 'desktop',
	token: string,
): Promise<ChangelogEntry[]> {
	const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=50`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'lovelofi-web',
		},
	});

	if (!res.ok) return [];

	const releases: GitHubRelease[] = await res.json();

	return releases
		.filter((r) => !r.draft && !r.prerelease)
		.map((r, i) => ({
			version: r.tag_name,
			date: formatDate(r.published_at),
			publishedAt: r.published_at,
			platform,
			latest: i === 0,
			body: parseBody(r.body),
			url: r.html_url,
		}));
}

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const token = platform?.env?.GITHUB_TOKEN;
	if (!token) {
		return { entries: [] };
	}

	try {
		const [desktop, ext] = await Promise.all([
			fetchReleases(GITHUB_DESKTOP_REPO, 'desktop', token),
			fetchReleases(GITHUB_EXT_REPO, 'extension', token),
		]);

		const entries = [...desktop, ...ext].sort(
			(a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
		);

		setHeaders({ 'cache-control': 'public, max-age=300' });

		return { entries };
	} catch {
		return { entries: [] };
	}
};
