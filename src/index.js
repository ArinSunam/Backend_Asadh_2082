import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
dotenv.config();

const app = express();
const port = 5000;
const hostname = "127.0.0.1";

app.use(cors());
app.get("/", (req, res) => res.send("Server is running"));

connectDB()
  .then(() =>
    app.listen(port, hostname, () => {
      console.log(`Server running successfully at ${hostname}:${port}`);
    })
  )
  .catch((err) => console.log("Error in connection::", err));

//universal middlewares

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/api/public", express.static("public"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
