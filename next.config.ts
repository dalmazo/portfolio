import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
// Project pages are served from https://<user>.github.io/<repo>, so assets need that prefix.
const repoName = "portfolio";
const basePath = isGithubActions ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: isGithubActions ? `/${repoName}/` : "",
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  agentRules: false,
};

export default nextConfig;
