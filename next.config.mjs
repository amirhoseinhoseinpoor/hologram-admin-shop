/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    // Next 14 still uses sass' legacy JS API; hide the (harmless) deprecation notice.
    silenceDeprecations: ["legacy-js-api"],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        // The panel must stay out of search results, assets included.
        source: "/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
