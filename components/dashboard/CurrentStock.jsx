import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function CurrentStock({title, items}) {

//   const items = await getData("items")

  
  const columns = ["imageUrl","title", "quantity", "updatedAt"  ]

  return (
    <div className='bg-pink-50 p-8'>
       <h1 className="mb-3 text-xl font-semibold"> {title} </h1>

        <div className="my-4 ">
        <DataTable data={items} columns={columns} resourceTitle="items"/>
        </div>
        
    </div>
  )
}
