"use client";

import Image from "next/image";
import { useState } from "react";

interface YouTubeFacadeProps {
  videoId: string;
  title?: string;
}

export default function YouTubeFacade({ videoId, title }: YouTubeFacadeProps) {
  const [loaded, setLoaded] = useState(false);

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  if (loaded) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "16/9" }}
      >
        <iframe
          src={iframeSrc}
          title={title ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: "none" }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg cursor-pointer group"
      style={{ aspectRatio: "16/9" }}
      onClick={() => setLoaded(true)}
      role="button"
      tabIndex={0}
      aria-label={title ? `Play ${title}` : "Play video"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setLoaded(true);
        }
      }}
    >
      {/* Thumbnail */}
      <Image
        src={thumbnailUrl}
        alt={title ?? "YouTube video thumbnail"}
        fill
        className="object-cover"
        loading="lazy"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
      />

      {/* Play button */}
      <div
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#dc2626",
            boxShadow: "0 4px 20px rgba(220,38,38,0.5)",
          }}
        >
          {/* Triangle play icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
          >
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </div>
      </div>

      {/* Title badge */}
      {title && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
