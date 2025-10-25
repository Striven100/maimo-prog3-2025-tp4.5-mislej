import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    price: String,
    quantity: Number,
  },
  { _id: false }
)

const RouteSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    items: [ItemSchema],
    total: String,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
)

export default mongoose.model("Route", RouteSchema, "Routes")
