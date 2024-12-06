"use client"
import { gardenerServiceEdit, userEdit } from '@/helpers/userEdit.helpers';
import { IUserSession } from '@/interfaces/IUserSession';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const EditServicesGardener = () => {

  const [userSession, setUserSession] = useState<IUserSession | null>(null);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');



  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem("userSession");
      if (storedSession) {
        const parsedSession: IUserSession = JSON.parse(storedSession);
        setUserSession(parsedSession);
      }
    }
  }, []);

  const handleEditClick = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditedValue(currentValue);
  };


  const handleSaveClick = async () => {
    if (editingField && userSession) {
      const updatedData = { [editingField]: editedValue };

      try {
        const updatedUser = await gardenerServiceEdit(updatedData);

        if (updatedUser) {
          const updatedSession = { ...userSession, user: updatedUser };
          localStorage.setItem("userSession", JSON.stringify(updatedSession));
          setUserSession(updatedSession);
          setEditingField(null);
          setEditedValue('');
          Swal.fire("Éxito", "Cambios guardados correctamente", "success");
        }
      } catch (error) {
        console.error("Error saving changes:", error);
        Swal.fire("Error", "Hubo un problema al guardar los cambios", "error");
      }
    }
  };

  const handleCancelClick = () => {
    setEditingField(null);
    setEditedValue('');
  };








  return (
    <div >


      {/* Campos de edición */}
      <div className=" max-w-3xl">
        <h2 className="text-xl font-semibold text-[#FF5722] mb-4">
          Edita tu experiencia:
        </h2>
        {[
          // { label: "Nombre de usuario", field: "name", value: userSession?.user.name || "" },
          // { label: "Edad", field: "age", value: userSession?.user.age || "N/A" },
          // { label: "Teléfono", field: "phone", value: userSession?.user.phone || "" },
          { label: "Experiencia", field: "experience", value: userSession?.user.experience || "" },
        ].map(({ label, field, value }) => (
          <div key={field} className="border p-4 mb-4 rounded  w-full">

            {/* Muestra el campo y el botón de edición */}
            <p className="mb-2 text-[#263238] text-left">

              <strong></strong> {value}
            </p>
            <button
              onClick={() => handleEditClick(field, value)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mt-2"
            >
              Editar
            </button>

            {/* Si el campo está en edición, muestra el input de edición debajo */}
            {editingField === field && (
              <div className="mt-4">
                <input
                  type="text"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  className="block  p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] bg-white"
                />

                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleSaveClick}
                    className="bg-green-500 hover:bg-green-600 text-[#263238] p-2 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-red-500 hover:bg-red-600 text-[#263238] p-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

}

export default EditServicesGardener
