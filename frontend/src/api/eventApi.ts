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

// GET /api/events
export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get("/api/events");
  return response.data;
};

// GET /api/events/{eventId}
export const getEventById = async (
  eventId: number
): Promise<Event> => {
  const response = await api.get(
    `/api/events/${eventId}`
  );

  return response.data;
};

// GET /api/events/ordered
export const getEventsOrdered = async (): Promise<Event[]> => {
  const response = await api.get(
    "/api/events/ordered"
  );

  return response.data;
};

// GET /api/events/creator/{createdBy}
export const getEventsByCreator = async (
 createdBy: number
): Promise<Event[]> => {
  const response = await api.get(
    `/api/events/creator/${createdBy}`
  );

  return response.data;
};

// GET /api/events/status/{status}
export const getEventsByStatus = async (
  status: string
): Promise<Event[]> => {
  const response = await api.get(
    `/api/events/status/${status}`
  );

  return response.data;
};

// GET /api/events/status/{status}/ordered
export const getEventsByStatusOrdered = async (
  status: string
): Promise<Event[]> => {
  const response = await api.get(
    `/api/events/status/${status}/ordered`
  );

  return response.data;
};

// POST /api/events
export const createEvent = async (
  data: EventRequest
): Promise<Event> => {
  const response = await api.post(
    "/api/events",
    data
  );

  return response.data;
};

// PUT /api/events/{eventId}
export const updateEvent = async (
  eventId: number,
  data: EventRequest
): Promise<Event> => {
  const response = await api.put(
    `/api/events/${eventId}`,
    data
  );

  return response.data;
};

// DELETE /api/events/{eventId}
export const deleteEvent = async (
  eventId: number
): Promise<void> => {
  await api.delete(`/api/events/${eventId}`);
};