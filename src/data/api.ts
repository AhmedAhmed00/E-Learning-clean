// api.ts
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

const BASEURL = "https://learning.sass.cyparta.com";

// ✅ Create axios instance
export const api: AxiosInstance = axios.create({ baseURL: BASEURL });

// ✅ Generic API request wrapper
export async function apiRequest<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await api.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(`Error in ${method.toUpperCase()} ${url}:`, err);
    throw err.response ?? new Error("Unknown error occurred");
  }
}

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const lang = localStorage.getItem("lang");

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    if (lang) {
      config.headers = {
        ...config.headers,
        "Accept-Language": lang,
      };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshRequest: Promise<string> | null = null;

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshRequest) {
        refreshRequest = refreshToken();
      }

      try {
        const newAccessToken = await refreshRequest;
        refreshRequest = null;

        localStorage.setItem("accessToken", newAccessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        refreshRequest = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);

// ✅ Refresh Token Logic
async function refreshToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axios.post<{ accessToken: string }>(
    `${BASEURL}/core/refresh`,
    { refreshToken },
  );

  return response.data.accessToken;
}

// ✅ Generic CRUD Service
export function createService<T>(baseUrl: string) {
  return {
    baseUrl,
    getAll: (params?: Record<string, unknown>) =>
      apiRequest<{
        results: Array<{ [key: string]: unknown }>;
        next: string | null;
        count: number;
        statistics?: Record<string, string>;
      }>("get", baseUrl, undefined, { params }),

    getById: (id: string | number) => apiRequest<T>("get", `${baseUrl}${id}/`),

    create: (body: Partial<T>) => apiRequest<T>("post", baseUrl, body),

    update: (id: string | number, body: Partial<T>) =>
      apiRequest<T>("patch", `${baseUrl}${id}/`, body),

    delete: (id: string | number) =>
      apiRequest<void>("delete", `${baseUrl}${id}/`),

    getInfinite: async ({
      page = 1,
      search = "",
    }: {
      page?: number;
      search?: string;
    }) => {
      const params = { page, search };
      const response = await apiRequest<{
        results: T[];
        next: string | null;
        count: number;
      }>("get", baseUrl, undefined, { params });

      return {
        data: response.results,
        nextPage: response.next ? page + 1 : undefined,
        total: response.count,
      };
    },
  };
}

// ✅ Example Service Types

export const COURSES = `/course/employee-manage/`;
export const EMPLOYEES = `/employee/manage/`;
export const STUDENTS = `/students/manage/`;
export const TEACHERS = `/instructor/manage/`;

export const coursesServices = createService(COURSES);
export const employeesServices = createService(EMPLOYEES);
export const studentsServices = createService(STUDENTS);
export const tachersServices = createService(TEACHERS);

export default BASEURL;
