import { useState, useMemo } from "react";

export default function DriverAdmission() {

const emptyForm = {
type:"Driver",
name:"",
phone:"",
license:"",
address:"",
joinDate:"",
photo:null,
photoPreview:"",
aadhaar:null,
aadhaarPreview:"",
dl:null,
dlPreview:""
};

const [data,setData] = useState([]);
const [search,setSearch] = useState("");
const [showModal,setShowModal] = useState(false);
const [preview,setPreview] = useState(null);
const [editData,setEditData] = useState(null);
const [formData,setFormData] = useState(emptyForm);

const handleFile=(e,field)=>{
const file=e.target.files[0];
if(!file) return;

const previewURL = URL.createObjectURL(file);

setFormData(prev=>({
...prev,
[field]:file,
[`${field}Preview`]:previewURL
}));
};

const filteredData = useMemo(()=>{
return data.filter(d =>
d.name.toLowerCase().includes(search.toLowerCase())
);
},[data,search]);

const handleSubmit=()=>{

if(!formData.name || !formData.phone){
alert("Fill required fields");
return;
}

if(editData){
setData(prev =>
prev.map(p => p.id === editData.id ? {...formData,id:editData.id} : p)
);
}else{
setData(prev => [...prev,{...formData,id:Date.now()}]);
}

resetForm();
};

const handleEdit=(item)=>{
setEditData(item);
setFormData(item);
setShowModal(true);
};

const handleDelete=(id)=>{
if(window.confirm("Delete record?")){
setData(prev => prev.filter(p => p.id!==id));
}
};

const resetForm=()=>{
setFormData(emptyForm);
setEditData(null);
setShowModal(false);
};

return (

<div className="p-0 min-h-screen ">

<div className="text-gray-500 text-sm mb-2">
Transport &gt; Driver Admission
</div>

<div className="flex justify-between items-center mb-4">
<h2 className="text-2xl font-bold">Driver / Cleaner Admission</h2>
</div>

<div className="bg-white rounded-xl shadow p-4">

<div className="flex justify-between items-center mb-4">

<h2 className="text-xl font-semibold">Driver List</h2>

<button
onClick={()=>setShowModal(true)}
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
+ Add
</button>

</div>

<div className="mb-4 w-full md:w-96">

<input
type="text"
placeholder="Search driver..."
className="w-full border px-3 py-2 rounded"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<div className="overflow-x-auto">

<table className="w-full border border-gray-300">

<thead className="bg-gray-100">

<tr>

<th className="p-3 border">Photo</th>
<th className="p-3 border">Name</th>
<th className="p-3 border">Type</th>
<th className="p-3 border">Phone</th>
<th className="p-3 border">License</th>
<th className="p-3 border">Address</th>
<th className="p-3 border text-center">Action</th>

</tr>

</thead>

<tbody>

{filteredData.map((item)=>(

<tr key={item.id} className="hover:bg-gray-50">

<td className="p-3 border">

{item.photoPreview ? (
<img
src={item.photoPreview}
className="w-10 h-10 rounded-full object-cover"
/>
):"—"}

</td>

<td className="p-3 border font-medium">{item.name}</td>
<td className="p-3 border">{item.type}</td>
<td className="p-3 border">{item.phone}</td>
<td className="p-3 border">{item.license || "-"}</td>
<td className="p-3 border">{item.address || "-"}</td>

<td className="p-3 border flex justify-center gap-2">

<button
onClick={()=>setPreview(item)}
className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
>
Preview
</button>

<button
onClick={()=>handleEdit(item)}
className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
>
Edit
</button>

<button
onClick={()=>handleDelete(item.id)}
className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
>
Delete
</button>

</td>

</tr>

))}

{filteredData.length===0 &&(

<tr>
<td colSpan="7" className="text-center p-4">
No Data Found
</td>
</tr>

)}

</tbody>

</table>

</div>

</div>


{/* Preview Modal */}

{preview &&(

<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

<div className="bg-white w-[90%] max-w-xl rounded-xl shadow-lg p-6">

<h3 className="text-xl font-semibold mb-4">
Driver Details
</h3>

<div className="flex gap-4 mb-4">

{preview.photoPreview &&(
<img
src={preview.photoPreview}
className="w-24 h-24 rounded object-cover"
/>
)}

<div>

<p><b>Name:</b> {preview.name}</p>
<p><b>Type:</b> {preview.type}</p>
<p><b>Phone:</b> {preview.phone}</p>
<p><b>License:</b> {preview.license || "-"}</p>
<p><b>Address:</b> {preview.address}</p>
<p><b>Join Date:</b> {preview.joinDate}</p>

</div>

</div>

<div className="grid grid-cols-2 gap-4">

{preview.aadhaarPreview &&(

<div>

<p className="text-sm font-semibold mb-1">Aadhaar</p>

<img
src={preview.aadhaarPreview}
className="rounded border cursor-pointer"
onClick={()=>window.open(preview.aadhaarPreview)}
/>

</div>

)}

{preview.dlPreview &&(

<div>

<p className="text-sm font-semibold mb-1">Driving License</p>

<img
src={preview.dlPreview}
className="rounded border cursor-pointer"
onClick={()=>window.open(preview.dlPreview)}
/>

</div>

)}

</div>

<button
onClick={()=>setPreview(null)}
className="mt-6 w-full bg-gray-200 py-2 rounded"
>
Close
</button>

</div>

</div>

)}


{/* Add/Edit Modal */}

{showModal &&(

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

<div className="bg-white w-[90%] max-w-xl rounded-xl shadow-lg">

<div className="bg-blue-600 text-white p-4 flex justify-between items-center">

<h3 className="text-lg font-semibold">
{editData ? "Edit Driver" : "Add Driver"}
</h3>

<button onClick={resetForm}>✕</button>

</div>

<div className="p-6 space-y-4">

<select
value={formData.type}
onChange={(e)=>setFormData({...formData,type:e.target.value})}
className="w-full border rounded px-3 py-2"
>
<option>Driver</option>
<option>Cleaner</option>
</select>

<input
placeholder="Name"
value={formData.name}
onChange={(e)=>setFormData({...formData,name:e.target.value})}
className="w-full border rounded px-3 py-2"
/>

<input
placeholder="Phone"
value={formData.phone}
onChange={(e)=>setFormData({...formData,phone:e.target.value})}
className="w-full border rounded px-3 py-2"
/>

{formData.type==="Driver" &&(

<input
placeholder="License Number"
value={formData.license}
onChange={(e)=>setFormData({...formData,license:e.target.value})}
className="w-full border rounded px-3 py-2"
/>

)}

<input
type="date"
value={formData.joinDate}
onChange={(e)=>setFormData({...formData,joinDate:e.target.value})}
className="w-full border rounded px-3 py-2"
/>

<textarea
placeholder="Address"
value={formData.address}
onChange={(e)=>setFormData({...formData,address:e.target.value})}
className="w-full border rounded px-3 py-2"
/>

<div>

<label className="text-sm font-semibold">Photo</label>

<input
type="file"
onChange={(e)=>handleFile(e,"photo")}
/>

{formData.photoPreview &&(
<img src={formData.photoPreview} className="w-16 mt-2 rounded"/>
)}

</div>

<div>

<label className="text-sm font-semibold">Aadhaar</label>

<input
type="file"
onChange={(e)=>handleFile(e,"aadhaar")}
/>

{formData.aadhaarPreview &&(
<img src={formData.aadhaarPreview} className="w-24 mt-2 border"/>
)}

</div>

{formData.type==="Driver" &&(

<div>

<label className="text-sm font-semibold">Driving License</label>

<input
type="file"
onChange={(e)=>handleFile(e,"dl")}
/>

{formData.dlPreview &&(
<img src={formData.dlPreview} className="w-24 mt-2 border"/>
)}

</div>

)}

<button
onClick={handleSubmit}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
>
Save
</button>

</div>

</div>

</div>

)}

</div>

);
}