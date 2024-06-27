import express from "express";
import { isAdmin,requireSignin } from "../middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryCOntroller, singleCategoryController, updateCategoryController } from "../contollers/categoryController.js";

const router = express.Router();

//routes
// create category
router.post(
  "/create-category",
  requireSignin,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requireSignin,
  isAdmin,
  updateCategoryController
);

//getALl category
router.get("/get-category", categoryController);

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  requireSignin,
  isAdmin,
  deleteCategoryCOntroller
);

export default router;