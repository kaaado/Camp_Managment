import { useUser } from '../../context/UserContext';


export default function AdminPanel() {
  const { user } = useUser();

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="admin-content">
        <div className="welcome-message">
          Welcome, {user?.name} ({user?.type})
        </div>
        <div className="admin-stats">
          <h2>Statistics</h2>
          <ul>
            <li>Total Users: 100</li>
            <li>Total Camps: 50</li>
            <li>Total Donations: $5000</li>
          </ul>
        </div>
      </div>
    </div>
  );
}