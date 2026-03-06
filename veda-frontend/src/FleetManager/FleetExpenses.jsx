import { useState } from "react";

const INITIAL_DATA = [
  {
    id: 1,
    vehicleNo: "UP32 AB 1234",
    expenses: [
      {
        id: 1,
        type: "Fuel",
        amount: 5200,
        date: "2026-03-01",
        note: "Fuel refill"
      },
      {
        id: 2,
        type: "Maintenance",
        amount: 12000,
        date: "2026-03-02",
        note: "Brake replacement"
      },
      {
        id: 3,
        type: "Document",
        amount: 4500,
        date: "2026-03-05",
        note: "Insurance renewal"
      }
    ]
  },
  {
    id: 2,
    vehicleNo: "UP32 CD 5678",
    expenses: [
      {
        id: 1,
        type: "Fuel",
        amount: 4800,
        date: "2026-03-04",
        note: "Fuel refill"
      }
    ]
  }
];

export default function FleetExpense() {

  const [buses,setBuses] = useState(INITIAL_DATA);
  const [openBus,setOpenBus] = useState(null);

  const [form,setForm] = useState({
    type:"Fuel",
    amount:"",
    date:"",
    note:""
  });

  const [editId,setEditId] = useState(null);

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const addExpense=(busId)=>{

    if(!form.amount || !form.date) return;

    setBuses(buses.map(bus=>{
      if(bus.id===busId){

        if(editId){
          return{
            ...bus,
            expenses:bus.expenses.map(e=>
              e.id===editId ? {...e,...form} : e
            )
          }
        }

        return{
          ...bus,
          expenses:[
            ...bus.expenses,
            {
              id:Date.now(),
              ...form
            }
          ]
        }
      }
      return bus
    }));

    setForm({type:"Fuel",amount:"",date:"",note:""});
    setEditId(null);
  };

  const deleteExpense=(busId,expId)=>{
    setBuses(buses.map(bus=>{
      if(bus.id===busId){
        return{
          ...bus,
          expenses:bus.expenses.filter(e=>e.id!==expId)
        }
      }
      return bus
    }))
  }

  const editExpense=(expense)=>{
    setForm(expense);
    setEditId(expense.id);
  }

  const getTotal=(expenses)=>{
    return expenses.reduce((sum,e)=>sum+Number(e.amount),0)
  }

  const getMonthly=(expenses)=>{
    const month = new Date().getMonth()

    return expenses
      .filter(e=>new Date(e.date).getMonth()===month)
      .reduce((sum,e)=>sum+Number(e.amount),0)
  }

  const getQuarter=(expenses)=>{

    const month=new Date().getMonth()

    return expenses
      .filter(e=>{
        const m=new Date(e.date).getMonth()
        return Math.abs(m-month)<=2
      })
      .reduce((sum,e)=>sum+Number(e.amount),0)
  }

  return (
 <div className="p-0 m-0 min-h-screen">

      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Fleet &gt;</span>
        <span>Bus Expenses</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Bus Expenses</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 text-sm mb-3 text-gray-600 border-b">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>
<div className=" space-y-3">




{/* BUS CARDS */}

{buses.map(bus=>{

const total = getTotal(bus.expenses)
const monthly = getMonthly(bus.expenses)
const quarter = getQuarter(bus.expenses)

return(

<div key={bus.id} className=" bg-white shadow rounded-lg p-4 space-y-4">

{/* BUS HEADER */}

<div className="flex justify-between items-center">

<div>
<h2 className="text-lg font-semibold">
 {bus.vehicleNo}
</h2>
</div>

<button
onClick={()=>setOpenBus(openBus===bus.id ? null : bus.id)}
className="text-blue-600 text-sm"
>
{openBus===bus.id ? "Hide" : "Manage Expense"}
</button>

</div>


{/* SUMMARY */}

<div className="grid grid-cols-3 gap-3 text-sm">

<div className="bg-gray-100 p-3 rounded">
<p>Total Expense</p>
<p className="font-bold">₹{total}</p>
</div>

<div className="bg-blue-50 p-3 rounded">
<p>This Month</p>
<p className="font-bold text-blue-600">₹{monthly}</p>
</div>

<div className="bg-purple-50 p-3 rounded">
<p>Quarter</p>
<p className="font-bold text-purple-600">₹{quarter}</p>
</div>

</div>


{/* MANAGE SECTION */}

{openBus===bus.id && (

<div className="space-y-4">

{/* ADD FORM */}

<div className="grid grid-cols-4 gap-2">

<select
name="type"
value={form.type}
onChange={handleChange}
className="border p-2 rounded"
>
<option>Fuel</option>
<option>Maintenance</option>
<option>Document</option>
<option>Other</option>
</select>

<input
type="number"
name="amount"
placeholder="Amount"
value={form.amount}
onChange={handleChange}
className="border p-2 rounded"
/>

<input
type="date"
name="date"
value={form.date}
onChange={handleChange}
className="border p-2 rounded"
/>

<input
type="text"
name="note"
placeholder="Note"
value={form.note}
onChange={handleChange}
className="border p-2 rounded"
/>

</div>

<button
onClick={()=>addExpense(bus.id)}
className="bg-green-600 text-white px-4 py-2 rounded text-sm"
>
{editId ? "Update Expense" : "Add Expense"}
</button>


{/* EXPENSE TABLE */}

<table className="w-full text-sm border">

<thead className="bg-gray-100">
<tr>
<th className="border p-2">Type</th>
<th className="border p-2">Amount</th>
<th className="border p-2">Date</th>
<th className="border p-2">Note</th>
<th className="border p-2">Action</th>
</tr>
</thead>

<tbody>

{bus.expenses.map(exp=>(
<tr key={exp.id} className="text-center">

<td className="border p-2">{exp.type}</td>
<td className="border p-2">₹{exp.amount}</td>
<td className="border p-2">{exp.date}</td>
<td className="border p-2">{exp.note}</td>

<td className="border p-2 space-x-2">

<button
onClick={()=>editExpense(exp)}
className="text-blue-600"
>
Edit
</button>

<button
onClick={()=>deleteExpense(bus.id,exp.id)}
className="text-red-600"
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)}

</div>

)

})}

</div>
</div>
  );
}