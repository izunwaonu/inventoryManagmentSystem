// Import the database instance and Next.js server response utilities
import db from "@/lib/db";
import { NextResponse } from "next/server";

// Handle POST requests
export async function POST(request) {
    try {
        // Parse the incoming JSON request body to get item data
        const itemData = await request.json();

        // Fetch the warehouse details using the provided warehouse ID
        const warehouse = await db.warehouse.findUnique({
            where: {
                id: itemData.warehouseId // Locate the warehouse by its unique ID
            }
        });

        // Get the current stock quantity of the warehouse
        const currentWarehouseStock = warehouse.stockQty;

        // Calculate the new stock quantity by adding the incoming item quantity
        const newStockQty = parseInt(currentWarehouseStock) + parseInt(itemData.qty);

        // Update the warehouse's stock quantity with the new value
        const updatedWarehouse = await db.warehouse.update({
            where: {
                id: itemData.warehouseId // Locate the warehouse by ID
            },
            data: {
                stockQty: newStockQty // Set the new stock quantity
            }
        });

        // Create a new item entry in the database
        const item = await db.item.create({
            data: {
                title: itemData.title, // Item title
                categoryId: itemData.categoryId, // Category ID the item belongs to
                sku: itemData.sku, // Stock Keeping Unit (SKU) identifier
                barcode: itemData.barcode, // Barcode of the item
                quantity: parseInt(itemData.qty), // Quantity of the item
                unitId: itemData.unitId, // Unit of measurement ID
                brandId: itemData.brandId, // Brand ID associated with the item
                supplierId: itemData.supplierId, // Supplier ID of the item
                buyingPrice: parseFloat(itemData.buyingPrice), // Buying price of the item
                sellingPrice: parseFloat(itemData.sellingPrice), // Selling price of the item
                reOrderPoint: parseInt(itemData.reOrderPoint), // Reorder point for stock
                warehouseId: itemData.warehouseId, // Warehouse ID where the item is stored
                imageUrl: itemData.imageUrl, // Image URL for the item
                weight: parseFloat(itemData.weight), // Weight of the item
                dimensions: itemData.dimensions, // Dimensions of the item
                taxRate: parseFloat(itemData.taxRate), // Tax rate applicable to the item
                description: itemData.description, // Description of the item
                notes: itemData.notes // Additional notes about the item
            }
        });

        // Respond with the newly created item as JSON
        return NextResponse.json(item);
    } catch (error) {
        // Log the error and respond with an error message and status code 500
        console.log(error);
        return NextResponse.json(
            {
                error,
                message: "Failed to create Item"
            },
            {
                status: 500
            }
        );
    }
}

// Handle GET requests
export async function GET(request) {
    try {
        // Fetch all items from the database, sorted by creation date in descending order
        const items = await db.item.findMany({
            orderBy: {
                createdAt: 'desc' // Return the latest items first
            },
            include: {
                category: true, // Include all fields from the related category table
                warehouse: true // Include all fields from the related warehouse table
            }
        });

        // Respond with the list of items as JSON
        return NextResponse.json(items);
    } catch (error) {
        // Log the error and respond with an error message and status code 500
        console.log(error);
        return NextResponse.json(
            {
                error,
                message: "Failed to fetch item"
            },
            {
                status: 500
            }
        );
    }
}

// Handle DELETE requests
export async function DELETE(request) {
    try {
        // Get the item ID from the query parameters of the request
        const id = request.nextUrl.searchParams.get("id");

        // Delete the item with the specified ID from the database
        const deletedItem = await db.item.delete({
            where: {
                id // Match the item by its unique ID
            }
        });

        // Respond with the deleted item's details as JSON
        return NextResponse.json(deletedItem);
    } catch (error) {
        // Log the error and respond with an error message and status code 500
        return NextResponse.json(
            {
                error,
                message: "Failed to delete Item"
            },
            {
                status: 500
            }
        );
    }
}
