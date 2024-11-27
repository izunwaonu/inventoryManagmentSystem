import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
      // Fetch the top 5 items with the highest quantity
     
      const topItems = await db.item.findMany({
        orderBy: {
          quantity: "desc", // Sort by quantity in descending order
        },
        take: 5, // Limit to 5 items
        select: {
          id: true,
          title: true,
          quantity: true,
        },
      });
  
      // Respond with the top 5 items

      return NextResponse.json(topItems);
    } catch (error) {
      console.error("Error fetching top items:", error);
      return NextResponse.json(
        { message: "Failed to fetch top items", error },
        { status: 500 }
      );
    }
  }
  