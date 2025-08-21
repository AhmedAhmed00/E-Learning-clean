import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

type ParamValue = string | number | null | undefined;
type ParamsObject = Record<string, ParamValue>;

interface SetParam<T extends ParamsObject> {
  (key: keyof T, value: ParamValue): void;
}

type SetParamsInput<T extends ParamsObject> = {
  [K in keyof T]?: ParamValue;
};

interface SetParams<T extends ParamsObject> {
  (params: SetParamsInput<T>): void;
}

interface UseURLParamsReturn<T extends ParamsObject> {
  params: T;
  setParam: SetParam<T>;
  setParams: SetParams<T>;
  clearParams: () => void;
  clearMyParams: () => void;
  searchParams: URLSearchParams;
  pathname: string;
  addQueryString: (paramsToUpdate: Record<string, string>) => void;
}

const useURLParams = <T extends ParamsObject>(
  initialParams: T
): UseURLParamsReturn<T> => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current search params
  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const pathname = location.pathname;

  // Get all params as object
  const getParams = useCallback((): T => {
    const urlParams: Record<string, any> = {};

    // Apply initial params first
    Object.entries(initialParams).forEach(([key, defaultValue]) => {
      urlParams[key] = defaultValue;
    });

    // Override with URL params
    for (const [key, value] of searchParams.entries()) {
      if (key in initialParams) {
        urlParams[key] = value;
      }
    }

    return urlParams as T;
  }, [initialParams, searchParams]);

  // Create query string by merging current params with new ones
  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string>): string => {
      const params = new URLSearchParams(location.search);
      
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      
      return params.toString();
    },
    [location.search]
  );

  // Navigate with updated query string (same as Next.js pattern)
  const addQueryString = useCallback(
    (paramsToUpdate: Record<string, string>): void => {
      const queryString = createQueryString(paramsToUpdate);
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      navigate(newUrl, { replace: false });
    },
    [createQueryString, pathname, navigate]
  );

  // Update specific param - PRESERVES all other params
  const setParam: SetParam<T> = useCallback(
    (key, value) => {
      const keyStr = String(key);
      const valueStr = value === null || value === undefined ? "" : String(value);
      
      addQueryString({ [keyStr]: valueStr });
    },
    [addQueryString]
  );

  // Update multiple params - PRESERVES all other params
  const setParams: SetParams<T> = useCallback(
    (params) => {
      const paramsToUpdate: Record<string, string> = {};
      
      Object.entries(params).forEach(([key, value]) => {
        const valueStr = value === null || value === undefined ? "" : String(value);
        paramsToUpdate[key] = valueStr;
      });
      
      addQueryString(paramsToUpdate);
    },
    [addQueryString, searchParams]
  );

  // Clear ALL params (dangerous - affects other components)
  const clearParams = useCallback(() => {
    navigate(pathname, { replace: true });
  }, [pathname, navigate]);

  // Clear only this component's params (safer)
  const clearMyParams = useCallback(() => {
    const paramsToUpdate: Record<string, string> = {};
    
    // Set all this component's params to empty (which will delete them)
    Object.keys(initialParams).forEach((key) => {
      paramsToUpdate[key] = "";
    });
    
    addQueryString(paramsToUpdate);
  }, [initialParams, addQueryString]);

  return {
    params: getParams(),
    setParam,
    setParams,
    clearParams,
    clearMyParams,
    searchParams,
    pathname,
    addQueryString,
  };
};

export default useURLParams;