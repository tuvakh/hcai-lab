//Experimenting with RSS news fetching
// This service runs in the background, periodically fetching news articles from various RSS feeds
// serverjs -> services/newsFetcher.js ->  hooks/UseNews.js -> pages/NewsArticle.js
const Parser  = require("rss-parser");
const cron    = require("node-cron");
const NewsArticle = require("../models/NewsArticle");

const parser = new Parser({ timeout: 10000 });

// Keyword for filtering 
// Only store articles that mention at least one of these terms.
// Checked against title + summary combined (case-insensitive).
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

function isAiRelated(title = "", summary = "") {
  const text = (title + " " + summary).toLowerCase();
  return AI_KEYWORDS.some((kw) => text.includes(kw));
}

// To filter tags 
const TAG_RULES = [
  { keywords: ["gpt", "openai", "chatgpt"],                   tag: "OpenAI"      },
  { keywords: ["claude", "anthropic"],                        tag: "Anthropic"   },
  { keywords: ["gemini", "google", "deepmind"],               tag: "Google"      },
  { keywords: ["llama", "meta"],                              tag: "Meta"        },
  { keywords: ["mistral"],                                    tag: "Mistral"     },
  { keywords: ["robot", "robotics"],                          tag: "Robotics"    },
  { keywords: ["design", "ux", "hci", "interface"],           tag: "Design"      },
  { keywords: ["agent", "agentic"],                           tag: "Agents"      },
  { keywords: ["regulation", "law", "policy", "act", "gdpr"], tag: "Policy"      },
  { keywords: ["research", "paper", "study", "university"],   tag: "Research"    },
  { keywords: ["startup", "funding", "raises", "million"],    tag: "Startup"     },
  { keywords: ["job", "hire", "hiring", "career"],            tag: "Jobs"        },
  { keywords: ["open source", "open-source", "open weight"],  tag: "Open Source" },
];

function inferTag(title = "", summary = "") {
  const lower = (title + " " + summary).toLowerCase();
  for (const rule of TAG_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.tag;
  }
  return "AI News";
}

//RSS Soruces
const FEEDS = {
  norway: [
    { url: "https://shifter.no/feed/",   source: "Shifter"  },
    { url: "https://www.digi.no/rss",    source: "Digi.no"  },
    { url: "https://khrono.no/feed",     source: "Khrono"   },
  ],
  international: [
    { url: "https://deepmind.google/blog/rss.xml",                          source: "Google DeepMind"   },
    { url: "https://www.technologyreview.com/feed/",                        source: "MIT Tech Review"   },
    { url: "https://arxiv.org/rss/cs.AI",                                   source: "arXiv"             },
    { url: "https://www.theverge.com/rss/index.xml", source: "The Verge"                     },
  ],
};

// more soruces can be added but these are major websites and a research website by a Cornell university is a nice addition. 

//Strip HTML tags from RSS content fields
function stripHtml(str = "") {
  return str
    .replace(/<[^>]+>/g, " ") //remove tags and white space (line 77-78)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ") 
    .trim();
}

//Fetch + upsert one feed 
async function processFeed(feedConfig, region) {
  let feed;
  try {
    feed = await parser.parseURL(feedConfig.url);
  } catch (err) {
    console.warn(`[newsFetcher] Failed to fetch ${feedConfig.url}: ${err.message}`);
    return 0;
  }

  let saved = 0;
  for (const item of feed.items ?? []) {
    const title      = item.title ?? "";
    const rawContent = stripHtml(item.content ?? item["content:encoded"] ?? "");
    const snippet    = item.contentSnippet ?? item.summary ?? "";
    // Use the longer of snippet vs stripped content for the body
    const fullText   = rawContent.length > snippet.length ? rawContent : snippet;
    const url        = item.link ?? item.guid ?? "";

    if (!url || !title) continue;
    if (!isAiRelated(title, fullText)) continue;

    const summary = fullText.slice(0, 300) + (fullText.length > 300 ? "…" : "");
    // Body: up to 1200 chars — much more than the card summary
    const body    = fullText.slice(0, 1200) + (fullText.length > 1200 ? "…" : "");

    const article = {
      externalId:  url,
      region,
      tag:         inferTag(title, fullText),
      headline:    title.replace(/\s*-\s*[^-]+$/, "").trim(),
      summary,
      body,
      url,
      source:      feedConfig.source,
      image:       item.enclosure?.url ?? null,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      fetchedAt:   new Date(),
    };

    try {
      await NewsArticle.updateOne(
        { externalId: url },  // match by URL — deduplicates across runs
        { $set: article },
        { upsert: true }
      );
      saved++;
    } catch (err) {
      if (err.code !== 11000) console.warn(`[newsFetcher] Upsert error: ${err.message}`);
    }
  }

  return saved;
}

//Run all feeds for both regions 
async function fetchAllNews() {
  console.log("[newsFetcher] Starting news fetch...");
  let total = 0;

  for (const [region, feeds] of Object.entries(FEEDS)) {
    for (const feed of feeds) {
      const count = await processFeed(feed, region);
      total += count;
    }
  }

  console.log(`[newsFetcher] Done. ${total} new/updated articles stored.`);
}

//Start: run once on boot, then every 6 hours 
function startNewsFetcher() {
  fetchAllNews(); // immediate first run
  cron.schedule("0 */6 * * *", fetchAllNews); // then every 6 hours
}

module.exports = { startNewsFetcher };
