import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  img: (props) => (
    <figure
      className="my-6 rounded-xl overflow-hidden"
      style={{ border: "1px solid #e7e5e4", backgroundColor: "#fafaf9", padding: "16px" }}
    >
      <img {...props} className="w-full rounded-lg" loading="lazy" />
    </figure>
  ),
  table: (props) => (
    <div
      className="overflow-x-auto my-6 rounded-lg"
      style={{ border: "1px solid #e7e5e4" }}
    >
      <table
        {...props}
        style={{
          width: "100%",
          fontSize: "14px",
          borderCollapse: "collapse",
          lineHeight: 1.5,
        }}
      />
    </div>
  ),
  thead: (props) => (
    <thead
      {...props}
      style={{
        backgroundColor: "#fafaf9",
        borderBottom: "2px solid #e7e5e4",
      }}
    />
  ),
  tbody: (props) => <tbody {...props} />,
  tr: (props) => (
    <tr
      {...props}
      style={{
        borderBottom: "1px solid #e7e5e4",
      }}
    />
  ),
  th: (props) => (
    <th
      {...props}
      style={{
        padding: "10px 16px",
        textAlign: "left",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#78716c",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    />
  ),
  td: (props) => (
    <td
      {...props}
      style={{
        padding: "10px 16px",
        color: "#44403c",
        fontSize: "14px",
        verticalAlign: "top",
      }}
    />
  ),
  h1: (props) => (
    <h1
      {...props}
      className="page-title mb-2"
      id={String(props.children ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className="section-heading mt-10 mb-4"
      id={String(props.children ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      style={{
        fontSize: "18px",
        fontWeight: 700,
        color: "#1c1917",
        marginTop: "24px",
        marginBottom: "12px",
      }}
      id={String(props.children ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    />
  ),
  p: (props) => <p {...props} className="body-text mb-4" />,
  ul: (props) => (
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
  ol: (props) => (
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
  li: (props) => (
    <li {...props} style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "4px" }} />
  ),
  strong: (props) => (
    <strong {...props} style={{ fontWeight: 700, color: "#1c1917" }} />
  ),
  blockquote: (props) => (
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
  a: (props) => (
    <a
      {...props}
      style={{ color: "#dc2626", textDecoration: "underline", textUnderlineOffset: "2px" }}
      target={String(props.href ?? "").startsWith("http") ? "_blank" : undefined}
      rel={String(props.href ?? "").startsWith("http") ? "noopener noreferrer" : undefined}
    />
  ),
};
