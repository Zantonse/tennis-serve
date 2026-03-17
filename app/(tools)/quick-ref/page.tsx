"use client";

import { useState } from "react";
import Link from "next/link";
import ToolPageShell from "@/components/tools/ToolPageShell";
import quickRefs from "@/content/quick-refs.json";

interface QuickRef {
  pageTitle: string;
  pageHref: string;
  cues: string[];
}

const refs: QuickRef[] = quickRefs as QuickRef[];

export default function QuickRefPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = refs[selectedIndex];

  return (
    <ToolPageShell
      title="Quick Reference"
      description="Court-side cues for each topic. Glance during a changeover."
    >
      {/* Tab selector — horizontal scroll */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          marginBottom: "24px",
        }}
      >
        <style>{`
          .qr-tab-scroll::-webkit-scrollbar { display: none; }
          html.dark .qr-tab-unselected {
            background-color: #292524 !important;
            color: #a8a29e !important;
            border-color: #44403c !important;
          }
          html.dark .qr-tab-unselected:hover {
            background-color: #3c3836 !important;
            color: #d6d3d1 !important;
          }
          html.dark .qr-content-card {
            background-color: #1c1917 !important;
            border-color: #44403c !important;
          }
          html.dark .qr-content-heading {
            color: #fafaf9 !important;
          }
          html.dark .qr-cue-text {
            color: #d6d3d1 !important;
          }
          html.dark .qr-full-link {
            color: #f87171 !important;
          }
        `}</style>
        {refs.map((ref, i) => {
          const isSelected = i === selectedIndex;
          return (
            <button
              key={ref.pageHref}
              onClick={() => setSelectedIndex(i)}
              className={isSelected ? undefined : "qr-tab-unselected"}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1.5px solid",
                borderColor: isSelected ? "#dc2626" : "#e7e5e4",
                backgroundColor: isSelected ? "#dc2626" : "#fdfcfb",
                color: isSelected ? "#ffffff" : "#44403c",
                fontSize: "14px",
                fontWeight: isSelected ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {ref.pageTitle}
            </button>
          );
        })}
      </div>

      {/* Content card */}
      <div
        className="qr-content-card"
        style={{
          backgroundColor: "#fdfcfb",
          border: "1.5px solid #e7e5e4",
          borderRadius: "14px",
          padding: "24px",
        }}
      >
        {/* Page title */}
        <h2
          className="qr-content-heading"
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#1c1917",
            margin: 0,
            marginBottom: "20px",
            letterSpacing: "-0.3px",
          }}
        >
          {selected.pageTitle}
        </h2>

        {/* Cue list */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          }}
        >
          {selected.cues.map((cue, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                paddingTop: "14px",
                paddingBottom: "14px",
                borderBottom: i < selected.cues.length - 1 ? "1px solid #f5f5f4" : "none",
              }}
            >
              {/* Red bullet */}
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#dc2626",
                  marginTop: "6px",
                }}
              />
              {/* Cue text */}
              <span
                className="qr-cue-text"
                style={{
                  fontSize: "17px",
                  lineHeight: 1.8,
                  color: "#1c1917",
                  fontWeight: 500,
                }}
              >
                {cue}
              </span>
            </li>
          ))}
        </ul>

        {/* Link to full page */}
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1.5px solid #e7e5e4" }}>
          <Link
            href={selected.pageHref}
            className="qr-full-link"
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#dc2626",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Read full page
            <span aria-hidden="true" style={{ fontSize: "17px" }}>
              {" "}
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </ToolPageShell>
  );
}
