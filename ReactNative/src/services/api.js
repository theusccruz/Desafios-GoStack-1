import axios from "axios";

const api = axios.create({
  baseURL: "http://172.24.85.19:3333",
});

export default api;
