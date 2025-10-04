import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;
const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
