import { useState } from "react";
import DeleteRowModal from "@/components/shared/modals/DeleteRowModal";
import type { ModalName } from "@/lib/types";
import { Link } from "react-router";
import { Eye, Pencil } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: Record<string, any>) => React.ReactNode; // ✅ optional render function
}

interface CustomTableProps {
  data: Array<{ [key: string]: any }>;
  columns: Array<Column>;
  actions: Array<"view" | "edit" | "delete">;
  loading: boolean;
  endpoint?:string;
  modalName: ModalName;
}

// Reusable Table Component
const CustomTable = ({
  data,
  columns,
  loading,
  actions,
  modalName,endpoint,defValuesOfEdit
}: CustomTableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((item) => item.id));
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Table */}
      <div className="overflow-x-auto border-t rounded-lg min-h-[400px]">
        <table className="w-full rounded-xl">
          <thead className="border !border-t-0">
            <tr>
              <th className="w-12 px-6 py-1">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === data.length && data.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded accent-primary"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-1 text-center text-sm font-medium text-primary capitalize tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-1 text-center text-sm font-medium text-primary capitalize tracking-wider">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr className="animate-pulse h-[400px]">
                <td
                  colSpan={columns.length + 2}
                  className="px-6 py-4 text-center text-xl text-primary font-semibold"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr className="h-[400px]">
                <td
                  colSpan={columns.length + 2}
                  className="px-6 py-4 text-center text-xl text-primary font-semibold"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                      className="rounded border-gray-300 accent-primary "
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.key + item.id}
                      className="px-6 py-2 whitespace-nowrap text-sm text-gray text-center"
                    >
                      {column.render
                        ? column.render(item[column.key], item) // ✅ custom formatting
                        : item[column.key] || "----"}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray">
                      <div className="flex items-center justify-center gap-2">
                        {actions.includes("edit") && (
                          <Link state={{item}} to={`/${modalName}/${item.id}`}>
                            <Pencil size={16} />
                          </Link>
                        )}
                        {actions.includes("delete") && (
                          <DeleteRowModal id={item.id} modelName={modalName} endpoint={endpoint} />
                        )}
                        {actions.includes("view") && (
                          <Link ؤ   to={`/${modalName}/view/${item.id}`}>
                            <Eye size={16} />
                          </Link>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
