import { Request, Response } from "express";
import * as deliveryService from "../services/deliveryService.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const getDeliveries = async (req: Request, res: Response) => {
    try {
        const deliveries = await deliveryService.getAllDeliveries();
        res.json(deliveries);
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        res.status(500).json({ error: "Failed to fetch deliveries" });
    }
};

export const getDeliveryById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid delivery ID" });
        }

        const delivery = await deliveryService.getDeliveryById(id);

        if (!delivery) {
            return res.status(404).json({ error: "Delivery not found" });
        }

        res.json(delivery);
    } catch (error) {
        console.error("Error fetching delivery:", error);
        res.status(500).json({ error: "Failed to fetch delivery" });
    }
};

export const createDelivery = async (req: Request, res: Response) => {
    try {
        const { from_warehouse_id, to_contact_id, scheduled_date, items } = req.body;

        const user = (req as AuthRequest).user;
        const responsible_user_id = (typeof user === 'object' && user !== null && 'id' in user) ? (user as any).id : null;

        if (!responsible_user_id) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        if (!from_warehouse_id || !to_contact_id || !scheduled_date || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await deliveryService.createDelivery({
            from_warehouse_id,
            to_contact_id,
            responsible_user_id,
            scheduled_date,
            items
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error("Error creating delivery:", error);
        res.status(500).json({ error: error.message || "Failed to create delivery" });
    }
};
