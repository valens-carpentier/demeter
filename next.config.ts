const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for Cloudflare Pages
  trailingSlash: true,
};

export default nextConfig;
