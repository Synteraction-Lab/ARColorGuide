/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
};

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  assetPrefix: isProd ? '/ARColorGuide/' : '',
  images: { unoptimized: true },
  output: 'export',
}; 