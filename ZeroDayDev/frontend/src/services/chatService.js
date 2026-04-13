import { request } from "./httpClient.js";


export function getRooms() {
  return request("/chat/rooms", { auth: true });
}


export function getMessages(room = "general") {
  return request(`/chat/${room}/history`, { auth: true });
}


export function sendMessage(room, message) {
  return request(`/chat/${room}/message`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ message })
  });
}