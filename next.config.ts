import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
// Project pages are served from https://<user>.github.io/<repo>, so assets need that prefix.
const repoName = "portfolio";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isGithubActions ? `/${repoName}` : "",
  assetPrefix: isGithubActions ? `/${repoName}/` : "",
  agentRules: false,
};

export default nextConfig;
