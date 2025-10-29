/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static HTML export
  images: {
    unoptimized: true, // Required for static export
  },

  // Webpack configuration for Three.js
  webpack: (config, { isServer }) => {
    // Handle GLB/GLTF files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    })

    // Handle shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    })

    // Handle HDR files
    config.module.rules.push({
      test: /\.hdr$/,
      type: 'asset/resource',
    })

    // Exclude Node.js modules from client bundle (for assimpjs)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
