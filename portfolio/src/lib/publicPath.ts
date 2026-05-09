/**
 * Path to an asset in `public/` when the app uses Next `basePath` (GitHub project Pages).
 */
export function publicPath(assetPath: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${base}${path}`;
}
