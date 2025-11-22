import { Router } from "express";
import * as deliveryController from "../controllers/deliveryController.js";
import auth from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, deliveryController.getDeliveries);
router.get("/:id", auth, deliveryController.getDeliveryById);
router.post("/", auth, deliveryController.createDelivery);

export default router;
