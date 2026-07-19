const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");

router.get("/profile", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username required" });

  try {
    const response = await fetch(`https://www.ntnu.no/ansatte/${username}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    const name = $("#profile-card h2").first().text().trim();
    const role = $("#profile-card .profile-info h2").next("div").text().trim();
    const email = $("#profile-card a[href^='mailto:']").first().attr("href")?.replace("mailto:", "") || "";

    const imgSrc = $("#profile-card .profile-image img").attr("src") || "";
    const image = imgSrc.startsWith("http") ? imgSrc : imgSrc ? `https://www.ntnu.no${imgSrc}` : "";

    const researchInterests = [];
    $(".competency-pill span[rel='tag']").each((_, el) => {
      researchInterests.push($(el).text().trim());
    });

    const bio = $("#nav-about .flex-grow").first().text().trim();
    const publicationsUrl = $("a[href*='nva.sikt.no']").first().attr("href") || "";

    const links = { linkedin: "", scholar: "", researchgate: "", twitter: "" };
    $("#profile-card a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href.includes("linkedin.com")) links.linkedin = href;
      else if (href.includes("scholar.google")) links.scholar = href;
      else if (href.includes("researchgate.net")) links.researchgate = href;
      else if (href.includes("twitter.com") || href.includes("x.com")) links.twitter = href;
    });

    res.json({
      name,
      role,
      email,
      image,
      researchInterests,
      shortDescription: bio,
      fullBio: bio,
      publicationsUrl,
      ntnuProfile: `https://www.ntnu.no/ansatte/${username}`,
      linkedin: links.linkedin,
      scholar: links.scholar,
      researchgate: links.researchgate,
      twitter: links.twitter,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "query required" });

  try {
    const url = `https://www.ntnu.no/sok?p_p_id=ntnusearchpage_WAR_ntnusearchportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=search&p_p_cacheability=cacheLevelPage&query=${encodeURIComponent(query)}&category=employee&sort=magic&pageNr=1`;

    const response = await fetch(url);
    const data = await response.json();

    const results = (data.docs || []).map(employee => ({
        username: employee.username,
        name: employee.displayName,
        role: employee.roleTitle || "",
        email: employee.email || "",
        image: employee.pictureUrl || "",
        department: employee.personOrgName || "",
    }));

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search" });
  }
});

router.get("/cristin/projects", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "query required" });
  try {
    const url = `https://api.cristin.no/v2/results?title=${encodeURIComponent(query)}&institution=194&per_page=10&fields=all`;
    const response = await fetch(url);
    const data = await response.json();
    const results = (Array.isArray(data) ? data : []).map(result => {
      const archiveLink = (result.links || []).find(link => link.url_type === "ARKIV");
      const doiLink = (result.links || []).find(link => link.url_type === "DOI");
      return {
        id: result.cristin_result_id,
        name: result.title?.en || result.title?.nb || "",
        year: result.year_published || "",
        status: ["Completed"],
        team: (result.contributors?.preview || []).map(contributor => `${contributor.first_name} ${contributor.surname}`),
        shortDescription: (result.summary?.en || result.summary?.nb || "").slice(0, 160),
        fullDescription: result.summary?.en || result.summary?.nb || "",
        links: archiveLink?.url || doiLink?.url || "",
      };
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to search NVA" });
  }
});

module.exports = router;
