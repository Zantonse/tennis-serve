import Image from "next/image";

interface DiagramFigureProps {
  src: string;
  alt: string;
  caption: string;
}

export default function DiagramFigure({ src, alt, caption }: DiagramFigureProps) {
  return (
    <figure
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: "#e7e5e4" }}
    >
      <div className="relative w-full" style={{ minHeight: "200px" }}>
        <Image
          src={src}
          alt={alt}
          width={800}
          height={450}
          loading="lazy"
          className="w-full h-auto object-contain"
          style={{ display: "block" }}
        />
      </div>
      <figcaption
        className="px-4 py-3 text-center"
        style={{
          fontSize: "13px",
          color: "#78716c",
          backgroundColor: "#fafaf9",
          borderTop: "1px solid #e7e5e4",
          fontStyle: "italic",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
