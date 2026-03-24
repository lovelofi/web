const SITE = 'https://lovelofi.app';

const pages = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/docs', priority: '0.8', changefreq: 'monthly' },
	{ path: '/download', priority: '0.9', changefreq: 'monthly' },
	{ path: '/changelog', priority: '0.6', changefreq: 'weekly' },
	{ path: '/privacy', priority: '0.3', changefreq: 'yearly' },
	{ path: '/terms', priority: '0.3', changefreq: 'yearly' },
	{ path: '/support', priority: '0.5', changefreq: 'monthly' },
];

export function GET() {
	const urls = pages
		.map(
			(p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600',
		},
	});
}
