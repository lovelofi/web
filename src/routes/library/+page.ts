import type { PageLoad } from './$types';

type EffectSetting = {
	enabled?: boolean;
};

type LibraryPreset = {
	id: string;
	name: string;
	description: string;
	settings: Record<string, EffectSetting>;
};

type PresetManifest = {
	version: number;
	updatedAt: string;
	featuredPresetIds: string[];
	freePresetIds: string[];
	additions: LibraryPreset[];
};

type PackPreset = {
	id: string;
	name: string;
	description: string;
	settings: Record<string, EffectSetting>;
};

type PresetPack = {
	id: string;
	name: string;
	description: string;
	tier: 'free' | 'premium';
	featured: boolean;
	presets: PackPreset[];
};

type PackManifest = {
	version: number;
	updatedAt: string;
	packs: PresetPack[];
};

export const prerender = true;

async function readJson<T>(fetcher: typeof fetch, path: string, fallback: T): Promise<T> {
	try {
		const response = await fetcher(path);
		if (!response.ok) {
			return fallback;
		}
		return (await response.json()) as T;
	} catch {
		return fallback;
	}
}

export const load: PageLoad = async ({ fetch }) => {
	const [presetManifest, packManifest] = await Promise.all([
		readJson<PresetManifest>(fetch, '/config/presets.json', {
			version: 0,
			updatedAt: '',
			featuredPresetIds: [],
			freePresetIds: [],
			additions: [],
		}),
		readJson<PackManifest>(fetch, '/config/preset-packs.json', {
			version: 0,
			updatedAt: '',
			packs: [],
		}),
	]);

	return {
		presets: presetManifest.additions,
		featuredPresetIds: presetManifest.featuredPresetIds,
		freePresetIds: presetManifest.freePresetIds,
		presetUpdatedAt: presetManifest.updatedAt,
		packs: packManifest.packs,
		packUpdatedAt: packManifest.updatedAt,
	};
};
