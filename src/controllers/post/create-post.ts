import { Request, Response, NextFunction } from "express";
import validationCheck from "../../utils/validator-result";
import Post from "../../models/Post";
import fr from "./../../utils/format-response";

const getResourseUrls = (files: any) => {
  const urls: String[] = [];
  return urls;
};

export default async (req: any, res: Response, next: NextFunction) => {
  try {
    console.log(req.files, req.body);
    const userId = req.userId;

    //validation check
    const isValid = await validationCheck(req, "Invalid Parameters", 422);
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
    const resourceUrls: String[] = [];
    const post = new Post({
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
    return res.status(200).json(fr("Post Successful", post));
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(
      fr(
        err.message,
        process.env.NODE_ENV === "production" ? {} : err.data || err,
        false,
        err
      )
    );
    // next(err);
  }
};
