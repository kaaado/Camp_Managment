import './bars.css';
import { NavLink } from 'react-router-dom';
import { Menu } from '../../context/MenuContext';
import { WindowSize } from '../../context/WindowContext';
import { useContext } from 'react';
import { useUser } from '../../context/UserContext';
import { TbUsersPlus } from "react-icons/tb";
import { FaPlus, FaUser, FaUsers, FaGithub } from "react-icons/fa";
import { FaCampground } from "react-icons/fa6";
import LoadingSubmit from '../Loading/loading';

export default function SideBar() {
  const { user, loading, isAuthenticated } = useUser();
  const menu = useContext(Menu);
  const isOpen = menu.isOpen;
  const WindowContext = useContext(WindowSize);
  const windowSize = WindowContext.windowSize;

  if (loading) {
    return <LoadingSubmit />;
  } 

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        left: '0',
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: 'rgba(0,0,0,0.2)',
        display: windowSize < '768' && isOpen ? "block" : "none"
      }}></div>
      
      <div className="side-bar pt-3" style={{
        left: windowSize < '768' ? isOpen ? 0 : '-100%' : 0,
        width: isOpen ? "250px" : "70px",
        position: windowSize < '768' ? "fixed" : "sticky",
        color: '#038edc',
        transition: 'left 0.5s ease, width 0.5s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'space-between'
      }}>
        <div>
          <div className="{` d-flex align-items-center logo ${isOpen ? 'side-bar-expanded' : 'side-bar-collapsed'}`}">
            <FaCampground
              className="sidebar-icon icon-collapsed " style={{ fontSize: "3rem", color: "#FFA500" }} /> 
            <h4 className=" m-0" style={{ display: isOpen ? "block" : "none" }}>Tim Camp</h4>
          </div>
          
          {user.type === "admin" && 
            <NavLink 
              to="/dashboard/users"
              className={`side-bar-link d-flex align-items-center gap-2 ${isOpen ? 'side-bar-expanded' : 'side-bar-collapsed'}`}
            >
              <FaUser className='sidebar-icon icon-collapsed fs-1' />
              <p className="m-0" style={{ display: isOpen ? "block" : "none" }}>
                Users
              </p>
            </NavLink>
          }

          <NavLink 
            to="/dashboard/camps"
            className={`side-bar-link d-flex align-items-center gap-2 ${isOpen ? 'side-bar-expanded' : 'side-bar-collapsed'}`}
          >
            <FaCampground className='sidebar-icon icon-collapsed fs-1' />
            <p className="m-0" style={{ display: isOpen ? "block" : "none" }}>
              Camps
            </p>
          </NavLink>

          {user.type === "admin" && <>
            <NavLink 
              to="/dashboard/camp/add"
              className={`side-bar-link d-flex align-items-center gap-2 ${isOpen ? 'side-bar-expanded' : 'side-bar-collapsed'}`}
            >
              <FaPlus className='sidebar-icon icon-collapsed fs-1' />
              <p className="m-0" style={{ display: isOpen ? "block" : "none" }}>
                Add Camp
              </p>
            </NavLink>
            <NavLink 
              to="/dashboard/kids"
              className={`side-bar-link d-flex align-items-center gap-2 ${isOpen ? 'side-bar-expanded' : 'side-bar-collapsed'}`}
            >
              <FaUsers className='sidebar-icon icon-collapsed fs-1' />
              <p className="m-0" style={{ display: isOpen ? "block" : "none" }}>
                Kids
              </p>
            </NavLink>
          </>}
        </div>

        {/* Developer Footer */}
        <div className={`developer-footer ${isOpen ? 'expanded' : 'collapsed'}`} 
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease'
          }}>
          <a 
            href="https://github.com/kaaado" 
            target="_blank" 
            rel="noopener noreferrer"
            className="d-flex align-items-center gap-2 text-decoration-none"
            style={{
              color: '#038edc',
              justifyContent: isOpen ? 'flex-start' : 'center'
            }}
          >
            <FaGithub className="fs-4" />
            {isOpen && (
              <div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Developed by</div>
                <div style={{ fontWeight: 'bold' }}>kaaado</div>
              </div>
            )}
          </a>
        </div>
      </div>
    </>
  );
}