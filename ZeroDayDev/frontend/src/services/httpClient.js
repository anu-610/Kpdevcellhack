import { auth } from "../lib/firebase.js";
import { config } from "../config/env.js";

async function getAuthHeaders() {
  if (!auth?.currentUser) return {};

  const token = await auth.currentUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.auth ? await getAuthHeaders() : {}),
    ...options.headers
  };

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
