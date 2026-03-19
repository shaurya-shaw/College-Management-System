import { useAuthStore } from "../store/authStore";

const NavBar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logOut);

  return (
    /* Keeping your exact container classes and dimensions */
    <div className="bg-white/90 backdrop-blur-md w-full max-w-300 mx-auto rounded-2xl m-3 md:m-5 px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-500">
      {/* Logo / Title - Added a subtle tracking-in animation and hover glow */}
      <div className="group cursor-pointer">
        <h1 className="font-black text-2xl md:text-3xl tracking-tighter text-slate-900 transition-all duration-300 group-hover:text-indigo-600">
          Sorceres
          <span className="text-indigo-600 group-hover:text-slate-900 transition-colors duration-300">
            {" "}
            University
          </span>
        </h1>
        {/* Decorative line that grows on hover */}
        <div className="h-1 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full" />
      </div>

      {/* Right section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4 md:mt-0">
        <div className="flex flex-col items-center md:items-end animate-in fade-in slide-in-from-right-4 duration-700">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
            Portal Active
          </span>
          <h2 className="text-slate-800 font-bold text-lg md:text-xl">
            Welcome,{" "}
            <span className="text-indigo-600">
              {user?.fullName || "Scholar"}
            </span>
          </h2>
        </div>

        {/* Action Button - Polished SaaS style with "pop" animation */}
        <button
          className="relative overflow-hidden group bg-slate-950 text-white px-8 py-2.5 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          onClick={logout}
          type="button"
        >
          {/* Shimmer effect on hover */}
          <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

          <span className="relative flex items-center gap-2">
            Log Out
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
        </button>
      </div>

      {/* Adding a small CSS keyframe for the shimmer effect directly */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default NavBar;
