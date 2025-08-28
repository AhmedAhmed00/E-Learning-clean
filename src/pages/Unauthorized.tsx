import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <Card className="max-w-md w-full shadow-lg rounded-2xl text-center p-6">
        <CardHeader>
          <div className="flex justify-center mb-3">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            غير مصرح لك بالدخول
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            عذراً، ليس لديك صلاحية لهذا الإجراء. الرجاء العودة إلى
            الصفحة الرئيسية أو تسجيل الدخول بحساب آخر.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => (window.location.href = "/")}>
              الصفحة الرئيسية
            </Button>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
