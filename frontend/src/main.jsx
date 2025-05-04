import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProvider from './context/UserContext';
import WindowContext from './context/WindowContext';
import MenuContext from './context/MenuContext';
import App from './App';



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
    <WindowContext>
     <MenuContext>
    <UserProvider>
    <BrowserRouter>
			<App />
		</BrowserRouter>
        </UserProvider>
    </MenuContext>  
    </WindowContext>
    </QueryClientProvider>
  ,
)
