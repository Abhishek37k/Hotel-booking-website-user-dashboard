import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <Navbar />
    
      <div className="flex-1 p-4">
        <Outlet /> {/* child routes render here */}
      </div>
    </div>
  );
};

export default Dashboard;
