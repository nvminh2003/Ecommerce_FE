const API_URL =
    process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_URL_BACKEND || "http://localhost:3002/api"
        : "http://localhost:3002/api"; // cho môi trường phát triển

export default API_URL;
