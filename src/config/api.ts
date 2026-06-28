const rawUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

// Self-healing: if the URL doesn't end with '/api', append it cleanly
const BASE_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl.replace(/\/$/, "")}/api`;

export default BASE_URL;
