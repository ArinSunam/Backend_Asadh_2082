import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    shipping_address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
