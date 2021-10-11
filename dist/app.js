"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//configure environment variables
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//import packages
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
//import socket from utils
const socket_1 = __importDefault(require("./utils/socket"));
//import response formatter
const format_response_1 = __importDefault(require("./utils/format-response"));
//importing routes
const index_1 = __importDefault(require("./routes/index"));
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, "../", "access.log"), {
    flags: "a",
});
//initialize express app
const app = express_1.default();
//setup middleware functions
app.use(helmet_1.default());
app.use(compression_1.default());
app.use(cors_1.default({
    origin: [
        "http://localhost:4200",
        "https://app.everest-digital.club",
        "https://everest.vercel.app",
        "https://dev-app.everest-digital.club",
    ],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morgan_1.default("combined", { stream: accessLogStream }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../", "public")));
//initialize api routes
app.use("/api/v1", index_1.default);
app.use((req, res, next) => {
    // 404 response
    const notFound = new Error("Not Found");
    next(format_response_1.default(notFound.message, notFound, false, notFound, 404));
});
//error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json(err);
});
//setting constants
const PORT = process.env.PORT || 3000;
const MONGO_URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.lbqsd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//initialize database connection
mongoose_1.default
    .connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((connection) => {
    // listening at PORT
    const server = app.listen(PORT);
    console.log("Starting server in env: " + process.env.NODE_ENV);
    const io = socket_1.default.init(server);
    io.on("connection", (socket) => {
        console.log("New Connection");
    });
})
    .catch((err) => {
    console.log(err);
});
