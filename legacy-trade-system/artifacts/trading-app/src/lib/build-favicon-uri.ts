// Client-side favicon builder - simplified for Vite
// In Next.js this read filesystem; in Vite we use a simpler approach
export function buildFaviconUri(): string | null {
  const appName = import.meta.env.VITE_DERIV_APP_NAME ?? 'Deriv App';
  const letter = appName.trim().charAt(0).toUpperCase() || 'A';

  const svgString = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">',
    '<rect width="32" height="32" rx="6" fill="#0051FF"/>',
    '<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"',
    ` fill="white" font-size="20" font-family="sans-serif" font-weight="bold">${letter}</text>`,
    '</svg>',
  ].join('');

  const base64Svg = btoa(svgString);
  return `data:image/svg+xml;base64,${base64Svg}`;
}
