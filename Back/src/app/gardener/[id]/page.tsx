"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IServiceProvider } from "@/interfaces/IServiceProvider";
import { getCarrouselById, getProviderById } from "@/helpers/gardeners.helpers";
import { getServicesProvided } from "@/helpers/service.helpers";
import { useParams, useRouter } from "next/navigation";
import { IService } from "@/interfaces/IService";
import { hireServices } from "@/helpers/order.helpers";
import { IUserSession } from "@/interfaces/IUserSession";
import Swal from "sweetalert2";
import GardenerCalendar from "@/components/GardenerCalendar/GardenerCalendar";
import GardenerMap from "@/components/GardenerMap/GardenerMap";
import { Button, Rate } from "antd";
import { fetchReviews } from "@/helpers/comments.helpers";

import { Carousel } from "antd";

const ProviderDetail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [gardener, setGardener] = useState<IServiceProvider | null>(null);
  const [services, setServices] = useState<IService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [userSession, setUserSession] = useState<IUserSession | null>(null);
  const [orderService, setOrderService] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [carrousel, setCarrousel] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGardener = async () => {
      if (id) {
        try {
          const gardenerData = await getProviderById(id);
          setGardener(gardenerData);

          // Convertir dirección a coordenadas
          if (gardenerData) {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                gardenerData.address
              )}`
            );
            const data = await response.json();
            if (data.length > 0) {
              setCoordinates({
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
              });
            } else {
              console.error(
                "No se encontraron coordenadas para la dirección proporcionada."
              );
            }
          }
        } catch (error) {
          console.error("Error buscando información del jardinero:", error);
          setError("No se pudo cargar la información del jardinero.");
        }
      }
    };

    const fetchCarrousel = async () => {
      try {
        if (id) {
          const carrouselData = await getCarrouselById(id);
          setCarrousel(carrouselData?.imageUrl || []);
        }
      } catch (error) {
        console.error("Error buscando el carrousel:", error);
        setError("No se pudo cargar el carrousel.");
      }
    };

    const fetchServices = async (id: any) => {
      try {
        const serviceData = await getServicesProvided(id);
        setServices(serviceData);
      } catch (error) {
        console.error("Error buscando los servicios:", error);
        setError("No se pudieron cargar los servicios.");
      }
    };

    fetchGardener();
    fetchServices(id);
    fetchCarrousel();
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedSession = JSON.parse(
        localStorage.getItem("userSession") || ""
      );
      setUserSession(storedSession);
    }
  }, []);

  {
    /*Solicitud de reseñas */
  }
  useEffect(() => {
    const fetchGardenerReviews = async () => {
      if (id) {
        try {
          const reviewsData = await fetchReviews(id);
          console.log("reviewsData", reviewsData);

          setReviews(reviewsData || []);
        } catch (error) {
          console.error("Error  en obtener las reseñas:", error);
        }
      }
    };

    fetchGardenerReviews();
  }, [id]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((service) => service.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleHireClick = async () => {
    // Verificar si no se han seleccionado servicios
    if (selectedServices.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un servicio",
        text: "Debes seleccionar al menos un servicio para continuar.",
      });
      return; // Detener ejecución si no hay servicios seleccionados
    }

    if (!userSession || !userSession.user?.id) {
      setError("No se encontró la sesión del usuario.");
      return;
    }

    if (!gardener) {
      setError("Información del jardinero no disponible.");
      return;
    }

    if (!selectedDate) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona una fecha",
        text: "Debes seleccionar una fecha para continuar.",
      });
      return; // Detener ejecución si no hay fecha seleccionada
    }

    setLoading(true);

    try {
      const order = await hireServices({
        date: selectedDate,
        isApproved: false,
        gardenerId: gardener.id.toString(),
        userId: userSession.user.id.toString(),
        serviceId: selectedServices,
      });
      setLoading(false);

      // Mostrar mensaje de éxito con Swal
      Swal.fire({
        icon: "success",
        title: "Servicios Contratados",
        text: "Tu orden ha sido creada con éxito.",
      });

      setOrderService(order);
      setSelectedServices([]);
      setSelectedDate(null);
      setTimeout(() => {
        router.push("/dashboard/userDashboard?update=true");
      }, 1250);
    } catch (error) {
      console.error("Error contratando servicios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al contratar los servicios. Inténtalo de nuevo.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-green-300 border-t-green-500 rounded-full animate-spin mb-4"></div>

        {/* Texto */}
        <h2 className="text-xl font-semibold text-[#263238]">
          Cargando la informacion..
        </h2>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;
  if (!gardener)
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-green-300 border-t-green-500 rounded-full animate-spin mb-4"></div>

        {/* Texto */}
        <h2 className="text-xl font-semibold text-[#263238]">
          Cargando la informacion..
        </h2>
      </div>
    );

    const RightArrow = () => {
      return (
          <Button size="large"/>
      )
  }
  
    const LeftArrow = () => {
      return (
          <Button size="large"/>
      )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[url('/images/fondoJardineros2.webp')] bg-cover bg-center mx-auto">
      {/* Contenedor principal */}
      <div className="mx-auto w-3/4 lg:w-full">
        <div className="max-w-3xl mt-16 sm:mt-20 lg:mt-32 mb-10 sm:mb-14 p-4 sm:p-6 bg-white rounded-lg shadow-lg mx-auto">
          <div className="flex flex-col sm:flex-row items-center">
            <Image
              className="rounded-full"
              src={
                gardener.profileImageUrl || "/images/nuevo_usuarioGardener.webp"
              }
              alt={`${gardener.name}'s profile`}
              width={120}
              height={120}
            />
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-[#263238]">
                {gardener.name}
              </h1>
              <p className="text-[#8BC34A]">@{gardener.username}</p>
            </div>
          </div>

          <div className="mt-6 text-center md:text-left">
            <h2 className="text-base sm:text-lg font-semibold text-[#263238]">
              Experiencia:
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {gardener.experience}
            </p>

            <h2 className="text-base sm:text-lg font-semibold text-[#263238] mt-4">
              Puntuación:
            </h2>
            <div className="lg:flex items-center mt-3 block">
              <Rate
                allowHalf
                disabled
                defaultValue={gardener?.calification}
                style={{ color: "#FFD700" }}
              />
              <span className="ml-2 text-sm sm:text-base text-gray-500">
                {gardener?.calification?.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="carousel-container my-6 w-full mx-auto">
            <Carousel 
            autoplay 
            effect="scrollx"             
            arrows
            prevArrow={LeftArrow()}
            nextArrow={RightArrow()}>
              {carrousel.map((imageUrl, index) => (
                <div
                  key={index}
                  className="mx-auto max-h-36 sm:max-h-96 flex justify-center items-center overflow-hidden rounded-lg border-2 border-[#4CAF50]"
                >
                  <Image
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Mapa */}
          <div className="mt-8 w-full mx-auto">
            <GardenerMap location={coordinates} />
          </div>

          {/* Servicios */}
          <ul className="mt-4 space-y-2">
            {services.map((service) => (
              <li
                key={service.id}
                className="py-3 px-4 rounded-lg border border-[#263238] hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
              >
                {/* Hacer que todo el li sea clickeable */}
                <label
                  htmlFor={`service-${service.id}`}
                  className="flex justify-between items-center w-full cursor-pointer"
                >
                  <div className="flex-1 text-left">
                    <span className="font-medium text-sm sm:text-base text-gray-800">
                      {service.detailService}
                    </span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="font-semibold text-green-600">
                      ${service.price}
                    </span>
                  </div>
                  {/* Checkbox oculto pero funcional */}
                  <div className="flex-1 text-right">
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceChange(service.id)}
                      className="hidden" // Oculta el checkbox visualmente
                    />
                    {/* Indicar visualmente el estado del checkbox */}
                    <span
                      className={`w-5 h-5 inline-block border-2 rounded ${
                        selectedServices.includes(service.id)
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}
                    ></span>
                  </div>
                </label>
              </li>
            ))}
          </ul>

          {/* Calendario */}
          <div className="mt-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#263238]">
              Calendario de Disponibilidad:
            </h2>
            <GardenerCalendar
              gardenerId={gardener.id.toString()}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Reseñas */}
          <div className="mt-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#263238]">
              Reseñas de Clientes:
            </h2>
            {reviews.length > 0 ? (
              <div className="mt-6 space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Rate
                          allowHalf
                          disabled
                          defaultValue={review.rate}
                          style={{ color: "#FFD700" }}
                        />
                        <span className="ml-2 text-sm sm:text-base font-semibold text-gray-800">
                          {review.rate.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {review?.date}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-800 mt-2">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm sm:text-base italic">
                No hay reseñas disponibles.
              </p>
            )}
          </div>

          {/* Botón de Contratar */}
          {userSession?.user?.role !== "gardener" && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleHireClick}
                className="w-full sm:w-auto bg-[#4CAF50] text-white py-2 px-4 rounded-lg hover:bg-[#45a049] transition duration-300"
              >
                Contratar Servicios
              </button>
            </div>
          )}
        </div>

        {/* Botón de Volver */}
        <div className="flex items-center justify-center w-full my-8">
          <button
            onClick={() => router.push("/gardener")}
            className="px-4 sm:px-6 py-2 sm:py-3 text-[#263238] bg-[#CDDC39] rounded-lg shadow-md hover:bg-[#8BC34A] transition-all"
          >
            Volver a la lista de jardineros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
