import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // eval-source-map (the default) wraps every module in eval(), which is
      // blocked by iOS Screen Time restrictions, some MDM profiles, and certain
      // home routers/content filters — causing silent JS failure on all mobile
      // browsers while desktop (localhost) works fine.
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};

export default nextConfig;
