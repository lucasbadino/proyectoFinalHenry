import React, { useState, useEffect } from "react";
import { banUser, deleteUser, getAllUsers } from "@/helpers/userOrders.helpers";
import Swal from "sweetalert2";

interface User {
  id: string;
  name: string;
  email?: string;
  isBanned: boolean;
  role: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isBanning, setIsBanning] = useState(false);
  const [banError, setBanError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [banningUserId, setBanningUserId] = useState<string | any>(null);

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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers();
        if (response) {
          setUsers(response.data);
        } else {
          console.error("No user data received from getAllUsers");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleBanUnbanUser = async (userId: string, isBanned: boolean) => {
    setIsBanning(true);
    setBanError(null);
    setBanningUserId(userId);

    try {
      const token = localStorage.getItem("userSession");
      if (token) {
        await banUser(userId, isBanned);

        const updatedUsers = await getAllUsers();
        setUsers(updatedUsers.data);
        Toast.fire({
          icon: isBanned ? "success" : "warning",
          title: isBanned ? "Usuario desbaneado" : "Usuario baneado"
        });
      } else {
        console.error("User token not found");
        setBanError("Token de usuario no encontrado");
      }
    } catch (error: any) {
      console.error("Error banning/unbanning user:", error);
      setBanError(error.message || "Error al banear/desbanear usuario");
    } finally {
      setIsBanning(false);
      setBanningUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "¿Estás seguro que deseas eliminar el usuario?",
        text: "No podrás revertir esto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
  
      if (!isConfirmed) return;
  
      const token = localStorage.getItem("userSession");
      if (token) {
        await deleteUser(userId);
        const updatedUsers = await getAllUsers();
        setUsers(updatedUsers.data);
        Toast.fire({
          icon: "success",
          title: "Usuario eliminado correctamente"
        });
      } else {
        console.error("User token not found");
        setBanError("Token de usuario no encontrado");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      Toast.fire({
        icon: "error",
        title: "Error al eliminar el usuario"
      });
    }
  };
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista de Usuarios</h1>
  
        {banError && (
          <div className="bg-red-100 text-red-800 px-4 py-3 mb-4 rounded-lg">
            {banError}
          </div>
        )}
  
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No hay usuarios para mostrar.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className={`bg-white shadow-md rounded-lg p-6 transition border-2 ${banningUserId === user.id
                  ? "border-yellow-500 shadow-lg shadow-yellow-500"
                  : "hover:shadow-lg hover:shadow-[#8BC34A] border-[#4CAF50]"
                }`}
              >
                <h2 className="font-semibold text-lg text-gray-800 mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-600">Estado: {user.isBanned ? "Baneado" : "Activo"}</p>
                <p className="text-gray-600">Rol: {user.role}</p>
  
                {/* Botón de banear/desbanear */}
                <button
                  onClick={() => handleBanUnbanUser(user.id, user.isBanned)}
                  className={`mt-4 px-4 py-2 rounded-md font-medium transition ${user.isBanned
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                    } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  disabled={banningUserId !== null}
                >
                  {banningUserId === user.id
                    ? "Procesando..."
                    : user.isBanned
                      ? "Desbanear"
                      : "Banear"}
                </button>
  
                {/* Botón de eliminar */}
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="mt-4 px-4 py-2 m-4 rounded-md font-medium bg-red-700 text-white hover:bg-red-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={banningUserId !== null}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}

export default UserList;
