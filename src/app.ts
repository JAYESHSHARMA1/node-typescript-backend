//configure environment variables
import dotenv from "dotenv";
dotenv.config();

//import packages
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import fs from "fs";
import path from "path";

//import socket from utils
import Socket from "./utils/socket";
//import response formatter
import fr from "./utils/format-response";

//importing routes
import indexRouter from "./routes/index";

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../", "access.log"),
  {
    flags: "a",
  }
);

//initialize express app
const app = express();

//setup middleware functions
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://app.everest-digital.club",
      "https://everest.vercel.app",
      "https://dev-app.everest-digital.club",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static(path.join(__dirname, "../", "public")));

//initialize api routes
app.use("/api/v1", indexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  // 404 response
  const notFound: any = new Error("Not Found");
  next(fr(notFound.message, notFound, false, notFound, 404));
});

//error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json(err);
});

//setting constants
const PORT = process.env.PORT || 3000;
const MONGO_URI: string = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.lbqsd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//initialize database connection
mongoose
  .connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((connection) => {
    // listening at PORT
    const server = app.listen(PORT);
    console.log("Starting server in env: " + process.env.NODE_ENV);
    const io = Socket.init(server);
    io.on("connection", (socket: any) => {
      console.log("New Connection");
    });
  })
  .catch((err) => {
    console.log(err);
  });
