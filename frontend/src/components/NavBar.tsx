import { useAuthStore } from "../store/authStore";

const NavBar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logOut);

  return (
    <div className="bg-white w-full max-w-300 mx-auto rounded-2xl m-3 md:m-5 px-4 py-3 flex flex-col md:flex-row items-center justify-between shadow-sm">
      {/* Logo / Title */}
      <h1 className="font-bold text-2xl md:text-4xl text-black text-center md:text-left">
        Sorceres University
      </h1>

      {/* Right section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 md:mt-0">
        <h2 className="text-black text-lg md:text-2xl text-center">
          Welcome, {user?.fullName}
        </h2>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded-3xl hover:bg-red-600 transition-colors duration-300 cursor-pointer"
          onClick={logout}
          type="button"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default NavBar;
