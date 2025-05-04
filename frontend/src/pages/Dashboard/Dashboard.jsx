
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import './dashboard.css';
import { Menu } from '../../context/MenuContext';
import { WindowSize } from '../../context/WindowContext';
import SideBar from '../../components/Dashboard/SideBar';
import TopBar from '../../components/Dashboard/TopBar';
export default function Dashboard() {
  const menu = useContext(Menu);
  const isOpen = menu.isOpen;
  const WindowContext =useContext(WindowSize);
const windowSize =WindowContext.windowSize;

  return (
    <div className="dashboard-container">
      <SideBar />
      <div className="dashboard-content" style={{
  width: windowSize >'768' ? `calc(100% - ${isOpen ? '270px' : '90px'})` : `calc(100% - ${isOpen ? '00px' : '0px'})` ,
  
}}>
        <TopBar />
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
