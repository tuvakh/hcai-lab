const { isAiRelated, inferTag, stripHtml, truncate } = require("../newsFetcher");

// ─── isAiRelated ─────────────────────────────────────────────────────────────

describe("isAiRelated(title, text)", () => {
  describe("positive cases", () => {
    it('returns true when title contains "artificial intelligence"', () => {
      expect(isAiRelated("New artificial intelligence breakthrough", "")).toBe(true);
    });

    it('returns true when title contains "machine learning"', () => {
      expect(isAiRelated("Machine learning advances in healthcare", "")).toBe(true);
    });

    it("returns true when body text contains an AI keyword", () => {
      expect(isAiRelated("", "Researchers used deep learning to analyse data")).toBe(true);
    });

    it('is case-insensitive — matches "CHATGPT" in an uppercase title', () => {
      expect(isAiRelated("CHATGPT GETS AN UPGRADE", "")).toBe(true);
    });

    it("matches a keyword that appears only in the text, not the title", () => {
      expect(isAiRelated("Tech news today", "OpenAI releases new model")).toBe(true);
    });
  });

  describe("boundary cases", () => {
    it('matches " ai " when surrounded by spaces in the text', () => {
      // The keyword " ai " (with leading and trailing spaces) is in the list
      expect(isAiRelated("This is ai research", "")).toBe(true);
    });

    it('does NOT match "ai" embedded inside a word without spaces', () => {
      // "railway" contains the letters "ai" but not the keyword " ai "
      expect(isAiRelated("Railway news today", "")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("returns false when both title and text are empty strings", () => {
      expect(isAiRelated("", "")).toBe(false);
    });

    it("returns false when called with no arguments (default parameters apply)", () => {
      expect(isAiRelated()).toBe(false);
    });

    it("returns true for a very long text that contains a keyword near the end", () => {
      const longText = "word ".repeat(2000) + "chatgpt";
      expect(isAiRelated("", longText)).toBe(true);
    });
  });

  describe("negative cases", () => {
    it("does not throw when null is passed as title — returns false", () => {
      // null is not undefined, so the default "" is not used.
      // JS coerces null to "null", which does not match any AI keyword.
      expect(() => isAiRelated(null, "")).not.toThrow();
      expect(isAiRelated(null, "")).toBe(false);
    });

    it("does not throw when undefined is passed — falls back to default empty string", () => {
      expect(() => isAiRelated(undefined, "")).not.toThrow();
      expect(isAiRelated(undefined, "")).toBe(false);
    });

    it("returns false for a very long completely unrelated string", () => {
      expect(isAiRelated("a".repeat(10_000), "")).toBe(false);
    });
  });
});

// ─── inferTag ────────────────────────────────────────────────────────────────

describe("inferTag(title, text)", () => {
  describe("positive cases", () => {
    it('returns "OpenAI" for a title mentioning "gpt"', () => {
      expect(inferTag("New GPT model released", "")).toBe("OpenAI");
    });

    it('returns "Anthropic" for content mentioning "claude"', () => {
      expect(inferTag("", "Claude 3 scores well on benchmarks")).toBe("Anthropic");
    });

    it('returns "Google" for a title mentioning "gemini"', () => {
      expect(inferTag("Gemini Ultra outperforms rivals", "")).toBe("Google");
    });

    it('returns "Policy" for regulatory content', () => {
      expect(inferTag("EU AI Act enters into force", "")).toBe("Policy");
    });

    it('returns "Research" for academic content', () => {
      expect(inferTag("University study on LLM reasoning", "")).toBe("Research");
    });

    it('returns "Startup" for funding news', () => {
      expect(inferTag("Norwegian AI startup raises 50 million", "")).toBe("Startup");
    });
  });

  describe("boundary cases — rule priority", () => {
    it("returns the tag from the earlier rule when multiple rules match", () => {
      // "openai" matches the OpenAI rule (position 1)
      // "research" matches the Research rule (position 10)
      // The first match must win
      expect(inferTag("OpenAI publishes new research paper", "")).toBe("OpenAI");
    });

    it('returns "Robotics" before "Design" when both keywords appear', () => {
      // "robot" matches Robotics (position 6); "design" matches Design (position 7)
      expect(inferTag("Robot interface design", "")).toBe("Robotics");
    });
  });

  describe("edge cases", () => {
    it('returns "AI News" as the fallback when no rule matches', () => {
      expect(inferTag("Some general technology update", "Nothing specific")).toBe("AI News");
    });

    it('returns "AI News" for completely empty inputs', () => {
      expect(inferTag("", "")).toBe("AI News");
    });

    it('returns "AI News" when called with no arguments', () => {
      expect(inferTag()).toBe("AI News");
    });
  });

  describe("negative cases", () => {
    it("does not throw when null is passed — returns AI News", () => {
      // JS coerces null to "null null", which matches no tag rule
      expect(() => inferTag(null, null)).not.toThrow();
      expect(inferTag(null, null)).toBe("AI News");
    });

    it("does not throw when numbers are passed — returns AI News", () => {
      expect(() => inferTag(123, 456)).not.toThrow();
      expect(inferTag(123, 456)).toBe("AI News");
    });
  });
});

// ─── stripHtml ───────────────────────────────────────────────────────────────

describe("stripHtml(str)", () => {
  describe("positive cases", () => {
    it("removes a basic paragraph tag", () => {
      expect(stripHtml("<p>Hello world</p>")).toBe("Hello world");
    });

    it("replaces &nbsp; with a plain space", () => {
      expect(stripHtml("Hello&nbsp;World")).toBe("Hello World");
    });

    it("decodes &amp; back to &", () => {
      expect(stripHtml("AT&amp;T")).toBe("AT&T");
    });

    it("decodes &lt; and &gt; back to angle brackets", () => {
      expect(stripHtml("&lt;b&gt;text&lt;/b&gt;")).toBe("<b>text</b>");
    });

    it("decodes &quot; back to a double-quote character", () => {
      expect(stripHtml('He said &quot;hello&quot;')).toBe('He said "hello"');
    });

    it("collapses multiple consecutive spaces into one", () => {
      expect(stripHtml("<p>Hello</p>   <p>World</p>")).toBe("Hello World");
    });

    it("trims leading and trailing whitespace", () => {
      expect(stripHtml("  <p>Hello</p>  ")).toBe("Hello");
    });
  });

  describe("edge cases", () => {
    it("returns an empty string for empty input", () => {
      expect(stripHtml("")).toBe("");
    });

    it("returns unchanged text when no HTML is present", () => {
      expect(stripHtml("Plain text, no markup")).toBe("Plain text, no markup");
    });

    it("handles deeply nested HTML tags", () => {
      expect(stripHtml("<div><p><span>nested</span></p></div>")).toBe("nested");
    });

    it("handles self-closing tags", () => {
      expect(stripHtml("Line 1<br/>Line 2")).toBe("Line 1 Line 2");
    });

    it("returns empty string when called with no arguments", () => {
      expect(stripHtml()).toBe("");
    });
  });

  describe("negative cases", () => {
    it("handles a very long HTML string without error", () => {
      const long = "<p>" + "word ".repeat(5000) + "</p>";
      expect(() => stripHtml(long)).not.toThrow();
      expect(stripHtml(long)).not.toContain("<");
    });

    it("handles malformed HTML (unclosed tag) without throwing", () => {
      // The regex requires a closing > to match, so an unclosed tag is left as-is
      expect(() => stripHtml("<div unclosed")).not.toThrow();
    });

    it("throws TypeError when null is passed (null is not undefined, so the default does not apply)", () => {
      expect(() => stripHtml(null)).toThrow(TypeError);
    });
  });
});

// ─── truncate ────────────────────────────────────────────────────────────────

describe("truncate(text, max)", () => {
  describe("positive cases", () => {
    it("returns the original string when its length is below the limit", () => {
      expect(truncate("Hello", 10)).toBe("Hello");
    });

    it('truncates a long string and appends "…"', () => {
      expect(truncate("Hello World", 5)).toBe("Hello…");
    });

    it("truncated result has length max + 1 (max chars + ellipsis)", () => {
      const long = "a".repeat(400);
      const result = truncate(long, 300);
      expect(result.length).toBe(301);
      expect(result.endsWith("…")).toBe(true);
    });

    it("works correctly with the production summary length of 300", () => {
      const text = "word ".repeat(100); // 500 chars
      expect(truncate(text, 300).length).toBe(301);
    });
  });

  describe("boundary cases", () => {
    it("does NOT truncate a string whose length exactly equals max", () => {
      const text = "a".repeat(300);
      expect(truncate(text, 300)).toBe(text);
    });

    it("DOES truncate a string whose length is exactly max + 1", () => {
      const text = "a".repeat(301);
      expect(truncate(text, 300)).toBe("a".repeat(300) + "…");
    });

    it('returns just "…" when max is 0 and text is non-empty', () => {
      expect(truncate("Hello", 0)).toBe("…");
    });

    it("keeps exactly one character when max is 1", () => {
      expect(truncate("Hello", 1)).toBe("H…");
    });
  });

  describe("edge cases", () => {
    it("returns an empty string when text is empty regardless of max", () => {
      expect(truncate("", 0)).toBe("");
      expect(truncate("", 10)).toBe("");
    });

    it("returns the original text when max is very large", () => {
      expect(truncate("short", 99_999)).toBe("short");
    });
  });

  describe("negative cases", () => {
    it("handles negative max — slice(0, -1) removes the last character", () => {
      // 'Hello'.length (5) is not <= -1, so truncation runs.
      // slice(0, -1) = "Hell", then "…" is appended → "Hell…"
      expect(truncate("Hello", -1)).toBe("Hell…");
    });
  });
});
