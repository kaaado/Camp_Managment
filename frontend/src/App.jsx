import './App.css'
import { Outlet } from 'react-router-dom';
import CustomToaster from "./components/CustomToast";

function App() {


  return (
    <>
     <CustomToaster />
     <Outlet />
    </>
  )
}

export default App
