import axiosInstance from "../config/axiosInstance";

export const getAllCustomer = async () => {
  const res = await axiosInstance.get("/customer/");
  return res.data;
};

export const getCustomerByPhone = async (phone) => {
  const res = await axiosInstance.get(`/customer/phone/${phone}`);
  return res.data;
};

export const getCustomerById = async (id) => {
  const res = await axiosInstance.get(`/customer/${id}`);
  return res.data;
};

export const getCustomerOrders = async (id) => {
  const res = await axiosInstance.get(`/customer/${id}/orders`);
  return res.data;
};
