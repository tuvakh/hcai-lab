const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    date: String,
    place: String,
    eventImg: String,
    description: String,
    maxSeats: Number,
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

module.exports = mongoose.model("Event", eventSchema);
