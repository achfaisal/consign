import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import publicRouter from "./routes/publicRoute.js";
import { errorMiddleware } from "./middleware/error-middleware.js";

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(publicRouter);
app.use(errorMiddleware);

// Dev
app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
