export type ThemeId = 'cafe' | 'cafe-dark' | 'midnight' | 'sakura';

export interface ThemeOption {
	id: ThemeId;
	name: string;
	isDark: boolean;
}

export const THEMES: ThemeOption[] = [
	{ id: 'cafe', name: 'Cafe Nocturne', isDark: false },
	{ id: 'cafe-dark', name: 'Cafe Eclipse', isDark: true },
	{ id: 'midnight', name: 'Midnight Session', isDark: true },
	{ id: 'sakura', name: 'Sakura Study', isDark: false },
];

let currentTheme = $state<ThemeId>('cafe');

export function getThemeState() {
	return {
		get current() {
			return currentTheme;
		},
		get isDark() {
			return THEMES.find((t) => t.id === currentTheme)?.isDark ?? false;
		},
		init() {
			if (typeof window === 'undefined') return;
			const saved = localStorage.getItem('lovelofi-theme') as ThemeId | null;
			if (saved && THEMES.some((t) => t.id === saved)) {
				currentTheme = saved;
			} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				currentTheme = 'cafe-dark';
			}
			document.documentElement.setAttribute('data-theme', currentTheme);
		},
		set(id: ThemeId) {
			currentTheme = id;
			localStorage.setItem('lovelofi-theme', id);
			document.documentElement.setAttribute('data-theme', id);
		},
	};
}
