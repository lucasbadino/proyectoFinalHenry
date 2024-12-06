// "use client";
// import { getCarrouselById, postCarrouselImage } from "@/helpers/gardeners.helpers";
// import { IUserSession } from "@/interfaces/IUserSession";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// const GardenerDashboard = () => {
//   const [activeComponent, setActiveComponent] = useState<string>(""); // Controla el componente activo
//   const [userSession, setUserSession] = useState<IUserSession | null>(null);
//   const [carrousel, setCarrousel] = useState<any[]>([]);

//   useEffect(() => {
//     if (typeof window !== "undefined" && window.localStorage) {
//       const storedSession = JSON.parse(
//         localStorage.getItem("userSession") || ""
//       );
//       setUserSession(storedSession);
//     }
//   }, []);

//   const fetchCarrousel = async () => {
//     try {
//       const id = userSession?.user.id.toString();
//       if (id) {
//         const carrouselData = await getCarrouselById(id);
//         setCarrousel(carrouselData?.imageUrl || []);
//       }
//     } catch (error) {
//       console.error("Error buscando el carrousel:", error);
//     }
//   };

//   const uploadImage = async (e: any) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "gardener");
//     const response = await postCarrouselImage(formData, userSession?.user.id.toString());
//     console.log(response);
//     if(response){
//       fetchCarrousel();
//     }
//   }

//   useEffect(() => {
//     fetchCarrousel();
//   },[userSession]);

//   console.log(carrousel);

//     return (
//       <div className="min-h-screen bg-[#F4F9F4] font-sans">
//         {/* Menú de navegación */}
//         <nav className="bg-[#263238] p-4 shadow-md flex justify-center space-x-4">
//           <button
//             onClick={() => setActiveComponent("tasks")}
//             className="p-3 bg-[#4CAF50] text-white font-bold rounded-lg hover:bg-[#388E3C] transition duration-200"
//           >
//             Tareas
//           </button>
//           <button
//             onClick={() => setActiveComponent("calendar")}
//             className="p-3 bg-[#8BC34A] text-white font-bold rounded-lg hover:bg-[#CDDC39] transition duration-200"
//           >
//             Calendario
//           </button>
//           <button
//             onClick={() => setActiveComponent("profile")}
//             className="p-3 bg-[#FF5722] text-white font-bold rounded-lg hover:bg-[#FF7043] transition duration-200"
//           >
//             Mi Perfil
//           </button>
//         </nav>

//         {/* Contenido dinámico */}
//         <main className="p-6">
//           {activeComponent === "tasks" && (
//             <section>
//               <h1 className="text-2xl font-bold text-[#263238]">
//                 Tareas del Jardinero
//               </h1>
//               <p className="mt-2 text-[#4CAF50]">
//                 Aquí podrás gestionar tus tareas diarias.
//               </p>
//             </section>
//           )}

//           {activeComponent === "calendar" && (
//             <section>
//               <h1 className="text-2xl font-bold text-[#263238]">
//                 Calendario del Jardinero
//               </h1>
//               <p className="mt-2 text-[#8BC34A]">
//                 Planifica tu semana con el calendario.
//               </p>
//             </section>
//           )}

//           {activeComponent === "profile" && (
//             <section>
//               <h1 className="text-2xl font-bold text-[#263238]">
//                 Modificar información del perfil
//               </h1>
//               <div className="mt-4">
//                 <div className="text-lg">
//                   <strong>Nombre:</strong> {userSession?.user.name}
//                 </div>
//                 <div className="text-lg">
//                   <strong>Correo:</strong> {userSession?.user.email}
//                 </div>
//                 <div className="text-lg">
//                   <strong>Teléfono:</strong> {userSession?.user.phone}
//                 </div>
//               </div>

//               {/* Carrusel de imágenes */}
//               <div className="mt-8">
//                 <h2 className="text-xl font-semibold text-[#388E3C] mb-4">
//                   Carrusel de imágenes:
//                 </h2>
//                 <div className="relative w-full max-w-3xl mx-auto">
//                   <div className="overflow-hidden rounded-lg shadow-lg bg-white">
//                     <div className="flex snap-x snap-mandatory overflow-x-auto">
//                       {carrousel?.map((image: string, index: number) => (
//                         <div
//                           key={index}
//                           className="snap-center flex-none w-full"
//                           style={{ maxWidth: "400px" }}
//                         >
//                           <Image
//                             src={image}
//                             alt={`Imagen ${index + 1}`}
//                             width={1920}
//                             height={1080}
//                             className="w-full h-full object-cover rounded-lg"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Subir nueva imagen */}
//               <div className="mt-8">
//                 <h2 className="text-xl font-semibold text-[#FF5722] mb-4">
//                   Subir imagen al carrusel:
//                 </h2>
//                 <input
//                   type="file"
//                   onChange={uploadImage}
//                   className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white"
//                 />
//               </div>
//             </section>
//           )}
//         </main>
//       </div>
//     );
//   };


