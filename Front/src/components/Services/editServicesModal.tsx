import { IService } from '@/interfaces/IService';
import React, { useState } from 'react';

interface EditServiceModalProps {
  service: IService;
  onClose: () => void;
  onSave: (updatedService: Partial<IService>) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    detailService: service.detailService,
    categories: service.categories,
    price: service.price,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Editar Servicio</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Detalle del Servicio</label>
            <input
              type="text"
              name="detailService"
              value={formData.detailService}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Categoría</label>
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="submit" className="px-4 py-2 bg-[#4CAF50] text-white rounded">
              Guardar
            </button>
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-red-500 rounded">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
