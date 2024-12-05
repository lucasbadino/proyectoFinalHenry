import { ILoginProps } from "@/interfaces/ILoginProps";
import { IRegisterProps } from "@/interfaces/IRegisterProps";
import { IServiceProps } from "@/interfaces/IServiceProps";

const APIURL = process.env.NEXT_PUBLIC_API_URL;
export async function register(dataUser: IRegisterProps): Promise<void> {
  try {
    console.log("Register intro")
    const res = await fetch(`${APIURL}/auth/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dataUser),
    });
    console.log(dataUser)

    // if (!res.ok) {
    //   const errorData = await res.json();
    //   if (errorData.message.includes("email")) {
    //     throw new Error("Este correo ya está registrado.");
    //   }
    //   throw new Error(errorData.message || "Register error");
    // }
    const response = await res.json(); //se trae solo la parte necesaria de todo el json
    console.log(response)
    if (response.status === 201) return response.user;
    else throw new Error(response.message);

  } catch (error: any) {
    console.log("catch")
    throw new Error(error.message);
  }
}export async function login(dataUser: ILoginProps) {
  try {
    const res = await fetch(`${APIURL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataUser),
    });

    // Si la respuesta no es ok (es decir, si hay un error)
    if (!res.ok) {
      const errorResponse = await res.json(); // Obtén el mensaje de error del backend
      const error = new Error(errorResponse.message || "Error al iniciar sesión");
      // Agregar detalles adicionales al error
      (error as any).status = res.status;
      (error as any).response = errorResponse;
      throw error;
    }

    // Procesar la respuesta si la solicitud fue exitosa
    const response = await res.json();
    return response;
  } catch (error: any) {
    throw error; // Lanza el error con los detalles completos
  }
}



export async function registerService(dataService: IServiceProps): Promise<void> {
  try {
    // Asegurarse de que estamos en el cliente y accediendo a localStorage
    if (typeof window === "undefined") {
      throw new Error("Cannot access localStorage on the server side.");
    }

    const storedToken = localStorage.getItem("userSession");
    const TOKEN = storedToken ? JSON.parse(storedToken) : null;

    // Verificamos que el token esté presente
    if (!TOKEN || !TOKEN.token) throw new Error("Token is missing or invalid.");

    const res = await fetch(`${APIURL}/serviceProvided`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataService),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Service registration error");
    }
  } catch (error: any) {
    throw new Error(error.message || "Unknown error");
  }
}


export async function checkEmailBeforeRegister(dataUser: IRegisterProps): Promise<boolean> {
  try {
    const res = await fetch(`${APIURL}/auth/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...dataUser }),
    });

    return res.ok; // Retorna `true` si no hay error

  } catch (error: any) {
    if (error.message.includes("email")) return false; // Si el email ya existe
    throw error; // Otros errores
  }
}
