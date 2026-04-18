require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("Connected to MongoDB.");
  try {
    await User.collection.dropIndex("collegeCode_1");
    console.log("Dropped index collegeCode_1 successfully.");
  } catch (err) {
    console.log("Error dropping index (maybe it does not exist):", err.message);
  }
  process.exit(0);
})
.catch(err => {
  console.log("Error connecting:", err);
  process.exit(1);
});
