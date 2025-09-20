import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth.user);

  return (
    <nav className="bg-gray-800 text-white p-3 flex justify-between">
      <h1 className="text-xl font-bold">Hotel Booking</h1>
      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard/explore">Explore</Link>
            <Link to="/dashboard/mybookings">My Bookings</Link>
            <button onClick={() => dispatch(authActions.logout())}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
