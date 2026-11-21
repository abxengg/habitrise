// Prefix a root-relative path with the site's base path, so the site works both at a domain root
// (habitrise.in, base "/") and in a sub-folder (GitHub Pages: abxengg.github.io/habitrise/).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const u = (path: string) => base + path;
