const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect("mongodb://atlas-sql-6989b6bc4074a406f54d5e26-qsbxud.a.query.mongodb.net/stay-ease?ssl=true&authSource=admin"); 
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;