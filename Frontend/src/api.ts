const API_BASE_URL = "https://localhost:7133/api";
export const IMAGE_BASE_URL = "https://localhost:7133";  // ✅ new one


export const API = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  orders: `${API_BASE_URL}/orders`,
  product: `${API_BASE_URL}/products`,
  menu: `${API_BASE_URL}/AdminProduct`,
  order: `${API_BASE_URL}/orders`,
  userorder: `${API_BASE_URL}/orders/mine`, // ✅ new one
};
