
const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchComments = async (id: string, body: any) => {
    let TOKEN = null;

    if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("userSession");
        TOKEN = storedToken ? JSON.parse(storedToken) : null;
    }

    if (!TOKEN || !TOKEN.token) {
        console.error("Token is missing or invalid.");
        return null;
    }
    const response = await fetch(`${APIURL}/reviews/create/${id}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${TOKEN.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log(data);

    return data;

}


export const fetchReviews = async (gardenerId: string) => {
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
        const response = await fetch(`${APIURL}/reviews/gardener/${gardenerId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TOKEN.token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        console.log("data",data);
        
        return data; 
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};
