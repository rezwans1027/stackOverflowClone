"use server";

import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";
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

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .sort({ createdAt: -1 });

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
