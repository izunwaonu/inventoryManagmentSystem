import { Check, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SalesActivityCard from './SalesActivityCard'
import InventoryCard from './InventoryCard'
import { getData } from '@/lib/getData'
import Dashboard from './Dashboard'

export default async function SalesOverview() {

   
    
// sequential fetching => waterfall. Which means that each block has to wait fot the other.

  const categoriesData =  getData('categories') 
  const itemsData =  getData('items')
  const warehousesData =  getData('warehouse')
  const suppliersData =  getData('suppliers')

  // Parallel Fetching 
  const [categories, items, warehouses, suppliers] = await Promise.all([categoriesData, itemsData, warehousesData, suppliersData ])


    //Creating a new array of objects with the warehouse name and the total quantity of products in each warehouse
    
    const inventorySummary = warehouses.map((item, i) =>{
        return {
            title: item.title,
            number: item.stockQty
        }
    })
    console.log(warehouses) //checking if data is being fetched correctly from the warehouse
    console.log(inventorySummary) //checking if data is being fetched
    const salesActivity = [
        {
            title: 'Categories',
            number: categories.length,
            unit: "Qty",
            href: "/dashboard/inventory/categories",
            color: "text-blue-600"   
        },
        {
            title: 'Items',
            number: items.length,
            href: "/dashboard/inventory/items",
            color: "text-red-600"   
        },
        {
            title: 'Warehouses',
            number: warehouses.length,
            unit: "Pkgs",
            href: "/dashboard/inventory/warehouse",
            color: "text-blue-600"   
        },
        {
            title: 'Suppliers',
            number: suppliers.length,
            unit: "Pkgs",
            href: "/dashboard/inventory/suppliers",
            color: "text-orange-600"   
        }
    ]

    

  return (
    <div className="bg-blue-50 border-b border-slate-300  grid grid-cols-12 gap-4">
        {/* Sales Activity */}
        <div className="col-span-full lg:col-span-8 border-r p-8 py-16 lg:py-8 border-slate-300">
            <h2 className="mb-6 text-xl">Sales Activity</h2>
            <div className=" pr-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                {/* Card */}
                {
                    salesActivity.map((item, i) =>{
                        return (
                        <SalesActivityCard item={item} key={i}/>
                        )
                    })
                }

  
            </div>
            <Dashboard/>
        </div>

        {/* Inventory Summary */}
        <div className="col-span-full lg:col-span-4 p-8">
        <h2 className="mb-6 text-xl">Inventory Summary</h2>
        <div className="">
            {
                inventorySummary.map((item, i) => {
                    return (
                        <InventoryCard item={item} key={i}/>
                    )
                })
            }
        </div>
        </div>

    </div>
  )
}