// export default GardenerDashboard;










"use client";

import { getAllServices, getServicesProvided } from "@/helpers/service.helpers";
import CalendarGardener from "@/components/CalendarGardener/CalendarGardener";
import OrderList from "@/components/DashboardGardenerCompo/orders/orders";
import EditDashboard from "@/components/EditDashboard/EditDashboard";
import {
  getProviderById,
  getTasks,
  updateProviderServices,
} from "@/helpers/gardeners.helpers";
import { IUserSession } from "@/interfaces/IUserSession";
import { IService } from "@/interfaces/IService";
import React, { useEffect, useState } from "react";
import CarrouselGardener from "@/components/carrouselGardener/CarrouselGardener";
import EditServicesGardener from "@/components/EditServicesGardener/EditServicesGardener";
import Swal from "sweetalert2";

const GardenerDashboard = () => {
  const [activeComponent, setActiveComponent] = useState<string>("perfil");
  const [userSession, setUserSession] = useState<IUserSession | null>(null);
  const [services, setServices] = useState<IService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("startTime");


  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  // Cargar la sesión del usuario desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedSession = localStorage.getItem("userSession");
      if (storedSession) {
        setUserSession(JSON.parse(storedSession));
      }
    }
  }, []);

  // Fetch para las tareas
  const fetchTasks = async (id: string) => {
    try {
      setLoader(true);
      setActiveComponent("tareas");
      const taskData = await getTasks(id);
      setTasks(taskData);
      console.log(taskData, "tareas");

      setLoader(false);
    } catch (error) {
      console.error("Error buscando las tareas:", error);
      setLoader(false);
    }
  };

  // Fetch para los servicios
  const fetchServices = async () => {
    try {
      setLoader(true);
      const id = userSession?.user.id.toString();
      if (id) {
        // Obtener todos los servicios disponibles
        const serviceData = await getAllServices();
        setServices(serviceData);

        // Obtener los servicios asociados al jardinero
        const gardenerData = await getProviderById(id);
        if (gardenerData?.serviceProvided) {
          const associatedServices = gardenerData.serviceProvided.map(
            (s: any) => s.id
          );
          setSelectedServices(associatedServices);
        }
      }
      setLoader(false);
    } catch (error) {
      console.error("Error buscando servicios:", error);
      setLoader(false);
    }
  };

  // Manejar cambio en los checkboxes de servicios
  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId) // Deseleccionar
        : [...prev, serviceId] // Seleccionar
    );
  };

  // Guardar los servicios seleccionados
  const saveServices = async () => {
    try {
      const userId = userSession?.user?.id?.toString();
      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      await updateProviderServices(userId, selectedServices);
      Toast.fire("Éxito", "Servicios actualizados correctamente", "success");
    } catch (error) {
      Toast.fire("Error", "Hubo un problema al actualizar los servicios", "error");
      throw new Error("Error actualizando servicios");
    }
  };

  // Llamar a los datos iniciales cuando el usuario está disponible
  useEffect(() => {
    if (userSession) {
      fetchServices();
    }
  }, [userSession]);

  const handleSortChange = (event: any) => {
    const { name, value } = event.target;

    if (name === "sortBy") {
      setSortBy(value); // Cambiar la propiedad por la que ordenar
    } else {
      setSortOrder(value); // Cambiar el orden de clasificación (asc o desc)
    }
  };
  const sortOrders = () => {
    const sortedOrders = Array.isArray(tasks)
      ? [...tasks].sort((a, b) => {
        // Determinar si estamos ordenando por startTime o isApproved
        if (sortBy === "startTime") {
          // Si startTime está presente, crear un objeto Date, si no, asignar Infinity
          const dateA: any = a.serviceDate ? new Date(a.serviceDate) : Infinity;
          const dateB: any = b.serviceDate ? new Date(b.serviceDate) : Infinity;

          // Orden ascendente
          if (sortOrder === "asc") {
            return dateA === Infinity ? 1 : dateB === Infinity ? -1 : dateA.getTime() - dateB.getTime();
          }
          // Orden descendente
          else {
            return dateA === Infinity ? -1 : dateB === Infinity ? 1 : dateB.getTime() - dateA.getTime();
          }
        } else if (sortBy === "isApproved") {
          const approvedA = a.isApproved ? 1 : 0;
          const approvedB = b.isApproved ? 1 : 0;
          return sortOrder === "asc" ? approvedB - approvedA : approvedA - approvedB;
        }
        return 0;
      }) : null;
    if (sortedOrders) {
      setTasks(sortedOrders);
    } 
    
  };
  useEffect(() => {

    sortOrders();
    console.log(tasks);

  }, [sortBy, sortOrder]);
  // Mostrar spinner mientras se cargan los datos
  if (loader) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <div className="w-16 h-16 border-4 border-green-300 border-t-green-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-[#263238]">
          Cargando la información...
        </h2>
      </div>
    );
  }


  return (
    <div>
      {/* Menú de navegación */}
      <nav className="flex flex-wrap justify-around bg-primary text-white p-4 rounded-md md:flex-row sm:flex-col">
  <button
    onClick={() => fetchTasks(userSession?.user?.id.toString() || "")}
    className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded mb-2 sm:mb-0 ${activeComponent === "tareas" ? "opacity-75" : ""}`}
  >
    Tareas
  </button>
  <button
    onClick={() => setActiveComponent("calendario")}
    className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded mb-2 sm:mb-0 ${activeComponent === "calendario" ? "opacity-75" : ""}`}
  >
    Calendario
  </button>
  <button
    onClick={() => setActiveComponent("perfil")}
    className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded mb-2 sm:mb-0 ${activeComponent === "perfil" ? "opacity-75" : ""}`}
  >
    Mi Perfil
  </button>
  <button
    onClick={() => setActiveComponent("Editar Servicios")}
    className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded mb-2 sm:mb-0 ${activeComponent === "Editar Servicios" ? "opacity-75" : ""}`}
  >
    Editar Servicios
  </button>
