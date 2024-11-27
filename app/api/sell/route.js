import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
      const { itemId, quantity } = await request.json();
  

      // Fetch the item to verify availability
      const item = await db.item.findUnique({
        where: { id: itemId },
        include: { warehouse: true }
      });

  
      if (!item) {
        return NextResponse.json(
          { message: "Item not found" },
          { status: 404 }
        );
      }
  
      if (item.quantity < quantity) {
        return NextResponse.json(
          { message: "Insufficient stock" },
          { status: 400 }
        );
      }
  
      // Update the item's quantity
      const updatedItem = await db.item.update({
        where: { id: itemId },
        data: { 
            quantity: item.quantity - quantity,
            // stockQty: item.warehouse.stockQty - quantity
         },
      });

      const updatedWarehouse = await db.warehouse.update({
        where: { id: item.warehouseId },
        data: { stockQty: item.warehouse.stockQty - quantity},
      });
  
      return NextResponse.json(updatedItem, updatedWarehouse);
    } catch (error) {
      console.error("Error updating item:", error);
      return NextResponse.json(
        { message: "Failed to process sale", error },
        { status: 500 }
      );
    }
  }
  