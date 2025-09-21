// Dashboard.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      {/* <div className="bg-blue-600 text-white py-6 px-6 shadow">
        <h2 className="text-2xl font-bold">User Dashboard</h2>
        <p className="text-sm opacity-90">Manage bookings & explore hotels</p>
      </div> */}
      <div className="flex-1 p-6">
        <Outlet /> {/* child routes render here */}
      </div>
    </div>
  );
};

export default Dashboard;
