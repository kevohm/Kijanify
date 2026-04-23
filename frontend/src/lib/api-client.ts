import axios from "axios";

function normalizeApiBaseUrl(rawBaseUrl: string): string {
  const trimmed = rawBaseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) return "http://localhost:4000/v1/api";
  if (trimmed.endsWith("/v1/api")) return trimmed;
  return `${trimmed}/v1/api`;
}

const baseURL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_URL ?? "http://localhost:4000",
);

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

function isAuthRoute(url: unknown): boolean {
  const value = String(url || "");
  return (
    value.includes("/auth/login") ||
    value.includes("/auth/signup") ||
    value.includes("/auth/refresh") ||
    value.includes("/auth/logout")
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (isAuthRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;
      return api.request(originalRequest);
    } catch {
      refreshPromise = null;
      try {
        await api.post("/auth/logout");
      } catch {
        // ignore
      }
      return Promise.reject(error);
    }
  },
);
