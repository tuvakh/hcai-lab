const Parser      = require("rss-parser");
const cron        = require("node-cron");
const NewsArticle = require("../models/NewsArticle");

const parser = new Parser({ timeout: 10000 });

const AI_KEYWORDS = [
  "artificial intelligence", "machine learning", "deep learning",
  "neural network", "large language model", "llm", "generative ai",
  "chatgpt", "gpt", "openai", "anthropic", "gemini", "deepmind",
  "llama", "mistral", "ai model", "ai tool", "ai system",
  "robotics", "automation", "algorithm", "data science",
  "natural language processing", "nlp", "computer vision",
  "reinforcement learning", "transformer model", "diffusion model",
  " ai ", "kunstig intelligens",
];

function isAiRelated(title = "", text = "") {
  const lower = (title + " " + text).toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

const TAG_RULES = [
  { keywords: ["gpt", "openai", "chatgpt"],                    tag: "OpenAI"      },
  { keywords: ["claude", "anthropic"],                         tag: "Anthropic"   },
  { keywords: ["gemini", "google", "deepmind"],                tag: "Google"      },
  { keywords: ["llama", "meta"],                               tag: "Meta"        },
  { keywords: ["mistral"],                                     tag: "Mistral"     },
  { keywords: ["robot", "robotics"],                           tag: "Robotics"    },
  { keywords: ["design", "ux", "hci", "interface"],            tag: "Design"      },
  { keywords: ["agent", "agentic"],                            tag: "Agents"      },
  { keywords: ["regulation", "law", "policy", "act", "gdpr"],  tag: "Policy"      },
  { keywords: ["research", "paper", "study", "university"],    tag: "Research"    },
  { keywords: ["startup", "funding", "raises", "million"],     tag: "Startup"     },
  { keywords: ["job", "hire", "hiring", "career"],             tag: "Jobs"        },
  { keywords: ["open source", "open-source", "open weight"],   tag: "Open Source" },
];

function inferTag(title = "", text = "") {
  const lower = (title + " " + text).toLowerCase();
  for (const rule of TAG_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.tag;
  }
  return "AI News";
}

const FEEDS = {
  norway: [
    { url: "https://shifter.no/feed/",  source: "Shifter" },
    { url: "https://www.digi.no/rss",   source: "Digi.no" },
    { url: "https://khrono.no/feed",    source: "Khrono"  },
  ],
  international: [
    { url: "https://deepmind.google/blog/rss.xml",   source: "Google DeepMind" },
    { url: "https://www.technologyreview.com/feed/", source: "MIT Tech Review"  },
    { url: "https://arxiv.org/rss/cs.AI",            source: "arXiv"            },
    { url: "https://www.theverge.com/rss/index.xml", source: "The Verge"        },
  ],
};

function stripHtml(str = "") {
  return str
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

function truncate(text, max) {
  return text.length <= max ? text : text.slice(0, max) + "…";
}

async function processFeed(feedConfig, region) {
  let feed;
  try {
    feed = await parser.parseURL(feedConfig.url);
  } catch (err) {
    console.warn(`[newsFetcher] Failed to fetch ${feedConfig.url}: ${err.message}`);
    return 0;
  }

  const operations = [];

  for (const item of feed.items ?? []) {
    const rawTitle = item.title ?? "";
    // arXiv titles contain "arXiv:XXXX Announce Type: new" — extract the real title after "Title:"
    const title = rawTitle.includes("Announce Type")
      ? (rawTitle.match(/Title:\s*(.+)/)?.[1] ?? rawTitle).trim()
      : rawTitle;

    const rawContent = stripHtml(item.content ?? item["content:encoded"] ?? "");
    const snippet    = item.contentSnippet ?? item.summary ?? "";
    const fullText   = (rawContent.length > snippet.length ? rawContent : snippet)
      .replace(/arXiv:\S+\s+Announce Type:[^\n]*/gi, "") // strip wherever it appears
      .replace(/^\s*Abstract:\s*/i, "")
      .trim();
    const url = item.link ?? item.guid ?? "";

    if (!url || !title) continue;
    if (!isAiRelated(title, fullText)) continue;

    const article = {
      externalId:  url,
      region,
      tag:         inferTag(title, fullText),
      headline:    title.replace(/\s*-\s*[^-]+$/, "").trim(),
      summary:     truncate(fullText, 300),
      body:        truncate(fullText, 1200),
      url,
      source:      feedConfig.source,
      image:       item.enclosure?.url ?? null,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      fetchedAt:   new Date(),
    };

    operations.push({
      updateOne: {
        filter: { externalId: url },
        update: { $set: article },
        upsert: true,
      },
    });
  }

  if (operations.length === 0) return 0;

  try {
    const result = await NewsArticle.bulkWrite(operations, { ordered: false });
    return result.upsertedCount + result.modifiedCount;
  } catch (err) {
    console.warn(`[newsFetcher] bulkWrite error for ${feedConfig.url}: ${err.message}`);
    return 0;
  }
}

async function fetchAllNews() {
  console.log("[newsFetcher] Starting news fetch...");

  // Fetch all feeds in parallel instead of sequentially
  const tasks = Object.entries(FEEDS).flatMap(([region, feeds]) =>
    feeds.map((feed) => processFeed(feed, region))
  );
  const counts = await Promise.all(tasks);
  const total  = counts.reduce((sum, n) => sum + n, 0);

  console.log(`[newsFetcher] Done. ${total} new/updated articles stored.`);
}

function startNewsFetcher() {
  fetchAllNews();
  cron.schedule("0 */6 * * *", fetchAllNews);
}

module.exports = { startNewsFetcher, isAiRelated, inferTag, stripHtml, truncate };
