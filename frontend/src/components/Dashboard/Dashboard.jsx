// import TopBar from './Topbar';
// import SideBar from './Sidebar';
import { Outlet } from 'react-router-dom';
import './dashboard.css';

export default function Dashboard() {

  return (
    <div className="dashboard-container">
      {/* <SideBar /> */}
      <div className="dashboard-content" >
        {/* <TopBar /> */}
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}