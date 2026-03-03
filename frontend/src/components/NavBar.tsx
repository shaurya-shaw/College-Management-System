import { useAuthStore } from "../store/authStore";

const NavBar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logOut);
  return (
    <div className=" bg-white w-100% h-15 rounded-2xl m-5 items-center flex flex-between justify-between px-4">
      <h1 className="font-bold text-4xl p-2 text-black ">
        Sorceres University
      </h1>
      <div className="flex">
        <h2 className="text-black text-2xl">Welcome,{user?.fullName}</h2>
        <button
          className="bg-red-500 text-amber-50 p-2 pl-3 pr-3 rounded-3xl ml-4 hover:bg-red-600 transition-colors duration-300 cursor-pointer"
          onClick={logout}
          type="button"
        >
          LogOut
        </button>
      </div>
    </div>
  );
};

export default NavBar;
