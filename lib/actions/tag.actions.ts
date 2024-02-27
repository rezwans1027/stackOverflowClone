"use server";

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/user.model";

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

export async function getAllTags({params}: GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = await Tag.find({});

    return {tags};

  } catch (error) {
    console.error(error);
  }
}
