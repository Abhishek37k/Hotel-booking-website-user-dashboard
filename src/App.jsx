// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookHotel from "./pages/BookHotel";
import Dashboard from "./components/Dashboard";
import Explore from "./pages/Explore";
import MyBookings from "./pages/MyBookings";

const NotFound = () => (
  <h1 className="text-center mt-20 text-2xl">404 - Page Not Found</h1>
);

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        >
          {/* child routes */}
           <Route index element={<Navigate to="explore" replace />} />
          <Route path="explore" element={<Explore />} />
          <Route path="book/:id" element={<BookHotel />} />
          <Route path="mybookings" element={<MyBookings />} />
          {/* <Route path="more" element={<More />} /> */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
