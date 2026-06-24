/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Keep the dev bundle small: only pull the icons actually used from each
    // icon barrel instead of its whole set. (react-icons was dropped because
    // its packs are single barrel modules that can't be split, which bloated
    // page.js to ~24 MB.) `developer-icons` (tech logos) and `lucide-animated`
    // (animated UI/timeline icons) are also single barrels, so they go here too
    // to stay tree-shaken — see change-animated-icons.md.
    optimizePackageImports: [
      "lucide-react",
      "developer-icons",
      "lucide-animated",
    ],
  },
};

module.exports = nextConfig;
