const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    description: String,
    image: String
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

module.exports = mongoose.model("Equipment", equipmentSchema);
