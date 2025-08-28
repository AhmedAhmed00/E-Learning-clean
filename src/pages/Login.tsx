import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Schema
const loginSchema = z.object({
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { isLoading, login, accessToken } = useAuth();

  useEffect(() => {
    if (accessToken) navigate("/");
  }, [accessToken, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await login(values);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
                  لوحة تحكم المنصة التعليمية
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">سجل دخولك للمتابعة</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={() => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl style={{ direction: "rtl" }}>
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <PhoneInput
                            country={"eg"} // 🇪🇬 default Egypt
                            value={field.value}
                            onChange={(value) => field.onChange("+" + value)}
                            inputClass="!w-full !h-10 !text-base  !border !border-gray-300 !rounded-lg focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200"
                            buttonClass="!h-10 !border-gray-300 !rounded-l-lg"
                            containerClass="!w-full"
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full rounded-lg py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
