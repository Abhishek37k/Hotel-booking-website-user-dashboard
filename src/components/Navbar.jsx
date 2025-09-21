import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth.user);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold text-teal-600">Hotel Booking</h1>
      <div className="space-x-6">
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard/explore"
              className="text-gray-700 font-medium hover:text-teal-500 transition"
            >
              Explore
            </Link>
            <Link
              to="/dashboard/mybookings"
              className="text-gray-700 font-medium hover:text-teal-500 transition"
            >
              My Bookings
            </Link>
            <button
              onClick={() => dispatch(authActions.logout())}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-teal-500 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-gray-700 font-medium hover:text-teal-500 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
