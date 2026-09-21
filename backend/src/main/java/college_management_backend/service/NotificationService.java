package college_management_backend.service;

import college_management_backend.dto.NotificationRequest;
import college_management_backend.dto.NotificationResponse;
import college_management_backend.entity.Notification;
import college_management_backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }

    public NotificationResponse createNotification(
            NotificationRequest request) {

        Notification notification =
                new Notification();

        notification.setUserId(request.getUserId());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setReadStatus(false);

        Notification saved =
                notificationRepository.save(notification);

        return convertToResponse(saved);
    }

    public List<NotificationResponse> getNotificationsByUser(
            Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse getNotificationById(
            Long notificationId) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        return convertToResponse(notification);
    }

    public NotificationResponse markAsRead(
            Long notificationId) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        notification.setReadStatus(true);

        Notification updated =
                notificationRepository.save(notification);

        return convertToResponse(updated);
    }

    private NotificationResponse convertToResponse(
            Notification notification) {

        NotificationResponse response =
                new NotificationResponse();

        response.setNotificationId(
                notification.getNotificationId());

        response.setUserId(
                notification.getUserId());

        response.setTitle(
                notification.getTitle());

        response.setMessage(
                notification.getMessage());

        response.setCreatedAt(
                notification.getCreatedAt());

        response.setReadStatus(
                notification.getReadStatus());

        return response;
    }
}