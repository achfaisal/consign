import path from "path"; // <-- Import path module
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import publicRouter from "./routes/public-route.js";
import router from "./routes/route.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { fileFilter, fileStorage } from "./application/multer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }).array("image", 3),
);
app.use(publicRouter);
app.use(router);
app.use(errorMiddleware);

// Dev
app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});

export default app;
