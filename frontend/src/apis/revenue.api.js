import axiosInstance from "../config/axiosInstance";

export const getRevenue = async () => {
  return await axiosInstance.get("/reports/revenue");
};

export const getOrdersSummary = async () => {
  return await axiosInstance.get("/reports/orders/summary");
};

export const getHallsUtilization = async () => {
  return await axiosInstance.get("/reports/halls/utilization");
};

export const getTopMenus = async () => {
  return await axiosInstance.get("/reports/top-menus");
};

export const getStaffPerformance = async () => {
  return await axiosInstance.get("/reports/staff/performance");
};
