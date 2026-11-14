process.env.SITE_ORIGIN = 'https://arthasya.biz';
process.env.SITE_INDEXABLE = 'true';

await import('./build.mjs');
