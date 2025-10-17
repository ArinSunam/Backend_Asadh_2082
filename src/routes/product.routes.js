import { Router } from "express";
import {
  addProduct,
  fetchProducts,
  fetchSingleProduct,
  searchProducts,
} from "../controllers/product.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/add-product").post(VerifyToken, upload.single("image"), addProduct);
router.route("/").get(fetchProducts);
router.route("/search").get(searchProducts);
router.route("/:id").get(fetchSingleProduct);

export default router;
