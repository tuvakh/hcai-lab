const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    equipmentId: { type: String, required: true },
    name: String,
    category: String,
    startDate: Date,
    endDate: Date,
    bookedByName: String,
    bookedByEmail: String,
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
