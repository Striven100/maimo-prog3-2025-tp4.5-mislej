import mongoose from "mongoose";
const {Schema} = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
});

export default mongoose.model("Category", categorySchema, "Categories");
