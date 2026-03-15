"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "@/lib/navigation";
import ThemeToggle from "./ThemeToggle";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Fixed top bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "52px",
          backgroundColor: "#fdfcfb",
          borderBottom: "1px solid #e7e5e4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
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

        {/* Right controls: ThemeToggle + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              border: "1px solid #e7e5e4",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "0",
            }}
          >
            {open ? (
              // X icon
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#44403c"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#44403c"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Overlay backdrop */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(28, 25, 23, 0.4)",
          }}
        />
      )}

      {/* Slide-out drawer */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          width: "260px",
          backgroundColor: "#fdfcfb",
          borderRight: "1px solid #e7e5e4",
          overflowY: "auto",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          paddingTop: "52px",
        }}
      >
        {/* Nav groups */}
        <nav style={{ padding: "16px 12px" }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: "20px" }}>
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
                        onClick={() => setOpen(false)}
                        style={{
                          display: "block",
                          padding: "8px 8px",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "#dc2626" : "#44403c",
                          backgroundColor: isActive ? "#fef2f2" : "transparent",
                          borderLeft: isActive
                            ? "2px solid #dc2626"
                            : "2px solid transparent",
                          textDecoration: "none",
                          marginBottom: "2px",
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
      </div>
    </>
  );
}
