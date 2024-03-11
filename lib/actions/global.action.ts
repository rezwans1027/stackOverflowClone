"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

export async function getGlobalResults(params: SearchParams) {
  try {
    connectToDatabase();

    const { query = "", type } = params;

    const questionsLimit = type === "question" ? 8 : type === "none" ? 0 : 2;
    const tagsLimit = type === "ta" ? 8 : type === "none" ? 0 : 2;
    const usersLimit = type === "user" ? 8 : type === "none" ? 0 : 2;
    const answersLimit = type === "answer" ? 8 : type === "none" ? 0 : 2;

    interface questionQuery {
      $text?: { $search: string };
      $or?: Array<{
        title?: { $regex: string; $options: string };
        content?: { $regex: string; $options: string };
      }>;
    }

    const result = [];

    const baseQuery: questionQuery = { $text: { $search: query! } };
    const regexQuery: questionQuery = {
      $or: [
        { title: { $regex: query!, $options: "i" } },
        { content: { $regex: query!, $options: "i" } },
      ],
    };

    if (!type || type === "question") {
      let questions = await Question.find(baseQuery)
        .limit(questionsLimit)
        .select("_id title");

      if (questions.length === 0) {
        questions = await Question.find(regexQuery)
          .limit(questionsLimit)
          .select("_id title");
      }

      for (const question of questions) {
        result.push({
          name: question.title,
          id: question._id.toString(),
          type: "Question",
        });
      }
    }

    if (!type || type === "answer") {
      const answers = await Answer.find({
        content: { $regex: query!, $options: "i" },
      })
        .limit(answersLimit)
        .select("question")
        .populate({ path: "question", model: Question, select: "_id title" });

      for (const answer of answers) {
        result.push({
          name: answer.question.title,
          id: answer.question._id.toString(),
          type: "Answer",
        });
      }
    }

    if (!type || type === "tag") {
      const tags = await Tag.find({ name: { $regex: query!, $options: "i" } })
        .limit(tagsLimit)
        .select("_id name");

      for (const tag of tags) {
        result.push({ name: tag.name, id: tag._id.toString(), type: "Tag" });
      }
    }

    if (!type || type === "user") {
      const users = await User.find({
        $or: [
          { name: { $regex: query!, $options: "i" } },
          { username: { $regex: query!, $options: "i" } },
        ],
      })
        .limit(usersLimit)
        .select("clerkId name");

      for (const user of users) {
        result.push({ name: user.name, id: user.clerkId, type: "User" });
      }
    }

    return result;
    
  } catch (error) {
    console.error(error);
    return [];
  }
}
