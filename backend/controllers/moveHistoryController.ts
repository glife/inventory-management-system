import { Request, Response } from "express";
import * as moveHistoryService from "../services/moveHistoryService.js";

export const getMoveHistory = async (req: Request, res: Response) => {
    try {
        const moveHistory = await moveHistoryService.getAllMoveHistory();
        res.json(moveHistory);
    } catch (error) {
        console.error("Error fetching move history:", error);
        res.status(500).json({ error: "Failed to fetch move history" });
    }
};
