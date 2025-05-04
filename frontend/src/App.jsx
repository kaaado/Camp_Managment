import {Routes, Route, Navigate} from 'react-router-dom';
import Camp from './components/Dashboard/Camp';
import CustomToaster from './components/CustomToast';
import RequireAuth from './pages/Auth/Protecting/RequireAuth';
import RequireBack from './pages/Auth/Protecting/RequireBack';
import Login from './pages/Auth/Auth/Login';
import Register from './pages/Auth/Auth/Register';
import Err404 from './pages/Auth/Error/404';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Dashboard/User/Users';
import User from './pages/Dashboard/User/User';
import CampDetails from './pages/Dashboard/Camp/CampDetails';
import AddCamp from './pages/Dashboard/Camp/AddCamp';
import UpdateCamp from './pages/Dashboard/Camp/UpdateCamp';
import AddKid from './pages/Dashboard/Kid/AddKid';
import Kids from './pages/Dashboard/Kid/Kids';
import DetailsKid from './pages/Dashboard/Kid/DetailsKid';

export default function App() {
  return (
    <>
      <CustomToaster />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Navigate to="/login" replace />} />

        <Route element={<RequireBack/>}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/*' element={<Err404 />} />
        
        {/* Protected Routes */}			
        <Route element={<RequireAuth allowedRoles={["user","admin"]} />}>
          {/* Dashboard */}
          <Route path='/dashboard' element={<Dashboard />}>
            <Route element={<RequireAuth allowedRoles={["admin"]} />}>
              {/* User */}
              <Route path='users' element={<Users/>} />
              <Route path="user/:id" element={<User />} />
              {/* Add Camp */}
              <Route path='camp/add' element={<AddCamp />} />
              <Route path="camp/:id" element={<UpdateCamp />} />
              {/* Kids */}
              <Route path='kids' element={<Kids />} />
              <Route path='kid/detail/:id' element={<DetailsKid />} />
              
            </Route>
            
            <Route element={<RequireAuth allowedRoles={["user","admin"]} />}>
              {/* Camp */}
              <Route path='camps' element={<Camp />} />
              <Route path='camp/detail/:id' element={<CampDetails />} />
              <Route path='kid/add' element={<AddKid />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}