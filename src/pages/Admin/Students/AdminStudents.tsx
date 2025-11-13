import { GenericTable } from "../ViewTable";

export default function AdminStudents() {

    const data = [
        { id:"1" , Name: "ahmed", Email:"Ahmed@yahoo.com" , Joined_Date:"20/10" , Plan:"sliver"},
        { id:"2" , Name: "Ali",Email:"Ali@yahoo.com" , Joined_Date:"20/10" , Plan:"sliver" },
        { id:"3" , Name: "omar",Email:"omar@yahoo.com" , Joined_Date:"15/10" , Plan:"Free" },
    ];

    const columns = ["Name" , "Email" , "Joined_Date" , "Plan" ]

    const onDelete = (id:(string | number)):void=>{
        console.log("Deleted" , id)
    }
  return (
    <>
      <div className='p-5'>
        <GenericTable data={data} columns={columns} onDelete={onDelete} title='Students'></GenericTable>
      </div>
    </>
  )
}
