"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState, useEffect, forwardRef } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "react-router"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Calendar as CalendarIcon } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  name: string
  label: string
  type?: "select" | "date"
  options?: FilterOption[]
  defaultValue?: string
}

export default function TableOperations({
  resourse = "عنصر",
  filters = [],
}: {
  resourse: string
  filters?: FilterConfig[]
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    filters.forEach((f) => {
      initial[f.name] =
        searchParams.get(f.name) ||
        f.defaultValue ||
        (f.type === "select" ? f.options?.[0]?.value : "") ||
        ""
    })
    return initial
  })

  const handleFilterChange = (name: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const params: Record<string, string> = {}
    if (search) params.search = search
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== "all") params[key] = value
    })
    setSearchParams(params, { replace: true })
  }, [search, filterValues, setSearchParams])

  // ✅ Custom Button for DatePicker (shadcn style)
  const DateButton = forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: () => void; placeholder?: string }
  >(({ value, onClick, placeholder }, ref) => (
    <Button
      ref={ref}
      onClick={onClick}
      variant="outline"
      className="w-full justify-start text-left font-normal h-[38px]"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value && value !== "" ? value : placeholder}
    </Button>
  ))
  DateButton.displayName = "DateButton"

  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex bg-white p-4 rounded-2xl shadow-md gap-4 mb-6 flex-wrap"
    >
      {/* 🔎 Search Input */}
      <div className="flex-1 min-w-[200px]">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            البحث
          </label>
          <Input
            placeholder={`ابحث عن ${resourse}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[38px] bg-white text-[15px]"
          />
        </div>
      </div>

      {/* 🔄 Dynamic Filters */}
      {filters.map((f) => (
        <div key={f.name} className="w-48">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {f.label}
            </label>
            
            {f.type === "select" ? (
              <Select
                value={filterValues[f.name]}
                onValueChange={(val) => handleFilterChange(f.name, val)}
              >
                <SelectTrigger style={{
                  height:"38px"
                }} className=" bg-white w-full">
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  {f.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : f.type === "date" ? (
              <DatePicker
                selected={filterValues[f.name] ? new Date(filterValues[f.name]) : null}
                onChange={(date: Date | null) =>
                  handleFilterChange(
                    f.name,
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                dateFormat="yyyy-MM-dd"
                customInput={<DateButton placeholder="اختر التاريخ" />}
                wrapperClassName="w-full"
              />
            ) : null}
          </div>
        </div>
      ))}
    </motion.div>
  )
}