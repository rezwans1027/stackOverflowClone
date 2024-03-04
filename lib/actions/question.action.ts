"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  GetSavedQuestionsParams,
  GetUserStatsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";

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
      const upvotesSort = upvotesCountB - upvotesCountA;

      // If upvotes count is equal, sort by views count
      if (upvotesSort === 0) {
        return b.views - a.views; // Sort in descending order
      }

      return upvotesSort;
    });

    // Apply pagination
    questions = questions.slice((page - 1) * pageSize, page * pageSize);

    return { questions, totalPages };
  } catch (error) {
    console.error(error);
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.findByIdAndDelete(questionId);
    await Answer.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );
    await User.updateMany(
      { saved: questionId },
      { $pull: { saved: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase();

    const { title, content, tags, questionId, path } = params;

    // Find and update the question's title and content
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $set: { title, content } },
      { new: true }
    );

    // Assuming `tags` is an array of tag names to be associated with the question
    const updatedTagDocs: any[] = [];
    const currentTagIds = question.tags; // Assuming this is an array of tag IDs currently associated with the question

    // Find or create new tags and add question to them
    for (const tagName of tags) {
      const tag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tagName}$`, "i") } },
        {
          $setOnInsert: { name: tagName },
          $addToSet: { questions: question._id },
        },
        { upsert: true, new: true }
      );

      updatedTagDocs.push(tag._id);
    }

    // Identify tags that were removed
    const removedTagIds = currentTagIds.filter(
      (tagId: any) =>
        !updatedTagDocs
          .map((updatedId) => updatedId.toString())
          .includes(tagId.toString())
    );

    // Remove the question from tags that are no longer associated
    if (removedTagIds.length > 0) {
      await Tag.updateMany(
        { _id: { $in: removedTagIds } },
        { $pull: { questions: question._id } }
      );
    }

    // Update the question document with the new set of tags
    await Question.findByIdAndUpdate(questionId, {
      $set: { tags: updatedTagDocs },
    });

    // Revalidate path if necessary
    await revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}
