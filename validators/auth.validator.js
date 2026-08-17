import { body, validationResult } from "express-validator";

export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage((value, { req }) => req.t("enterValidEmail")),
  body("password").isLength({ min: 6 }),
  body("role").optional().isIn(["admin", "user"]),
  body("userName")
    .notEmpty()
    .withMessage((value, { req }) => req.t("enterValidUserName")),
  body("city")
    .notEmpty()
    .withMessage((value, { req }) => req.t("enterCityName")),
  body("addressLine1")
    .notEmpty()
    .withMessage((value, { req }) => req.t("enterValidAddressLine1")),
  body("addressLine2").optional(),
  body("phoneNumber")
    .notEmpty()
    .withMessage((value, { req }) => req.t("enterValidPhoneNumber"))
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage((value, { req }) => req.t("validPhoneNumber")),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage((value, { req }) => req.t("enterValidEmail")),
  body("password")
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.t("passwordMinLength")),
];

export const updateUserValidations = [
  body("email")
    .optional()
    .isEmail()
    .withMessage((value, { req }) => req.t("enterValidEmail")),
  body("password").optional().isLength({ min: 6 }),
  body("role").optional().isIn(["admin", "user"]),
  body("userName")
    .optional()
    .notEmpty()
    .withMessage((value, { req }) => req.t("enterValidUserName")),
  body("city")
    .optional()
    .notEmpty()
    .withMessage((value, { req }) => req.t("enterCityName")),
  body("addressLine1")
    .optional()
    .notEmpty()
    .withMessage((value, { req }) => req.t("enterValidAddressLine1")),
  body("addressLine2").optional(),
  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage((value, { req }) => req.t("enterValidPhoneNumber"))
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage((value, { req }) => req.t("validPhoneNumber")),
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
