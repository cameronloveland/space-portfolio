import type { NextConfig } from "next";

/** Set in CI for project Pages (`/repo-name/`). Omit or leave empty for a `<user>.github.io` root site. */
const raw = process.env.NEXT_BASE_PATH?.trim() ?? "";
const basePath =
  raw && raw !== "/" ? `/${raw.replace(/^\/+|\/+$/g, "")}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
