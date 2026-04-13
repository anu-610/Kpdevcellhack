import { request } from "./httpClient.js";

function getCollection(payload, keys) {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  return [];
}

export async function getCoreMembers() {
  try {
    const payload = await request("/members");
    return getCollection(payload, ["data", "members", "coreMembers"]);
  } catch {
    const payload = await request("/members/core");
    return getCollection(payload, ["data", "members", "coreMembers"]);
  }
}

export async function getProjects() {
  const payload = await request("/projects");
  return getCollection(payload, ["data", "projects"]);
}
