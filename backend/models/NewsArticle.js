const mongoose = require("mongoose");

const newsArticleSchema = new mongoose.Schema(
  {
    externalId: { type: String, unique: true },
    region:     { type: String, enum: ["norway", "international"] },
    tag:        String,
    headline:   String,
    summary:    String,
    body:       String,
    url:        String,
    source:     String,
    image:      { type: String, default: null },
    publishedAt: Date,
    fetchedAt:  { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("NewsArticle", newsArticleSchema);
