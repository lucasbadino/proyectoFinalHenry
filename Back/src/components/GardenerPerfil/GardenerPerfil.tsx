// import { GardenerEdit } from '@/helpers/gardeners.helpers';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';

// const GardenerPerfil = () => {
//     const [userSession, setUserSession] = useState<any | null>(null);
//     const TOKEN = JSON.parse(localStorage.getItem("userSession") || "null");
//     const [imageProfile, setImageProfile] = useState<string | null>(null);
//     const [editingField, setEditingField] = useState<string | null>(null); // Campo en edición
//     const [editedValue, setEditedValue] = useState<string>(''); // Valor editado



//     useEffect(() => {
//         // Asegurarse de que la sesión se cargue solo una vez al inicio
//         if (typeof window !== "undefined") {
//             const storedSession = JSON.parse(
//                 localStorage.getItem("userSession") || "null"

//             );
//             console.log("Token:", TOKEN);
//             setUserSession(storedSession);
//             if (storedSession?.user?.profileImageUrl) {
//                 setImageProfile(storedSession.user.profileImageUrl);
//             }
//         }
//     }, []);

//     // Manejo de la subida de la imagen
//     const handleImageUpload = async (
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         if (event.target.files && event.target.files[0]) {
//             const file = event.target.files[0];
//             const formData = new FormData();
//             formData.append("file", file);

//             try {
//                 const response = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_URL}/gardener/${userSession?.user?.id}/image`,
//                     {
//                         method: "POST",
//                         headers: {
//                             Authorization: `Bearer ${TOKEN.token}`,
//                         },
//                         body: formData,
//                     }
//                 );

//                 if (!response.ok) {
//                     throw new Error("Error uploading image");
//                 }

//                 const data = await response.json();

//                 // Actualiza la imagen en el estado y en el localStorage
//                 if (userSession && userSession.user) {
//                     const updatedSession = { ...userSession };
//                     updatedSession.user.profileImageUrl = data.imageUrl;

//                     // Guardar la sesión actualizada en el localStorage
//                     localStorage.setItem("userSession", JSON.stringify(updatedSession));
//                     setImageProfile(data.imageUrl); // Actualiza el estado inmediatamente
//                 }
//                 Swal.fire("Éxito", "Imagen subida correctamente", "success");
//             } catch (error) {
//                 Swal.fire("Error", "No se pudo subir la imagen", "error");
//             }
//         }
//     };
        
//         // Activar modo de edición en un campo específico
//         const handleEditClick = (field: string, currentValue: string) => {
//             setEditingField(field); // Establecer qué campo se está editando
//             setEditedValue(currentValue); // Establecer el valor actual del campo para editarlo
//         };
//     const handleSaveClick = async () => {
//         if (editingField && userSession && userSession.user && userSession.user.id) {
//             const updatedData = {
//                 [editingField]: editedValue, // Actualizamos el campo editado
//             };

//             try {
//                 // Llamamos a la función userEdit pasando el id y los datos actualizados
//                 const updatedUser = await GardenerEdit(userSession.user.id, updatedData);

//                 if (updatedUser) {

//                     const updatedSession = { ...userSession, user: updatedUser };
//                     localStorage.setItem("userSession", JSON.stringify(updatedSession));
//                     setUserSession(updatedSession); // Actualizamos el estado del usuario

//                     // Cerramos la edición
//                     setEditingField(null);
//                     setEditedValue('');
//                     Swal.fire("Éxito", "Cambios guardados correctamente", "success");
//                 } else {
//                     Swal.fire("Error", "No se pudo guardar los cambios", "error");
//                 }
//             } catch (error) {
//                 Swal.fire("Error", "Hubo un problema al guardar los cambios", "error");
//             }
//         };

//     };
//     // Cancelar la edición
//     const handleCancelClick = () => {
//         setEditingField(null); // Salir del modo edición sin guardar cambios
//         setEditedValue(''); // Limpiar el valor editado
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
//         {/* Título principal */}
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Datos de tu cuenta</h1>

//         {/* Contenedor principal */}
//         <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 space-y-10">
//             {/* Sección de imagen de perfil */}
//             <div className="text-center">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Opciones de perfil</h2>

//                 {/* Input para subir imagen */}
//                 <div className="mb-6">
//                     <label
//                         htmlFor="image"
//                         className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                         Sube una imagen de perfil
//                     </label>
//                     <input
//                         id="profileImageUrl"
//                         name="profileImageUrl"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="p-2 border border-gray-300 rounded w-full"
//                     />
//                 </div>

//                 {/* Imagen de perfil o mensaje "SIN IMAGEN" */}
//                 <div className="flex items-center justify-center">
//                     {imageProfile ? (
//                         <Image
//                             src={imageProfile || ""}
//                             alt="Profile"
//                             className="rounded-full border-2 border-gray-200 shadow-md"
//                             width={150}
//                             height={150}
//                         />
//                     ) : (
//                         <h1 className="text-gray-500 text-sm">SIN IMAGEN</h1>
//                     )}
//                 </div>
//             </div>




//                 {/* Sección de datos del usuario */}
//                 <div>
//                     {/* Campo de nombre */}
//                     <div className="border p-4 mb-4 rounded">
//                         <p>Nombre de usuario: {userSession?.user.name}</p>
//                         <button
//                             onClick={() => handleEditClick('name', userSession?.user.name || '')}
//                             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
//                         >
//                             Editar
//                         </button>
//                     </div>


//                         {/* Campo de email */}
//                         <div className="border p-4 mb-4 rounded">
//                         <p>E-mail: {userSession?.user.email}</p>
//                         <button
//                             onClick={() => handleEditClick('email', userSession?.user.email || '')}
//                             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
//                         >
//                             Editar
//                         </button>
//                     </div>

//                     {/* Campo de teléfono */}
//                     <div className="border p-4 mb-4 rounded">
//                         <p>Teléfono: {userSession?.user.phone}</p>
//                         <button
//                             onClick={() => handleEditClick('phone', userSession?.user.phone || '')}
//                             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
//                         >
//                             Editar
//                         </button>
//                     </div>

//                 </div>


//                  {/* Si un campo está en modo de edición, mostrar el input y los botones para guardar o cancelar */}
//                  {editingField && (
//                         <div className="border p-4 mb-4 rounded mt-4">
//                             <input
//                                 type="text"
//                                 value={editedValue} // Mostrar el valor editado
//                                 onChange={(e) => setEditedValue(e.target.value)} // Actualizar el valor editado
//                                 className="p-2 border border-gray-300 rounded w-full"
//                             />
//                             <div className="flex space-x-4 mt-4">
//                                 <button
//                                     onClick={handleSaveClick} // Guardar el cambio
//                                     className="bg-green-500 text-white p-2 rounded"
//                                 >
//                                     Guardar
//                                 </button>
//                                 <button
//                                     onClick={handleCancelClick} // Cancelar la edición
//                                     className="bg-red-500 text-white p-2 rounded"
//                                 >
//                                     Cancelar
//                                 </button>
//                             </div>
//                         </div>
//                     )}



//             </div>
//         </div>
//     );
// };

// export default GardenerPerfil;





