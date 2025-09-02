import mongoose from "mongoose";

const categories = ["Citrus Fruit", "Berries", "Tropical fruits"];
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    Categories: {
      type: String,
      enum: categories,
    },
    rating: {
      type: Number,
    },
    in_stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
