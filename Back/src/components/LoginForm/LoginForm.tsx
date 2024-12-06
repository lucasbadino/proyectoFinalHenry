"use client";

import { login } from "@/helpers/auth.helpers";
import { validateLoginForm } from "@/helpers/validate";
import { ILoginErrors, ILoginProps } from "@/interfaces/ILoginProps";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const initialState = {
    email: "",
    password: "",
  };

  interface UserSession {
    token: string;
    user: any; // Cambia 'any' por el tipo adecuado si tienes uno para el usuario
  }

  const [dataUser, setDataUser] = useState<ILoginProps>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ILoginErrors>(initialState);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataUser({
      ...dataUser,
      [name]: value,
    });
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const response = await login(dataUser);
  
      // Si la respuesta es exitosa, muestra mensaje de éxito y redirige
      Swal.fire({
        title: "Bienvenido!",
        text: "Ingresaste correctamente",
        icon: "success",
      });
  
      const { token, user } = response;
      localStorage.setItem("userSession", JSON.stringify({ token, user }));
      router.push("/Home");
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
  
      // Verificar si el error tiene la respuesta de "isBanned" dentro de "response"
      if (error?.response?.message === "El usuario esta baneado") {
        Swal.fire({
          title: "Acceso denegado",
          text: "Estás baneado, no puedes ingresar",
          icon: "warning",
        });
      } else if (error?.status === 401) {
        Swal.fire({
          title: "Error",
          text: "Email o contraseña incorrectos",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: error?.message || "Ocurrió un problema. Inténtalo nuevamente.",
          icon: "error",
        });
      }
    }
  };
  
  useEffect(() => {
    if (userSession) {
      if (typeof window !== "undefined") {
        localStorage.setItem("userSession", JSON.stringify(userSession));
        router.push("/");
      }
    }
  }, [userSession, router]); // Incluye router en las dependencias

  useEffect(() => {
    if (Object.values(touched).some((field) => field)) {
      const validationErrors = validateLoginForm(dataUser);
      setErrors(validationErrors);
    }
  }, [dataUser, touched]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="h-screen w-screen relative flex items-center justify-center">
      <Image
        src="/images/fondoLogin.webp"
        alt="Fondo de bienvenida"
        layout="fill"
        objectFit="cover"
        priority
        quality={100}
      />

      <div className="relative w-full max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white z-9">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#263238]">
          Inicia sesión
        </h2>
        <p className="text-[#388e3c] text-center mb-6">Accede a tu cuenta</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={dataUser.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="mt-1 p-2 border border-[#8bc34a] rounded w-full"
            />
            {touched.email && errors.email && (
              <span className="text-red-500">{errors.email}</span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={dataUser.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 p-2 border border-[#8bc34a] rounded w-full"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
              {touched.password && errors.password && (
                <span className="text-red-500">{errors.password}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={Object.values(errors).some((error) => error !== "")}
            className="w-full mt-4 p-2 bg-[#4caf50] text-white font-bold rounded hover:bg-[#388e3c] hover:text-[#FFEB3B]"
          >
            Entrar
          </button>
        </form>

        {/* Botón para iniciar sesión con Google */}
        <div className="mt-6">
          <Link
            href="/api/auth/login?returnTo=/loginGoogle"
            className="w-full mt-4 p-2 bg-[#4caf50] text-white font-bold rounded hover:bg-[#388e3c] hover:text-[#FFEB3B] flex items-center justify-center"
          >
            <Image
              src="/images/LogoGoogle.webp"
              alt="Google Logo"
              width={20}
              height={20}
              className="mr-2 rounded-full bg-white"
            />
            Entrar con Google
          </Link>
        </div>
        <div className="mt-6">
          <Link
            href="/preRegister"
            className="w-full mt-4 p-2 bg-[#4caf50] text-white font-bold rounded hover:bg-[#388e3c] hover:text-[#FFEB3B] flex items-center justify-center"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
