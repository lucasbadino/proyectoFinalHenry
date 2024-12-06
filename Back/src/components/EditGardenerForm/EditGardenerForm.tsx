"use client";
import React, { useState } from "react";
import { updateGardener } from "@/helpers/gardeners.helpers";
import { IServiceProvider } from "@/interfaces/IServiceProvider";
import Swal from "sweetalert2";

interface EditGardenerFormProps {
  gardener: IServiceProvider;
  onSave: (updatedGardener: IServiceProvider) => void;
  onCancel: () => void;
}

const EditGardenerForm: React.FC<EditGardenerFormProps> = ({ gardener, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<IServiceProvider>>({
    name: gardener.name,
    experience: gardener.experience,
    calification: gardener.calification,
    username: gardener.username,
    age: gardener.age,
    phone: gardener.phone,
    address: gardener.address,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("userSession") || "{}").token
          : null;

      if (!token) {
        throw new Error("Usuario no autenticado");
      }

      const updatedGardener = await updateGardener(token, gardener.id, formData);
      onSave(updatedGardener);
      Swal.fire({
        icon: "success",
        title: "Cambio exitoso",
        text: "Tus cambios ha sido guardado con éxito.",
      });
    } catch (error: any) {
      alert(error.message || "Error al actualizar el jardinero.");
    }
  };
  return (
    <div className="p-6 bg-white border rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-gray-700 mb-6">Editar Perfil de Jardinero</h3>
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
            placeholder="Nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
            placeholder="Nombre de Usuario"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
            placeholder="Edad"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Teléfono</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
            placeholder="Número de Teléfono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
            placeholder="Dirección"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia</label>
          <textarea
            name="experience"
            value={formData.experience || ""}
            onChange={handleInputChange}
            rows={6}
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-green-200"
            placeholder="Describe tu experiencia"
          ></textarea>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditGardenerForm;