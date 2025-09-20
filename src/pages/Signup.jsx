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
      console.log("Signup Response:", data);
      if (data.error) throw new Error(data.error.message);

      // Store user info in Realtime Database
      const userId = data.localId;
      const token = data.idToken;
      
      await fetch(`${DB_URL}/users/${userId}.json?auth=${token}`, {
        method: "PUT",
        body: JSON.stringify({
          name: nameRef.current.value,
          email: payload.email,
          role: "user", // default role
        }),
      });

      // store user in redux
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSignup}
      >
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <input
          ref={nameRef}
          type="text"
          placeholder="Name"
          required
          className="w-full p-2 mb-3 border rounded"
        />
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
          {loading ? "Signing up..." : "Signup"}
        </button>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
