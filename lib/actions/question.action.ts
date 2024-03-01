"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  GetSavedQuestionsParams,
  GetUserStatsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.error(error);
  }
}

export async function getQuestionById({ questionId }: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting question by ID");
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasUpvoted, path } = params;

    await Question.findByIdAndUpdate(
      questionId,
      hasUpvoted
        ? { $pull: { upvotes: userId } }
        : { $push: { upvotes: userId }, $pull: { downvotes: userId } },
      { new: true }
    );

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw new Error("Error upvoting question");
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasDownvoted, path } = params;

    await Question.findByIdAndUpdate(
      questionId,
      hasDownvoted
        ? { $pull: { downvotes: userId } }
        : { $push: { downvotes: userId }, $pull: { upvotes: userId } },
      { new: true }
    );

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw new Error("Error upvoting question");
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      model: Question,
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name picture" },
      ],
      select: "_id title createdAt upvotes views answers",
    });

    return user.saved;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page, pageSize } = params;

    const totalQuestionsCount = await Question.countDocuments({
      author: userId,
    });
    const totalPages = Math.ceil(totalQuestionsCount / pageSize);

    let questions = await Question.find({ author: userId })
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({ path: "author", model: User, select: "_id name picture" })
      .populate({ path: "upvotes", model: User, select: "_id" });

    // Sort questions based on the number of upvotes
    questions.sort((a, b) => {
      const upvotesCountA = a.upvotes.length;
      const upvotesCountB = b.upvotes.length;
        
      return upvotesCountB - upvotesCountA;
    });

    // Apply pagination
    questions = questions.slice((page - 1) * pageSize, page * pageSize);

    return { questions, totalPages };
  } catch (error) {
    console.error(error);
  }
}

