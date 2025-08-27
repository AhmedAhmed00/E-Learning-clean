"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  DollarSign,
  UserRound,
  CheckCircle,
  Loader2,
  ExternalLink,
  Receipt,
  Calendar,
  BookOpen,
  User,
  Clock,
  
} from "lucide-react";



import Heading from "@/components/shared/Heading";
import TableOperations from "@/components/shared/table/TableOperations";
import RoundedCard from "@/components/shared/rounded-card";
import CustomTable from "@/components/shared/table/CustomTable";
import { useFetch } from "@/hooks/useFetch";
import BASEURL, { apiRequest, ordersServices } from "@/data/api";
import useFetchById from "@/hooks/useFetchById";
import { useNavigate, useParams } from "react-router";

function getStatusColor(status?: string) {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium";
    case "pending":
      return "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium";
    case "declined":
      return "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium";
    default:
      return "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium";
  }
}

const ordersTableColumns = [
  {
    label: "رقم الطلب",
    key: "id",
    render: (value: string) => <div>#{value}</div>,
  },
  {
    label: "الطالب",
    key: "student_name",
  },
  {
    label: "الكورس",
    key: "course_title",
  },
  {
    label: "المحاضرة",
    key: "lecture_title",
  },
  {
    label: "المبلغ",
    key: "final_price",
  },
  {
    label: "التاريخ",
    key: "order_date",
    render: (value: string) => {
      const date = new Date(value);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    label: "الحالة",
    key: "status",
    render: (value: string) => {
      return <div className={getStatusColor(value)}>{value}</div>;
    },
  },
];
interface CourseOrder {
  id: number;
  student: number;
  student_name: string;
  course: number;
  course_title: string;
  receipt: string;
  status: "pending" | "approved" | "rejected";
  order_date: string;
  cousre_final_price: string;
}

export default function Orders({ viewModal }: { viewModal?: boolean }) {
  const navigate = useNavigate();

  const { data, isError, isFetching, isLoading } = useFetch({
    service: ordersServices.getAll,
    key: "orders",
  });

  const { id } = useParams();

  const { data: orderDetails } = useFetchById<CourseOrder>(
    "order",
    id,
    ordersServices.getById,
  );
  const showModal = Boolean(id && orderDetails);

  console.log(orderDetails);
  const closeModal = () => {
    navigate("/orders"); // Adjust based on your route structure
  };

  const orderStats = [
    {
      id: 1,
      title: "بانتظار المراجعة",
      number: data?.stats?.total_pending,
      icon: ClipboardList,
      iconBg: "bg-yellow-500",
      desc: "طلبات تحتاج مراجعة",
    },
    {
      id: 2,
      title: "موافق عليها",
      number: data?.stats?.total_accepted,
      icon: CheckCircle2,
      iconBg: "bg-green-500",
      desc: "طلبات تمت الموافقة عليها",
    },
    {
      id: 3,
      title: "مرفوضة",
      number: data?.stats?.total_declined,

      icon: XCircle,
      iconBg: "bg-red-500",
      desc: "طلبات تم رفضها",
    },
    {
      id: 4,
      title: "إجمالي الإيرادات",
      number: data?.stats?.total_profit,
      icon: DollarSign,
      iconBg: "bg-blue-500",
      desc: "القيمة الكلية من المبيعات",
    },
  ];

  return (
    <>
      {/* 🏷️ الهيدر */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="إدارة الطلبات"
          desc="مراجعة وإدارة طلبات الطلاب للكورسات"
          icon={UserRound}
        />
      </div>

      {/* 📊 الكروت الخاصة بالطلبات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {orderStats.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                delay: i * 0.15,
                duration: 0.5,
                type: "spring",
                stiffness: 120,
              },
            }}
          >
            <RoundedCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* 🔎 عمليات علي الجدول */}
      <div>
        <TableOperations
          filters={[
            {
              label: "نوع الطلب",
              name: "order_type",
              defaultValue: "",
              type: "select",
              options: [
                { label: "الكل", value: null },
                { label: "محاضرة", value: "lecture" },
                { label: "كورس كامل", value: "course" },
              ],
            },
            {
              label: "الحالة",
              name: "status",
              defaultValue: "",
              type: "select",
              options: [
                { label: "الكل", value: null },
                { label: "معلق", value: "pending" },
                { label: "مقبول", value: "accepted" },
                { label: "ملغي", value: "declined" },
              ],
            },
          ]}
          resourse="طلب"
        />
      </div>

      <CustomTable
        actions={["view"]}
        loading={false}
        modalName="orders"
        columns={ordersTableColumns}
        data={data?.data?.results || []}
      />
      {showModal && orderDetails && (
        <OrderDetailsModal
          open={showModal}
          onClose={closeModal}
          data={orderDetails}
        />
      )}
    </>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  data: CourseOrder;
}

export function OrderDetailsModal({
  open,
  onClose,
  data,
}: OrderDetailsModalProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { mutate: approve, status: approvingStatus } = useMutation({
    mutationFn: () =>
      apiRequest(
        "post",
        `${BASEURL}/course/student-orders-employee/${id}/accept/`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("✅ تم قبول الطلب بنجاح");
      onClose();
    },
    onError: (err) => {
      const errMsg = err?.statusText
        ? `${err.statusText}\nلا يمكن قبول الطلب`
        : "لا يمكن قبول الطلب";
      toast.error(errMsg);
    },
  });

  const { mutate: decline, status: decliningStatus } = useMutation({
    mutationFn: () =>
      apiRequest(
        "post",
        `${BASEURL}/course/student-orders-employee/${id}/decline/`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("❌ تم رفض الطلب بنجاح");
      onClose();
    },
    onError: (err) => {
      const errMsg = err?.statusText
        ? `${err.statusText}\nلا يمكن رفض الطلب`
        : "لا يمكن رفض الطلب";
      toast.error(errMsg);
    },
  });

  const isPending = data.status === "pending";
  const isApproved = data.status === "accepted";
  const isDeclined = data.status === "declined";

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "في الانتظار",
          variant: "secondary" as const,
          icon: Clock,
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200"
        };
      case "accepted":
        return {
          label: "مقبول",
          variant: "default" as const,
          icon: CheckCircle,
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200"
        };
      case "declined":
        return {
          label: "مرفوض",
          variant: "destructive" as const,
          icon: XCircle,
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200"
        };
      default:
        return {
          label: status,
          variant: "outline" as const,
          icon: Clock,
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200"
        };
    }
  };

  const statusConfig = getStatusConfig(data.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              تفاصيل الطلب
            </DialogTitle>
            <Badge 
              variant={statusConfig.variant}
              className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border flex items-center gap-1 px-3 py-1`}
            >
              <StatusIcon size={14} />
              {statusConfig.label}
            </Badge>
          </div>
          <DialogDescription className="text-gray-600">
            معلومات تفصيلية للطلب رقم #{data.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات أساسية */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                معلومات الطلب
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">اسم الطالب</p>
                      <p className="font-medium text-gray-900">{data.student_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">اسم الكورس</p>
                      <p className="font-medium text-gray-900">{data.course_title}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">المبلغ النهائي</p>
                      <p className="font-medium text-gray-900 text-lg">
                        {data.cousre_final_price} 
                        <span className="text-sm text-gray-500 mr-1">جنيه</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">تاريخ الطلب</p>
                      <p className="font-medium text-gray-900">
                        {new Date(data.order_date).toLocaleDateString("ar-EG", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* إيصال الدفع */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt size={18} className="text-green-600" />
                إيصال الدفع
              </h3>
              
              {data.receipt ? (
                <div className="space-y-3">
                
                 <div className="text-center space-y-3">
  {/* Receipt preview */}
  <div className="w-full flex justify-center">
    <img
      src={data.receipt}
      alt="إيصال الدفع"
      className="max-h-80 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md object-contain"
    />
  </div>

  {/* Link to open in new tab */}
  <a 
    href={data.receipt} 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
  >
    <ExternalLink size={14} />
    عرض الإيصال في نافذة جديدة
  </a>
</div>

                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Receipt size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>لا يوجد إيصال دفع مرفق</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* أزرار التحكم */}
          {isPending && (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  إجراءات الطلب
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="destructive"
                    onClick={() => decline()}
                    disabled={decliningStatus === "pending"}
                    className="flex items-center gap-2 min-w-[140px]"
                  >
                    {decliningStatus === "pending" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        جاري الرفض...
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        رفض الطلب
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => approve()}
                    disabled={approvingStatus === "pending"}
                    className="flex items-center gap-2 min-w-[140px] bg-green-600 hover:bg-green-700"
                  >
                    {approvingStatus === "pending" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        جاري القبول...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        قبول الطلب
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* زر إغلاق */}
          <div className="flex justify-center pt-4">
            <DialogClose asChild>
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="min-w-[120px]"
              >
                إغلاق
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

