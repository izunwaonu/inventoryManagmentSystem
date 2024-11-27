import React from 'react'

export default function InventoryCard({item}) {
  return (
    <>
    <div  className="shadow mb-4 rounded-lg bg-white border border-slate-200 hover:border-blue-400 py-2 px-4 cursor-pointer flex items-center gap-3 transition-all duration-300 justify-between">
         <h2 className="uppercase  text-slate-500 text-sm">{item.title}</h2>
          <h4 className="text-2xl">{item.number}</h4>
          
    </div>
             <div
             className={`mb-4 p-3 rounded-md ${
               item.number < 100
                 ? "p-4 mb-4 bg-yellow-200 border-l-4 border-yellow-600 text-yellow-800"
                 : "p-4 mb-4 bg-green-200 border-l-4 border-green-600 text-green-800"
             }`}
           >
             {item.number < 100
               ? "⚠️Running out of stock. Add items!"
               : "✅In good stock"}
           </div>
    </>
  )
}
