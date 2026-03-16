import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import DiagramFigure from "@/components/DiagramFigure";
import { mdxComponents } from "@/lib/mdx-components";

export default function TechniquePage() {
  const source = getContentSource("technique");

  return (
    <div>
      <Breadcrumb currentPath="/technique" />

      <div style={{ marginBottom: "24px" }}>
        <DiagramFigure
          src="/images/diagrams/trophy-position.png"
          alt="Trophy position diagram showing the key checkpoint in the serve motion"
          caption="The trophy position — key checkpoint in the serve motion"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} />

      <PageNav currentPath="/technique" />
    </div>
  );
}
