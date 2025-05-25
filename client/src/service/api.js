import axios from "axios";

export default axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_API_URL}/api`,
    // baseURL: `http://localhost:7001/api`,
});
