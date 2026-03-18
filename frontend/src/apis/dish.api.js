import axiosInstance from "../config/axiosInstance";

export const getAllDish = async () => {
  return await axiosInstance.get("/dishes");
};
