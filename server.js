const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("database connected Sucessfully");
});

const port = process.env.PORT || 3000;
// Start The server
app.listen(port, () => {
  console.log(`Server Is Running on port ${port}`);
});
