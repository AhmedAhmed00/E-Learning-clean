
import { BrowserRouter, useRoutes } from 'react-router'
import './styles/App.css'
import { protectedRoutes, publicRoutes } from './routes';
import ProtectedRoute from './pages/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import  { Toaster as HoatToast } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});

function AppRoutes() {
  const routes = useRoutes([
    {
      element: <ProtectedRoute />,
      children: protectedRoutes,
    },
    ...publicRoutes,
  ]);

  return routes;
}




function App() {
 

  return (
    <>
     <QueryClientProvider client={queryClient}>
      <Toaster />
      <HoatToast />
          <BrowserRouter > 
      <AuthProvider  > 
       <AppRoutes/>
        
      </AuthProvider>
   
      </BrowserRouter>
            <ReactQueryDevtools position='bottom' initialIsOpen={false} />

     </QueryClientProvider>
  
    </>
  )
}

export default App
