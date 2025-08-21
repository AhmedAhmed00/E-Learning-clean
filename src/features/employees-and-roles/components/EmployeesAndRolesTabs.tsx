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
import { employeesServices } from "@/data/api";

const employeesCols = [
  { label: "الموظف", key: "user_name" },
  { label: "البريد الالكتروني", key: "user_email" },
  { label: "رقم الهاتف", key: "user_phone" },
  { label: "الوظيفة", key: "education_level" },
  { label: "تاريخ الإنضمام", key: "enroll_date" },
  { label: "الحالة", key: "status" }, // يحتوي على سويتش
];


// 📊 بيانات وهمية للوظائف
const fakeRoles = [
  {
    id: 1,
    title: "مدير المحتوى",
    description: "إدارة الكورسات والمحتوى التعليمي",
    employeesCount: 2,
    permissions: ["إدارة الكورسات", "إدارة المدرسين", "عرض التقارير"],
  },
  {
    id: 2,
    title: "مسؤول الدعم",
    description: "الرد على استفسارات المستخدمين ومتابعة المشاكل",
    employeesCount: 1,
    permissions: ["إدارة التذاكر", "التواصل مع العملاء"],
  },
  {
    id: 3,
    title: "المسؤول المالي",
    description: "إدارة المدفوعات والفواتير والاشتراكات",
    employeesCount: 1,
    permissions: ["إدارة الفواتير", "عرض التقارير المالية"],
  },
];


export function EmployeesAndRolesTabs() {
  
  const { data:{results,count}={}} = useFetch({ 
    service:employeesServices.getAll, 
    key:"employees"
  })
  console.log(results,count)
  
  
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs className="w-full" defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">الموظفين</TabsTrigger>
          <TabsTrigger value="roles">الوظائف</TabsTrigger>
        </TabsList>

        <div>
          <TableOperations resourse="الموظفون" />
        </div>

        <TabsContent value="employees">
          <CustomTable
            loading={false}
            actions={['view']}
            key={"employees"}
            columns={employeesCols}
            data={results||[]}
            modalName={"employees"}
          />
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fakeRoles.map((role) => (
              <JobCard key={role.id} role={role} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
