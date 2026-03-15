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

export default function EquipmentPage() {
  const source = getContentSource("equipment");

  return (
    <div>
      <Breadcrumb currentPath="/equipment" />

      {/* Key spec stat cards */}
      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="300g+"
          label="Recommended Racket Weight"
          description="More mass = better plow-through and less vibration. Lighter frames under 285g increase forearm strain."
        />
        <StatCard
          number="55–65"
          label="RA Stiffness Range"
          description="Preferred stiffness rating for arm health. RA 68+ transmits substantially more vibration to the elbow."
        />
        <StatCard
          number="46–54 lbs"
          label="String Tension Sweet Spot"
          description="Optimal tension for recreational-to-intermediate players using hybrid or nylon string setups."
        />
      </div>

      {/* String setup quick-ref table */}
      <div style={{ marginBottom: "32px" }}>
        <DataTable
          headers={["Player Level", "Recommended Setup", "Tension", "Notes"]}
          rows={[
            ["Beginner / Intermediate", "Nylon / multifilament synthetic gut", "50–60 lbs", "Most arm-friendly option"],
            ["Intermediate–Advanced", "Hybrid: natural gut mains / poly crosses", "46–56 lbs", "Gold standard for comfort + control"],
            ["Advanced", "Full polyester", "44–54 lbs", "String 2–4 lbs looser than nylon equivalent"],
          ]}
          highlightColumn={1}
        />
      </div>

      <MDXRemote source={source} components={components} />

      <PageNav currentPath="/equipment" />
    </div>
  );
}
