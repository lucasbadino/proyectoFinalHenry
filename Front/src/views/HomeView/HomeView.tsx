"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


// import { getServicesProvided } from '@/helpers/service.helpers';

// interface ServiceProvided {
//   id: string;
//   detailService: string;
//   price: number;
// }

const Home: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('');

  // const [services, setServices] = useState<ServiceProvided[]>([]);
  // const [isMounted, setIsMounted] = useState(false); // Nuevo estado para verificar si el componente está montado
  const router = useRouter();


  // Efecto para verificar si el componente está montado
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // useEffect(() => {
  //   const fetchServices = async () => {
  //     if (!isMounted) return; // Esperamos hasta que el componente esté montado

  //     // Obtenemos el token del localStorage
  //     const userSession = localStorage.getItem("userSession");
  //     const tokenData = userSession ? JSON.parse(userSession) : null;

  //     // Verificamos si existe el token
  //     if (!tokenData || !tokenData.token) {
  //       console.error('Token not found');
  //       return;
  //     }

  //   try {
  //     // Obtenemos los servicios usando el helper
  //     const fetchedServices = await getServicesProvided();
  //     setServices(fetchedServices);
  //   } catch (error) {
  //     console.error('Error fetching services:', error);
  //   }
  // };

  //   fetchServices();
  // }, [isMounted]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
 
  useEffect(() => {
    const checkUserSession = async () => {
      // 1. Verificar si hay un token en localStorage
      const userSession = localStorage.getItem("userSession");
      if (userSession) {
        const tokenData = JSON.parse(userSession);
        if (tokenData?.token) {
          setIsUserLoggedIn(true);
          return; // Usuario ya logueado, no seguimos.
        }
      }
      if (isUserLoggedIn) return

      setIsUserLoggedIn(false);
    };
    checkUserSession();
  }, []);

  const handleSearch = () => {
    if (selectedService) {
      router.push(`/gardener/${selectedService}`);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      {/* HERO SECTION */}
      <section
        id="hero"
        className="w-full h-screen flex flex-col items-center justify-center relative text-white"
        style={{
          backgroundImage: "url('/images/fondo_home.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex flex-col items-center justify-center px-6 lg:px-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bienvenido a Vicnasol Jardinería
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Transformamos tu espacio en un oasis verde
          </p>
          <a
            href="/servicios"
            className="bg-green-600 hover:bg-green-700 hover:text-[#FFEB3B] text-white font-semibold py-2 px-4 rounded"
          >
            Ver Servicios
          </a>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="w-full py-20 bg-gray-100 text-gray-800 flex flex-col items-center justify-center"
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#263238]">
          Sobre Nosotros
        </h2>
        <p className="text-lg md:text-xl mb-6 px-4 md:w-2/3 lg:w-1/2 text-center text-[#263238]">
          En Vicnasol Jardinería, nos especializamos en crear y mantener
          hermosos jardines que alegran los espacios. Nuestro equipo de
          profesionales está comprometido con la excelencia y la
          satisfacción del cliente.
        </p>
      </section>

      {/* SERVICES SECTION */}
      <section
        id="services"
        className="w-full py-20 bg-gradient-to-b from-green-500 to-green-700 text-white flex flex-col items-center"
        style={{
          backgroundImage: "url('/images/fondo_home.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center text-[#263238]">
          Nuestros Servicios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-10 lg:px-20">
          {/* Bloque de Servicio */}
          <div className="bg-gray-100 text-gray-800 p-6 rounded-lg border-2 border-[#4CAF50] shadow-lg transform transition-transform hover:scale-105 hover:shadow-[#FFEB3B]">
            <div className="flex items-center justify-center mb-4">
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center text-[#263238]">Mantenimiento</h3>
            <p className="text-center text-[#263238]">
              Servicios regulares de mantenimiento para mantener tu jardín en perfectas
              condiciones durante todo el año.
            </p>
          </div>
          {/* Bloque de Diseño */}
          <div className="bg-gray-100 text-gray-800 p-6 rounded-lg border-2 border-[#4CAF50] shadow-lg transform transition-transform hover:scale-105 hover:shadow-[#FFEB3B]">
            <div className="flex items-center justify-center mb-4">
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center text-[#263238] ">Diseño</h3>
            <p className="text-center text-[#263238] ">
              Creamos diseños personalizados que se adaptan a tus gustos y al entorno
              de tu espacio.
            </p>
          </div>
          {/* Bloque de Instalación */}
          <div className="bg-gray-100 text-gray-800 p-6 rounded-lg border-2 border-[#4CAF50] shadow-lg transform transition-transform hover:scale-105 hover:shadow-[#FFEB3B]">
            <div className="flex items-center justify-center mb-4">
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center text-[#263238]">Instalación</h3>
            <p className="text-center text-[#263238]">
              Realizamos instalaciones completas, desde césped hasta sistemas de riego.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="w-full py-20 bg-gray-100 text-gray-800 flex flex-col items-center justify-center"
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#263238]">Contáctanos</h2>
        <p className="text-lg md:text-xl mb-6 px-4 md:w-2/3 lg:w-1/2 text-center text-[#263238]">
          ¿Tenes alguna sugerencia? ¿Necesitas asesoramiento? ¡No dudes en contactarnos! 
        </p>
        <a
          href="/contacto"
          className="bg-green-600 hover:bg-green-700 hover:text-[#FFEB3B] text-white font-semibold py-2 px-4 rounded"
        >
          Enviar Mensaje
        </a>
      </section>
      
    </div>
  );
};

export default Home;