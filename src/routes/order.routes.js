import Router from "express";
import { VerifyToken } from "../middleware/auth.middleware.js";
import { createOrder, getAllOrder, getOrderByUser } from "../controllers/order.controller.js";

const router = Router();

router.route("/").post(VerifyToken, createOrder);
router.route("/").get(VerifyToken, getAllOrder);
router.route("/get-order-by-user").get(VerifyToken, getOrderByUser);
router.route("/:orderId").get(VerifyToken, getOrderById).patch(VerifyToken, updateOrderStatus);

router.route("/:orderId/cancel").patch(VerifyToken, cancelOrderByUser);

export default router;
