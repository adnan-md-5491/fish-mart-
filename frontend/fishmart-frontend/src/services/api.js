import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

<<<<<<< HEAD
// ==============================
// REQUEST INTERCEPTOR
// ==============================

=======
// attach token automatically
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

<<<<<<< HEAD
    if (token && token !== "null" && token !== "undefined") {
=======
    // public endpoints (NO AUTH)
    const publicEndpoints = [
      "products",
      "signup",
      "login",
      "verify-otp",
      "categories",
    ];

    const isPublic = publicEndpoints.some((url) =>
      config.url.includes(url)
    );

    if (token && !isPublic) {
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

<<<<<<< HEAD
// ==============================
// RESPONSE INTERCEPTOR (TOKEN REFRESH)
// ==============================

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);

        API.defaults.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ==============================
// AUTH
// ==============================

export const signup    = (data) => API.post("signup/", data);
export const verifyOtp = (data) => API.post("verify-otp/", data);

export const login = (data) => API.post("login/", data);
// ==============================
// DELIVERY BOY — ADMIN
// ==============================
export const adminGetDeliveryBoys    = ()        => API.get("admin/delivery-boys/");
export const adminAddDeliveryBoy     = (data)    => API.post("admin/delivery-boys/add/", data);
export const adminRemoveDeliveryBoy  = (id)      => API.post(`admin/delivery-boys/${id}/remove/`);
export const adminAssignDelivery     = (orderId, data) => API.post(`admin/orders/${orderId}/assign/`, data);
export const adminUnassignedOrders   = ()        => API.get("admin/orders/unassigned/");
export const adminToggleDeliveryBoy = (id, action) =>
  API.post(`admin/delivery-boys/${id}/toggle/`, { action });

export const getDeliverySettings        = ()     => API.get("delivery-settings/");
export const adminUpdateDeliverySettings = (data) => API.post("admin/delivery-settings/update/", data);

// ==============================
// DELIVERY BOY — OWN PANEL
// ==============================
export const deliveryDashboard       = ()        => API.get("delivery/dashboard/");
export const deliveryMyOrders        = ()        => API.get("delivery/orders/");
export const deliveryUpdateStatus    = (id, data)=> API.post(`delivery/orders/${id}/status/`, data);
export const deliveryUpdateLocation  = (data)    => API.post("delivery/location/", data);

// ==============================
// CUSTOMER TRACKING
// ==============================
export const trackOrder              = (orderId) => API.get(`orders/${orderId}/track/`);

// ==============================
// PRODUCTS
// ==============================

export const getProducts = () => API.get("products/");

export const getCategories = () => API.get("categories/");

// ==============================
// CART
// ==============================

export const addToCart = (data) => API.post("cart/add/", data);

export const getCart = () => API.get("cart/");

export const updateCartItem = (data) => API.post("cart/update/", data);

export const removeCartItem = (data) => API.post("cart/remove/", data);

// ==============================
// ORDERS
// ==============================

export const createOrder = (data) => API.post("order/create/", data);
export const getOrders = () => API.get("orders/");

// ==============================
// WALLET
// ==============================

export const getWalletBalance = () => API.get("wallet/");
export const createWalletOrder = (data) => API.post("wallet/create-order/", data);
export const verifyWalletPayment = (data) => API.post("wallet/verify-payment/", data);

// ==============================
// MEMBERSHIP
// ==============================

export const createMembershipOrder = (data) =>
  API.post("membership/create-order/", data);

export const verifyMembershipPayment = (data) =>
  API.post("membership/verify-payment/", data);
// ==============================
// VENDOR
// ==============================
export const vendorRegister     = (data) => API.post("vendor/register/", data);
export const vendorDashboard    = ()     => API.get("vendor/dashboard/");
export const vendorGetProducts  = ()     => API.get("vendor/products/");
export const vendorAddProduct   = (data) => API.post("vendor/products/", data);
export const vendorUpdateProduct= (id, data) => API.put(`vendor/products/${id}/`, data);
export const vendorDeleteProduct= (id)   => API.delete(`vendor/products/${id}/`);
export const vendorGetOrders    = ()     => API.get("vendor/orders/");

// ==============================
// ADMIN
// ==============================
export const adminGetVendors    = ()           => API.get("admin/vendors/");
export const adminApproveVendor = (id, action) => API.post(`admin/vendors/${id}/approve/`, { action });
export const adminSetCommission = (id, rate)   => API.post(`admin/vendors/${id}/commission/`, { commission_rate: rate });
export const adminGetOrders     = ()           => API.get("admin/orders/");

=======

export const signup = (data) => API.post("signup/", data);
export const login = (data) => API.post("login/", data);
export const verifyOtp = (data) => API.post("verify-otp/", data);

export const getProducts = (category) => {
  if (category && category !== 'all') {
    return API.get(`products/?category=${category}`);
  }
  return API.get("products/");
};

export const addToCart = (data) => API.post("cart/add/", data);
export const getCart = () => API.get("cart/");
export const updateCartItem = (data) => API.post("cart/update/", data);
export const removeCartItem = (data) => API.post("cart/remove/", data);

export const createOrder = () => API.post("order/create/");
export const getOrders = () => API.get("orders/");

>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
export default API;