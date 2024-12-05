// src/views/PreHomeView.tsx
import Link from "next/link";
import Image from "next/image";

const PreHomeView = () => {
  return (
    <div className="relative h-screen w-screen">
      {/* Imagen de fondo */}
      <Image
        src="/images/fondo_landingPage.webp" // Reemplaza por el nombre exacto de tu archivo
        alt="Fondo de bienvenida"
        fill
        className="object-cover object-center w-full h-full"
        priority
      />
      
      {/* Overlay y botón */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
        <h1 className="text-gray-100 text-4xl md:text-6xl font-bold mb-8">
          ¡Bienvenido a Vicnasol!
        </h1>
        <Link href="/Home">
          <button className="px-6 py-3 bg-[#388E3C] text-gray-100 hover:text-[#FFEB3B] font-semibold rounded-lg hover:bg-[#4CAF50] transition duration-300">
            INGRESAR
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PreHomeView;
