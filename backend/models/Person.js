const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    image: String,
    shortDescription: String,
    fullBio: String,
    email: String,
    linkedin: String,
    github: String,
    scholar: String,
    researchgate: String,
    twitter: String,
    ntnuProfile: String,
    publicationsUrl: String,
    researchInterests: [String],
    projects: [{ name: String, image: String, url: String }],
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

module.exports = mongoose.model("Person", personSchema);
