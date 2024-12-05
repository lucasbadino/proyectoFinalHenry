'use client';

import { register } from '@/helpers/auth.helpers';
import { validateRegisterForm } from '@/helpers/validate';
import { IRegisterProps } from '@/interfaces/IRegisterProps';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from "lucide-react";
import Image from 'next/image';
import { Spin } from 'antd';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para leer parámetros de la URL

  // Estado inicial
  const initialState: IRegisterProps = {
    name: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    age: 0,
    address: "",
    phone: "",
    role: "",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [dataUser, setDataUser] = useState<IRegisterProps>(initialState);
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    username: false,
    password: false,
    passwordConfirm: false,
    age: false,
    address: false,
    phone: false,
    role: false,
  });
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const role = searchParams?.get('role'); // Obtén el valor del parámetro "role"

  // Cambiar dinámicamente el título basado en el parámetro `role`
  useEffect(() => {
    if (role === 'user') {
      setTitle("Regístrate como Cliente");
    } else if (role === 'gardener') {
      setTitle("Regístrate como Jardinero");
    }

    // Configurar el campo `role` en `dataUser`
    if (role) {
      setDataUser((prev) => ({
        ...prev,
        role: role,
      }));
    }
  }, [role]);

  // Manejo del cambio en los campos
  // Manejo del cambio en los campos
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;

    // Si el campo es 'age', aseguramos que no sea mayor a 150
    if (name === 'age') {
      // Convertimos el valor a un número
      const ageValue = Number(value);

      // Si el valor es un número y está dentro del rango válido, lo actualizamos
      if (ageValue <= 150 || value === "") {
        setDataUser({
          ...dataUser,
          [name]: name === "age" ? (value ? Number(value) : 0) : value,
        });
      }
    } else {
      // Para otros campos, simplemente actualizamos el estado
      setDataUser({
        ...dataUser,
        [name]: type === 'checkbox' ? event.target.checked : value,
      });
    }

    setTouched({
      ...touched,
      [name]: true,
    });
  };


  // Manejo del submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateRegisterForm(dataUser);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await register(dataUser);
        Swal.fire({
          title: "¡Bienvenido!",
          text: "Registrado correctamente",
          icon: "success",
        });
        router.push("/login");
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  // Validación en tiempo real al cambiar `dataUser` o `touched`
  useEffect(() => {
    if (Object.values(touched).some((field) => field)) {
      const validationErrors = validateRegisterForm(dataUser);
      setErrors(validationErrors);
    }
  }, [dataUser, touched]);

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="h-screen w-screen relative flex items-center justify-center mt-10">
      <Image
        src="/images/fondo_proyectos.webp"
        alt="Fondo de bienvenida"
        layout="fill"
        objectFit="cover"
        priority
        quality={100}
      />
      <div className="relative w-full max-w-screen-md mx-auto p-6 border rounded-lg shadow-lg bg-white z-9 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#4CAF50]">{title}</h2>
        <p className="text-[#263238] text-center mb-6">Crea tu cuenta y disfruta de nuestros servicios</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#263238]">Nombre</label>
            <input
              id="name"
              name="name"
              required
              value={dataUser.name}
              onChange={handleChange}
              placeholder="John"
              className="mt-1 p-2 border border-[#CDDC39] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-none"
            />
            {touched.name && errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          {/* Usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#263238]">Nombre de Usuario</label>
            <input
              id="username"
              name="username"
              required
              value={dataUser.username}
              onChange={handleChange}
              placeholder="john_doe"
              className="mt-1 p-2 border border-[#CDDC39] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-none"
            />
            {touched.username && errors.username && (
              <span className="text-red-500 text-sm">{errors.username}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#263238]">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={dataUser.email}
              onChange={handleChange}
              placeholder="ejemplo@mail.com"
              className="mt-1 p-2 border border-[#CDDC39] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-none"
            />
            {touched.email && errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#263238]">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={dataUser.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 p-2 border border-[#CDDC39] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#263238] hover:text-[#8BC34A]"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-[#263238]">Confirmar Contraseña</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type={showPassword ? 'text' : 'password'}
              required
              value={dataUser.passwordConfirm}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 p-2 border border-[#CDDC39] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-none"
            />
            {touched.passwordConfirm && errors.passwordConfirm && (
              <span className="text-red-500 text-sm">{errors.passwordConfirm}</span>
            )}
          </div>
          {/* Edad */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-[#263238]">Edad</label>
            <input
              id="age"
              name="age"
              type="number"
              required
              value={dataUser.age}
              onChange={handleChange}
              placeholder="30"
              min="18"
              max="150"
              className="mt-1 p-2 border border-[#CDDC39] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-none"
            />
            {touched.age && errors.age && (
              <span className="text-red-500 text-sm">{errors.age}</span>
            )}
          </div>


          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#263238]">Teléfono</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={dataUser.phone}
              onChange={handleChange}
              placeholder="123-456-7890"
              className="mt-1 p-2 border border-[#CDDC39] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-none"
            />
            {touched.phone && errors.phone && (
              <span className="text-red-500 text-sm">{errors.phone}</span>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#263238]">Dirección</label>
            <input
              id="address"
              name="address"
              required
              value={dataUser.address}
              onChange={handleChange}
              placeholder="Calle 123, Ciudad"
              className="mt-1 p-2 border border-[#CDDC39] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-none"
            />
            {touched.address && errors.address && (
              <span className="text-red-500 text-sm">{errors.address}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 mt-4 text-white bg-[#4CAF50] hover:text-[#FFEB3B] rounded-lg focus:outline-none ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#388E3C]'
              }`}
          >
            {isSubmitting ? <Spin /> : 'Registrarse'}
          </button>
        </form>
      </div>
      /</div>
  );
}
