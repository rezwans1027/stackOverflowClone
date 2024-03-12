"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (existingInteraction) {
        return 
      }

      const question = await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

      if (question === null) return

      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
        tags: question.tags,
      });

    }
  } catch (error) {
    console.error(error);
  }
}
