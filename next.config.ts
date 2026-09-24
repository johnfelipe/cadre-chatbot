import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // knowledge/ is read with fs at runtime, so file tracing can't see it on its own.
  outputFileTracingIncludes: {
    "/api/chat": ["./knowledge/**/*.md"],
  },
};

export default nextConfig;
