const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http); 
const UserRoutes = require("./Routes/UserRoutes");
const MessageRoutes = require("./Routes/MessageRoutes");
require("dotenv").config();

app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json({ extended: true, limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ extended: true, limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/message", MessageRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    http.listen(process.env.PORT, () => { // Use http.listen instead of app.listen
      console.log(`Server is connected to ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: " + err.message);
  });

// WebSocket (socket.io) integration
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Handle incoming messages from client
  socket.on("chat message", (msg) => {
    console.log("Message from client: " + msg);
    // Broadcast the message to all clients
    io.emit("chat message", msg);
  });
});

module.exports = app;
