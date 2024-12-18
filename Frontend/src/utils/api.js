const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    return await response.json();
  } catch (error) {
    console.error("API Error: ", error);
    throw error;
  }
};
