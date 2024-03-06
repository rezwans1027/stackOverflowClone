"use server";

import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams, GetUserStatsParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, question, author, path } = params;

    const answer = await Answer.create({
      content,
      question, // This is the question id
      author, // This is the user id
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function getAnswersByQuestionId(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId, sortBy } = params;

    console.log("sortBy", sortBy);

    let sort = {};

    switch (sortBy) {
      case "recent":
        sort = { createdAt: -1 };
        break;
      case "old":
        sort = { createdAt: 1 };
        break;
      case "highestUpvotes":
        sort = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sort = { upvotes: 1 };
        break;
      default:
        sort = { createdAt: -1, upvoted: -1 };
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .sort(sort);

    return { answers };
  } catch (error) {
    console.error(error);
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasUpvoted, path } = params;

    await Answer.findByIdAndUpdate(
      answerId,
      hasUpvoted
        ? { $pull: { upvotes: userId } }
        : { $push: { upvotes: userId }, $pull: { downvotes: userId } },
        { new: true }
    );

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw new Error("Error upvoting Answer");
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasDownvoted, path } = params;

    await Answer.findByIdAndUpdate(
      answerId,
      hasDownvoted
        ? { $pull: { downvotes: userId } }
        : { $push: { downvotes: userId }, $pull: { upvotes: userId } },
        { new: true }
    );

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw new Error("Error upvoting Answer");
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page, pageSize } = params;

    const totalAnswersCount = await Answer.countDocuments({
      author: userId,
    });
    const totalAnswerPages = Math.ceil(totalAnswersCount / pageSize);

    let answers = await Answer.find({ author: userId })
      .populate({ path: "author", model: User, select: "_id name picture" })
      .populate({ path: "upvotes", model: User, select: "_id" })
      .populate({ path: "question", model: Question, select: "_id title" })

    // Sort answers based on the number of upvotes
    answers.sort((a, b) => {
      const upvotesCountA = a.upvotes.length;
      const upvotesCountB = b.upvotes.length;
      const upvotesSort = upvotesCountB - upvotesCountA;

      return upvotesSort;
    });

    // Apply pagination
    answers = answers.slice((page - 1) * pageSize, page * pageSize);

    return { answers, totalAnswerPages };
  } catch (error) {
    console.error(error);
  }
}

export async function deleteAnswer({ answerId, path }:DeleteAnswerParams) {
  try {
    connectToDatabase();

    const answer = await Answer.findByIdAndDelete(answerId);
    await Question.findByIdAndUpdate(answer.question, { $pull: { answers: answerId } });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

