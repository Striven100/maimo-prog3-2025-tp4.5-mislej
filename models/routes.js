import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const RouteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    items: { type: [ItemSchema], required: true },
    total: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Route", RouteSchema, "Routes");
