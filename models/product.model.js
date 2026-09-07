import mongoose from "mongoose";
import { addCommonVirtuals } from "../helpers/mongoose-plugin.js";


const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name is requied"],
      trim: true,
      minLength: [2, "Prodcut name must be at least 2 characters"],
      maxLength: [100, "Product name must be at most 100 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Category is required"],
      ref: "Category",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: [5, "Description must be at least 5 characters"],
      maxLength: [1000, "Description must be at most 1000 characters"],
    },
    images: {
      type: [String],
      required: [true, "Images are required"],
    },
    countInStock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock count cannot be negative"],
      max: [99999, "Stock count cannot be nore than 99999"],
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 5,
        min: [1, "Rating cannot be less than 1 star"],
        max: [5, "Rating cannot be more than 5 stars"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Rating count cannot be negative"],
      },
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views count cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

// id instead of _id
productSchema.plugin(addCommonVirtuals);

export const ProductModel = mongoose.model("Product", productSchema);
