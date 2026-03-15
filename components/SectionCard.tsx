import Image from "next/image";
import Link from "next/link";

interface SectionCardProps {
  title: string;
  description: string;
  href: string;
  iconSrc: string;
  photoSrc: string;
}

export default function SectionCard({
  title,
  description,
  href,
  iconSrc,
  photoSrc,
}: SectionCardProps) {
  return (
    <Link
      href={href}
      className="block no-underline rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
      style={{ backgroundColor: "#1c1917", textDecoration: "none" }}
    >
      {/* Photo header */}
      <div className="relative w-full" style={{ height: "160px", overflow: "hidden" }}>
        <Image
          src={photoSrc}
          alt={title}
          fill
          className="object-cover"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, #1c1917 100%)",
          }}
        />
        {/* Icon pill */}
        <div
          className="absolute bottom-3 left-3 flex items-center justify-center rounded-full"
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#dc2626",
          }}
        >
          <Image src={iconSrc} alt="" width={16} height={16} />
        </div>
      </div>

      {/* Text content */}
      <div className="px-4 py-4">
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#fafaf9",
            margin: 0,
            marginBottom: "6px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#a8a29e",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
