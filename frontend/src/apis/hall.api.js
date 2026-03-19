import axiosInstance from "../config/axiosInstance";

export const getAllHall = async () => {
  const res = await axiosInstance.get("/hall/");
  return res;
};

export const getHallById = async (hallId) => {
  const res = await axiosInstance.get(`/hall/${hallId}`);
  return res;
};

export const createHall = async (payload) => {
  const res = await axiosInstance.post("/hall/", payload);
  return res;
};

export const updateHall = async (hallId, payload) => {
  const res = await axiosInstance.put(`/hall/${hallId}`, payload);
  return res;
};

export const deleteHall = async (hallId) => {
  const res = await axiosInstance.delete(`/hall/${hallId}`);
  return res;
};

export const toggleHallAvailability = async (hallId) => {
  const res = await axiosInstance.patch(`/hall/${hallId}/availability`);
  return res;
};

export const getAvailableHalls = async (params) => {
  const res = await axiosInstance.get("/hallavailability", { params });
  return res;
};
