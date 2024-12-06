
export const userEdit = async ( updatedData: any, token : string) => {
  const TOKEN = JSON.parse(localStorage.getItem("userSession") || "null");
  try {

    if (!TOKEN || !TOKEN.token) {
      console.error("No hay token válido en el localStorage");
      throw new Error("Unauthorized: Token inválido o inexistente.");
    }

    let role = ""
    role = TOKEN.user?.role; 
    let userId = TOKEN.user?.id;

    console.log("Role EN EDIT HELPERS:", role);
    
    if (!role || !userId) {
      console.error("Datos de usuario incompletos en el token.");
      throw new Error("Unauthorized: Datos de usuario incompletos.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${role}/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error del servidor:", errorDetails);
      throw new Error(`Error en la actualización: ${response.status} ${response.statusText}`);
    }

    const updatedUser = await response.json();
    return updatedUser; 
  } catch (error) {
    console.error("Error actualizando datos del usuario:");
    return null;
  }
};


export const gardenerEdit = async ( updatedData: any, token : string) => {
  const TOKEN = JSON.parse(localStorage.getItem("userSession") || "null");
  try {

    if (!TOKEN || !TOKEN.token) {
      console.error("No hay token válido en el localStorage");
      throw new Error("Unauthorized: Token inválido o inexistente.");
    }

    const userId = TOKEN.user?.id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gardener/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error del servidor:", errorDetails);
      throw new Error(`Error en la actualización: ${response.status} ${response.statusText}`);
    }

    const updatedUser = await response.json();
    return updatedUser; 
  } catch (error) {
    console.error("Error actualizando datos del usuario:");
    return null;
  }
};


export const gardenerServiceEdit = async ( updatedData: any) => {
  const TOKEN = JSON.parse(localStorage.getItem("userSession") || "null");
  try {

    if (!TOKEN || !TOKEN.token) {
      console.error("No hay token válido en el localStorage");
      throw new Error("Unauthorized: Token inválido o inexistente.");
    }

    const userId = TOKEN.user?.id;


    if (!userId) {
      console.error("Datos de usuario incompletos en el token.");
      throw new Error("Unauthorized: Datos de usuario incompletos.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gardener/servicesEdit/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${TOKEN.token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error del servidor:", errorDetails);
      throw new Error(`Error en la actualización: ${response.status} ${response.statusText}`);
    }

    const updatedUser = await response.json();
    return updatedUser; 
  } catch (error) {
    console.error("Error actualizando los servicios del Jardinero:");
    return null;
  }
};
