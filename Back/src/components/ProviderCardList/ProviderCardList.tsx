"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ProviderCard from "../ProviderCard/ProviderCard";
import { IServiceProvider } from "@/interfaces/IServiceProvider";
import { getGardenersDB } from "@/helpers/gardeners.helpers";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const Dropdown: React.FC<{ filter: string; onChange: (value: string) => void }> = ({
  filter,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const options = [
    { value: "ASC", label: "Restaurar" },
    { value: "DESC", label: "Z-A" },
    { value: "1", label: "⭐" },
    { value: "2", label: "⭐⭐" },
    { value: "3", label: "⭐⭐⭐" },
    { value: "4", label: "⭐⭐⭐⭐" },
    { value: "5", label: "⭐⭐⭐⭐⭐" },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[150px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-[#263238] rounded-md shadow-sm px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <span className="float-right text-[#263238]">
          {options.find((opt) => opt.value === filter)?.label || "Ordenar por"} ▼
        </span>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 hover:bg-[#8BC34A] hover:text-white cursor-pointer text-center ${
                filter === option.value ? "bg-green-100" : ""
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

const ProviderCardList: React.FC = () => {
  const [providers, setProviders] = useState<IServiceProvider[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [TOKEN, setTOKEN] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ASC");
  const [searchTerm, setSearchTerm] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalProviders, setTotalProviders] = useState<number>(0);
  const [inputSave, setInputSave] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem("userSession");
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        setTOKEN(parsedSession.token);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Inicia sesión para acceder a esta sección",
        });
        router.push("/login");
      }

      setFilter(localStorage.getItem("filter") || "ASC");
      setSearchTerm(localStorage.getItem("searchTerm") || "");
    }
  }, [router]);

  const handleFilter = (newFilter: string) => {
    setFilter(newFilter);
    if (typeof window !== "undefined") {
      localStorage.setItem("filter", newFilter);
    }
    setCurrentPage(1); 
  };

  const handleSearch = () => {
    setSearchTerm(inputSave)
    if (typeof window !== "undefined") {
      localStorage.setItem("searchTerm", inputSave);
    }
    setCurrentPage(1); 
  };

  const handleClearFilters = () => {
    setFilter("ASC");
    setSearchTerm("");
    setCurrentPage(1);
    if (typeof window !== "undefined") {
      localStorage.removeItem("filter");
      localStorage.removeItem("searchTerm");
    }
  };

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);

        const order = filter === "ASC" || filter === "DESC" ? filter : "ASC";
        const calification = isNaN(Number(filter)) ? undefined : Number(filter);

        const token =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("userSession") || "{}").token
            : null;

        const result = await getGardenersDB(
          token, 
          order, 
          calification, 
          searchTerm, 
          currentPage
        );

        setProviders(result.data);
        setTotalPages(result.totalPages);
        setTotalProviders(result.totalCount);
      } catch (error: any) {
        setError(error.message || "Error al cargar los Jardineros");
      } finally {
        setLoading(false);
      }
    };

    if (TOKEN) {
      fetchProviders();
    }
  }, [currentPage, filter, searchTerm, TOKEN]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <div className="w-16 h-16 border-4 border-green-300 border-t-green-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-[#263238]">
          Cargando la información...
        </h2>
      </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <div className="mx-auto mt-24 px-4 max-w-7xl">
      {providers?.length === undefined ? (
        <div className="text-center mb-8 mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-red-500">No hay jardineros</h1>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleClearFilters}
          >
            Volver
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-8 mx-auto">
            <div className="relative w-full sm:w-3/4 lg:w-1/2 mx-auto flex items-center mb-8">
              <input
                id="inputBusqueda"
                type="text"
                placeholder="Buscar jardinero..."
                value={inputSave}
                onChange={(e) => setInputSave(e.target.value)}
                className="w-full pl-4 pr-12 py-2 text-lg rounded-full border border-[#263238] shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
              onClick={handleSearch}>
              <FaSearch className="absolute right-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="flex justify-end mb-4">
            <Dropdown filter={filter} onChange={handleFilter} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {providers?.map((gardener) => (
              <Link href={`/gardener/${gardener.id}`} key={gardener.id}>
                <ProviderCard
                  name={gardener.name}
                  experience={gardener.experience}
                  profileImageUrl={gardener.profileImageUrl}
                  calification={gardener.calification}
                />
              </Link>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between mt-6 mb-8 items-center space-y-4 sm:space-y-0">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-[#8BC34A] text-white rounded hover:shadow-lg hover:shadow-[#FFEB3B] hover:text-[#263238] ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Página anterior
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-full ${
                    page === currentPage 
                      ? "bg-[#8BC34A] text-[#263238] hover:text-[#FFEB3B] hover:shadow-lg hover:shadow-[#FFEB3B]" 
                      : "bg-gray-200 text-[#263238] hover:text-[#4CAF50] hover:shadow-lg hover:shadow-[#FFEB3B]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-[#8BC34A] text-white rounded hover:shadow-lg hover:shadow-[#FFEB3B] hover:text-[#263238] ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Página siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );

};

export default ProviderCardList;


