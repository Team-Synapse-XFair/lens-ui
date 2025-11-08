/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {remotePatterns: [
          {
            protocol: 'https', // Or 'https' if your localhost server uses HTTPS
            hostname: 'beamishly-expectative-brandy.ngrok-free.dev',
            pathname: '/**', // Allows any path on localhost
          },
        ],
    }
}
;

export default nextConfig;
