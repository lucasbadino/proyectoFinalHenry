"use client";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { userEdit } from "@/helpers/userEdit.helpers";
import { IUserSession } from "@/interfaces/IUserSession";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const EditDashboard: React.FC = () => {
    const [userSession, setUserSession] = useState<IUserSession | null>(null);
    const [imageProfile, setImageProfile] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState<string>("");
    const TOKEN = userSession?.token || "";

    const editableFields = [
        { label: "Nombre de usuario", field: "name", value: userSession?.user?.name || "" },
        { label: "Edad", field: "age", value: userSession?.user?.age || "N/A" },
        { label: "Teléfono", field: "phone", value: userSession?.user?.phone || "" },
        { label: "Dirección", field: "address", value: userSession?.user?.address || "" },
        ...(userSession?.user?.role === "gardener"
            ? [{ label: "Experiencia", field: "experience", value: userSession?.user?.experience || "" }]
            : []),

    ];

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedSession = localStorage.getItem("userSession");
            if (storedSession) {
                const parsedSession: IUserSession = JSON.parse(storedSession);
                setUserSession(parsedSession);
                setImageProfile(parsedSession?.user?.profileImageUrl || null);
            }
        }
    }, []);

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/${userSession?.user?.role}/${userSession?.user?.id}/image`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) throw new Error("Error uploading image");

            const data = await response.json();


            if (userSession) {
                const updatedSession = {
                    ...userSession,
                    user: { ...userSession.user, profileImageUrl: data.imageUrl },
                };
                localStorage.setItem("userSession", JSON.stringify(updatedSession));

                window.dispatchEvent(new StorageEvent('storage', { key: 'userSession', newValue: JSON.stringify(updatedSession) }));

                setImageProfile(data.imageUrl);
                setUserSession(updatedSession);
                console.log("Que trae userSession: ", updatedSession);

            }
            Swal.fire("Éxito", "Imagen subida correctamente", "success");
        } catch (error) {
            console.error("Error uploading image:", error);
            Swal.fire("Error", "No se pudo subir la imagen", "error");
        }
    };


    const handleEditClick = (field: string, currentValue: string) => {
        setEditingField(field);
        setEditedValue(currentValue);
    };




    const handleSaveClick = async () => {
        if (editingField && userSession) {
            // Validar que el valor no esté vacío o no sea un valor inválido
            if (editedValue === "" || editedValue === null || editedValue === undefined) {
                Swal.fire("Error", "El campo no puede estar vacío", "error");
                return;
            }

            const updatedData = { [editingField]: editedValue };

            try {
                const updatedUser = await userEdit(updatedData, TOKEN);

                if (updatedUser) {
                    const updatedSession = { ...userSession, user: updatedUser };
                    localStorage.setItem("userSession", JSON.stringify(updatedSession));
                    setUserSession(updatedSession);
                    setEditingField(null);
                    setEditedValue("");
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
        setEditedValue("");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Datos de tu cuenta</h1>

            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 space-y-10">
                {/* Imagen de perfil */}
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Opciones de perfil</h2>
                    <div className="mb-6">
                        <Upload
                            accept="image/*"
                            showUploadList={false}
                            customRequest={({ file, onSuccess }) => {
                                handleImageUpload(file as File).then(() => {
                                    if (onSuccess) onSuccess("ok");
                                });
                            }}
                        >
                            <Button style={{ backgroundColor: "#4CAF50", borderColor: "#263238", color: "white", padding: "20px" }} icon={<UploadOutlined />}>Sube tu imagen</Button>
                        </Upload>
                    </div>
                    <div className="flex items-center justify-center">
                        {imageProfile ? (
                            <Image
                                src={imageProfile}
                                alt="Profile"
                                className="rounded-full border-2 border-[#388E3C] shadow-md"
                                width={250}
                                height={250}
                            />
                        ) : (
                            <h1 className="text-gray-500 text-sm">SIN IMAGEN</h1>
                        )}
                    </div>
                </div>

                {/* Campos de edición */}
                <div>
                    {editableFields.map(({ label, field, value }) => (
                        <div key={field} className="border p-4 mb-4 rounded border-[#4CAF50]">
                            <p className="mb-2 text-[#263238]">
                                <strong>{label}:</strong> {value}
                            </p>

                            {editingField !== field ? (
                                // Mostrar botón "Editar" solo si no está en edición
                                <button
                                    onClick={() => handleEditClick(field, value)}
                                    className="bg-green-600 hover:bg-green-700 text-white hover:text-[#FFEB3B] font-semibold py-2 px-4 rounded"
                                >
                                    Editar
                                </button>
                            ) : (
                                // Mostrar input y botones de "Guardar" y "Cancelar" si está en edición
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        value={editedValue}
                                        onChange={(e) => setEditedValue(e.target.value)}
                                        className="p-2 border border-gray-300 rounded text-[#263238] w-full"
                                    />
                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            onClick={handleSaveClick}
                                            disabled={editedValue === "" || editedValue === null || editedValue === undefined}
                                            className={`${editedValue === "" || editedValue === null || editedValue === undefined
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-green-500 hover:bg-green-600"
                                                } text-[#263238] p-2 rounded`} 
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
        </div>
    );
};

export default EditDashboard;