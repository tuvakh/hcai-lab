const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    type: { 
        type: String, 
        enum: ["equipment", "seat"], 
        required: true 
    },
    bookedByName:  String,
    bookedByEmail: String,
    // equipment only
    equipmentId:  String,
    name:         String,
    category:     String,
    startDate:    Date,
    endDate:      Date,
    // seat only
    eventId:      String,
    eventTitle:   String,
    eventDescription: String,
    seats:        Number,
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
