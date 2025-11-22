import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

interface CreateDeliveryParams {
    from_warehouse_id: number;
    to_contact_id: number;
    responsible_user_id: number;
    scheduled_date: string;
    items: {
        product_id: number;
        quantity: number;
        unit_cost: number;
        alert_out_of_stock?: boolean;
    }[];
}

export const getAllDeliveries = async () => {
    const deliveries = await sql`
    SELECT 
      d.id, 
      d.reference, 
      d.status, 
      d.scheduled_date,
      w.name as from_warehouse,
      c.name as to_contact,
      u.name as responsible_user_name
    FROM deliveries d
    LEFT JOIN warehouses w ON d.from_warehouse_id = w.id
    LEFT JOIN contacts c ON d.to_contact_id = c.id
    LEFT JOIN users u ON d.responsible_user_id = u.id
    ORDER BY d.created_at DESC
  `;
    return deliveries;
};

export const getDeliveryById = async (id: number) => {
    // Get delivery header
    const deliveryResult = await sql`
    SELECT 
      d.id,
      d.reference,
      d.status,
      d.scheduled_date,
      d.from_warehouse_id,
      d.to_contact_id,
      d.responsible_user_id,
      w.name as from_warehouse,
      c.name as to_contact,
      u.name as responsible_user_name
    FROM deliveries d
    LEFT JOIN warehouses w ON d.from_warehouse_id = w.id
    LEFT JOIN contacts c ON d.to_contact_id = c.id
    LEFT JOIN users u ON d.responsible_user_id = u.id
    WHERE d.id = ${id}
  `;

    if (deliveryResult.length === 0) {
        return null;
    }

    // Get delivery items
    const itemsResult = await sql`
    SELECT 
      di.id,
      di.product_id,
      di.quantity,
      di.unit_cost,
      di.alert_out_of_stock,
      p.name as product_name,
      p.sku
    FROM delivery_items di
    LEFT JOIN products p ON di.product_id = p.id
    WHERE di.delivery_id = ${id}
  `;

    return {
        ...deliveryResult[0],
        items: itemsResult
    };
};

export const createDelivery = async (params: CreateDeliveryParams) => {
    // 1. Get warehouse short code
    const warehouseResult = await sql`
    SELECT short_code FROM warehouses WHERE id = ${params.from_warehouse_id}
  `;

    if (warehouseResult.length === 0) {
        throw new Error("Warehouse not found");
    }

    const warehouseShortCode = warehouseResult[0].short_code;

    // 2. Insert delivery with temporary reference
    const insertResult = await sql`
    INSERT INTO deliveries (
      reference, 
      status, 
      from_warehouse_id, 
      to_contact_id, 
      responsible_user_id, 
      scheduled_date
    ) VALUES (
      'TEMP', 
      'Draft', 
      ${params.from_warehouse_id}, 
      ${params.to_contact_id}, 
      ${params.responsible_user_id}, 
      ${params.scheduled_date}
    ) RETURNING id
  `;

    const deliveryId = insertResult[0].id;

    // 3. Generate proper reference: WH/OUT/<ID>
    const paddedId = deliveryId.toString().padStart(3, '0');
    const reference = `${warehouseShortCode}/OUT/${paddedId}`;

    await sql`
    UPDATE deliveries SET reference = ${reference} WHERE id = ${deliveryId}
  `;

    // 4. Insert items
    for (const item of params.items) {
        await sql`
      INSERT INTO delivery_items (
        delivery_id, 
        product_id, 
        quantity, 
        unit_cost,
        alert_out_of_stock
      ) VALUES (
        ${deliveryId}, 
        ${item.product_id}, 
        ${item.quantity}, 
        ${item.unit_cost},
        ${item.alert_out_of_stock || false}
      )
    `;
    }

    return { id: deliveryId, reference };
};
