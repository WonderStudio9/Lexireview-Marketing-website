/**
 * Seeds Week 3 RERA blog posts (15) + Week 4 whitepapers (5) into PublishedContent.
 *
 * Run: cd /var/www/lexiforge && node prisma/seed-blogs-week34.mjs
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

function parseFrontmatter(mdx) {
  const match = mdx.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: mdx };
  const fmText = match[1];
  const body = match[2];
  const frontmatter = {};
  for (const line of fmText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        frontmatter[key] = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        frontmatter[key] = value;
      }
    } else if (!isNaN(Number(value))) {
      frontmatter[key] = Number(value);
    } else {
      frontmatter[key] = value;
    }
  }
  return { frontmatter, body };
}

async function seedDir(dir, cluster) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  console.log(`\n=== Seeding ${cluster}: ${files.length} files ===\n`);
  let created = 0;
  let skipped = 0;
  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    const slug = frontmatter.slug || file.replace(/\.mdx$/, "");
    const title = frontmatter.title || slug;
    const existing = await prisma.publishedContent.findUnique({ where: { slug } });
    if (existing) {
      console.log(`  ↷ ${slug} (exists)`);
      skipped++;
      continue;
    }
    const brief = await prisma.contentBrief.create({
      data: {
        topic: title,
        icp: frontmatter.icp || "UNKNOWN",
        channel: cluster === "enterprise-law-firms" ? "WHITEPAPER" : "BLOG",
        funnelStage: cluster === "enterprise-law-firms" ? "BOFU" : "MOFU",
        cluster,
        keywords: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        competitors: [],
        status: "PUBLISHED",
        priority: cluster === "enterprise-law-firms" ? 3 : 2,
      },
    });
    await prisma.publishedContent.create({
      data: {
        briefId: brief.id,
        slug,
        title,
        metaTitle: frontmatter.metaTitle || title,
        metaDesc: frontmatter.metaDescription || "",
        bodyMdx: body.trim(),
        publishedAt: new Date(),
      },
    });
    console.log(`  ✓ ${slug}`);
    created++;
  }
  console.log(`\n${cluster}: ${created} created, ${skipped} skipped`);
  return { created, skipped };
}

async function main() {
  const reraDir = join(__dirname, "week3-blog-posts", "rera");
  const whitepaperDir = join(__dirname, "week4-whitepapers");
  const r = await seedDir(reraDir, "real-estate");
  const w = await seedDir(whitepaperDir, "enterprise-law-firms");
  console.log(`\n=== Total: ${r.created + w.created} new posts seeded ===`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
