"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_result_1 = __importDefault(require("../../utils/validator-result"));
const Post_1 = __importDefault(require("../../models/Post"));
const format_response_1 = __importDefault(require("./../../utils/format-response"));
const getResourseUrls = (files) => {
    const urls = [];
    return urls;
};
exports.default = async (req, res, next) => {
    try {
        console.log(req.files, req.body);
        const userId = req.userId;
        //validation check
        const isValid = await validator_result_1.default(req, "Invalid Parameters", 422);
        if (!isValid) {
            return;
        }
        const { description, postType, usersTags, hashTags, location } = req.body;
        /**
     * [
            {
              userName: "Jay",
              userId: "609e3e316b4da700f0840ed8",
            },
          ],
     */
        // resourceUrls, full url with domain;
        const resourceUrls = [];
        const post = new Post_1.default({
            userId: userId,
            description: description,
            postType: postType,
            resourceUrls: resourceUrls,
            hashTags: hashTags,
            usersTags: usersTags,
            location: location,
        });
        //   location: {
        //     cords: {
        //       lat: "0.0",
        //       lng: "0.0",
        //     },
        //     city: "Indore",
        //     state: "Madhya Pradesh",
        //     country: "India",
        //   },
        // });
        await post.save();
        return res.status(200).json(format_response_1.default("Post Successful", post));
    }
    catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(format_response_1.default(err.message, process.env.NODE_ENV === "production" ? {} : err.data || err, false, err));
        // next(err);
    }
};
