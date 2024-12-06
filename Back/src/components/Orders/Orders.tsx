"use client";

import { deleteOrder, getuserOrdersDB } from "@/helpers/userOrders.helpers";
import { IOrderProps } from "@/interfaces/IOrdersProps";
import { IUserSession } from "@/interfaces/IUserSession";

import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "./modal";
import { format } from "date-fns";
import { fetchComments } from "@/helpers/comments.helpers";

// Componente para mostrar las órdenes del usuario
const DashboardUserCompo: React.FC = () => {
  const [orders, setOrders] = useState<any>([]);
  const [params, setParams] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<IUserSession | null>(null);
  const TOKEN = JSON.parse(localStorage.getItem("userSession") || "null");
  const [imageProfile, setImageProfile] = useState<any>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Para almacenar la orden seleccionada
  const [status, setStatus] = useState<string | null>("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("startTime");

  const handleOpenModal = (order: any) => {
    setSelectedOrder(order); // Establecer la orden seleccionada
    setShowModal(true); // Mostrar el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cerrar el modal
    setSelectedOrder(null); // Resetear la orden seleccionada
  };
  const showRatingModal = async (id: string) => {
    Swal.fire({
      title: 'Califica el Servicio',
      html: `
        <div class="modal-content w-11/12 max-w-lg bg-white rounded-lg p-6 shadow-lg text-center">
          <div class="modal-header mb-4">
            <h2 class="text-2xl font-semibold text-gray-800">Tu Comentario</h2>
          </div>
  
          <div class="modal-body mb-6">
            <!-- Área de texto para comentario -->
            <textarea id="comentario" class="w-full h-24 p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Escribe tu comentario..."></textarea>
  
            <!-- Estrellas de calificación -->
            <div class="stars-rating flex justify-center mt-4">
              <span class="star text-3xl cursor-pointer text-gray-400" data-value="1">&#9733;</span>
              <span class="star text-3xl cursor-pointer text-gray-400" data-value="2">&#9733;</span>
              <span class="star text-3xl cursor-pointer text-gray-400" data-value="3">&#9733;</span>
              <span class="star text-3xl cursor-pointer text-gray-400" data-value="4">&#9733;</span>
              <span class="star text-3xl cursor-pointer text-gray-400" data-value="5">&#9733;</span>
            </div>
  
            <!-- Mostrar calificación -->
            <div class="rating-display text-xl font-bold mt-2 text-gray-800">
              <span id="ratingValue">5</span> / 5
            </div>
          </div>
          
          <div class="modal-footer">
            <button id="submitButton" class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center">
              <span id="submitText">Enviar</span> <!-- Texto del botón -->
              <div id="loader" class="hidden w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin ml-2"></div> <!-- Círculo de carga -->
            </button>
          </div>
        </div>
      `,
      focusConfirm: false,
      showConfirmButton: false, // Desactivar el botón de confirmación de Swal
      preConfirm: async () => {
        const comentario = (document.getElementById('comentario') as HTMLTextAreaElement).value;
        const calificacion = (document.getElementById('ratingValue') as HTMLElement).textContent;
        return { comentario, calificacion };
      },
      didOpen: async () => {
        const stars = document.querySelectorAll('.star');
        const ratingValue = document.getElementById('ratingValue');

        // Manejar la selección de las estrellas (solo clic)
        stars.forEach(star => {
          star.addEventListener('click', () => {
            const rating = star.getAttribute('data-value');
            updateStars(rating as string);
          });
        });

        function updateStars(rating: string) {
          stars.forEach(star => {
            const starValue = star.getAttribute('data-value');
            if (starValue && parseInt(starValue) <= parseInt(rating)) {
              // Añadir clase de color dorado a las estrellas seleccionadas
              star.classList.add('text-yellow-400');
              star.classList.remove('text-gray-400');
            } else {
              // Quitar el color dorado y restaurar al gris
              star.classList.remove('text-yellow-400');
              star.classList.add('text-gray-400');
            }
          });
          if (ratingValue) {
            ratingValue.textContent = rating;
          }
        }

        // Inicializar con calificación de 5 estrellas
        updateStars('5');

        // Agregar el evento de clic al botón "Enviar"
        const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
        const submitText = document.getElementById('submitText') as HTMLElement;
        const loader = document.getElementById('loader') as HTMLElement;

        submitButton.addEventListener('click', async () => {
          const comentario = (document.getElementById('comentario') as HTMLTextAreaElement).value;
          const calificacion = (document.getElementById('ratingValue') as HTMLElement).textContent;

          // Mostrar el loader y ocultar el texto del botón
          loader.classList.remove('hidden');
          submitText.classList.add('hidden');

          try {
            // Realizar el fetch cuando el usuario haga clic en "Enviar"
            const comments = await fetchComments(id, { comentario, calificacion });
            console.log('Comentarios:', comments);

            if (comments.status === 400) {
              Swal.fire({
                title: 'Error',
                text: "Ya has calificado este servicio.",
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            } else {
              Swal.fire({
                title: '¡Reseña creada con éxito!',
                text: 'Puedes ver tu reseña en el perfil del jardinero.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
            }
          } catch (error) {
            throw new Error('Error al enviar la reseña');
          } finally {
            // Ocultar el loader y restaurar el texto del botón
            loader.classList.add('hidden');
            submitText.classList.remove('hidden');
            if (userSession?.user?.id && userSession?.token) {
              fetchOrders(userSession?.user?.id, userSession?.token);
            }
          }
        });
      }
    });
  };


  useEffect(() => {
    // Usamos URLSearchParams para obtener los query params
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const paymentId = urlParams.get("payment_id");
    const externalReference = urlParams.get("external_reference");

    setStatus(status);
    setParams({ status, paymentId, externalReference });

  }, []);

  useEffect(() => {
    if (params?.status === "approved" && params?.externalReference) {
      // Marcar como aprobado y realizar fetch de órdenes actualizadas
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services-order/orderPay/${params.externalReference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN.token}`,
            "Content-Type": "application/json",
          },
        }
      ).then(() => {
        if (userSession?.user?.id && userSession.token) {
          fetchOrders(userSession.user.id, userSession.token);
        }
      });
    } else if (
      params?.status === "failure" ||
      params?.status === "rejected" ||
      params?.status === "null"
    ) {
      Swal.fire({
        title: "Error",
        text: "El pago ha fallado",
        icon: "error",
      });
    }
  }, [params]);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = JSON.parse(
        localStorage.getItem("userSession") || ""
      );
      setUserSession(storedSession);
    }
  }, []);




  const deleteOrders = async (id: string) => {
    setLoading(true);
    try {
      await deleteOrder(id);
      Swal.fire({
        title: "Orden Eliminada",
        text: "Orden eliminada correctamente",
        icon: "success",
        confirmButtonText: "OK",
      })
      if (userSession?.user?.id && userSession.token) {
        fetchOrders(userSession.user.id, userSession.token);
      }
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      Swal.fire({
        title: "Error",
        text: "Error al eliminar la orden",
        icon: "error",
        confirmButtonText: "OK",
      })

    } finally {
      setLoading(false);
    }
  }

  const handlePayment = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mercadopago/create-payment/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }
      if (data.paymentUrl.sandbox_init_point) {
        window.location.href = data.paymentUrl.sandbox_init_point;
      }
      setStatus("approved");
      if (params?.status === "approved") {

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/services-order/orderPay/${params.externalReference}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      if (userSession?.user?.id && userSession?.token) {
        fetchOrders(userSession.user.id, userSession.token);
      }
    } catch (error) {
      throw error;
    }
  };
  const handleSortChange = (event: any) => {
    const { name, value } = event.target;

    if (name === "sortBy") {
      setSortBy(value);
    } else {
      setSortOrder(value);
    }
  };
  const sortOrders = () => {
    const sortedOrders = Array.isArray(orders[0]?.servicesOrder)
      ? [...orders[0]?.servicesOrder].sort((a, b) => {
        if (sortBy === "startTime") {
          const dateA: any = a.serviceDate ? new Date(a.serviceDate) : Infinity;
          const dateB: any = b.serviceDate ? new Date(b.serviceDate) : Infinity;

          if (sortOrder === "asc") {
            return dateA === Infinity ? 1 : dateB === Infinity ? -1 : dateA.getTime() - dateB.getTime();
          }
          else {
            return dateA === Infinity ? -1 : dateB === Infinity ? 1 : dateB.getTime() - dateA.getTime();
          }
        } else if (sortBy === "isApproved") {
          const approvedA = a.isApproved ? 1 : 0;
          const approvedB = b.isApproved ? 1 : 0;
          return sortOrder === "asc" ? approvedB - approvedA : approvedA - approvedB;
        }
        return 0;
      }) : null;

    setOrders((prevOrders: any[]) =>
      [
        { ...prevOrders[0], servicesOrder: sortedOrders }
      ]
    );
  };
  useEffect(() => {

    sortOrders();

  }, [sortBy, sortOrder]);


  const fetchOrders = async (id: number, token: string) => {
    console.log("recibi la id: ", id);

    setLoading(true);
    try {
      setOrders([]);
      const ordersData = await getuserOrdersDB(id, token);
      setOrders(ordersData);
      setError(null);

    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const queryParams = new URLSearchParams(window.location.search);
  const shouldUpdate = queryParams.get("update");

  console.log(shouldUpdate);

  useEffect(() => {
    if (userSession?.user?.id && userSession.token) {
      fetchOrders(userSession.user.id, userSession.token);
    }
  }, [userSession, status]);

  useEffect(() => {

    if (userSession?.user?.id && userSession.token) {
      fetchOrders(userSession.user.id, userSession.token);
    }
  }, [shouldUpdate, userSession]);

  console.log("orders: ", orders);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-green-300 border-t-green-500 rounded-full animate-spin mb-4"></div>

        {/* Texto */}
        <h2 className="text-xl font-semibold text-[#263238]">
          Cargando la informacion..
        </h2>
      </div>);
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 lg:px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 px-4">
        Bienvenido a su historial de Operaciones
      </h1>
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md w-full sm:w-auto mb-6">
        <div>
          <label htmlFor="sortBy">Ordenar por: </label>
          <select
            id="sortBy"
            name="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="w-full sm:w-auto"
          >
            <option value="startTime">Fecha de inicio</option>
            <option value="isApproved">Aprobado</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder">Orden: </label>
          <select
            id="sortOrder"
            name="sortOrder"
            value={sortOrder}
            onChange={handleSortChange}
            className="w-full sm:w-auto"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>


      {!orders[0]?.servicesOrder?.length ? (
        <p className="text-xl mt-6 text-[#FF5722]">
          No se encontraron órdenes.
        </p>
      ) : (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          {orders[0]?.servicesOrder?.map((order: any) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {!order.isApproved ? (
                <button onClick={() => deleteOrders(order.id)} className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center">X</button>

              ) : ""}
              {/* ID de la Orden y Detalles Generales */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Jardinero contratado: {order.gardener.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Imagen del jardinero */}
                <div className="flex justify-center items-center">
                  <Image
                    className="rounded-full w-28 h-28 object-cover"
                    src={order.gardener.profileImageUrl || "/images/nuevo_usuarioGardener.webp"}
                    alt={`${order.gardener.name}'s profile`}
                    width={120}
                    height={120}
                  />
                </div>

                {/* Información del jardinero */}
                <div className="flex flex-col space-y-1 mt-4 ">
                  <p className="text-gray-700">
                    <strong>Dirección:</strong> {order.gardener.address}
                  </p>
                  <p className="text-gray-700 truncate">
                    <strong>Email:</strong> {order.gardener.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>Teléfono:</strong> {order.gardener.phone}
                  </p>
                </div>

              </div>
              {/* Información de la orden */}
              <div className="flex flex-col space-y-6">
                <h1 className="text-gray-700 text-xl mt-6">
                  <strong>Nº de Orden: </strong>
                  {order.id}
                </h1>
                <p className="text-gray-700">
                  <strong>Fecha de Orden:</strong> {order.date}
                </p>
                <strong>Fecha del Servicio:</strong>{" "}
                {order ? order?.serviceDate : "No está definida"}
              </div>

              {/* Detalles del Servicio */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Detalles del Servicio
                </h3>
                {order.serviceProvided.map((s: any) => (
                  <div key={s.id}>
                    <p className="text-gray-700">
                      <strong>Servicio:</strong> {s.detailService}
                    </p>
                    <p className="text-gray-700">
                      <strong>Precio Unitario:</strong> ${s.price}
                    </p>
                  </div>
                ))}
                <p className="text-gray-700">
                  <strong>Cantidad:</strong> {order.serviceProvided.length}{" "}
                </p>
                <p className="text-gray-700 text-2xl mt-4">
                  <strong>Total:</strong> $
                  {order.serviceProvided.reduce(
                    (acc: number, s: any) => acc + s.price,
                    0
                  )}
                </p>
              </div>

              {/* Estado y Pago */}
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${order.isApproved ? "bg-green-500" : "bg-red-500"
                      }`}
                  >
                    {order.isApproved ? `Aprobada: Estado del trabajo ${order.orderDetail.status}` : "No Aprobada"}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-between mt-6 gap-4">
                {/* Botón de pago solo si no está aprobada */}
                {!order.isApproved && (
                  <button
                    className="py-2 px-4 bg-[#4caf50] text-white text-sm font-medium rounded-lg hover:bg-[#388e3c] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#388e3c] w-full"
                    onClick={() => handlePayment(order.id)}
                  >
                    Pagar con MercadoPago
                  </button>
                )}

                {/* Botón "Ver detalles" */}
                {order.isApproved && (
                  <button
                    className="py-2 px-4 bg-[#2196f3] text-white text-sm font-medium rounded-lg hover:bg-[#1976d2] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1976d2] w-full"
                    onClick={() => handleOpenModal(order.orderDetail)}
                  >
                    Ver detalles
                  </button>
                )}

                {/* Botón para calificar el servicio si está finalizado */}
                {order?.orderDetail?.status === "Finalizado" && !order?.reviews && (
                  <button
                    className="p-3 bg-[#ff9800] text-white text-lg font-medium rounded-lg hover:bg-[#f57c00] transition-colors w-full"
                    onClick={() => showRatingModal(order.id)}
                  >
                    Califica el Servicio
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        orderDetail={selectedOrder}
      />
    </div>
  )
}

export default DashboardUserCompo;
