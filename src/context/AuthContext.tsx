import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

// ================== Types ==================
interface AuthResponse {
  access: string;
  refresh: string;
  type:string
}

interface LoginData {
  phone: string;
  password: string;
}

interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  setAccessToken: (token: string | null) => void;
}

// ================== Context ==================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================== Provider ==================
export default function AuthProvider({ children }: { children: ReactElement }) {
  const queryClient = useQueryClient();

  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);

      const { data: resData } = await axios.post<AuthResponse>(
        "https://learning.sass.cyparta.com/dashboard/login/",
        data
      );

      toast.success("تم تسجيل الدخول بنجاح");

      localStorage.setItem("accessToken", resData.access);
      localStorage.setItem("refreshToken", resData.refresh);
      localStorage.setItem("role", resData.type);

      setAccessToken(resData.access);
    } catch (error) {
      const err = error as AxiosError<{ detail?: string }>;

      if (err.response?.status === 401 || err.response?.status === 404) {
        toast.error("من فضلك ادخل بيانات صحيحة");
      } else {
        toast.error(err.response?.data?.detail || "حدث خطأ غير متوقع");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, logout, login, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ================== Hook ==================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
