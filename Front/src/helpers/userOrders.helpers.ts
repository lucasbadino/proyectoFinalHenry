const APIURL: string = process.env.NEXT_PUBLIC_API_URL as string;
const TOKEN = JSON.parse(localStorage.getItem("userSession") || "null")

export async function getuserOrdersDB(id: number, token: string) {
  try {
    const res = await fetch(`${APIURL}/user/${id}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
    });
    if (!res.ok) {
      throw new Error("Error al obtener las órdenes");
    }
    const orders = await res.json();
    return orders;
  } catch (error) {
    console.error(error);  
    throw new Error(error instanceof Error ? error.message : "Error desconocido");
  }
}

export async function getAllUsers() {
  const TOKEN = JSON.parse(localStorage.getItem("userSession") || "null")
  try {
  
    const response = await fetch(`${APIURL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN.token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado: token no válido');
      } else {
        throw new Error('La respuesta de la red no fue correcta');
      }
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error al recuperar usuarios', error);
    throw error; 
  }
}

export async function banUser(userId: string,  isBanned: boolean) {
  const response = await fetch(`${APIURL}/user/${userId}/ban`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${TOKEN.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isBanned })
  });

  if (!response.ok) {
    throw new Error('Failed to ban user');
  }
  return await response.json();
}



export async function deleteUser(userId: string) {
  const response = await fetch(`${APIURL}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${TOKEN.token}`,
      'Content-Type': 'application/json',
    },
  });
if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  if (response.headers.get('content-length') === '0') {
    return null; 
  }
  return await response.json();
}

export async function deleteOrder(orderId: string) {
  const response = await fetch(`${APIURL}/services-order/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${TOKEN.token}`,
      'Content-Type': 'application/json',
    },
  });
if (!response.ok) {
    throw new Error('Failed to delete Order');
  }
  if (response.headers.get('content-length') === '0') {
    return null; 
  }
  return await response.json();
}