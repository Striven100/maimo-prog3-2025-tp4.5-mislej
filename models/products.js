import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  backdrop_path: { type: String },
  overview: { type: String },
  rank: { type: String },
  release_date: { type: String },
  vote_average: { type: Number },
  vote_count: { type: Number },
  categories: [{ type: Schema.Types.ObjectId, ref:"Category" }]
}, { timestamps: true });

export default mongoose.model("Product", productSchema, "Products");