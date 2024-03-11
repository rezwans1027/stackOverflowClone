"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { searchQuery = "", filter = "", page = 1, pageSize = 1 } = params;

    let sort = {};

    switch (filter) {
      case "new_users":
        sort = { joinedAt: -1 };
        break;
      case "old_users":
        sort = { joinedAt: 1 };
        break;
      case "top_contributors":
        sort = { reputation: -1 };
        break;
      default:
        break;
    }

    const query = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const totalDocuments = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const users = await User.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { users, totalPages };
  } catch (error) {
    console.error(error);
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = userData;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user from database
    // and questions, answers, comments, and likes, etc.

    // const userQuestionIds = await Question.find({author: user._id}).distinct('_id');
    await Question.find({ author: user._id }).distinct("_id");

    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, likes, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.error(error);
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user.saved.includes(questionId)) {
      await User.findByIdAndUpdate(
        userId,
        { $push: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [totalQuestionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);
    const [totalAnswerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);
    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, views: 1 } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
      { type: 'QUESTION_UPVOTES' as BadgeCriteriaType, count: totalQuestionUpvotes?.totalUpvotes || 0 },
      { type: 'ANSWER_UPVOTES' as BadgeCriteriaType, count: totalAnswerUpvotes?.totalUpvotes || 0 },
      { type: 'TOTAL_VIEWS' as BadgeCriteriaType, count: questionViews?.totalViews || 0 },
    ]

    const badgeCounts = assignBadges({criteria});

    return { user, totalQuestions, totalAnswers, badgeCounts };
  } catch (error) {
    console.error(error);
  }
}

export async function getUserProfile(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId }).select(
      "clerkId name username bio location portfolioWebsite"
    );

    return { user };
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserProfile(userData: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = userData;

    const { name, username, portfolioWebsite, location, bio } = updateData;

    await User.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          name,
          username,
          portfolioWebsite,
          location,
          bio,
        },
      }
    );

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}
