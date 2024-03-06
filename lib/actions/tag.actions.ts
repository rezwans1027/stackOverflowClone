"use server";

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import User from "@/database/user.model";
import Question from "@/database/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    // eslint-disable-next-line no-unused-vars
    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // interaction...

    return [
      { _id: "0", name: "reactjs" },
      { _id: "1", name: "nodejs" },
    ];
  } catch (error) {
    console.error(error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery = "", filter = "", page = 1, pageSize = 6 } = params;

    let sort = {};

    switch (filter) {
      case "popular":
        sort = { questionCount: -1 }; // add followers count here as well
        break;
      case "name":
        sort = { name: 1 };
        break;
      case "recent":
        sort = { createdAt: -1 };
        break;
      case "old":
        sort = { createdAt: 1 };
        break;
      default:
        sort = { questionCount: -1 };
        break;
    }

    const totalTags = await Tag.countDocuments({
      name: { $regex: new RegExp(searchQuery, "i") },
    });
    const totalPages = Math.ceil(totalTags / pageSize);

    const tags = await Tag.aggregate(
      [
        // Step 1: Match tags based on the search query.
        {
          $match: {
            name: { $regex: new RegExp(searchQuery, "i") },
          },
        },
        // Step 2: Lookup to join with the questions collection.
        {
          $lookup: {
            from: "questions", // This should be the name of your questions collection in MongoDB
            localField: "questions", // The field in the tags document that contains question IDs
            foreignField: "_id", // The matching field in the questions document
            as: "questionDetails", // The name of the field where the joined documents will be placed
          },
        },
        // Step 3: Project the necessary fields, including the count of questions.
        {
          $project: {
            name: 1, // Include other tag fields as necessary.
            questionCount: { $size: "$questionDetails" }, // Count the number of questions joined in the previous step.
            followersCount: { $size: "$followers" },
          },
        },
        // Apply sorting, skipping, and limiting as needed.
        { $sort: sort },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ],
      {
        collation: { locale: "en", strength: 2 },
      }
    );

    console.log(tags[1]);

    return { tags, totalPages };
  } catch (error) {
    console.error(error);
  }
}

export async function getTagNameById(params: string) {
  try {
    connectToDatabase();

    const { name } = await Tag.findById(params);

    return name;
  } catch (error) {
    console.error(error);
  }
}

export async function getQuestionsByTag(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, searchQuery = "", page = 1, pageSize = 1 } = params;

    const totalQuestions = await Question.countDocuments({
      tags: tagId,
      title: { $regex: new RegExp(searchQuery, "i") },
    });

    const totalPages = Math.ceil(totalQuestions / pageSize);

    const tag = await Tag.findById(tagId).populate({
      path: "questions",
      match: { title: { $regex: new RegExp(searchQuery, "i") } },
      model: Question,
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name picture" },
      ],
      select: "_id title createdAt upvotes views answers",
      options: {
        sort: { createdAt: -1 },
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
    });

    return { tagTitle: tag.name, questions: tag.questions, totalPages };
  } catch (error) {
    console.error(error);
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();

    const tags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          questionsCount: { $size: "$questions" },
          followersCount: { $size: "$followers" },
        },
      },
      { $sort: { questionsCount: -1, followersCount: -1 } },
      { $limit: 5 },
      { $project: { followersCount: 0 } },
    ]);

    return tags;
  } catch (error) {
    console.error(error);
  }
}
