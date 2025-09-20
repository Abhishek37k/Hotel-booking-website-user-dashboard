import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/authSlice";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
// console.log("API_KEY:", API_KEY);

const Login = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: emailRef.current.value,
      password: passRef.current.value,
      returnSecureToken: true,
    };

    try {
      // 1️⃣ Firebase Auth Login
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const userId = data.localId;

      // 2️⃣ Fetch user role from Firebase Realtime Database
      const roleRes = await fetch(
        `${import.meta.env.VITE_FIREBASE_DB_URL}/users/${userId}.json?auth=${
          data.idToken
        }`
      );
      const roleData = await roleRes.json();
      if (!roleData) {
        alert("User role data not found.");
        setLoading(false);
        return;
      }
      if (roleData.role !== "user") {
        alert("Admins cannot login here.");
        setLoading(false);
        return;
      }

      // 3️⃣ Login successful
      dispatch(
        authActions.login({
          user: { email: payload.email, name: roleData.name },
          token: data.idToken,
        })
      );
      navigate("/dashboard/explore");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleLogin}
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          ref={passRef}
          type="password"
          placeholder="Password"
          required
          className="w-full p-2 mb-3 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
