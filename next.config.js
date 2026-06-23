/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Keep the dev bundle small: only pull the icons actually used from
    // lucide-react instead of its whole set. (react-icons was dropped because
    // its packs are single barrel modules that can't be split, which bloated
    // page.js to ~24 MB; brand logos now live as inline SVGs in
    // components/icons/brand.tsx.)
    optimizePackageImports: ["lucide-react"],
  },
};

module.exports = nextConfig;
