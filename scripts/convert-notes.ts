import fs from "fs";
import path from "path";
import os from "os";

const obsidianDir = path.join(
  os.homedir(),
  "Documents/ObsidianNotes/Claude-Research/tennis"
);
const contentDir = path.join(process.cwd(), "content");

const fileMapping: Record<string, string> = {
  "serve-biomechanics-kinetic-chain-2026-03.md": "biomechanics.mdx",
  "serve-technical-phases-detailed-2026-03.md": "technique.mdx",
  "serve-strategy-tactics-2026-03.md": "strategy.mdx",
  "serve-physical-preparation-training-2026-03.md": "training.mdx",
  "serve-video-resources-2026-03.md": "videos.mdx",
  "tennis-serve-comprehensive-research-2026-03.md": "main.mdx",
};

function stripFrontmatter(content: string): string {
  // Remove YAML frontmatter block at the top
  return content.replace(/^---[\s\S]*?---\n?/, "");
}

function convertObsidianImages(content: string): string {
  // ![[image.png]] -> ![image](/images/diagrams/image.png)
  return content.replace(/!\[\[([^\]]+)\]\]/g, (_, filename) => {
    const basename = path.basename(filename);
    return `![${basename}](/images/diagrams/${basename})`;
  });
}

function convertWikiLinks(content: string): string {
  // [[link|alias]] -> alias
  content = content.replace(/\[\[[^\]]+\|([^\]]+)\]\]/g, "$1");
  // [[link]] -> link (just the link text, no brackets)
  content = content.replace(/\[\[([^\]]+)\]\]/g, "$1");
  return content;
}

function removeRelatedLines(content: string): string {
  // Remove lines starting with "> Related:"
  return content.replace(/^> Related:.*$/gm, "");
}

function convertNote(source: string): string {
  let result = source;
  result = stripFrontmatter(result);
  result = convertObsidianImages(result);
  result = convertWikiLinks(result);
  result = removeRelatedLines(result);
  // Clean up any blank lines left by the removals
  result = result.replace(/\n{3,}/g, "\n\n");
  return result.trim() + "\n";
}

function main() {
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  let convertedCount = 0;

  for (const [sourceFile, destFile] of Object.entries(fileMapping)) {
    const sourcePath = path.join(obsidianDir, sourceFile);
    const destPath = path.join(contentDir, destFile);

    if (!fs.existsSync(sourcePath)) {
      console.error(`MISSING source file: ${sourcePath}`);
      continue;
    }

    const raw = fs.readFileSync(sourcePath, "utf-8");
    const converted = convertNote(raw);
    fs.writeFileSync(destPath, converted, "utf-8");
    console.log(`Converted: ${sourceFile} -> ${destFile}`);
    convertedCount++;
  }

  console.log(`\nDone. Converted ${convertedCount} files to ${contentDir}`);
  console.log(
    "\nNext step: manually extract from main.mdx:\n" +
      "  - Serve Types section -> content/serve-types.mdx\n" +
      "  - Recovery & Injury Prevention section -> content/recovery.mdx\n" +
      "  - Equipment & Environment section -> content/equipment.mdx"
  );
}

main();
