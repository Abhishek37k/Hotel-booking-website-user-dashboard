import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/" />; 

  return (
    <div>
      <Navbar />
      {/* Nested Routes for Explore / MyBookings */}
    </div>
  );
};

export default Dashboard;
