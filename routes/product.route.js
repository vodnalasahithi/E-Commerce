import express from "express";
import { ProductModel } from "../models/product.model.js";
import { handleRouteError } from "../helpers/error-handling.js";
import {
  getFileURL,
  uploadMultiple,
  handleUploadError,
} from "../middleware/upload.middleware.js";
import { adminOnly, userAndAdmin } from "../middleware/roles.middleware.js";
import {
  handleValidationErrors,
  createProductValidation,
  updateProductValidation,
} from "../validators/product.validator.js";

const router = express.Router();

router.post(
  "/",
  adminOnly,
  uploadMultiple,
  handleUploadError,
  createProductValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      let imageURLs = [];
      if (req.files && req.files.length > 0) {
        imageURLs = req.files.map((file) => getFileURL(req, file.filename)); // Assuming you are using multer and storing the file path
      }
      const newProduct = new ProductModel({
        title: req.body.title,
        price: parseFloat(req.body.price),
        category: req.body.category,
        countInStock: parseInt(req.body.countInStock),
        description: req.body.description,
        images: imageURLs,
      });

      const savedProduct = await newProduct.save();

      return res.status(201).json({
        success: true,
        message: req.t("productCreated"),
        data: savedProduct,
      });
    } catch (error) {
      handleRouteError(res, error);
    }
  },
);

router.get("/", userAndAdmin, async (req, res) => {
  try {
    const filter = {};
    const { search } = req.query;
    const categoryID = req.query.CategoryID;

    // Pagination Params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (categoryID) {
      filter.category = categoryID;
    }

    const totalCount = await ProductModel.countDocuments(filter);

    const productsList = await ProductModel.find(filter)
      .populate("category")
      .skip(skip)
      .limit(limit);

    const sharedDataResponse = {
      search,
      categoryID,
      page,
      limit,
      totalProducts: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1,
    };
    if (!productsList || productsList.length === 0) {
      return res.send({
        message: req.t("noProducts"),
        data: [],
        ...sharedDataResponse,
      });
    }
    res.send({
      data: productsList,
      ...sharedDataResponse,
    });
  } catch (error) {
    handleRouteError(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("category");
    if (!product) {
      return res.status(401).send({ message: req.t("noProductFound") });
    }

    return res.send(product);
  } catch (error) {
    handleRouteError(error, res);
  }
});

router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).send({
        message: req.t("productNotFound"),
      });
    }
    return res.send({ message: req.t("productDeletedSuccessfully") });
  } catch (error) {
    handleRouteError(error, res);
  }
});

router.put(
  "/:id",
  adminOnly,
  uploadMultiple,
  handleUploadError,
  updateProductValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      //Check if product exists

      const existingProduct = await ProductModel.findById(req.params.id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: req.t("productNotFound"),
        });
      }
      // Prepare update data
      const updateData = {};

      // Only update fields that are provided in the request
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.price !== undefined)
        updateData.price = parseFloat(req.body.price);
      if (req.body.category !== undefined)
        updateData.category = req.body.category;
      if (req.body.countInStock !== undefined)
        updateData.countInStock = req.body.countInStock;
      if (req.body.description !== undefined)
        updateData.description = req.body.description;

      //Handle image uploads
      if (req.files && req.files.length > 0) {
        const imageURLs = req.files.map((file) =>
          getFileURL(req, file.filename),
        );

        if (req.body.replaceImages === "true") {
          updateData.images = imageURLs;
        } else {
          updateData.images = [...existingProduct.images, ...imageURLs];
        }
      }

      // Update the product
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        },
      ).populate("category");

      return res.status(200).json({
        success: true,
        message: req.t("productUpdateSuccessfully"),
        data: updatedProduct,
      });
    } catch (error) {
      handleRouteError(error, res);
    }
  },
);
export default router;
