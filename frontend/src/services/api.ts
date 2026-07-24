import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for Auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor with exponential backoff retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response, message } = error;

    // Retry transient network errors or server 502/503/504 statuses
    const isNetworkError = !response && message !== "canceled";
    const isTransientError = response && [502, 503, 504].includes(response.status);

    if ((isNetworkError || isTransientError) && config) {
      config._retryCount = config._retryCount ?? 0;
      const maxRetries = 3;

      if (config._retryCount < maxRetries) {
        config._retryCount += 1;
        const delay = Math.pow(2, config._retryCount) * 1000;
        
        console.warn(
          `Transient error detected (${message || response?.status}). Retrying ${config.url} (Attempt ${config._retryCount}/${maxRetries}) in ${delay}ms...`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;