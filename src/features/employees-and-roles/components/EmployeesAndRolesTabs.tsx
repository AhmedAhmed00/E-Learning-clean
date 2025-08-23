import CustomTable from "@/components/shared/table/CustomTable";
import TableOperations from "@/components/shared/table/TableOperations";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { JobCard } from "./JobCard";
import { useFetch } from "@/hooks/useFetch";
import BASEURL, { apiRequest, employeesServices } from "@/data/api";

const employeesCols = [
  { label: "الموظف", key: "user_name" },
  { label: "البريد الالكتروني", key: "user_email" },
  { label: "رقم الهاتف", key: "user_phone" },
  { label: "الوظيفة", key: "education_level" },
  { label: "تاريخ الإنضمام", key: "enroll_date" },
  { label: "الحالة", key: "status" }, // يحتوي على سويتش
];


// 📊 بيانات وهمية للوظائف



export function EmployeesAndRolesTabs() {
  
  const { data:{results:empRes}={}} = useFetch({ 
    service:employeesServices.getAll, 
    key:"employees"
  })
const {data:{results}={}} = useFetch({ 
  service:() => apiRequest("get",`${BASEURL}/employee/groups-with-permissions/`), 
  key:"job-roles"
  
})
  console.log(results, "ddddddddddddddd")
  
  
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs className="w-full" defaultValue="roles">
        <TabsList>
          <TabsTrigger value="employees">الموظفين</TabsTrigger>
          <TabsTrigger value="roles">الوظائف</TabsTrigger>
        </TabsList>

        <div>
          <TableOperations filters={[
            {
              label:"الحالة",
              type:"select",
              name:"user__is_active",
              defaultValue:"true",
              options:[{label:"active" ,value:"true"},{label:"inactive", value:"false"}]
            }
          ]} resourse="الموظفون" />
        </div>

        <TabsContent value="employees">
          <CustomTable
            loading={false}
            actions={['view']}
            key={"employees"}
            columns={employeesCols}
            data={empRes||[]}
            modalName={"employees"}
          />
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results?.map((role) => (
              <JobCard key={role.id} role={role} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
