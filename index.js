import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routers/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true,
};
app.get("/", (req, res) => {
  res.send("Api is working");
});

connectDB()
  .then(({ getDB }) => {
    const isDbConnected =
      getDB() === null
        ? "Not Connected"
        : `${getDB()?.databaseName} - Connected`;
    console.log("Mongo Connection Established");
    console.log("Database \t: " + isDbConnected);
  })
  .catch((err) => {
    console.log("Error", err);
  });

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);

app.listen(port, () => {
  connectDB();
  console.log("server is running on port" + port);
});
