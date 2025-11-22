import { Router } from "express";
import * as moveHistoryController from "../controllers/moveHistoryController.js";
import auth from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, moveHistoryController.getMoveHistory);

export default router;
