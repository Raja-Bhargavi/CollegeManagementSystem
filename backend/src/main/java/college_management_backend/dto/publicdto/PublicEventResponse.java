
package college_management_backend.dto.publicdto;

import college_management_backend.entity.Event;

import java.time.LocalDateTime;

public class PublicEventResponse {

    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private String category;
    private Long departmentId;

    public PublicEventResponse() {
    }

    public PublicEventResponse(Event event) {
        this.eventId = event.getEventId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.eventDate = event.getEventDate();
        this.location = event.getLocation();
        this.category = event.getCategory();
        this.departmentId = event.getDepartmentId();
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}
