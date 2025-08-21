import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'


export function JobCard({ role }: { role: {
  id: number,
  title: string,
  description: string,
  employeesCount: number,
  permissions: string[]
} }) {
  return (
    <Card className="w-full bg-white shadow-lg border border-gray-200 rounded-lg">
      
      {/* card header */}
 <CardHeader className="pb-4">
  <div className="grid grid-cols-12 items-start gap-2">
    <div className="col-span-9">
      <h2 className="text-[18px] font-bold text-gray-800 mb-2">
        {role.title}
      </h2>
      <p className="text-gray-600 text-[15px] mb-3">
        {role.description}
      </p>
    </div>

    <span className="col-span-3 bg-blue-100 text-blue-800 text-[12px] font-medium px-2 py-2 rounded-md flex items-center justify-center">
      {role.employeesCount} موظف
    </span>
  </div>
</CardHeader>


{/* card content */}
      <CardContent className="pt-0">
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-3">الصلاحيات:</p>
          <div className="flex flex-wrap gap-2 ">
            {role.permissions.map((perm, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button style={{cursor:"pointer"}} className="p-1 text-gray-100 hover:text-blue-200 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit size={18} />
          </Button>
          <Button style={{cursor:"pointer"}} className="p-1 text-gray-100 hover:text-red-200 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
