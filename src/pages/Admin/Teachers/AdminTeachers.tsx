import { GenericTable } from "../ViewTable";

export default function AdminTeachers() {

    const data = [
        { id:"1" , Name: "Ali", Email:"ali@yahoo.com" , Joined_Date:"20/10" , Plan:"sliver"},
        { id:"2" , Name: "Sara",Email:"sara@yahoo.com" , Joined_Date:"20/10" , Plan:"sliver" },
    ];

    const columns = ["Name" , "Email" , "Joined_Date" , "Plan" ]

    const onDelete = (id:(string | number)):void=>{
        console.log("Deleted" , id)
    }
  return (
    <>
      <div className='p-5'>
        <GenericTable data={data} columns={columns} onDelete={onDelete} title='Teachers'></GenericTable>
      </div>
    </>
  )
}
