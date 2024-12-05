"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ServicesComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const services = [
    {
      id: "GardenMaintenance",
      shortTitle: "Jardín",
      title: "Mantenimiento de jardín",
      description:
        "Mantener tu jardín en perfectas condiciones es nuestra prioridad. Ofrecemos servicios de poda, abono y cuidado integral para que tu espacio verde luzca siempre impecable. Con técnicas avanzadas y un equipo experto, cuidamos cada detalle.",
      images: [
        "/images/servicioJardin2.webp",
        "/images/servicioJardin1.webp",
        "/images/servicioJardin3.webp",
      ],
    },
    {
      id: "Landscaping",
      shortTitle: "Paisajismo",
      title: "Paisajismo",
      description:
        "Transformamos tus espacios con proyectos paisajísticos que combinan creatividad, funcionalidad y estética. Diseñamos jardines que no sólo embellecen sino que también optimizan el uso del suelo y la sostenibilidad ambiental.",
      images: [
        "/images/Pasiajismo1.webp",
        "/images/Paisajismo2.webp",
        "/images/Paisajismo3.webp",
        "/images/Paisajismo4.webp",
      ],
    },
    {
      id: "IrrigationInstallation",
      shortTitle: "Riego",
      title: "Servicio de instalación de riego, tuberías subterráneas",
      description:
        "Instalamos sistemas de riego eficientes adaptados a las necesidades de tu jardín. La automatización y el diseño profesional aseguran un riego perfecto para cada espacio.",
      images: [
        "/images/riego1.webp",
        "/images/riego2.webp",
        "/images/riego3.webp",
        "/images/riego4.webp",
      ],
    },
    {
      id: "Trimming",
      shortTitle: "Podas",
      title: "Podador especializado en podado de arbustos, árboles, etc.",
      description:
        "Nuestros expertos podadores garantizan cortes precisos y seguros, preservando la salud y la estética de tus árboles y arbustos.",
      images: [
        "/images/podador1.webp",
        "/images/podador2.webp",
        "/images/podador3.webp",
        "/images/podador4.webp",
      ],
    },
    {
      id: "CustomGardenDesign",
      shortTitle: "Diseño",
      title: "Diseño de jardines personalizados",
      description:
        "Creamos jardines únicos que se ajustan a tu estilo y necesidades. Diseñamos espacios que reflejan tu personalidad y armonizan con el entorno.",
      images: [
        "/images/disenio.webp",
        "/images/disenio2.webp",
        "/images/disenio3.webp",
      ],
    },
    {
      id: "OutdoorLandscapes",
      shortTitle: "Exteriores",
      title: "Creación de paisajes exteriores",
      description:
        "Transformamos tus áreas exteriores con diseños innovadores y funcionales, asegurando un equilibrio perfecto entre belleza y practicidad.",
      images: [
        "/images/creacionPaisajes.webp",
        "/images/creacionPaisajes2.webp",
        "/images/creacionPaisajes3.webp",
      ],
    },
    {
      id: "PestControl",
      shortTitle: "Plagas",
      title: "Control de plagas en jardines",
      description:
        "Protege tus plantas con nuestras soluciones efectivas para el control de plagas, asegurando la salud y vitalidad de tu jardín.",
      images: [
        "/images/plagas.webp",
        "/images/plagas2.webp",
        "/images/plagas3.webp",
        "/images/plagas4.webp",
      ],
    },
  ];

  return (
    <div
      className={`bg-green-50 py-12 ${
        isScrolled ? "pb-8 lg:mt-4" : "pb-16 lg:mt-4"
      }`}
    >
      <div className="fixed w-full z-10">
        <nav className="p-4 w-full bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] opacity-90 shadow-md">
          <ul className="flex flex-wrap justify-center gap-4 text-sm md:text-base lg:gap-6 text-white">
            {services.map((service) => (
              <li key={service.id} className="relative group">
                <a
                  href={`#${service.id}`}
                  className="block px-3 py-2 hover:text-[#FFEB3B] transition-colors duration-300 font-navbar"
                >
                  {service.shortTitle}
                </a>
                <span className="absolute hidden group-hover:block bg-white text-[#388E3C] px-3 py-1 text-xs md:text-sm rounded shadow-md transition-all duration-300 top-full left-1/2 -translate-x-1/2 mt-2 z-10">
                  {service.title}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {services.map((service) => (
        <div key={service.id}>
          <hr id={service.id} className="my-24 border-green-900 opacity-50" />
          <section className="lg:mt-24">
            <div className="grid grid-cols-1 max-w-7xl mx-auto p-6 lg:grid-cols-2 lg:items-center gap-y-12">
              <div className="lg:p-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-center lg:text-left mb-4 text-[#263238]">
                  {service.title}
                </h2>
                <p className="text-lg text-justify mb-6 text-[#263238]">
                  {service.description}
                </p>
              </div>
              <div className="relative grid grid-cols-2 grid-rows-2 gap-2 lg:p-6 lg:shadow-xl lg:rounded-lg hover:shadow-2xl hover:shadow-[#388E3C] hover:scale-105 transition-all">
                {service.images?.map((image, i) => (
                  <Image
                    key={i}
                    src={image}
                    alt={service.title}
                    width={1920}
                    height={1080}
                    className="rounded-lg shadow-md hover:scale-105 transition-all min-h-[200px] border-2 border-[#263238]"
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
};

export default ServicesComponent;
