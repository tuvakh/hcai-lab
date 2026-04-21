require("dotenv").config();
const mongoose = require("mongoose");

const Equipment = require("./models/Equipment");


const equipments = require("./data/equipments.json");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");

  
  await Equipment.deleteMany();


  await Equipment.insertMany(equipments);

  console.log("Seeded successfully");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
