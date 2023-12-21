import { Document, Schema, model, models } from "mongoose";

export interface ICatgory extends Document {
  _id: string;
  name: string;
}

const CategorySchema = new Schema({
  name: { type: String, required: true },
});

export const Category = models.Category || model("Category", CategorySchema);
