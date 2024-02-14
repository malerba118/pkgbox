"use client";

import dynamic from "next/dynamic";

const ProjectPage = dynamic(
  () => import("../components/projects/ProjectPage"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const Page = () => {
  return <ProjectPage />;
};

export default Page;
