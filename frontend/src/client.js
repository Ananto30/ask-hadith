import axios from "axios";

const api = axios.create({
  // baseURL: "http://192.168.0.107:5000/api",
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Hadith = {
  search: (key) => api.get(`/search?search=${key}`),
};

export default {
  Hadith,
};
