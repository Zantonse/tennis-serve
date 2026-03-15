import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";

const components = {
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure
      className="my-6 rounded-xl border"
      style={{ borderColor: "#e7e5e4", backgroundColor: "#fafaf9", padding: "16px" }}
    >
      <img {...props} className="w-full rounded-lg" loading="lazy" />
    </figure>
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div
      className="overflow-x-auto rounded-lg border my-6"
      style={{ borderColor: "#e7e5e4" }}
    >
      <table {...props} className="w-full text-sm" />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      style={{
        padding: "12px 16px",
        textAlign: "left",
        fontSize: "11px",
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        color: "#78716c",
        fontWeight: 600,
        backgroundColor: "#fafaf9",
        borderBottom: "1px solid #e7e5e4",
        whiteSpace: "nowrap" as const,
      }}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      {...props}
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #e7e5e4",
        color: "#44403c",
        fontSize: "14px",
      }}
    />
  ),
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      className="page-title mb-2"
      id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="section-heading mt-10 mb-4"
      id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      style={{
        fontSize: "18px",
        fontWeight: 700,
        color: "#1c1917",
        marginTop: "24px",
        marginBottom: "12px",
      }}
      id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="body-text mb-4" />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      style={{
        listStyleType: "disc",
        paddingLeft: "24px",
        marginBottom: "16px",
        color: "#44403c",
      }}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      style={{
        listStyleType: "decimal",
        paddingLeft: "24px",
        marginBottom: "16px",
        color: "#44403c",
      }}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "4px" }} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} style={{ fontWeight: 700, color: "#1c1917" }} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      style={{
        borderLeft: "3px solid #d6d3d1",
        paddingLeft: "16px",
        paddingTop: "8px",
        paddingBottom: "8px",
        margin: "16px 0",
        fontSize: "14px",
        color: "#78716c",
        backgroundColor: "#fafaf9",
        borderRadius: "0 8px 8px 0",
      }}
    />
  ),
  hr: () => <hr style={{ margin: "32px 0", borderColor: "#e7e5e4" }} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      style={{ color: "#dc2626", textDecoration: "underline", textUnderlineOffset: "2px" }}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    />
  ),
};

export default function StrategyPage() {
  const source = getContentSource("strategy");

  return (
    <div>
      <Breadcrumb currentPath="/strategy" />

      {/* Key stat callout row */}
      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="68–72%"
          label="T Serve Win Rate"
          description="ATP first-serve point win rate targeting the T (Match Charting Project)"
        />
        <StatCard
          number="70–74%"
          label="Body Serve Win Rate"
          description="Highest win rate of all targets — yet the most underutilized at all levels"
        />
        <StatCard
          number="60–65%"
          label="Optimal First-Serve %"
          description="Below 55% = too many second serves; above 75% = insufficient target risk"
        />
      </div>

      {/* Quick-reference tactical table */}
      <div style={{ marginBottom: "32px" }}>
        <DataTable
          headers={["Situation", "Recommended Action"]}
          rows={[
            ["30-0 first serve", "Best serve, best target"],
            ["0-30 first serve", "High-% target (T/body), full commitment"],
            ["Break point second serve", "Kick to BH, back 1/3 of box"],
            ["Tiebreak 6-6", "Most reliable pattern, standard routine"],
            ["Opponent inside baseline", "Flat wide or body"],
            ["Opponent behind baseline", "T with pace"],
            ["Opponent cheating wide", "Nail the T"],
            ["After double fault", "Full reset, focus cue, simplify to kick"],
            ["Same target 3x in a row", "Change immediately"],
          ]}
          highlightColumn={0}
        />
      </div>

      <MDXRemote source={source} components={components} />

      <PageNav currentPath="/strategy" />
    </div>
  );
}
