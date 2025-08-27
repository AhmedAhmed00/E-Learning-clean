"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  DollarSign,
  UserRound,
} from "lucide-react";

import Heading from "@/components/shared/Heading";
import TableOperations from "@/components/shared/table/TableOperations";
import RoundedCard from "@/components/shared/rounded-card";
import CustomTable from "@/components/shared/table/CustomTable";
import { useFetch } from "@/hooks/useFetch";
import BASEURL, { apiRequest, lecOrdersServices, ordersServices } from "@/data/api";
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
    label: "المبلغ",
    key: "cousre_final_price",
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
    service: lecOrdersServices.getAll,
    key: "lec-orders",
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تفاصيل الطلب</DialogTitle>
          <DialogDescription>
            معلومات الطلب رقم #{data.id}
          </DialogDescription>
        </DialogHeader>

        {/* تفاصيل الطلب */}
        <div className="space-y-2 ">
          <p>
            <strong className="me-1">الطالب:</strong> {data.student_name}
          </p>
          <p>
            <strong className="me-1">الكورس:</strong> {data.course_title}
          </p>
          <p>
            <strong className="me-1">المبلغ:</strong> {data.cousre_final_price}
          </p>
          <p>
            <strong className="me-1">الحالة:</strong> {data.status}
          </p>
          <p>
            <strong className="me-1">التاريخ:</strong>
            {new Date(data.order_date).toLocaleString("ar-EG")}
          </p>

          <div>
            <strong className="me-1">الإيصال:</strong>
            {data.receipt ? (
              <a href={data.receipt} target="_blank" rel="noopener noreferrer">
                <img
                  src={data.receipt}
                  alt="إيصال الدفع"
                  className="mt-2 rounded border max-w-xs cursor-pointer hover:opacity-80 transition"
                />
              </a>
            ) : (
              <span>لا يوجد</span>
            )}
          </div>
        </div>

        {/* أزرار التحكم - تظهر فقط إذا كان الطلب "pending" */}
        {isPending && (
          <div className="flex justify-between mt-6">
            <Button
              variant="destructive"
              onClick={() => decline()}
              disabled={decliningStatus === "pending"}
            >
              {decliningStatus === "pending" ? "جاري الرفض..." : "رفض الطلب"}
            </Button>

            <Button
              variant="default"
              onClick={() => approve()}
              disabled={approvingStatus === "pending"}
            >
              {approvingStatus === "pending" ? "جاري القبول..." : "قبول الطلب"}
            </Button>
          </div>
        )}

        {/* زر إغلاق */}
        <DialogClose asChild>
          <Button onClick={onClose} variant="outline" className="mt-4 w-full">
            إغلاق
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}




