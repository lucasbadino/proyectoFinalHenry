// Helper para realizar solicitudes con fetch e incluir el token de autenticación
export const fetchWithToken = async (url: string, options: RequestInit = {}) => {
    const TOKEN = JSON.parse(localStorage.getItem("userSession") || "null");
  
    // Añadir el header de autorización si el token existe
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${TOKEN?.token || ''}`,
      'Content-Type': 'application/json',
    };
  
    // Realizar la solicitud con fetch
    const response = await fetch(url, {
      ...options,
      headers,
    });
  
    // Manejar respuestas no autorizadas
    if (response.status === 401) {
      console.error("Error 401: No autorizado. Verifique el token.");
      throw new Error("Unauthorized");
    }
  
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error en la solicitud: ${errorMessage}`);
      throw new Error(errorMessage || 'Error en la solicitud');
    }
  
    // Intentar parsear la respuesta como JSON solo si el contenido es JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text(); // Devolver texto plano si no es JSON
    }
  };
  