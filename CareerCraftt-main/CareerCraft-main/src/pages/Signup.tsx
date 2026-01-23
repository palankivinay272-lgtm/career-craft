import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [college, setCollege] = useState("");
  const [role, setRole] = useState("student"); // Default to student
  const [loading, setLoading] = useState(false);

  // List of Colleges (Shared with Placements.tsx - simplified for now)
  const COLLEGES = [
    "ABC College", "XYZ University", "IIT Delhi", "IIT Bombay", "IIT Madras",
    "NIT Trichy", "NIT Warangal", "NIT Surathkal", "BITS Pilani", "VIT Vellore",
    "SRM University", "Amity University", "Anna University", "JNTU Hyderabad",
    "Osmania University", "Manipal University", "PES University", "Christ University",
    "Lovely Professional University", "SASTRA University", "Anurag University"
  ];

  const handleKeyDown = (e: React.KeyboardEvent, target: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (target === "password") {
        document.getElementById("password-input")?.focus();
      } else if (target === "college") {
        document.getElementById("college-select")?.focus();
      } else if (target === "submit") {
        handleSignup();
      }
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !college) {
      toast.error("Please fill in all fields (including College)");
      return;
    }

    setLoading(true);

    try {
      // 🔗 Firebase Signup
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("../lib/firebase");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registered:", userCredential.user);

      // Sync with Backend (Sending token + college + role)
      try {
        const token = await userCredential.user.getIdToken();
        await fetch("http://localhost:8000/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, college, role }),
        });
      } catch (err) {
        console.error("Backend Sync Failed:", err);
      }

      toast.success("Account created! Logging you in...");

      // Auto-login after signup
      localStorage.setItem("user", userCredential.user.email?.split("@")[0] || "User");
      localStorage.setItem("email", userCredential.user.email || "");
      localStorage.setItem("uid", userCredential.user.uid);
      localStorage.setItem("college", college);
      localStorage.setItem("role", role); // Save role locally
      if (role === 'admin') localStorage.setItem("isAdmin", "true");

      navigate(role === 'admin' ? "/admin-dashboard" : "/dashboard");

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
          onKeyDown={(e) => handleKeyDown(e, "password")} // 🆕
        />

        {/* Password Group */}
        <div className="relative mb-4">
          <input
            id="password-input" // 🆕
            type={showPassword ? "text" : "password"} // 🆕
            placeholder="Password"
            className="w-full rounded-lg bg-black/60 border border-white/10 px-4 py-2 outline-none focus:border-purple-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "college")} // 🆕
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* College Selection */}
        <select
          id="college-select" // 🆕
          className="w-full mb-4 rounded-lg bg-black/60 border border-white/10 px-4 py-2 outline-none focus:border-purple-500 text-white/80"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        >
          <option value="" disabled>Select your College</option>
          {COLLEGES.map((c) => (
            <option key={c} value={c} className="bg-black text-white">
              {c}
            </option>
          ))}
        </select>

        {/* Role Selection */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-2 rounded-lg border ${role === 'student' ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'border-white/10 text-gray-400'}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-lg border ${role === 'admin' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-white/10 text-gray-400'}`}
          >
            Admin
          </button>
        </div>

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
