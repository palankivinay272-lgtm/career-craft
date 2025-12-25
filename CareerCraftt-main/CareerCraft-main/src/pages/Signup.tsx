import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // 🔗 Firebase Signup
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("../lib/firebase");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registered:", userCredential.user);

      // Sync with Backend
      try {
        const token = await userCredential.user.getIdToken();
        await fetch("http://127.0.0.1:8000/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      } catch (err) {
        console.error("Backend Sync Failed:", err);
        // Optional: We don't block the user, just log it.
        // Because usually verify-token is for syncing logic.
      }

      toast.success("Account created! Logging you in...");

      // Auto-login after signup just like a modern app
      // Set local storage for ProtectedRoute compatibility
      localStorage.setItem("user", userCredential.user.email?.split("@")[0] || "User");
      localStorage.setItem("email", userCredential.user.email || "");

      navigate("/dashboard");

    } catch (error: any) {
      console.error("Signup Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Email already in use. Try logging in.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password should be at least 6 characters.");
      } else {
        toast.error("Signup failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0b2e] to-black relative overflow-hidden">

      {/* Glow */}
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
          Create Account
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Start crafting your career with AI
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 rounded-lg bg-black/60 border border-white/10 px-4 py-2 outline-none focus:border-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 rounded-lg bg-black/60 border border-white/10 px-4 py-2 outline-none focus:border-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
