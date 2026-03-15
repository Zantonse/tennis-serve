"use client";

interface VideoEmbedAmbientProps {
  mode: "ambient";
  src: string;
  poster?: string;
}

interface VideoEmbedNormalProps {
  mode: "normal";
  src: string;
  poster?: string;
  label?: string;
}

type VideoEmbedProps = VideoEmbedAmbientProps | VideoEmbedNormalProps;

export default function VideoEmbed(props: VideoEmbedProps) {
  if (props.mode === "ambient") {
    return (
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "16/9" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={props.poster}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={props.src} />
        </video>
      </div>
    );
  }

  // Normal mode
  const { src, poster, label } = props as VideoEmbedNormalProps;

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: "16/9" }}
    >
      <video
        controls
        poster={poster}
        preload="metadata"
        className="w-full h-full object-contain"
        style={{ backgroundColor: "#0c0a09" }}
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>
      {label && (
        <div
          className="absolute top-3 left-3 px-2 py-1 rounded"
          style={{
            backgroundColor: "#dc2626",
            fontSize: "11px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
