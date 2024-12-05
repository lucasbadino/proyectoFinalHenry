import Image from "next/image";
import Link from "next/link";
import React from "react";

const PreRegisterView = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/fondoPreRegister.webp')",
          filter: "blur(5px)",
        }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center min-h-screen pt-10">
        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#263238] mb-10">
          Elige tu Rol
        </h1>
        <p className="text-lg md:text-xl text-[#263238] mb-16 max-w-2xl">
          Antes de registrarte, selecciona el rol que mejor se adapte a tus necesidades. Puedes registrarte como cliente o jardinero.
        </p>

        {/* Opciones */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          {/* Cliente */}
          <div className="relative group hover:scale-105 transition-transform">
            <Link href="/register?role=user">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg transition-all group-hover:shadow-xl group-hover:shadow-[#FFEB3B]">
                <Image
                  className="object-cover h-full w-full transition-transform group-hover:scale-110"
                  src="/images/client.webp"
                  alt="Cliente"
                  width={384}
                  height={384}
                  priority
                />
                {/* Texto */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[#FFEB3B] text-2xl md:text-3xl font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">
                  Usuario
                </div>
              </div>
            </Link>
            <p className="text-center text-lg font-semibold text-gray-700 mt-4">
              Registrarte como cliente
            </p>
          </div>

          {/* Jardinero */}
          <div className="relative group hover:scale-105 transition-transform">
            <Link href="/register?role=gardener">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg transition-all group-hover:shadow-xl group-hover:shadow-[#FFEB3B]">
                <Image
                  className="object-cover h-full w-full transition-transform group-hover:scale-110"
                  src="/images/gardeners.webp"
                  alt="Jardinero"
                  width={384}
                  height={384}
                  priority
                />
                {/* Texto */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[#FFEB3B] text-2xl md:text-3xl font-extrabold opacity-0 group-hover:opacity-100 transition-opacity">
                  Jardinero
                </div>
              </div>
            </Link>
            <p className="text-center text-lg font-semibold text-gray-700 mt-4">
              Registrarte como jardinero
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#263238] mb-4">
            ¿Ya tienes una cuenta?
          </h2>
          <Link
            href="/login"
            className="w-full mt-4 p-2 bg-[#4caf50] text-white font-bold rounded hover:bg-[#388e3c] hover:text-[#FFEB3B] flex items-center justify-center"
          >
            INICIAR SESIÓN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PreRegisterView;
