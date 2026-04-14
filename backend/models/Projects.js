const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: String,
    year: Number,
    status: [String],
    tags: [String],
    team: [String],
    image: String,
    links: [{ label: String, url: String }],
    shortDescription: String,
    fullDescription: String,
    outcomes: String,
    presentationUrl: String,
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

module.exports = mongoose.model("Project", projectSchema);
