import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface ModalDetailsProps {
    order: any;
    onClose: () => void;
}
const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                fill={i <= rating ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`w-5 h-5 ${i <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
            </svg>
        );
    }
    return <div className="flex space-x-1">{stars}</div>;
};

const ModalDetails: React.FC<ModalDetailsProps> = ({ order, onClose }) => {
    const [token, setToken] = useState("");
    const [userToken, setUserToken] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const storedSession = JSON.parse(localStorage.getItem("userSession") || "");
            setUserToken(storedSession.token);
        }

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
    };

    const handleDateExpiration = (value: string) => {
        const endTimeStr = value;
        const [year, month, day] = endTimeStr.split("-").map(Number);
        const endTimeDate = new Date(year, month - 1, day);
        const currentDate = new Date();
        return endTimeDate > currentDate;
    };

    const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/token/check/${order.id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ token }),
            }
        );
        const data = await response.json();

        if (data.status === 200) {
            Swal.fire({
                icon: "success",
                title: "Token verificado",
                text: "El token es correcto",
                showConfirmButton: false,
                timer: 1500,
            });
            onClose();
        } else {
            Swal.fire({
                icon: "error",
                title: "Token incorrecto",
                text: "El token es incorrecto",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    if (!order) return null;
    console.log(order);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClickOutside}
        >
            <div className="relative bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Botón de cierre */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Título del modal */}
                <h2 className="text-3xl font-semibold text-[#263238] mb-8 text-center">Detalles de la solicitud</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Información del servicio */}
                    <div className="p-6 bg-white rounded-lg shadow-xl space-y-4">
                        <p className="text-sm text-gray-600">
                            <strong>Fecha del servicio:</strong>{" "}
                            {order.orderDetail.startTime.toLocaleString("es-ES").split(",")[0]}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Precio:</strong> ${order.orderDetail.totalPrice}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Estado:</strong> {order.isApproved ? "Aprobada" : "Pendiente"}
                        </p>
                    </div>

                    {/* Información del cliente */}
                    <div className="p-6 bg-blue-50 rounded-lg shadow-xl space-y-4">
                        <h3 className="text-lg font-semibold text-[#263238]">Datos del cliente</h3>
                        <p className="text-sm text-gray-600">
                            <strong>Nombre:</strong> {order.user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Email:</strong> {order.user.email}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Teléfono:</strong> {order.user.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Dirección:</strong> {order.user.address || "No proporcionada"}
                        </p>
                    </div>
                </div>

                {/* Estado del servicio y reseña del cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {/* Estado del servicio */}
                    <div className="p-6 bg-white rounded-lg shadow-xl">
                        <h3 className="text-lg font-semibold text-[#263238] mb-4">Estado del servicio</h3>
                        <p className="text-sm text-gray-600">
                            <strong>Estado:</strong> {order.orderDetail.status}
                        </p>
                    </div>

                    {/* Reseña del cliente */}
                    {order?.reviews && (
                        <div className="p-6 bg-gradient-to-br from-pink-50 to-orange-100 rounded-lg shadow-xl">
                            <h3 className="text-lg font-semibold text-[#263238] mb-4">Reseña del cliente: {order?.reviews?.comment}</h3>
                            <p className="text-sm text-gray-700 italic">
                                {order?.reviews?.rate ? renderStars(Number(order.reviews.rate)) : "No calificado"}
                            </p>
                            {/* Mostrar fecha de la reseña */}
                            <p className="text-sm text-gray-600 mt-4">
                                <strong>Fecha de la reseña:</strong> {order.reviews?.date}
                            </p>
                        </div>
                    )}
                </div>

                {/* Campo de entrada del token */}
                {order.orderDetail.status === "Finalizado" ? (
                    <div className="mt-8 bg-green-700 text-white p-6 rounded-lg shadow-xl">
                        <label htmlFor="token" className="block text-sm font-medium mb-2 text-center">
                            ¡El Token es Válido!
                        </label>
                        <input
                            type="text"
                            id="token"
                            value={order.orderDetail.status}
                            readOnly
                            className="w-full bg-gray-700 text-center text-gray-200 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                ) : handleDateExpiration(order.orderDetail.endTime) ? (
                    <div className="mb-6 mt-8">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="token">
                            Ingresa el token para finalizar el servicio antes del:{" "}
                            {order.orderDetail.endTime.toLocaleString("es-ES").split(",")[0]} a las 23:59hs
                        </label>
                        <input
                            type="text"
                            id="token"
                            maxLength={6}
                            value={token}
                            onChange={handleInputChange}
                            placeholder="Escribe el token aquí"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                        {/* Botón de acción */}
                        <button
                            onClick={handleOnClick}
                            className="w-full bg-[#4caf50] text-white text-center py-2 mt-4 px-4 rounded-lg hover:bg-[#388e3c] transition duration-200"
                        >
                            Confirmar
                        </button>
                    </div>
                ) : (
                    <div className="mb-6 mt-8">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="token">
                            El token ya expiró.
                        </label>
                    </div>
                )}
            </div>
        </div>
    );

};

export default ModalDetails;
