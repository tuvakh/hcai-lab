// // src/hooks/useNews.js
// import { useState, useEffect } from "react";

// const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
// const BASE    = "https://eventregistry.org/api/v1/article/getArticles";

// // Module-level cache — persists for the whole browser session
// // Prevents re-fetching when navigating between pages
// const cache = {};

// const QUERIES = {
//   norway:        ["Norway", "artificial intelligence"],
//   international: ["artificial intelligence", "machine learning", "LLM"],
// };

// const TAG_RULES = [
//   { keywords: ["gpt", "openai", "chatgpt"],                    tag: "OpenAI"     },
//   { keywords: ["claude", "anthropic"],                         tag: "Anthropic"  },
//   { keywords: ["gemini", "google", "deepmind"],                tag: "Google"     },
//   { keywords: ["llama", "meta"],                               tag: "Meta"       },
//   { keywords: ["mistral"],                                     tag: "Mistral"    },
//   { keywords: ["robot", "robotics"],                           tag: "Robotics"   },
//   { keywords: ["design", "ux", "hci", "interface"],            tag: "Design"     },
//   { keywords: ["agent", "agentic"],                            tag: "Agents"     },
//   { keywords: ["regulation", "law", "policy", "act", "gdpr"],  tag: "Policy"     },
//   { keywords: ["research", "paper", "study", "university"],    tag: "Research"   },
// ];

// function inferTag(title = "", body = "") {
//   const lower = (title + " " + body).toLowerCase();
//   for (const rule of TAG_RULES) {
//     if (rule.keywords.some((k) => lower.includes(k))) return rule.tag;
//   }
//   return "AI News";
// }

// function reshapeArticle(article, index, region) {
//   return {
//     id:       `${region}-${index}`,
//     region:   "fetched",
//     tag:      inferTag(article.title, article.body),
//     headline: article.title?.replace(/\s*-\s*[^-]+$/, "") ?? "Untitled",
//     summary:  article.body ? article.body.slice(0, 200) + "..." : "No description available.",
//     body:     buildBody(article),
//     why:      null,
//     time:     article.dateTime ?? article.date,
//     url:      article.url,
//     source:   article.source?.title ?? "Unknown source",
//     image:    article.image ?? null,
//   };
// }

// function buildBody(article) {
//   const parts = [];
//   if (article.body) parts.push(article.body.slice(0, 800));
//   parts.push(
//     `Published by ${article.source?.title ?? "unknown source"} on ${
//       new Date(article.dateTime ?? article.date).toLocaleDateString("en-GB", {
//         day: "numeric", month: "long", year: "numeric",
//       })
//     }.`
//   );
//   return parts.join("\n\n");
// }

// export function useNews(region) {
//   // Initialise from cache if available — no loading spinner on repeat visits
//   const [items,   setItems]   = useState(cache[region] ?? []);
//   const [loading, setLoading] = useState(!cache[region]);
//   const [error,   setError]   = useState(null);

//   useEffect(() => {
//     // Cache hit — skip the fetch entirely
//     if (cache[region]) {
//       setItems(cache[region]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     if (!API_KEY) {
//       setError("No API key — add VITE_NEWS_API_KEY to your .env file");
//       setLoading(false);
//       return;
//     }

//     const body = {
//       action:          "getArticles",
//       keyword:         QUERIES[region],
//       keywordOper:     "and",
//       lang:            "eng",
//       sortBy:          "date",
//       sortByAsc:       false,
//       articlesPage:    1,
//       articlesCount:   12,        // reduced from 20 — saves tokens
//       articlesSortBy:  "date",
//       categoryUri:     "dmoz/Computers/Artificial_Intelligence",
//       includeArticleBody:       true,
//       includeArticleImage:      true,
//       includeSourceTitle:       true,
//       includeArticleCategories: false,
//       apiKey:          API_KEY,
//     };

