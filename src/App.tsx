
import { BrowserRouter, useRoutes } from 'react-router'
import './styles/App.css'
import { protectedRoutes, publicRoutes } from './routes';
import ProtectedRoute from './pages/ProtectedRoute';


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
      <BrowserRouter > 
       <AppRoutes/>
   
      </BrowserRouter>
    </>
  )
}

export default App
