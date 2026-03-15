interface CitationProps {
  source: string;
  url?: string;
}

export default function Citation({ source, url }: CitationProps) {
  return (
    <blockquote
      className="pl-4 py-2 my-4"
      style={{
        borderLeft: "3px solid #e7e5e4",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          color: "#78716c",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        <span style={{ fontWeight: 600, color: "#a8a29e", marginRight: "4px" }}>
          Source:
        </span>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#78716c",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            {source}
          </a>
        ) : (
          source
        )}
      </p>
    </blockquote>
  );
}
