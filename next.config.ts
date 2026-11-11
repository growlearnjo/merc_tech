import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto (hay un pnpm-workspace.yaml en la carpeta de usuario).
  turbopack: { root: process.cwd() },
};

export default nextConfig;
