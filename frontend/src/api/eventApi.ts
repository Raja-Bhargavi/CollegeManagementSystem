import api from "./axios";

export interface Event {
  eventId: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  createdBy: number;
  status: string;
}

export interface EventRequest {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  createdBy: number;
  status: string;
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get("/events");
  return response.data;
};

export const getEventById = async (
  eventId: number
): Promise<Event> => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

export const createEvent = async (
  data: EventRequest
): Promise<Event> => {
  const response = await api.post("/events", data);
  return response.data;
};

export const updateEvent = async (
  eventId: number,
  data: EventRequest
): Promise<Event> => {
  const response = await api.put(`/events/${eventId}`, data);
  return response.data;
};

export const deleteEvent = async (
  eventId: number
): Promise<void> => {
  await api.delete(`/events/${eventId}`);
};