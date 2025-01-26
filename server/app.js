require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/test", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 5000;

// Load SSL certificate and key
const key = fs.readFileSync(
  path.join(__dirname, "../client/geo_attendance-privateKey.key"),
  "utf8"
);
const cert = fs.readFileSync(
  path.join(__dirname, "../client/geo_attendance.crt"),
  "utf8"
);

const httpsServer = https.createServer({ key, cert }, app);
const httpServer = http.createServer(app);

// Start both HTTP and HTTPS servers
httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
