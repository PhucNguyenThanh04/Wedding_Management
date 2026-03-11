import axiosInstance from "../config/axiosInstance";

export const getMenus = () => axiosInstance.get("/menus/").then((r) => r.data);
export const getDishesByMenu = (menuId) =>
  axiosInstance.get(`/menus/menus/${menuId}/dishes`).then((r) => r.data);
export const createMenu = (data) =>
  axiosInstance.post("/menus/", data).then((r) => r.data);
export const updateMenu = (id, data) =>
  axiosInstance.put(`/menus/${id}`, data).then((r) => r.data);
export const deleteMenu = (id) =>
  axiosInstance.delete(`/menus/${id}`).then((r) => r.data);
export const toggleMenuActive = (id) =>
  axiosInstance.patch(`/menus/${id}/is_active`).then((r) => r.data);
