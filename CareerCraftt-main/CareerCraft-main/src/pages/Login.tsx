import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  // 🆕 Handle "Enter" key to focus next field or submit
  const handleKeyDown = (e: React.KeyboardEvent, target: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (target === "password") {
        document.getElementById("password-input")?.focus();
      } else if (target === "submit") {
        handleLogin();
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      /* ===============================
         1️⃣ TRY ADMIN LOGIN FIRST
      =============================== */
      const adminRes = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email, // admin uses email field
          password: password,
        }),
      });

      if (!adminRes.ok) {
        throw new Error("Backend not reachable");
      }

      const adminData = await adminRes.json();

      if (adminData.success) {
        // ✅ ADMIN LOGIN
        localStorage.setItem("isAdmin", "true");
        // Store college if returned (e.g. "IIT Bombay"), or "SUPER_ADMIN" fallback
        if (adminData.college) {
          localStorage.setItem("adminCollege", adminData.college);
        }

        toast.success("Admin login successful!");
        navigate("/admin");
        return;
      }

      /* ===============================
         2️⃣ NORMAL USER LOGIN (FIREBASE)
      =============================== */

      // If Admin login failed and input is NOT an email, don't try Firebase
      if (!email.includes("@")) {
        toast.error("Invalid username or password");
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Sync with Backend
      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:8000/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (data.college) {
          localStorage.setItem("college", data.college); // 🆕 Save fetched college
        }

      } catch (err) {
        console.error("Backend Sync Failed:", err);
      }

      localStorage.removeItem("isAdmin");
      localStorage.setItem("user", user.email?.split("@")[0] || "User");
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("uid", user.uid);

      toast.success("Login successful!");
      navigate("/dashboard");

    } catch (error: any) {
      console.error(error);
      if (error.message === "Backend not reachable") {
        // Admin login failed connection, but if we are trying user login, it might be firebase error
        toast.error("Admin Login/Server Error: " + error.message);
      } else if (error.code) {
        // Firebase Error
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
          // If we got here, it means Admin Login failed (backend said {success:false}) AND Firebase failed.
          // So it really is invalid creds.
          toast.error("Invalid email or password");
        } else {
          toast.error("Login failed: " + error.message);
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0b2e] to-black relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl top-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl bottom-[-200px] right-[-200px]" />

      {/* Card */}
      <div className="relative z-10 w-[380px] rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-8 text-white shadow-xl">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center text-xl font-bold">
            ✨
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Login to continue your career journey
        </p>

        {/* Email */}
        <input
          id="email-input"
          type="email"
          placeholder="Email / Username"
          className="w-full mb-4 rounded-lg bg-black/60 border border-white/10 px-4 py-2 outline-none focus:border-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "password")} // 🆕 Move to password
        />

        {/* Password Group */}
        <div className="relative mb-6">
          <input
            id="password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full rounded-lg bg-black/60 border border-white/10 px-4 py-2 outline-none focus:border-purple-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "submit")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-6 -mt-4">
          <button
            onClick={handleForgotPassword}
            className="text-xs text-gray-400 hover:text-purple-400 transition"
          >
            Forgot Password?
          </button>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
