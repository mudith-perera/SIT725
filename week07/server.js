const express = require("express");
const app = express();
const port = process.env.PORT || 3004;
const mongoose = require("mongoose");
const path = require("path");

// Socket Imports
const http = require("http").createServer(app); // Create HTTP server from app
const io = require("socket.io")(http); // Pass http server to socket.io

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB (local)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect("mongodb://localhost:27017/myprojectDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error", err));
}
// Routes
const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

// Socket
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  setInterval(() => {
    socket.emit("number", parseInt(Math.random() * 10));
  }, 1000);
});

// Start server
http.listen(port, () => {
  console.log(`App3 listening on port ${port}`);
});

// if (require.main === module) {
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`Server on ${PORT}`));
// }
module.exports = app;
