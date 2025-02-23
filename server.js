import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(morgan("dev")); // Logs API request details in a concise format

// Custom middleware to log request & response
app.use((req, res, next) => {
  console.log(`\n[API Request] ${req.method} ${req.url}`);
  console.log("Request Body:", req.body);

  // Capture the response
  const oldSend = res.send;
  res.send = function (data) {
    console.log("[API Response]:", data);
    oldSend.apply(res, arguments);
  };

  next();
});

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
