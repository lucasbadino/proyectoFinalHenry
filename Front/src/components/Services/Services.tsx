"use client";

import {
  getAllServices,
  deleteService,
  editService,
} from "@/helpers/service.helpers";
import { IService } from "@/interfaces/IService";
import { IServiceErrors, IServiceProps } from "@/interfaces/IServiceProps";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Categories } from "../RegisterServiceForm/enums/categories.enum";
import { validateServiceForm } from "@/helpers/validateService";
import { registerService } from "@/helpers/auth.helpers";
import Swal from "sweetalert2";
import EditServiceModal from "./editServicesModal";
import { Tooltip } from 'antd';


const Services = () => {
  const [services, setServices] = useState<IService[]>([]); // Servicios disponibles
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  const router = useRouter();

  const categories = Object.values(Categories);

  const initialState: IServiceProps = {
    detailService: "",
    price: 0,
    categories: [],
  };

  const [dataService, setDataService] = useState<IServiceProps>(initialState);
  const [errors, setErrors] = useState<IServiceErrors>({});
  const [touched, setTouched] = useState({
    detailService: false,
    price: false,
    categories: false,
  });

  useEffect(() => {
    fetchServices();
  }, [sortOrder]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const serviceData = await getAllServices();
      setServices(serviceData);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    setDataService({
      ...dataService,
      [name]: type === "number" ? Number(value) : value,
    });
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // Manejo del cambio en las categorías (checkboxes)
  const handleCategoriesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    if (checked) {
      setDataService({
        ...dataService,
        categories: [...dataService.categories, value],
      });
    } else {
      setDataService({
        ...dataService,
        categories: dataService.categories.filter(
          (category) => category !== value
        ),
      });
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateServiceForm(dataService);
    setErrors(validationErrors);

    // Si no hay errores, enviamos el servicio
    if (Object.keys(validationErrors).length === 0) {
      await registerService(dataService);
      Swal.fire({
        title: "Hecho!",
        text: "Servicio agregado con éxito",
        icon: "success",
      });
      router.push("/dashboard"); 
      const serviceData = await getAllServices();
      setServices(serviceData);
    }else{
      Swal.fire({
        title: "Error!",
        text: "No se pudo agregar el servicio",
        icon: "error",
      });
    }
  };

  const handleServiceClick = async (service: IService) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el servicio permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        confirmButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#3085d6",
      });
  
      if (result.isConfirmed) {
        setLoading(true);
        const deleted = await deleteService(service.id);
        if (deleted) {
          Swal.fire({
            title: "Hecho!",
            text: "Servicio eliminado con éxito",
            icon: "success",
            confirmButtonColor: "#4CAF50",
          });
          const serviceData = await getAllServices();
          setServices(serviceData);
        }
      } else {
        Swal.fire({
          title: "Cancelado",
          text: "El servicio no fue eliminado",
          icon: "info",
          confirmButtonColor: "#4CAF50",
        });
      }
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
      Swal.fire({
        title: "Error!",
        text: "Error al eliminar el servicio",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleEditService = (service: IService) => {
    setSelectedService(service);
    setIsEditing(true);
  };

  const handleSave = async (updatedData: Partial<IService>) => {
    if (!selectedService) return;

    const updatedService = { ...selectedService, ...updatedData };

    const id = selectedService.id;
    try {
      const response = await editService(id, updatedService);

      if (!response) {
        throw new Error("Error al actualizar el servicio");
      }

      Swal.fire({
        title: "Hecho!",
        text: "Servicio actualizado con éxito",
        icon: "success",
      });

      const updatedServices = services.map((service) =>
        service.id === selectedService.id ? updatedService : service
      );
      setServices(updatedServices);
      setIsEditing(false);
      setSelectedService(null);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Error al actualizar el servicio",
        icon: "error",
      })
      console.error("Error al actualizar el servicio:", error);
    }
  };

  // Validación en tiempo real
  useEffect(() => {
    if (Object.values(touched).some((field) => field)) {
      const validationErrors = validateServiceForm(dataService);
      setErrors(validationErrors);
    }
  }, [dataService, touched]);
  if (loading)
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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Título principal */}
      <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
        Servicios de Jardinería Disponibles
      </h1>

      {/* Lista de servicios */}
      {services.length === 0 ? (
        <p className="text-gray-500 text-center">
          No hay servicios disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-[#388E3C] rounded-lg shadow-md p-6 hover:shadow-lg hover:shadow-[#8BC34A] transition"
            >
              <div className="flex justify-end">
                <button onClick={() => handleEditService(service)}>
                <Tooltip title="Editar" color="#263238">
                  <span className="text-lg font-bold mr-2">✏️</span>
                </Tooltip>
                </button>
                <Tooltip title="Eliminar" color="#263238">
                <button
                  onClick={() => handleServiceClick(service)}
                  className="my-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full justify-end text-sm"
                >
                  X
                </button>
                </Tooltip>
              </div>
              <h2 className="font-semibold text-lg text-green-700 mb-2">
                {service.detailService}
              </h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-gray-700">Categoría: </span>
                {service.categories}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Precio: </span>$
                {service.price}
              </p>
            </div>
          ))}
          {isEditing && selectedService && (
            <EditServiceModal
              service={selectedService}
              onClose={() => setIsEditing(false)}
              onSave={handleSave}
            />
          )}
        </div>
      )}

      {/* Formulario para agregar servicios */}
      <div className="w-full max-w-lg mx-auto mt-12 p-8 border border-gray-200 rounded-lg shadow-md bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Agregar un Servicio de Jardinería
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Detalle del servicio */}
          <div>
            <label
              htmlFor="detailService"
              className="block text-sm font-medium text-gray-700"
            >
              Detalle del Servicio
            </label>
            <input
              id="detailService"
              name="detailService"
              required
              value={dataService.detailService}
              onChange={handleChange}
              placeholder="Por ej., cortar el césped"
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {touched.detailService && errors.detailService && (
              <span className="text-red-500 text-sm">
                {errors.detailService}
              </span>
            )}
          </div>

          {/* Precio */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Precio
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              value={dataService.price}
              onChange={handleChange}
              placeholder="50.00"
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {touched.price && errors.price && (
              <span className="text-red-500 text-sm">{errors.price}</span>
            )}
          </div>

          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categorías
            </label>
            <div className="mt-2 space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    id={category}
                    name="categories"
                    type="checkbox"
                    value={category}
                    onChange={handleCategoriesChange}
                    className="h-4 w-4 text-green-700 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={category}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
            {touched.categories && errors.categories && (
              <span className="text-red-500 text-sm">{errors.categories}</span>
            )}
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={Object.values(errors).some((error) => error !== "")}
            className="text-white bg-green-700 hover:bg-green-800 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 transition"
          >
            Agregar Servicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default Services;
