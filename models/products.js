import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pixelData: { type: [String], default: [] },
    description: { type: String },
    backdrop_path: { type: String },
    price: { type: String },
    categories: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema, "Products");
