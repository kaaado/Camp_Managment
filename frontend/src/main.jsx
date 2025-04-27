import { createRoot } from 'react-dom/client'
import './index.css'
import router from './routes';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProvider from './context/UserContext';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 10,  
      staleTime: 1000 * 60 * 2,   
    },
  },
});


createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
    </QueryClientProvider>
  ,
)
