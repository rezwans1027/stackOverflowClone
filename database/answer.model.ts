import { Schema, model, models, Document } from "mongoose";

interface IAnswer extends Document {
  question: Schema.Types.ObjectId;
  content: string;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
}

const AnswerSchema = new Schema<IAnswer>({
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true},
  createdAt: { type: Date, default: Date.now },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
