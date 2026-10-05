import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/resume",
        permanent: false,
      },
      {
        source: "/login",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/recruiter/create-job",
        destination: "/recruiter/jobs/create",
        permanent: false,
      },
      {
        source: "/create-job",
        destination: "/recruiter/jobs/create",
        permanent: false,
      },
      {
        source: "/recruiter/jobs/new",
        destination: "/recruiter/jobs/create",
        permanent: false,
      },
      {
        source: "/startup",
        destination: "/recruiter/startup/fundraising-pipeline",
        permanent: false,
      },
      {
        source: "/startup/fundraising",
        destination: "/recruiter/startup/fundraising-pipeline",
        permanent: false,
      },
      {
        source: "/startup/fundraising-pipeline",
        destination: "/recruiter/startup/fundraising-pipeline",
        permanent: false,
      },
      {
        source: "/startup/investors-connect",
        destination: "/recruiter/startup/investors-connect",
        permanent: false,
      },
      {
        source: "/recruiter/fundraising",
        destination: "/recruiter/startup/fundraising-pipeline",
        permanent: false,
      },
      {
        source: "/recruiter/fundraising-pipeline",
        destination: "/recruiter/startup/fundraising-pipeline",
        permanent: false,
      },
      {
        source: "/recruiter/investors-connect",
        destination: "/recruiter/startup/investors-connect",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
