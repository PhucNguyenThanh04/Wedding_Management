import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1/orders",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
