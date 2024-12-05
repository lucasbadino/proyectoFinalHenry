"use client";

import React, { useEffect, useState } from "react";

import { IServiceProvider } from "@/interfaces/IServiceProvider";
import { deleteGardener, getGardenersDB } from "@/helpers/gardeners.helpers";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import EditGardenerForm from "../EditGardenerForm/EditGardenerForm";
import CardGardener from "../CardGardener/CardGardener";

import Swal from 'sweetalert2';

const Dropdown: React.FC<{ filter: string; onChange: (value: string) => void }> = ({
  filter,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "ASC", label: "A-Z" },
    { value: "DESC", label: "Z-A" },
    { value: "1", label: "⭐" },
    { value: "2", label: "⭐⭐" },
    { value: "3", label: "⭐⭐⭐" },
    { value: "4", label: "⭐⭐⭐⭐" },
    { value: "5", label: "⭐⭐⭐⭐⭐" },
    // { value: "AVAILABLE", label: "Disponibles" },
    // { value: "NOT_AVAILABLE", label: "No disponibles" },
  ];

  return (
    <div className="relative w-48">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left text-slate-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        {options.find((opt) => opt.value === filter)?.label || "Ordenar por"}
        <span className="float-right text-[#263238]">▼</span>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 hover:bg-[#8BC34A] hover:text-white cursor-pointer text-center ${filter === option.value ? "bg-green-100" : ""
                }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

const ListGardeners: React.FC = () => {
  const [providers, setProviders] = useState<IServiceProvider[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [TOKEN, setTOKEN] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ASC");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1); // Estado para manejar la página actual
  const itemsPerPage = 8; // Límite de cards por página
  const [availability, setAvailability] = useState<string | undefined>(undefined);
  const [editGardener, setEditGardener] = useState<IServiceProvider | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem("userSession");
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        setTOKEN(parsedSession.token);
      } else {
        router.push("/login");
      }

      setFilter(localStorage.getItem("filter") || "ASC");
      setSearchTerm(localStorage.getItem("searchTerm") || "");
    }
  }, [router]);

  const handleFilter = (newFilter: string) => {
    setFilter(newFilter);

    if (newFilter === "AVAILABLE") {
      setAvailability("true");
    } else if (newFilter === "NOT_AVAILABLE") {
      setAvailability("false");
    } else {
      setAvailability(undefined);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("filter", newFilter);
    }
  };


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (typeof window !== "undefined") {
      localStorage.setItem("searchTerm", newSearchTerm);
    }
  };

  const handleDelete = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
  
    if (!isConfirmed) return;
  
    try {
      const token =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("userSession") || "{}").token
          : null;
  
      if (!token) {
        throw new Error("Usuario no autenticado");
      }
  
      console.log('Token recibido en handleDelete:', token);
  
      await deleteGardener(token, id);  // Llamada a la función de eliminación
  
      // Actualizar la lista de jardineros después de eliminar
      setProviders((prev) => prev.filter((gardener) => gardener.id !== id));
  
      await Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El jardinero fue eliminado exitosamente.",
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.log('Error al eliminar jardinero:', error); // Log detallado del error
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Hubo un problema al eliminar el jardinero.",
        timer: 3000,
        showConfirmButton: false
      });
    }
  };
  


  {/*fn para editar un jardinero */ }
  const handleEdit = (gardener: IServiceProvider) => {
    setEditGardener(gardener);
  };

  const handleSaveEdit = (updatedGardener: IServiceProvider) => {
    setProviders((prev) =>
      prev.map((gardener) =>
        gardener.id === updatedGardener.id ? updatedGardener : gardener
      )
    );
    setEditGardener(null);
  };

  const handleCancelEdit = () => {
    setEditGardener(null);
  };


  useEffect(() => {
    const fetchProviders = async () => {
      //setLoading(true);
      try {
        const order = filter === "ASC" || filter === "DESC" ? filter : "ASC";
        const calification = isNaN(Number(filter)) ? undefined : Number(filter);
        let availability: string | undefined = undefined;

        if (filter === "AVAILABLE") {
          availability = "true";
        }
        const token =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("userSession") || "{}").token
            : null;

        const gardeners = await getGardenersDB(token, order, calification, searchTerm,) //availability);
        setProviders(gardeners.data || []);
      } catch (error: any) {
        setError(error.message || "Error al cargar los Jardineros");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [filter, searchTerm]);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const paginatedProviders = providers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    
    if (error) return <div>{error}</div>;
    
    return (
      <div className="mx-auto mt-2">
        {providers.length === 0 ? (
          <div className="text-center mb-8 mx-auto">
            <h1 className="text-2xl font-bold mb-4">No se encontraron Jardineros</h1>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setSearchTerm("")}
            >
              Back
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-orange-950 bg-[#388E3C] p-3 shadow-sm rounded-lg mb-4">
              <h2>Jardineros Disponibles</h2>
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Buscar jardinero..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-4 pr-10 py-2 border border-[#263238] rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <Dropdown filter={filter} onChange={handleFilter} />
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto">
              {paginatedProviders.map((gardener) => (
                <div key={gardener.id} className="relative bg-white shadow-md rounded-lg p-4 border border-[#4CAF50]">
                  {editGardener?.id === gardener.id ? (
                    <EditGardenerForm
                      gardener={editGardener}
                      onSave={handleSaveEdit}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <>
                      <CardGardener
                        name={gardener.name}
                        experience={gardener.experience}
                        profileImageUrl={gardener.profileImageUrl}
                        calification={gardener.calification}
                      />
                      
                      {/* Contenedor de los botones debajo de la tarjeta */}
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => handleEdit(gardener)}
                          className="bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(gardener.id)}
                          className="bg-red-500 text-white rounded px-4 py-2 text-sm hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
    
            <div className="flex justify-between mt-6 mb-8">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-[#8BC34A] text-white rounded hover:bg-[#8BC34A] hover:text-[#263238] hover:shadow-lg hover:shadow-[#FFEB3B] ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              Página anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage * itemsPerPage >= providers.length}
              className={`px-4 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#8BC34A] hover:text-[#263238] hover:shadow-lg hover:shadow-[#FFEB3B] ${currentPage * itemsPerPage >= providers.length
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
            >
              Página siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}


export default ListGardeners;