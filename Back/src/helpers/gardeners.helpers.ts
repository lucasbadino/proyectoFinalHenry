import { IService } from "@/interfaces/IService";
import { IServiceProvider } from "@/interfaces/IServiceProvider";
import { getServicesProvided } from "./service.helpers";
const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const getGardenersDB = async (
  token: string,
  order: "ASC" | "DESC" = "ASC",
  calification?: number,
  name?: string,
  page: number = 1,
  limit: number = 8
): Promise<{ 
  data: IServiceProvider[], 
  totalCount: number, 
  currentPage: number, 
  totalPages: number 
}> => {
  if (!token) {
    console.error("Token is missing or invalid.");
    return { 
      data: [], 
      totalCount: 0, 
      currentPage: 1, 
      totalPages: 0 
    };
  }
  
  const params = new URLSearchParams();
  params.append("order", order);
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  
  if (calification) params.append("calification", calification.toString());
  if (name) params.append("name", name);

  const response = await fetch(`${APIURL}/gardener?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return await response.json();
};

export const getTasks = async (id: string) => {
  let TOKEN = null;

  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("userSession");
    TOKEN = storedToken ? JSON.parse(storedToken) : null;
  }

  if (!TOKEN || !TOKEN.token) {
    console.error("Token is missing or invalid.");
    return null;
  }
  const response = await fetch(`${APIURL}/services-order/gardener/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN.token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);

  return data;
}

// Función para obtener un gardener por ID
export async function getProviderById(id: string): Promise<IServiceProvider | null> {
  let TOKEN = null;

  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("userSession");
    TOKEN = storedToken ? JSON.parse(storedToken) : null;
  }

  if (!TOKEN || !TOKEN.token) {
    console.error("Token is missing or invalid.");
    return null;
  }

  try {
    const res = await fetch(`${APIURL}/gardener/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN.token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 1200 },
    });

    if (!res.ok) throw new Error(`Failed to fetch gardener with ID ${id}`);

    const response = await res.json();

    if (response && typeof response === "object" && !Array.isArray(response)) {
      return response.data || response;
    } else {
      throw new Error("Invalid data format, expected object in 'data'");
    }
  } catch (error: any) {
    console.error(`Error fetching gardener with ID ${id}:`, error);
    return null;
  }
}


export async function getCarrouselById(id: string) {
  try {

    let TOKEN = null;
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("userSession");
      TOKEN = storedToken ? JSON.parse(storedToken) : null;
    }


    if (!TOKEN?.token) {
      console.error("Token is missing or invalid.");
      return null;
    }


    const res = await fetch(`${APIURL}/gardener/carrousel/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN.token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 1200 },
    });


    if (!res.ok) {
      throw new Error(`Error con el jardinero ${id}: ${res.status} ${res.statusText}`);
    }


    const response = await res.json();


    if (response && typeof response === "object" && !Array.isArray(response)) {
      return response.data || response;
    } else {
      throw new Error("Formato invalido.");
    }
  } catch (error: any) {
    console.error(`Error con el jardinero ${id}:`, error.message || error);
    return null;
  }
}

export async function postCarrouselImage(formData: FormData, id: string | undefined) {
  try {
    let TOKEN = null;
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("userSession");
      TOKEN = storedToken ? JSON.parse(storedToken) : null;
    }

    if (!TOKEN?.token) {
      console.error("Token is missing or invalid.");
      return null;
    }

    const res = await fetch(`${APIURL}/gardener/carrousel/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN.token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Error al subir la imagen: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();

    if (response && typeof response === "object" && !Array.isArray(response)) {
      return response.data || response;
    } else {
      throw new Error("Formato invalido.");
    }
  } catch (error: any) {
    console.error("Error al subir la imagen:", error.message || error);
    return null;
  }
}
export async function updateCarrousel(id: string, carrousel: string[]) {
  try {
    let TOKEN = null;
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("userSession");
      TOKEN = storedToken ? JSON.parse(storedToken) : null;
    }

    if (!TOKEN?.token) {
      console.error("Token is missing or invalid.");
      return null;
    }

    const res = await fetch(`${APIURL}/gardener/carrousel/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // Indica que el cuerpo es JSON
        Authorization: `Bearer ${TOKEN.token}`,
      },
      body: JSON.stringify(carrousel), // Serializa el arreglo a JSON
    });

    if (!res.ok) {
      throw new Error(`Error al modificar el carrousel: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();

    if (response && typeof response === "object" && !Array.isArray(response)) {
      return response.data || response;
    } else {
      throw new Error("Formato inválido.");
    }
  } catch (error: any) {
    console.error("Error al modificar el carrousel:", error.message || error);
    return null;
  }
}


export const updateProviderServices = async (gardenerId: string, serviceIds: string[]): Promise<IServiceProvider> => {
  try {
    let TOKEN = null;
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("userSession");
      TOKEN = storedToken ? JSON.parse(storedToken) : null;
    }

    if (!TOKEN?.token) {
      console.error("Token is missing or invalid.");
      throw new Error("Unauthorized");
    }
    console.log("Que estoy recibiendo en serviceIds: ", serviceIds);

    const response = await fetch(`${APIURL}/gardener/${gardenerId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceProvided: serviceIds }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar los servicios del proveedor con ID ${gardenerId}`);
    }

    const updatedProvider = await response.json();
    return updatedProvider;
  } catch (error) {
    console.error('Error al actualizar los servicios del proveedor:', error);
    throw error;
  }
};


export const getProviderServices = async (gardenerId: string): Promise<IService[]> => {
  try {
    let TOKEN = null;
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("userSession");
      TOKEN = storedToken ? JSON.parse(storedToken) : null;
    }

    if (!TOKEN?.token) {
      console.error("Token is missing or invalid.");
    }

    const response = await fetch(`${APIURL}/gardener/${gardenerId}/serviceProvided`, {
      headers: {
        'Authorization': `Bearer ${TOKEN?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los servicios del proveedor con ID ${gardenerId}`);
    }

    const services = await response.json();
    return services;
  } catch (error) {
    console.error('Error al obtener los servicios del proveedor:', error);
    throw error;
  }
};

export const deleteGardener = async (token: string, id: number): Promise<any> => {
  if (!token) {
    throw new Error("Token is missing or invalid.");
  }

  const response = await fetch(`${APIURL}/gardener/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.status === 200) {
    return true
  } else {
    return false
  }
};



export const updateGardener = async (
  token: string,
  id: number,
  updateGardenerDto: Partial<IServiceProvider>
): Promise<IServiceProvider> => {
  if (!token) {
    throw new Error("Token inválido o ausente");
  }

  const response = await fetch(`${APIURL}/gardener/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateGardenerDto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el jardinero");
  }

  return response.json();
};

