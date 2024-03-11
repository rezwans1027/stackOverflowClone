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
import Interaction from "@/database/interaction.model";

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

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    await Interaction.create({
      user: question.author._id,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase(); // Assuming this function establishes a MongoDB connection

    const { searchQuery = "", filter = "", page = 1, pageSize = 3 } = params; // Use the search query from parameters

    interface query {
      $text?: { $search: string };
      answers?: { $size: number };
      $or?: Array<{
        title?: { $regex: string; $options: string };
        content?: { $regex: string; $options: string };
      }>;
    }

    let sort = {};
    const baseQuery: query = { $text: { $search: searchQuery } };
    const regexQuery: query = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ],
    };

    switch (filter) {
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "recommended":
        sort = { upvotes: -1, views: -1, createdAt: -1 };
        break;
      case "frequent":
        sort = { views: -1 };
        break;
      case "unanswered":
        baseQuery.answers = { $size: 0 };
        regexQuery.answers = { $size: 0 };
        break;
      default:
        break;
    }

    let totalDocuments = await Question.countDocuments(baseQuery);

    let questions = await Question.find(baseQuery)
      .populate({ path: "tags", model: "Tag" })
      .populate({ path: "author", model: "User" })
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // If the full-text search returns no results, fall back to regex search
    if (questions.length === 0) {
      totalDocuments = await Question.countDocuments(regexQuery);

      questions = await Question.find(regexQuery)
        .populate({ path: "tags", model: "Tag" })
        .populate({ path: "author", model: "User" })
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    }

    const totalPages = Math.ceil(totalDocuments / pageSize);

    return { questions, totalPages };
  } catch (error) {
    console.error(error);
    throw error; // It might be useful to re-throw the error or handle it as per your error handling policy
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
    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    const question = await Question.findByIdAndUpdate(
      questionId,
      hasUpvoted
        ? { $pull: { upvotes: userId } }
        : { $push: { upvotes: userId }, $pull: { downvotes: userId } },
      { new: true }
    ).select("author");

    const authorId = question.author.toString();

    await User.findByIdAndUpdate(
      userId,
      hasUpvoted
        ? { $inc: { reputation: -1 } }
        : hasDownvoted
          ? { $inc: { reputation: 2 } }
          : { $inc: { reputation: 1 } }
    );

    await User.findByIdAndUpdate(
      authorId,
      hasUpvoted
        ? { $inc: { reputation: -10 } }
        : hasDownvoted
          ? { $inc: { reputation: 12 } }
          : { $inc: { reputation: 10 } }
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
    const { questionId, userId, hasDownvoted, hasUpvoted, path } = params;

    const question = await Question.findByIdAndUpdate(
      questionId,
      hasDownvoted
        ? { $pull: { downvotes: userId } }
        : { $push: { downvotes: userId }, $pull: { upvotes: userId } },
      { new: true }
    ).select("author");

    const authorId = question.author.toString();

    await User.findByIdAndUpdate(
      userId,
      hasDownvoted
        ? { $inc: { reputation: 1 } }
        : hasUpvoted
          ? { $inc: { reputation: -2 } }
          : { $inc: { reputation: -1 } }
    );

    await User.findByIdAndUpdate(
      authorId,
      hasDownvoted
        ? { $inc: { reputation: 2 } }
        : hasUpvoted
          ? { $inc: { reputation: -12 } }
          : { $inc: { reputation: -2 } }
    );

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw new Error("Error downvoting question");
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 2 } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sort = {};

    switch (filter) {
      case "most_recent":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "most_viewed":
        sort = { views: -1 };
        break;
      case "most_answered":
        sort = { answersCount: -1 };
        break;
      case "most_voted":
        sort = { upvotesCount: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId });

    const totalDocuments = await Question.countDocuments({
      _id: { $in: user.saved },
      ...query,
    });

    const totalPages = Math.ceil(totalDocuments / pageSize);

    const users = await User.aggregate([
      { $match: { clerkId } },
      {
        $lookup: {
          from: "questions",
          localField: "saved",
          foreignField: "_id",
          as: "saved",
          pipeline: [
            { $match: query },
            {
              $addFields: {
                upvotesCount: { $size: "$upvotes" },
                answersCount: { $size: "$answers" },
              },
            },
            ...(filter ? [{ $sort: sort }] : []), // Sort by upvotesCount in descending order
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags",
                pipeline: [{ $project: { _id: 1, name: 1 } }],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
                pipeline: [{ $project: { _id: 1, name: 1, picture: 1 } }],
              },
            },
            { $unwind: "$author" },
            {
              $project: {
                _id: 1,
                title: 1,
                createdAt: 1,
                upvotes: 1,
                views: 1,
                tags: 1,
                author: 1,
                answers: 1,
                upvotesCount: 1,
              },
            },
          ],
        },
      },
    ]);

    const savedQuestions = users[0].saved;

    return { savedQuestions, totalPages };
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

    const question = await Question.findByIdAndDelete(questionId).select("author");
    await Answer.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );
    await User.updateMany(
      { saved: questionId },
      { $pull: { saved: questionId } }
    );

    await User.findByIdAndUpdate(question.author, { $inc: { reputation: -5 } })

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

export async function getTopQuestions() {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .select("_id title")
      .sort({ upvotes: -1, views: -1 })
      .limit(5);

    return questions;
  } catch (error) {
    console.error(error);
  }
}
