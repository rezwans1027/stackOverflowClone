"use server";

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
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

    return [{ _id: '0', name: 'reactjs' }, { _id: '1', name: 'nodejs' }, ]

  } catch (error) {
    console.error(error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = await Tag.find({});

    return {tags};

  } catch (error) {
    console.error(error);
  }
}

export async function getTagNameById(params: string) {
  try {
    connectToDatabase();

    const { name } = await Tag.findById(params);

    return name

  } catch (error) {
    console.error(error);
  }
}

export async function getQuestionsByTag(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, searchQuery } = params;

    const tag = await Tag.findById(tagId).populate({
      path: "questions",
      match: searchQuery ? { title: { $regex: new RegExp(searchQuery, "i") } } : {},
      model: Question,
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name picture" }
      ],
      select: "_id title createdAt upvotes views answers",
    });

    return { tagTitle: tag.name, questions: tag.questions };
  } catch (error) {
    console.error(error);
  }
}

export async function getPopularTags () {
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
      { $project: { followersCount: 0 } }
    ]);
    console.log(tags)

    return tags;

  } catch (error) {
    console.error(error);
  }
}