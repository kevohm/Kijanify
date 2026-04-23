import axios from "axios";

import { getAuthToken } from "./auth-token";

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

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (!token) return config;

  config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});
