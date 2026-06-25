import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Sparkles, Eye, EyeOff, TrendingUp, Users, FolderKanban, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginForm { email: string; password: string; remember: boolean; }

const STATS = [
  { icon: Users, label: "Resources Managed", value: "500+" },
  { icon: FolderKanban, label: "Active Projects", value: "35+" },
  { icon: TrendingUp, label: "Utilization Accuracy", value: "98%" },
  { icon: Zap, label: "Bench Reduction", value: "40%" },
];

interface LoginPageProps { onLogin: () => void; }

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: "admin@techcorp.com", password: "", remember: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (data.email === "admin@techcorp.com" && data.password === "Admin@123") {
      localStorage.setItem("rms_auth", "true");
      onLogin();
    } else {
      setError("Invalid credentials. Try admin@techcorp.com / Admin@123");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-12 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-500/10 border border-indigo-500/20"
              style={{
                width: 120 + i * 80, height: 120 + i * 80,
                top: `${10 + i * 12}%`, left: `${-20 + i * 15}%`,
              }}
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-lg tracking-tight">TechCorp RMS</p>
            <p className="text-indigo-300 text-xs">Resource Management System</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Intelligent resource management for enterprise teams
            </h1>
            <p className="text-indigo-300 text-lg leading-relaxed">
              Allocate the right people to the right projects. Maximize utilization. Minimize bench time.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <Icon className="h-5 w-5 text-indigo-300 mb-2" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-indigo-300 text-xs mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative">
          <p className="text-indigo-400 text-sm italic">
            "TechCorp RMS reduced our bench time by 40% in the first quarter."
          </p>
          <p className="text-indigo-500 text-xs mt-1">— VP of Delivery, Fortune 500 Client</p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">TechCorp RMS</p>
              <p className="text-slate-400 text-xs">Resource Management System</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                data-testid="input-email"
                className={cn(
                  "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 outline-none transition-all",
                  "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
                  errors.email ? "border-red-300" : "border-slate-300"
                )}
                placeholder="you@company.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button type="button" className="text-xs text-indigo-600 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  {...register("password", { required: "Password is required" })}
                  type={showPass ? "text" : "password"}
                  data-testid="input-password"
                  className={cn(
                    "w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm text-slate-900 bg-white placeholder:text-slate-400 outline-none transition-all",
                    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
                    errors.password ? "border-red-300" : "border-slate-300"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                {...register("remember")}
                type="checkbox"
                id="remember"
                data-testid="checkbox-remember"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me for 30 days</label>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              data-testid="button-signin"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={cn(
                "w-full rounded-lg bg-indigo-600 text-white py-2.5 text-sm font-semibold transition-all hover:bg-indigo-700",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
            </motion.button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Demo credentials</p>
            <p className="text-xs text-indigo-600">admin@techcorp.com</p>
            <p className="text-xs text-indigo-600">Admin@123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
