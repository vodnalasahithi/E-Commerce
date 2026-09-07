import express from "express";
import { Category } from "../models/category.model.js";
import { adminOnly, userAndAdmin } from "../middleware/roles.middleware.js";
const router = express.Router();

router.post("/", adminOnly, async (req, res) => {
  try {
    if (!req.body.name || req.body.name.trim().length < 3) {
      return res
        .status(400)
        .send({ message: req.t("categoryValidationFailed") });
    }
    const newCategory = await Category.create({
      name: req.body.name,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

router.get("/", userAndAdmin, async (req, res) => {
  try {
    const categoriesList = await Category.find();
    if (!categoriesList || categoriesList.length === 0) {
      return res.send({ message: req.t("noCategoriesFound") });
    }
    res.send(categoriesList);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send({ message: req.t("categoryNotFound") });
    }
    return res.send({ message: req.t("categoryDeletedSuccessfully") });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

router.put("/:id", adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    if (!category) {
      return res.status(404).send({ message: req.t("categoryNotFound") });
    }
    return res.send({ message: req.t("categoryUpdatedSuccessfully") });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});
export default router;
