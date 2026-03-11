import axiosInstance from "../config/axiosInstance";

export const getAllStaff = async () => {
  const res = await axiosInstance.get("/staff");
  return res.data;
};

export const getStaffById = async (id) => {
  const res = await axiosInstance.get(`/staff/${id}`);
  return res.data;
};
