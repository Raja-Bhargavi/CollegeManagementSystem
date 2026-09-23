package college_management_backend.dto;

import college_management_backend.entity.Event;

import java.time.LocalDateTime;

public class EventResponse {

    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private Long createdBy;
    private String status;

    public EventResponse(Event event) {
        this.eventId = event.getEventId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.eventDate = event.getEventDate();
        this.location = event.getLocation();
        this.createdBy = event.getCreatedBy();
        this.status = event.getStatus();
    }

    public Long getEventId() {
        return eventId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public String getLocation() {
        return location;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public String getStatus() {
        return status;
    }
}
