import {
  UserRound,
} from "lucide-react";
import Heading from "@/components/shared/Heading";
import { EmployeesAndRolesTabs } from "@/features/employees-and-roles/components/EmployeesAndRolesTabs";
import { EmployeeForm } from "@/components/forms/EmployeeForm";
import { RoleForm } from "@/components/forms/RoleForm";

// 📋 أعمدة جدول الموظفين
export default function Employees() {
  return (
    <>
      {/* 🏷️ الهيدر */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="إدارة الموظفين والوظائف"
          desc="إدارة الموظفين والوظائف والصلاحيات"
          icon={UserRound}
        />
<div className="flex "> 
  
         <EmployeeForm />
         <RoleForm />
</div>
      </div>

      {/* 🔎 عمليات علي الجدول */}
      <EmployeesAndRolesTabs />
    </>
  );
}






