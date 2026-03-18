import axiosInstance from "../config/axiosInstance";

export const getAllBooking = async () => {
  return await axiosInstance.get("/orders");
};

export const createBooking = async (payload) => {
  return await axiosInstance.post("/orders", payload);
};

export const cancelOrder = (id, payload) =>
  axiosInstance.delete(`/orders/${id}`, { data: payload });

export const confirmOrder = (id) => {
  const res = axiosInstance.post(`/orders/${id}/confirm`);
  return res;
};

export const inProcessOrder = (id) =>
  axiosInstance.post(`/orders/${id}/in_process`);

export const completedOrder = (id) =>
  axiosInstance.post(`/orders/${id}/completed`);

export const getBookingById = async (id) => {
  return await axiosInstance.get(`/orders/${id}`);
};

export const updateBookingMenu = async (id, data) => {
  return await axiosInstance.put(`/menus/${id}`, data);
};

export const updateBookingItems = async (id, data) => {
  return await axiosInstance.put(`/menus/${id}`, data);
};
