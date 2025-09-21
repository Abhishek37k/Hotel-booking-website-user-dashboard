import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/authSlice";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
      <form
        onSubmit={handleLogin}
        className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to access your dashboard
        </p>

        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
        />
        <input
          ref={passRef}
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold p-3 rounded-xl shadow-md transition duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-500 font-medium hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
