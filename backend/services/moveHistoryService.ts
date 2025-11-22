import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

export const getAllMoveHistory = async () => {
    const moveHistory = await sql`
    SELECT 
      mh.id,
      mh.reference,
      mh.status,
      mh.event_type,
      mh.quantity,
      mh.date,
      mh.created_at,
      c.name as contact_name,
      fw.name as from_warehouse,
      tw.name as to_warehouse,
      fl.name as from_location,
      tl.name as to_location,
      p.name as product_name,
      p.sku as product_sku,
      u.name as responsible_user_name
    FROM move_history mh
    LEFT JOIN contacts c ON mh.contact_id = c.id
    LEFT JOIN warehouses fw ON mh.from_warehouse_id = fw.id
    LEFT JOIN warehouses tw ON mh.to_warehouse_id = tw.id
    LEFT JOIN locations fl ON mh.from_location_id = fl.id
    LEFT JOIN locations tl ON mh.to_location_id = tl.id
    LEFT JOIN products p ON mh.product_id = p.id
    LEFT JOIN users u ON mh.responsible_user_id = u.id
    ORDER BY mh.created_at DESC
  `;
    return moveHistory;
};
