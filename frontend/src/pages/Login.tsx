import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Existing custom utility classes
const customStyles = `
  @keyframes fade-in-scale {
    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .animate-cool-entry { animation: fade-in-scale 0.5s ease-out forwards; }
  .cool-input:focus ~ label { color: #4f46e5; }
`;

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const res = await api.post("/login", data);
      console.log("login successfull", res.data);
      setUser(res.data.user);
      const role = res.data.user.role;

      if (role === "TEACHER") navigate("/teacher/dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/student/dashboard");
    } catch (error: any) {
      console.log("login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen flex items-center justify-center bg-[#0e1015] relative overflow-hidden">
        {/* Shifting Gradient Blurs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-100 h-100 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse delay-75"></div>
          <div className="absolute top-1/4 right-1/4 w-87.5 h-87.5 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[90px] opacity-60 animate-pulse delay-200"></div>
          <div className="absolute -bottom-20 right-1/2 w-125 h-125 bg-indigo-700/25 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse delay-150"></div>
        </div>

        {/* Core Login Card Container */}
        <div className="max-w-xl w-full p-6 sm:p-10 md:p-12 z-10 animate-cool-entry">
          <div className="relative overflow-hidden bg-[#161a1f] p-8 sm:p-12 rounded-[40px] shadow-[0_0_80px_rgba(31,41,55,0.4)] border border-gray-800 backdrop-blur-3xl transform transition-all duration-300">
            {/* Cool Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#161a1f]/80 backdrop-blur-md">
                <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-r-4 border-blue-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-4 border-b-4 border-indigo-300 rounded-full animate-spin opacity-50"></div>
                </div>
                <h2 className="text-2xl font-bold text-white animate-pulse tracking-wide">
                  Authenticating
                </h2>
                <p className="text-sm text-indigo-400 mt-2 font-medium">
                  Waking up secure server...
                </p>
              </div>
            )}

            <div className="flex flex-col items-center mb-10">
              <div className="p-3.5 mb-5 bg-gray-800 border border-gray-700 rounded-3xl group transition hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10">
                <svg
                  className="w-10 h-10 text-gray-400 group-hover:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight text-center">
                Sign in to your account
              </h1>
              <p className="mt-2.5 text-center text-base text-gray-400 font-medium">
                Enter your details to access your dashboard.
              </p>
            </div>

            <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    disabled={isLoading}
                    className="cool-input block w-full px-5 py-4 text-base text-white bg-gray-900 border border-gray-700 rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 peer hover:border-gray-600 disabled:opacity-50"
                    {...register("email")}
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-5 top-4.5 text-gray-400 text-base font-medium transition-all duration-200 peer-focus:text-indigo-400 peer-focus:scale-85 peer-focus:-translate-y-9.5 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:-translate-y-9.5 origin-left pointer-events-none"
                  >
                    Email address
                  </label>
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    disabled={isLoading}
                    className="cool-input block w-full px-5 py-4 text-base text-white bg-gray-900 border border-gray-700 rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 peer hover:border-gray-600 disabled:opacity-50"
                    {...register("password")}
                    placeholder=" "
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-5 top-4.5 text-gray-400 text-base font-medium transition-all duration-200 peer-focus:text-indigo-400 peer-focus:scale-85 peer-focus:-translate-y-9.5 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:-translate-y-9.5 origin-left pointer-events-none"
                  >
                    Password
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-4 px-6 text-base font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200 ease-in-out shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.5)] focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#161a1f] focus:ring-indigo-500 focus:outline-none disabled:bg-indigo-800 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Sign In"}
                {!isLoading && (
                  <span className="absolute right-6 transition-transform duration-300 group-hover:translate-x-1.5">
                    <svg
                      className="w-5 h-5 text-indigo-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* === DEMO CREDENTIALS BOX (added here) === */}
            <div className="mt-8 bg-[#1f252b] border border-gray-700 rounded-3xl p-6">
              <p className="font-medium text-gray-400 mb-4 text-sm text-center">
                Demo Credentials (for recruiters &amp; testing)
              </p>

              <div className="space-y-2 text-left max-w-70 mx-auto text-gray-300 text-sm">
                <p>
                  <strong className="text-indigo-400">Admin:</strong>{" "}
                  shaurya@gmail.com / 1234
                </p>
                <p>
                  <strong className="text-indigo-400">Teacher:</strong>{" "}
                  kalyan@gmail.com / 1234
                </p>
                <p>
                  <strong className="text-indigo-400">Student:</strong>{" "}
                  surya@gmail.com / 1234
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-700 text-[10px] text-gray-500 leading-tight">
                Password is same for all roles • Centralized admin control
                <div className="mt-2 text-[13px] text-gray-200">
                  <span className="font-medium text-emerald-400">
                    **Student panel is fully responsive
                  </span>{" "}
                  (works perfectly on mobile) • Admin &amp; Teacher panels are
                  optimized for desktop/laptop Only
                </div>
              </div>
            </div>
            {/* =========================================== */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
