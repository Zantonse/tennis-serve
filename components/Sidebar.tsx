"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navGroups } from "@/lib/navigation";
import ThemeToggle from "./ThemeToggle";

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Build TOC from h2/h3 headings in the page
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]")
    );
    const entries: TocEntry[] = headings.map((h) => ({
      id: h.id,
      text: h.textContent ?? "",
      level: parseInt(h.tagName[1], 10),
    }));
    setToc(entries);

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (ioEntries) => {
        const visible = ioEntries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => observer.observe(h));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <aside
      className="flex flex-col"
      style={{
        width: "230px",
        minWidth: "230px",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        backgroundColor: "#fdfcfb",
        borderRight: "1px solid #e7e5e4",
        padding: "0",
      }}
    >
      {/* Logo + ThemeToggle */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: "1px solid #e7e5e4" }}
      >
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#dc2626",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "#1c1917",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}
          >
            The Serve
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation groups */}
      <nav className="flex-1 px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "#a8a29e",
                padding: "0 8px",
                marginBottom: "4px",
              }}
            >
              {group.label}
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={{
                        display: "block",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#dc2626" : "#44403c",
                        backgroundColor: isActive ? "#fef2f2" : "transparent",
                        borderLeft: isActive ? "2px solid #dc2626" : "2px solid transparent",
                        textDecoration: "none",
                        marginBottom: "1px",
                        transition: "background-color 0.1s, color 0.1s",
                      }}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* On-page TOC */}
      {toc.length > 0 && (
        <div
          className="px-3 py-4"
          style={{ borderTop: "1px solid #e7e5e4" }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#a8a29e",
              padding: "0 8px",
              marginBottom: "4px",
            }}
          >
            On this page
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {toc.map((entry) => {
              const isActive = activeId === entry.id;
              return (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    style={{
                      display: "block",
                      padding: "4px 8px",
                      paddingLeft: entry.level === 3 ? "20px" : "8px",
                      fontSize: "12px",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#dc2626" : "#78716c",
                      textDecoration: "none",
                      borderRadius: "4px",
                      borderLeft: isActive ? "2px solid #dc2626" : "2px solid transparent",
                      transition: "color 0.1s",
                    }}
                  >
                    {entry.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
