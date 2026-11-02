/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    // Next 14 still uses sass' legacy JS API; hide the (harmless) deprecation notice.
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;
