package college_management_backend.service;

import college_management_backend.dto.EventRequest;
import college_management_backend.dto.EventResponse;
import college_management_backend.entity.Event;
import college_management_backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(EventResponse::new)
                .toList();
    }

    public List<EventResponse> getAllEventsOrderedByDate() {
        return eventRepository.findAllByOrderByEventDateAsc()
                .stream()
                .map(EventResponse::new)
                .toList();
    }

    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        return new EventResponse(event);
    }

    public List<EventResponse> getEventsByCreatedBy(Long createdBy) {
        return eventRepository.findByCreatedBy(createdBy)
                .stream()
                .map(EventResponse::new)
                .toList();
    }

    public List<EventResponse> getEventsByStatus(String status) {
        return eventRepository.findByStatus(status)
                .stream()
                .map(EventResponse::new)
                .toList();
    }

    public List<EventResponse> getEventsByStatusOrderedByDate(
            String status) {

        return eventRepository.findByStatusOrderByEventDateAsc(status)
                .stream()
                .map(EventResponse::new)
                .toList();
    }

    public EventResponse createEvent(EventRequest request) {

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setCreatedBy(request.getCreatedBy());
        event.setStatus(request.getStatus());

        Event savedEvent = eventRepository.save(event);

        return new EventResponse(savedEvent);
    }

    public EventResponse updateEvent(
            Long eventId,
            EventRequest request) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setCreatedBy(request.getCreatedBy());
        event.setStatus(request.getStatus());

        Event updatedEvent = eventRepository.save(event);

        return new EventResponse(updatedEvent);
    }

    public void deleteEvent(Long eventId) {

        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }

        eventRepository.deleteById(eventId);
    }
}