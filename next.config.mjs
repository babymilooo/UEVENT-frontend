/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['i.scdn.co', 'localhost'],
    },
    asyncProxy: {
        '/static': {
            target: 'http://localhost:3001',
            pathRewrite: { '^/static': '' },
            changeOrigin: true,
        },
    },
};

export default nextConfig;
