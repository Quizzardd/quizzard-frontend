import { GenericTable } from "../ViewTable";

export default function AdminCourses() {

    const data = [
        { id:"1" , Name: "CS", Teacher:"Ahmed ali" , Students:"Abdo ali" , Created:"20/10"},
        { id:"2" , Name: "IS",Teacher:"Ali omar" , Students:"yousef hussien " , Created:"15/2" },
        { id:"3" , Name: "IT",Teacher:"omar mohamed" , Students:"Peter josef" , Created:"30/5" },
    ];

    const columns = ["Name" , "Teacher" , "Students" , "Created" ]

    const onDelete = (id:(string | number)):void=>{
        console.log("Deleted" , id)
    }
  return (
    <>
      <div className='p-5'>
        <GenericTable data={data} columns={columns} onDelete={onDelete} title='Courses'></GenericTable>
      </div>
    </>
  )
}
