import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {  Trash2, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import BASEURL, { apiRequest } from '@/data/api'
import toast from 'react-hot-toast'
import { RoleForm } from '@/components/forms/RoleForm'

interface Role {
  id: number
  name:string
  section: string
  description: string
  employeesCount: number
  permissions: Array<{ name: string }>
}

interface JobCardProps {
  role: Role
}

export function JobCard({ role }: JobCardProps) {
  const queryClient = useQueryClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('delete', `${BASEURL}/employee/groups-with-permissions/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-roles'] })
      setIsDeleteDialogOpen(false)
    },
    onError: (error) => {
      console.error('Failed to delete role:', error)
      // You might want to show a toast notification here
      toast.error("تعذر حذف الوظيفة")
    },
  })

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    deleteRoleMutation.mutate(role.id)
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
  }

  const isDeleting = deleteRoleMutation.isPending

  return (
    <Card className="w-full bg-white shadow-lg border border-gray-200 rounded-lg">
      <CardHeader className="pb-4">
        <div className="grid grid-cols-12 items-start gap-2">
          <div className="col-span-9">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {role?.name}
            </h2>
            {/* <p className="text-gray-600 text-sm mb-3">
              {role.description}
            </p> */}
          </div>

          <div className="col-span-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-2 rounded-md flex items-center justify-center">
              {role.employeesCount} موظف
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Permissions Section */}
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-3">الصلاحيات:</p>
          <div className="flex flex-wrap gap-2">
            {role?.permissions?.map((permission, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
              >
                {permission.name}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          
          <RoleForm  defaultValues={{name:role?.name,
            permissions:role?.permissions,
            id:role?.id
          }}/>
          
          
          
         

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </Button>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog   open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent  className="sm:max-w-md ">
          <DialogHeader className='mx-auto' >
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          
          <p className="text-sm text-gray-600 py-4">
            هل أنت متأكد أنك تريد حذف وظيفة "{role.section}"؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>

          <DialogFooter className="me-auto">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 size={16} className="animate-spin mr-2" />}
              {isDeleting ? 'جارٍ الحذف...' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}