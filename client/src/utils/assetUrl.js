const API_ORIGIN = import.meta.env.VITE_API_URL || '';

export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}
