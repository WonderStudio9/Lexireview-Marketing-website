import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  cluster: string;
  icp: string;
  funnelStage: "TOFU" | "MOFU" | "BOFU";
  keywords: string[];
  bodyMdx: string;
}

const BLOG_POSTS: BlogPost[] = [
  // PLACEHOLDER — will be filled by agents
];

async function main() {
  console.log("Seeding blog posts...");

  for (const post of BLOG_POSTS) {
    // Create ContentBrief first (required FK)
    const brief = await prisma.contentBrief.create({
      data: {
        topic: post.title,
        icp: post.icp,
        channel: "BLOG",
        funnelStage: post.funnelStage,
        cluster: post.cluster,
        keywords: post.keywords,
        status: "PUBLISHED",
        priority: 1,
      },
    });

    // Create PublishedContent
    await prisma.publishedContent.create({
      data: {
        briefId: brief.id,
        slug: post.slug,
        title: post.title,
        metaTitle: post.metaTitle,
        metaDesc: post.metaDesc,
        bodyMdx: post.bodyMdx,
        publishedAt: new Date(),
      },
    });

    console.log(`  Published: ${post.slug}`);
  }

  console.log(`\nSeeded ${BLOG_POSTS.length} blog posts!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
