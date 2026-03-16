import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import YouTubeFacade from "@/components/YouTubeFacade";
import { mdxComponents } from "@/lib/mdx-components";

export default function VideosPage() {
  const source = getContentSource("videos");

  return (
    <div>
      <Breadcrumb currentPath="/videos" />

      {/* Section label */}
      <p
        style={{
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: "#78716c",
          marginBottom: "16px",
        }}
      >
        Start Here — Most Recommended
      </p>

      {/* Top 3 featured videos */}
      <div
        className="grid-3-col"
        style={{
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <YouTubeFacade
          videoId="UWHIM1g5oFw"
          title="Master the Serve Kinetic Chain"
        />
        <YouTubeFacade
          videoId="RNKK1zH-CJs"
          title="Tennis Serve Biomechanics — Technical Analysis"
        />
        <YouTubeFacade
          videoId="w03NVg7YtNo"
          title="Perfect Tennis Serve in 5 Steps"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} />

      <PageNav currentPath="/videos" />
    </div>
  );
}
