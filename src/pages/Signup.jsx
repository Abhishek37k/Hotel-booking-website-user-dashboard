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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-500">
      <form
        onSubmit={handleSignup}
        className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Join us to explore amazing hotels
        </p>

        <input
          ref={nameRef}
          type="text"
          placeholder="Name"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
        <input
          ref={passRef}
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold p-3 rounded-xl shadow-md transition duration-300"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-teal-500 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