</nav>



      {/* Contenido dinámico */}
      <main className="p-6 bg-secondary">
        {activeComponent === "tareas" && (
         <section className="w-full max-w-screen-lg mx-auto">
            <h1 className="text-2xl font-bold text-[#263238] m-3 text-center">
              Tareas del Jardinero
            </h1>
            <div className="w-full max-w-2xl mb-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                <div>
                  <label htmlFor="sortBy">Ordenar por: </label>
                  <select id="sortBy" name="sortBy" value={sortBy} onChange={handleSortChange}>
                    <option value="startTime">Fecha de inicio</option>
                    <option value="isApproved">Aprobado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sortOrder">Orden: </label>
                  <select id="sortOrder" name="sortOrder" value={sortOrder} onChange={handleSortChange}>
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </select>
                </div>
              </div>
            </div>
            <OrderList order={tasks} getTasks={fetchTasks} />
          </section>
        )}

        {activeComponent === "perfil" && <EditDashboard />}

        {activeComponent === "calendario" && <CalendarGardener id={userSession?.user?.id.toString() || ""} />}

        {activeComponent === "Editar Servicios" && (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg space-y-8">
          
          {/* Servicios que Ofrezco */}
           <h1 className="text-2xl font-bold text-[#263238] mb-6">
              Servicios que Ofrezco
            </h1> <section   className="block  w-full p-3 border border-[#4CAF50] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white">
          
            {services.map((service) => (
              <div key={service.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={service.id}
                  checked={selectedServices.includes(service.id)}
                  onChange={() => handleServiceChange(service.id)}
                  className="mr-3"
                />
                <label htmlFor={service.id} className="flex-grow">
                  <span className="font-semibold">{service.detailService}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    (${service.price} - {service.categories.join(", ")})
                  </span>
                </label>
              </div>
            ))}
<button
  onClick={saveServices}
  className="mt-4 w-40 p-2 bg-[#4CAF50] text-white rounded hover:bg-[#388E3C] hover:text-[#FFEB3B] mx-auto block sm:w-full md:w-40"
>
  Guardar Servicios
</button>


          </section>
      
          {/* Carrusel de imágenes */}
          <CarrouselGardener />
      
        
        </div>
      </div>
      
        )}
      </main>
    </div>
  );
};

export default GardenerDashboard;





