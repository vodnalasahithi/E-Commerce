import { body, validationResult } from "express-validator";

export const createProductValidation = [
  body("title")
    .notEmpty()
    .withMessage(
      (value, { req }) =>
        req.t("productTitleRequired") || "Product title is required",
    )
    .isLength({ min: 2, max: 100 })
    .withMessage(
      (value, { req }) =>
        req.t("productTitleLength") ||
        "Product title must be between 2 and 100 characters",
    ),
  body("price")
    .notEmpty()
    .withMessage(
      (value, { req }) => req.t("priceRequired") || "Product price is required",
    )
    .isFloat({ min: 0, max: 1000000 })
    .withMessage(
      (value, { req }) =>
        req.t("priceRange") || "Product price must be between 0 and 1,000,000",
    ),
  body("category")
    .notEmpty()
    .withMessage(
      (value, { req }) =>
        req.t("categoryRequired") || "Product category is required",
    )
    .isMongoId()
    .withMessage(
      (value, { req }) =>
        req.t("categoryInvalid") ||
        "Product category must be a valid MongoDB ObjectId",
    ),
  body("countInStock")
    .notEmpty()
    .withMessage(
      (value, { req }) =>
        req.t("stockCountRequired") || "Product stock count is required",
    )
    .isInt({ min: 0, max: 99999 })
    .withMessage(
      (value, { req }) =>
        req.t("stockCountRange") ||
        "Product stock count must be between 0 and 99,999",
    ),
  body("description")
    .notEmpty()
    .withMessage(
      (value, { req }) =>
        req.t("descriptionRequired") || "Product description is required",
    )
    .isLength({ min: 10, max: 1000 })
    .withMessage(
      (value, { req }) =>
        req.t("descriptionLength") ||
        "Product description must be between 10 and 1,000 characters",
    ),
  body("rating.average")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 1, max: 5 })
    .withMessage(
      (value, { req }) =>
        req.t("ratingAverageRange") ||
        "Product rating average must be between 1 and 5",
    ),
  body("rating.count")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage(
      (value, { req }) =>
        req.t("ratingCountRange") || "Product rating count cannot be negative",
    ),
];

export const updateProductValidation = [
  body("title")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage(
      (value, { req }) =>
        req.t("productTitleLength") ||
        "Product length should be between 2 and 100",
    ),
  body("category")
    .optional()
    .isMongoId()
    .withMessage(
      (value, { req }) => req.t("invalidCategoryId") || "Invalid category Id",
    ),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      (value, { req }) =>
        req.t("pricePositive") || "Price must be positive number",
    ),
  body("description")
    .optional()
    .isLength({ min: 5, max: 1000 })
    .withMessage(
      (value, { req }) =>
        req.t("descriptionLength") ||
        "Description should be between 5 and 1000 characters.",
    )
    .trim(),
  body("countInStock")
    .optional()
    .isInt({ min: 0, max: 99999 })
    .withMessage(
      (value, req) =>
        req.t("stockCountRange") || "Stock count must be between 0 and 99999.",
    ),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};
