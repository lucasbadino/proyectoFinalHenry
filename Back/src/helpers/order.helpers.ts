const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const hireServices = async (data: {
  date: string; // Asegúrate de enviar 'YYYY-MM-DD' desde el calendario
  isApproved: boolean;
  gardenerId: string;
  userId: string;
  serviceId: string[];
}) => {
  let token = null;

  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("userSession");
    token = storedToken ? JSON.parse(storedToken) : null;
  }

  if (!token || !token.token) {
    console.error("Token is missing or invalid.");
    throw new Error("Token is missing or invalid.");
  }

  try {
    const response = await fetch(`${APIURL}/gardener/${data.gardenerId}/reserve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: data.date }), // Enviar la fecha formateada
    });

    if (!response.ok) {
      throw new Error("Failed to hire services");
    }

    const result = await response.json();
    console.log("Reserva realizada:", result);

    // Crear la orden de servicios
    const orderResponse = await fetch(`${APIURL}/services-order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!orderResponse.ok) {
      throw new Error("Failed to create service order");
    }

    const orderResult = await orderResponse.json();
    return orderResult;
  } catch (error) {
    console.error("Error during service hiring:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
};
