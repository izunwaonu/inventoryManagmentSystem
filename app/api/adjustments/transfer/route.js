import db from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        
        const {transferStockQty, itemId, givingWarehouseId, receivingWarehouseId, notes, referenceNumber} = await request.json();

        // the giving warehouse

        const item = await db.item.findUnique({
            where: {
                id: itemId
            }
        })

        //the giving warehouse
     

        //item in the receiving warehouse

       
         const givingWarehouse = await db.warehouse.findUnique({
            where: {
                id:givingWarehouseId
            }
        })
        // get current stock
        const currentGivingWarehouseStock = givingWarehouse.stockQty;

        if(parseInt(currentGivingWarehouseStock)>parseInt(transferStockQty)){

            
        const newStockForGivingWarehouse = parseInt(currentGivingWarehouseStock) - parseInt(transferStockQty) ;
        // Update stock 

        const updatedGivingWarehouse = await db.warehouse.update({
            where: {
                id:givingWarehouseId
            },
            data: {
                stockQty: newStockForGivingWarehouse
            }
        })
        //update the item in the giving warehouse
        const updatedItemInGivingWarehouse = await db.item.update({
            where: {
                id: itemId
            },
            data: {
                warehouseId: givingWarehouseId, //make sure to update the warehouse ID if it is not the same
                quantity: newStockForGivingWarehouse,
            }
        })




        // Get the receiving warehouse
        const receivingWarehouse = await db.warehouse.findUnique({
            where: {
                id:receivingWarehouseId
            }
        })
        // get current stock
        const currentReceivingWarehouseStock = receivingWarehouse.stockQty;

        const newStockForReceivingWarehouse = parseInt(currentReceivingWarehouseStock) + parseInt(transferStockQty) ;
        // Update stock 

        const updatedReceivingWarehouse = await db.warehouse.update({
            where: {
                id:receivingWarehouseId
            },
            data: {
                stockQty: newStockForReceivingWarehouse,
                // items: item
            }
        })

        //update the item in the receiving warehouse
        const updatedItemInReceivingWarehouse = await db.item.update({
            where: {
                id: itemId,
            },
            data: {
                warehouseId: receivingWarehouseId, //make sure to update the warehouse ID if it is not the same
                quantity: newStockForReceivingWarehouse,
            },
        });
        
        //update the item in both warehouses

        //item in the giving warehouse and
 
        const adjustment = await db.transferStockAdjustment.create({
            data: {transferStockQty:parseInt(transferStockQty), 
                itemId, 
                givingWarehouseId, 
                receivingWarehouseId, 
                notes, 
                referenceNumber
            }
        }) 
        console.log(adjustment);
    return NextResponse.json(adjustment)
        } else{
            return NextResponse.json(
            {
                data: null,
                message: "Giving Warehouse has no enough Stock"
            }, 
            {
                status:409
            })
        }


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message: "Failed to create adjustment"
        },{
            status: 500
        });
    }
}

export async function GET(request){
    try {
        const adjustments = await db.transferStockAdjustment.findMany({
            orderBy: {
                createdAt: 'desc', // 'asc' for ascending, 'desc' for descending it will give us the latest warehouse. 
            },
        });
        return NextResponse.json(adjustments)
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message: "Failed to fetch adjustments"
        },{
            status: 500
        });
    }
}
export async function DELETE(request){
    try {
        const id = request.nextUrl.searchParams.get("id");

        const deletedAdjustment = await db.transferStockAdjustment.delete({
            where: {
               id
            },
        })
        
        return NextResponse.json(deletedAdjustment)
        
    } catch (error) {
        return NextResponse.json({
            error,
            message: "Failed to delete Adjustments"
        },{
            status: 500
        });
    }
}