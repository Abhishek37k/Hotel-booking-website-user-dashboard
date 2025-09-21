import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/authSlice";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: emailRef.current.value,
      password: passRef.current.value,
      returnSecureToken: true,
    };

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const userId = data.localId;
      const token = data.idToken;

      await fetch(`${DB_URL}/users/${userId}.json?auth=${token}`, {
        method: "PUT",
        body: JSON.stringify({
          name: nameRef.current.value,
          email: payload.email,
          role: "user",
        }),
      });

      dispatch(
        authActions.login({
          user: { email: payload.email, name: nameRef.current.value },
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 px-4">
      {/* Page Heading */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-10 text-center drop-shadow-lg">
        Hotel Booking Website - User Signup
      </h1>

      <form
        onSubmit={handleSignup}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/30"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign up and start booking your favorite hotels
        </p>

        <input
          ref={nameRef}
          type="text"
          placeholder="Full Name"
          required
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <input
          ref={emailRef}
          type="email"
          placeholder="Email Address"
          required
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        <input
          ref={passRef}
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold p-3 rounded-xl shadow-lg transition duration-300"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-teal-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
