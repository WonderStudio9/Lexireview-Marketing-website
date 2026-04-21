/**
 * Updates the bodyMdx of already-seeded RERA blog posts to strip tool-call artefacts.
 * Run: cd /var/www/lexiforge && node prisma/update-rera-bodies.mjs
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

function parseFrontmatter(mdx) {
  const match = mdx.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { body: mdx, slug: null };
  const fmText = match[1];
  const body = match[2];
  const slugMatch = fmText.match(/slug:\s*"?([^"\n]+)"?/);
  return { body: body.trim(), slug: slugMatch ? slugMatch[1].trim() : null };
}

async function main() {
  const dir = join(__dirname, "week3-blog-posts", "rera");
  const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  console.log(`Updating ${files.length} RERA posts...\n`);
  let updated = 0;
  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf-8");
    const { body, slug } = parseFrontmatter(content);
    if (!slug) {
      console.log(`  ✗ ${file} — no slug`);
      continue;
    }
    const existing = await prisma.publishedContent.findUnique({ where: { slug } });
    if (!existing) {
      console.log(`  ↷ ${slug} — not found`);
      continue;
    }
    await prisma.publishedContent.update({
      where: { slug },
      data: { bodyMdx: body, updatedAt: new Date() },
    });
    console.log(`  ✓ ${slug}`);
    updated++;
  }
  console.log(`\n${updated} posts updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
