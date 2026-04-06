const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const DNS_SERVERS = process.env.DNS_SERVERS
  ? process.env.DNS_SERVERS.split(",")
      .map((server) => server.trim())
      .filter(Boolean)
  : [];
const FRONTEND_ORIGINS = (
  process.env.FRONTEND_ORIGINS ||
  "http://localhost:3000,http://127.0.0.1:3000,http://127.0.0.1:5500,http://localhost:5500"
)
  .split(",")
  .map((origin) => origin.trim());

if (DNS_SERVERS.length > 0) {
  dns.setServers(DNS_SERVERS);
}

app.use(
  cors({
    origin: FRONTEND_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/todos", todoRoutes);

async function connectMongoDB() {
  try {
    if (!MONGO_URI) {
      console.error("MONGO_URI 환경변수가 설정되지 않았습니다.");
      return;
    }

    await mongoose.connect(MONGO_URI);
    console.log("연결성공");
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
    setTimeout(connectMongoDB, 5000);
  }
}

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

connectMongoDB();
