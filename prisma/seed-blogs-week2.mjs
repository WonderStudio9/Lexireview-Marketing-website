/**
 * Seeds Week 2 blog posts (10 solo-lawyer + 10 startup) into PublishedContent.
 *
 * Reads MDX files from:
 *   - /var/www/lexiforge/prisma/week2-blog-posts/solo-lawyer/*.mdx
 *   - /var/www/lexiforge/prisma/week2-blog-posts/startup/*.mdx
 *
 * For each MDX file:
 *   - Parses frontmatter (title, slug, metaTitle, metaDescription, cluster, icp)
 *   - Extracts body
 *   - Creates matching ContentBrief row (status=PUBLISHED)
 *   - Creates matching PublishedContent row
 *
 * Idempotent — skip if slug already exists.
 *
 * Run: cd /var/www/lexiforge && node prisma/seed-blogs-week2.mjs
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

/**
 * Very small YAML frontmatter parser — handles only key:value pairs and string arrays.
 */
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

    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Array handling: ["a", "b"]
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
  console.log(`\n=== Seeding ${cluster}: ${files.length} files from ${dir} ===\n`);

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    const slug = frontmatter.slug || file.replace(/\.mdx$/, "");
    const title = frontmatter.title || slug;

    // Skip if already published
    const existing = await prisma.publishedContent.findUnique({ where: { slug } });
    if (existing) {
      console.log(`  ↷ ${slug} (already published)`);
      skipped++;
      continue;
    }

    // Map icp → ContentBrief.icp string
    const icp = frontmatter.icp || "UNKNOWN";

    // Create ContentBrief first (PublishedContent depends on it)
    const brief = await prisma.contentBrief.create({
      data: {
        topic: title,
        icp,
        channel: "BLOG",
        funnelStage: "MOFU",
        cluster,
        keywords: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        competitors: [],
        status: "PUBLISHED",
        priority: 2,
      },
    });

    // Create PublishedContent
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
  const soloDir = join(__dirname, "week2-blog-posts", "solo-lawyer");
  const startupDir = join(__dirname, "week2-blog-posts", "startup");

  let soloStats = { created: 0, skipped: 0 };
  let startupStats = { created: 0, skipped: 0 };

  try {
    soloStats = await seedDir(soloDir, "solo-lawyers");
  } catch (err) {
    console.error("Solo lawyer seeding failed:", err.message);
  }

  try {
    startupStats = await seedDir(startupDir, "startups");
  } catch (err) {
    console.error("Startup seeding failed:", err.message);
  }

  const total = soloStats.created + startupStats.created;
  console.log(`\n=== Week 2 blog seed complete: ${total} new posts ===`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
