package college_management_backend.controller;

import college_management_backend.dto.EventRequest;
import college_management_backend.dto.EventResponse;
import college_management_backend.service.EventService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@SecurityRequirement(name = "bearerAuth")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }

    @GetMapping("/ordered")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<EventResponse>>
    getAllEventsOrderedByDate() {

        return ResponseEntity.ok(
                eventService.getAllEventsOrderedByDate()
        );
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                eventService.getEventById(eventId)
        );
    }

    @GetMapping("/created-by/{createdBy}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<EventResponse>>
    getEventsByCreatedBy(
            @PathVariable Long createdBy) {

        return ResponseEntity.ok(
                eventService.getEventsByCreatedBy(createdBy)
        );
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<EventResponse>>
    getEventsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                eventService.getEventsByStatus(status)
        );
    }

    @GetMapping("/status/{status}/ordered")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<EventResponse>>
    getEventsByStatusOrderedByDate(
            @PathVariable String status) {

        return ResponseEntity.ok(
                eventService.getEventsByStatusOrderedByDate(status)
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(eventService.createEvent(request));
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequest request) {

        return ResponseEntity.ok(
                eventService.updateEvent(eventId, request)
        );
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long eventId) {

        eventService.deleteEvent(eventId);

        return ResponseEntity.noContent().build();
    }
}