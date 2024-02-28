"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const users = await User.find({}).sort({ joinedAt: -1 });
    return {users};

  } catch (error) {
    console.error(error);
  }
}

export async function getUserById(params: any) {
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
    await Question.find({author: user._id}).distinct('_id');

    await Question.deleteMany({author: user._id});

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


    const user = await User.findById(userId)

    if (!user.saved.includes(questionId)) {
      console.log("option 2")
      await User.findByIdAndUpdate(userId, { $push: { saved: questionId } }, { new: true });
    } else {  
      console.log("option 1")
      await User.findByIdAndUpdate(userId, { $pull: { saved: questionId } }, { new: true });
    }

    revalidatePath(path);

  } catch (error) {
    console.error(error);
  }
}