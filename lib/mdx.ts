import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

export function getContentSource(slug: string): string {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${slug}.mdx`);
  }
  return fs.readFileSync(filePath, "utf-8");
}
