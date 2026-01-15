import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"
import externalNewsRoutes from "./routes/externalNews.route.js"
import aiRoutes from "./routes/ai.route.js";
import translateRoutes from "./routes/translate.route.js";

import weatherRoutes from "./routes/weather.route.js";
import notificationRoutes from "./routes/notification.route.js";
import affiliateProductRoutes from "./routes/affiliateProduct.route.js";

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// for allowing json object in req body
app.use(express.json())
app.use(cookieParser())

app.listen(5000, () => {
  console.log("Server is running on port 5000!")
})

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true, // 
}));

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/external", externalNewsRoutes);
app.use(express.json({ limit: "1mb" }));
app.use("/api/ai", aiRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/affiliate-products", affiliateProductRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