//     fetch(BASE, {
//       method:  "POST",
//       headers: { "Content-Type": "application/json" },
//       body:    JSON.stringify(body),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`NewsAPI.ai error ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         const articles = data?.articles?.results;
//         if (!articles) throw new Error("Unexpected response from NewsAPI.ai");

//         const shaped = articles
//           .filter((a) => a.title && a.title !== "[Removed]")
//           .map((article, index) => reshapeArticle(article, index, region));

//         cache[region] = shaped;   // store in cache
//         console.log(`[useNews] fetched region="${region}" → ${shaped.length} articles`);
//         setItems(shaped);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("[useNews] fetch failed:", err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [region]);

//   return { items, loading, error };
// }

// src/hooks/useNews.js
// ─────────────────────────────────────────────────────────────────────────────
// DEMO MODE — mock data only, no API calls, no tokens used
// When ready for live: replace this file with the NewsAPI.ai version
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

const MOCK_NEWS = {
  norway: [
    {
      id: "norway-0",
      region: "fetched",
      tag: "Policy",
      headline: "Norway tightens AI regulation ahead of EU Act deadline",
      summary: "The Norwegian government has proposed new oversight requirements for high-risk AI systems, aligning with incoming EU AI Act obligations through the EEA agreement.",
      body: "The Norwegian government has proposed new oversight requirements for high-risk AI systems, aligning with incoming EU AI Act obligations through the EEA agreement.\n\nThe proposal covers documentation standards, risk assessments, and mandatory human oversight for automated decision-making tools used in public services, hiring, and healthcare.\n\nPublished by Aftenposten on 1 March 2026.",
      why: null,
      time: "2026-03-01T10:00:00Z",
      url: "#",
      source: "Aftenposten",
    },
    {
      id: "norway-1",
      region: "fetched",
      tag: "Research",
      headline: "NTNU researchers publish landmark study on human-AI teaming",
      summary: "A new paper from the NTNU Shore Control Lab documents findings from field studies aboard Norwegian coastal vessels, examining real crew interactions with autonomous systems.",
      body: "A new paper from the NTNU Shore Control Lab documents findings from field studies aboard Norwegian coastal vessels, examining how crews interact with autonomous systems in real operational conditions.\n\nThe study used ethnographic observation, experience sampling, and post-voyage interviews. Key findings include operator uncertainty about when to intervene in autonomous decisions, and informal communication practices that existing interfaces fail to support.\n\nPublished by NTNU on 20 February 2026.",
      why: null,
      time: "2026-02-20T09:00:00Z",
      url: "#",
      source: "NTNU",
    },
    {
      id: "norway-2",
      region: "fetched",
      tag: "Startup",
      headline: "Cognite expands Trondheim AI hub with 50 new hires",
      summary: "Industrial data company Cognite is doubling its Trondheim office, recruiting data engineers, UX designers and ML researchers from Norwegian universities.",
      body: "Industrial data company Cognite is doubling its Trondheim office, recruiting data engineers, UX designers and ML researchers from Norwegian universities.\n\nThe expansion follows a 500M NOK funding round and focuses on building AI-assisted tools for predictive maintenance and operational optimisation in heavy industry.\n\nPublished by Dagens Næringsliv on 15 February 2026.",
      why: null,
      time: "2026-02-15T08:00:00Z",
      url: "#",
      source: "Dagens Næringsliv",
    },
    {
      id: "norway-3",
      region: "fetched",
      tag: "Education",
      headline: "NIKT 2026 opens submissions for dedicated HCAI research track",
      summary: "Norway's national ICT conference has opened submissions for a new Human-Centred AI track, welcoming full papers, demos, and student project showcases.",
      body: "Norway's national ICT conference has opened submissions for a new Human-Centred AI track, welcoming full papers, demos, and student project showcases.\n\nThe programme committee is chaired by researchers from NTNU and the University of Oslo. The deadline for abstract submissions is January 2026, with a student showcase category requiring only a two-page project description.\n\nPublished by NIKT on 10 February 2026.",
      why: null,
      time: "2026-02-10T09:00:00Z",
      url: "#",
      source: "NIKT",
    },
    {
      id: "norway-4",
      region: "fetched",
      tag: "Jobs",
      headline: "Equinor and Aker BP seek 300 new IT and AI specialists",
      summary: "Norway's largest energy companies are ramping up digital hiring, targeting data engineers, ML platform developers, and visual analytics specialists.",
      body: "Norway's largest energy companies are ramping up digital hiring, targeting data engineers, ML platform developers, and visual analytics specialists across Oslo, Stavanger, and Trondheim.\n\nBoth companies have emphasised interest in candidates who understand domain context and can communicate technical findings to non-technical stakeholders. Graduate recruitment tracks are open now.\n\nPublished by E24 on 5 February 2026.",
      why: null,
      time: "2026-02-05T08:00:00Z",
      url: "#",
      source: "E24",
    },
    {
      id: "norway-5",
      region: "fetched",
      tag: "Tech",
      headline: "Norway invests 4B NOK in green AI data centres along the coast",
      summary: "A major government investment package targets sustainable AI infrastructure, with new coastal data centres powered entirely by renewable energy.",
      body: "The Norwegian government has announced a 4 billion NOK investment package targeting sustainable AI infrastructure. The initiative focuses on building large-scale data centres along the Norwegian coast, powered entirely by hydroelectric and wind energy sources.\n\nThe data centres are designed to serve both domestic tech companies and international cloud providers looking to meet EU sustainability requirements. Tax incentives are available for companies meeting verified green energy benchmarks.\n\nPublished by Regjeringen on 1 February 2026.",
      why: null,
      time: "2026-02-01T10:00:00Z",
      url: "#",
      source: "Regjeringen",
    },
    {
      id: "norway-6",
      region: "fetched",
      tag: "Research",
      headline: "Responsible gambling tool from NTNU wins European Innovation Award",
      summary: "A suite of responsible gambling tools developed in collaboration with Norsk Tipping has received the European Lottery Association's annual Innovation Award.",
      body: "A suite of responsible gambling tools developed in collaboration between NTNU and Norsk Tipping has received the European Lottery Association's annual Innovation Award.\n\nThe tools — including real-time spend trackers, friction nudges, and a redesigned self-exclusion flow — are now deployed to over one million users. The project demonstrates that ethical design and commercial viability can coexist.\n\nPublished by NTNU on 18 February 2026.",
      why: null,
      time: "2026-01-28T09:00:00Z",
      url: "#",
      source: "NTNU",
    },
    {
      id: "norway-7",
      region: "fetched",
      tag: "Policy",
      headline: "Datatilsynet publishes first guidance on EU AI Act compliance for Norwegian firms",
      summary: "Norway's data protection authority has released a practical guide to help organisations understand their obligations under the EU AI Act.",
      body: "Norway's data protection authority (Datatilsynet) has released a practical guide to help organisations understand their obligations under the EU AI Act, which applies to Norwegian firms through the EEA agreement.\n\nThe guide covers risk classification, documentation requirements, and human oversight obligations. Fines for non-compliance can reach 3% of global annual turnover for standard violations.\n\nPublished by Datatilsynet on 20 January 2026.",
      why: null,
      time: "2026-01-20T10:00:00Z",
      url: "#",
      source: "Datatilsynet",
    },
    {
      id: "norway-8",
      region: "fetched",
      tag: "Agents",
      headline: "Norwegian startup Nodes launches AI agent platform for enterprise workflows",
      summary: "Oslo-based Nodes has launched an enterprise AI agent platform designed to automate multi-step workflows across project management, customer service, and data analysis tools.",
      body: "Oslo-based Nodes has launched an enterprise AI agent platform designed to automate multi-step workflows across project management, customer service, and data analysis tools.\n\nThe platform integrates with existing enterprise software stacks and includes a visual workflow builder requiring no coding experience. Early customers include two Norwegian banks and a major retailer.\n\nPublished by Shifter on 12 January 2026.",
      why: null,
      time: "2026-01-12T08:00:00Z",
      url: "#",
      source: "Shifter",
    },
  ],

  international: [
    {
      id: "international-0",
      region: "fetched",
      tag: "OpenAI",
      headline: "OpenAI unveils new reasoning model surpassing o3 on key benchmarks",
      summary: "A new architecture pushes state-of-the-art on 14 benchmarks, introducing a dedicated reasoning trace layer that makes step-by-step thinking more transparent and auditable.",
      body: "OpenAI has announced a successor to its o3 reasoning model, claiming improvements across 14 industry-standard benchmarks including MATH, HumanEval, and MMLU.\n\nThe new architecture introduces a dedicated reasoning trace layer that separates the reasoning and response generation phases — allowing the model to self-correct during the reasoning pass before committing to an answer. Early evaluations suggest this significantly reduces hallucination rates on multi-step problems.\n\nPublished by OpenAI on 1 March 2026.",
      why: null,
      time: "2026-03-01T12:00:00Z",
      url: "#",
      source: "OpenAI",
    },
    {
      id: "international-1",
      region: "fetched",
      tag: "Google",
      headline: "Google DeepMind releases Gemini 3 with enhanced multimodal reasoning",
      summary: "The latest Gemini model introduces stronger cross-modal reasoning, longer context windows, and improved performance on scientific and coding tasks.",
      body: "Google DeepMind has released Gemini 3, the latest generation of its flagship multimodal model. The release introduces stronger cross-modal reasoning capabilities, a significantly extended context window, and improved benchmark performance on scientific reasoning and code generation.\n\nThe model is available through Google AI Studio and the Gemini API. A lightweight variant optimised for on-device deployment is expected to follow within weeks.\n\nPublished by Google DeepMind on 25 February 2026.",
      why: null,
      time: "2026-02-25T10:00:00Z",
      url: "#",
      source: "Google DeepMind",
    },
    {
      id: "international-2",
      region: "fetched",
      tag: "Anthropic",
      headline: "Anthropic publishes research on constitutional AI and model alignment",
      summary: "A new paper from Anthropic details advances in constitutional AI methods, showing measurable improvements in model helpfulness and harmlessness on independent evaluations.",
      body: "A new paper from Anthropic details advances in constitutional AI methods, showing measurable improvements in model helpfulness and harmlessness on independent evaluations.\n\nThe research introduces a revised constitutional framework that allows models to reason about competing values more explicitly, reducing the frequency of refusals on ambiguous but legitimate requests while maintaining safety boundaries.\n\nPublished by Anthropic on 18 February 2026.",
      why: null,
      time: "2026-02-18T11:00:00Z",
      url: "#",
      source: "Anthropic",
    },
    {
      id: "international-3",
      region: "fetched",
      tag: "Meta",
      headline: "Meta releases Llama 4 with 1M token context window",
      summary: "The latest open-weight model from Meta features native multimodal capabilities and a one million token context window, available for commercial use.",
      body: "Meta has released Llama 4, featuring a one million token context window and native multimodal capabilities covering text, images, and structured data. The model weights are available under a licence permitting commercial use.\n\nThe extended context window makes Llama 4 particularly suited for applications reasoning over entire codebases or long documents. A quantised version optimised for consumer hardware makes local deployment feasible on high-end laptops.\n\nPublished by Meta AI on 10 February 2026.",
      why: null,
      time: "2026-02-10T09:00:00Z",
      url: "#",
      source: "Meta AI",
    },
    {
      id: "international-4",
      region: "fetched",
      tag: "Agents",
      headline: "New benchmark reveals significant gaps in AI agent reliability",
      summary: "A comprehensive study of 12 leading AI agent frameworks finds that real-world task completion rates drop sharply when tasks involve more than five sequential steps.",
      body: "A comprehensive study of 12 leading AI agent frameworks finds that real-world task completion rates drop sharply when tasks involve more than five sequential steps, raising questions about production readiness.\n\nResearchers from Stanford and MIT designed a benchmark of 200 real-world tasks across domains including web research, code execution, and file management. The best-performing system completed 61% of tasks without human intervention.\n\nPublished by Stanford HAI on 5 February 2026.",
      why: null,
      time: "2026-02-05T10:00:00Z",
      url: "#",
      source: "Stanford HAI",
    },
    {
      id: "international-5",
      region: "fetched",
      tag: "Design",
      headline: "Apple Intelligence redesign leaks ahead of WWDC reveal",
      summary: "Screenshots from an internal build show a sweeping visual redesign tied to next-generation Apple Intelligence features, including ambient suggestions and contextual UI cards.",
      body: "Screenshots purportedly from an internal Apple build show a sweeping visual redesign tied to next-generation Apple Intelligence features. The leaked interfaces show translucent layered surfaces, context-sensitive information cards, and subtle AI-generated content indicators throughout the system UI.\n\nThe most notable change is an ambient suggestions layer that surfaces relevant actions based on current context without requiring the user to explicitly invoke any assistant.\n\nPublished by 9to5Mac on 1 February 2026.",
      why: null,
      time: "2026-02-01T14:00:00Z",
      url: "#",
      source: "9to5Mac",
    },
    {
      id: "international-6",
      region: "fetched",
      tag: "Open Source",
      headline: "Mistral releases new open-weight model optimised for European languages",
      summary: "Mistral's latest release focuses on strong performance across European languages including French, German, Spanish, and the Nordic languages, under a permissive open licence.",
      body: "Mistral has released a new open-weight model with particular focus on European language performance, including French, German, Spanish, Italian, and the Nordic languages. The model is available under a permissive licence for both research and commercial use.\n\nBenchmark results show the model outperforming comparably-sized competitors on multilingual reasoning tasks. A fine-tuning guide for domain adaptation is included in the release documentation.\n\nPublished by Mistral AI on 28 January 2026.",
      why: null,
      time: "2026-01-28T10:00:00Z",
      url: "#",
      source: "Mistral AI",
    },
    {
      id: "international-7",
      region: "fetched",
      tag: "Research",
      headline: "CHI 2026 announces record paper submissions in human-AI interaction",
      summary: "ACM CHI 2026 has received over 4,000 paper submissions, with human-AI interaction overtaking mobile and social computing as the most submitted topic area for the first time.",
      body: "ACM CHI 2026 has received over 4,000 paper submissions, with human-AI interaction overtaking mobile and social computing as the most submitted topic area for the first time in the conference's history.\n\nThe programme chairs note a particular surge in papers addressing AI transparency, user control, and the design of conversational agents. Acceptance notifications are expected in January 2026.\n\nPublished by ACM on 20 January 2026.",
      why: null,
      time: "2026-01-20T09:00:00Z",
      url: "#",
      source: "ACM",
    },
    {
      id: "international-8",
      region: "fetched",
      tag: "Policy",
      headline: "EU AI Act enforcement begins for high-risk system providers",
      summary: "The first enforcement phase of the EU AI Act is now active, requiring providers of high-risk AI systems to meet documentation, testing, and human oversight obligations.",
      body: "The first enforcement phase of the EU AI Act is now active, requiring providers of high-risk AI systems — including hiring tools, credit scoring, biometric systems, and safety-critical applications — to meet documentation, testing, and human oversight obligations.\n\nNational supervisory authorities across EU and EEA member states have begun accepting compliance filings. Fines for non-compliance can reach 6% of global annual turnover for the most serious violations.\n\nPublished by European Commission on 10 January 2026.",
      why: null,
      time: "2026-01-10T10:00:00Z",
      url: "#",
      source: "European Commission",
    },
  ],
};

export function useNews(region) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // Simulate a brief loading state so the UI behaves the same as live mode
    const timer = setTimeout(() => {
      setItems(MOCK_NEWS[region] ?? []);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [region]);

  return { items, loading, error };
}