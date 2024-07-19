const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const UserRoutes = require("./Routes/UserRoutes")
const MessageRoutes = require("./Routes/MessageRoutes")
require("dotenv").config();
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json({ extended: true, limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ extended: true, limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/api/v1/user",UserRoutes);
app.use("/api/v1/message",MessageRoutes);
app.get("/", (req, res) => {
  res.send("Server is running");
});
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is connected to ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: " + err.message);
  });

module.exports = app;
