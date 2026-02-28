import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  type LoginForm = {
    email: String;
    password: String;
  };

  const { register, handleSubmit } = useForm<LoginForm>();
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/login", data);
      console.log("login successfull", res.data);
      setUser(res.data.user);
      const role = res.data.user.role;

      if (role == "TEACHER") navigate("/teacher/dashboard");
      else if (role == "ADMIN") navigate("/admin/dashboard");
      else navigate("/student/dashboard");
    } catch (error: any) {
      console.log("login failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md items-center gap-4">
        <h2 className="font-bold text-center pt-2 pb-4 text-3xl">Login</h2>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="p-3 mb-4 border border-gray-500 rounded-2xl"
            {...register("email")}
            placeholder="Enter email"
          />
          <input
            className="p-3 mb-4 border border-gray-500 rounded-2xl"
            {...register("password")}
            placeholder="enter password"
          />
          <button
            className="bg-blue-800 text-amber-50 rounded-3xl py-3 hover:bg-blue-900 transition-colors duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
