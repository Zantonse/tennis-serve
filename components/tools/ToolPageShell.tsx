"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface ToolPageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function ToolPageShell({
  title,
  description,
  children,
}: ToolPageShellProps) {
  const router = useRouter();

  return (
    <div
      style={{
        maxWidth: "896px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            padding: "0",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#78716c",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#1c1917",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              fontSize: "14px",
              color: "#78716c",
              margin: 0,
              marginTop: "6px",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          // Extra padding on wider screens via a responsive approach with inline style
          // 20px mobile already applied to wrapper; here we add the content offset
        }}
      >
        {children}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .tool-page-shell-wrapper {
            padding: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
