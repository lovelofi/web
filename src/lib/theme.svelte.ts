export type ThemeId = 'sakura';

export function getThemeState() {
	return {
		get current(): ThemeId {
			return 'sakura';
		},
		get isDark() {
			return false;
		},
		init() {
			if (typeof window === 'undefined') return;
			document.documentElement.setAttribute('data-theme', 'sakura');
		},
	};
}
