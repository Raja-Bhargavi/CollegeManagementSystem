
package college_management_backend.service;

import college_management_backend.dto.NoticeRequest;
import college_management_backend.dto.NoticeResponse;
import college_management_backend.entity.Notice;
import college_management_backend.repository.NoticeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import college_management_backend.repository.DepartmentRepository;
import java.util.HashSet;

@Service
public class NoticeService {

    private static final Set<String> VALID_PROGRAM_LEVELS =
            Set.of("ALL", "BTECH", "MTECH");

    private final NoticeRepository noticeRepository;

    private final DepartmentRepository departmentRepository;

    public NoticeService(
        NoticeRepository noticeRepository,
        DepartmentRepository departmentRepository) {
        this.noticeRepository = noticeRepository;
        this.departmentRepository = departmentRepository;
        }

    public List<NoticeResponse> getAllNotices() {
        return noticeRepository.findAll()
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public NoticeResponse getNoticeById(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notice not found"
                ));

        return new NoticeResponse(notice);
    }

    public List<NoticeResponse> getNoticesByCreatedBy(Long createdBy) {
        return noticeRepository.findByCreatedBy(createdBy)
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public List<NoticeResponse> getNoticesByVisibility(String visibility) {
        return noticeRepository.findByVisibility(visibility)
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public List<NoticeResponse> getNoticesByStatus(String status) {
        return noticeRepository.findByStatus(status)
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public List<NoticeResponse> getNoticesByVisibilityAndStatus(
            String visibility,
            String status) {

        return noticeRepository
                .findByVisibilityAndStatus(visibility, status)
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public NoticeResponse createNotice(NoticeRequest request) {
        Notice notice = new Notice();
        applyRequest(notice, request);

        if ("PUBLISHED".equalsIgnoreCase(notice.getStatus())
                && notice.getPublishedAt() == null) {
            notice.setPublishedAt(LocalDateTime.now());
        }

        return new NoticeResponse(noticeRepository.save(notice));
    }

    public NoticeResponse updateNotice(
            Long noticeId,
            NoticeRequest request) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notice not found"
                ));

        applyRequest(notice, request);

        if ("PUBLISHED".equalsIgnoreCase(notice.getStatus())
                && notice.getPublishedAt() == null) {
            notice.setPublishedAt(LocalDateTime.now());
        }

        return new NoticeResponse(noticeRepository.save(notice));
    }

    private void applyRequest(Notice notice, NoticeRequest request) {
        notice.setTitle(request.getTitle().trim());
        notice.setContent(request.getContent());
        notice.setCreatedBy(request.getCreatedBy());
        notice.setPublishedAt(request.getPublishedAt());
        notice.setExpiryDate(request.getExpiryDate());
        notice.setVisibility(request.getVisibility().trim().toUpperCase());
        notice.setStatus(request.getStatus().trim().toUpperCase());

        String category = request.getCategory();

        notice.setCategory(
                category == null || category.isBlank()
                        ? "GENERAL"
                        : category.trim().toUpperCase()
        );

        String departmentScope = request.getDepartmentScope();

        if (departmentScope == null || departmentScope.isBlank()) {
        departmentScope = "ALL";
        }

        departmentScope = departmentScope.trim().toUpperCase(Locale.ROOT);

        if ("ALL".equals(departmentScope)) {
        notice.setDepartmentId(null);
        } else if ("SELECTED".equals(departmentScope)) {
        notice.setDepartmentId(null);
        } else {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Department scope must be ALL or SELECTED"
        );
        }

        String programLevel = request.getProgramLevel();

        if (programLevel == null || programLevel.isBlank()) {
            programLevel = "ALL";
        }

        programLevel = programLevel.trim().toUpperCase(Locale.ROOT);

        if (!VALID_PROGRAM_LEVELS.contains(programLevel)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Programme must be ALL, BTECH, or MTECH"
            );
        }

        if (request.getExpiryDate() != null
                && request.getPublishedAt() != null
                && request.getExpiryDate().isBefore(request.getPublishedAt())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Expiry date cannot be before the publication date"
            );
        }

        notice.setProgramLevel(programLevel);

        String scope = request.getDepartmentScope();

        if (scope == null || scope.isBlank()) {
        scope = "ALL";
        }

        scope = scope.trim().toUpperCase(Locale.ROOT);

        if (!Set.of("ALL", "SELECTED").contains(scope)) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Department scope must be ALL or SELECTED"
        );
        }

        Set<Long> selectedIds = new HashSet<>(
                request.getTargetDepartmentIds() == null
                        ? List.of()
                        : request.getTargetDepartmentIds()
        );

        if ("ALL".equals(scope)) {
        selectedIds.clear();
        } else {
        if (selectedIds.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Select at least one department"
                );
        }

        for (Long departmentId : selectedIds) {
                if (departmentId == null
                        || !departmentRepository.existsById(departmentId)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "One or more selected departments do not exist"
                );
                }
        }
        }

        notice.setDepartmentScope(scope);
        notice.setTargetDepartmentIds(selectedIds);
    }

    public void deleteNotice(Long noticeId) {
        if (!noticeRepository.existsById(noticeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Notice not found"
            );
        }

        noticeRepository.deleteById(noticeId);
    }

    public List<NoticeResponse> getStudentNotices() {
        return noticeRepository.findByStatus("PUBLISHED")
                .stream()
                .filter(notice -> notice.getVisibility() != null
                        && (
                        "STUDENT".equalsIgnoreCase(notice.getVisibility())
                        || "STUDENTS".equalsIgnoreCase(notice.getVisibility())
                        || "ALL".equalsIgnoreCase(notice.getVisibility())
                ))
                .filter(this::isNotExpired)
                .filter(this::isPublished)
                .map(NoticeResponse::new)
                .toList();
    }

    public List<NoticeResponse> getFacultyNotices() {
        return noticeRepository.findByStatus("PUBLISHED")
                .stream()
                .filter(notice -> notice.getVisibility() != null
                        && (
                        "FACULTY".equalsIgnoreCase(notice.getVisibility())
                        || "ALL".equalsIgnoreCase(notice.getVisibility())
                ))
                .filter(this::isNotExpired)
                .filter(this::isPublished)
                .map(NoticeResponse::new)
                .toList();
    }

    private boolean isNotExpired(Notice notice) {
        return notice.getExpiryDate() == null
                || !notice.getExpiryDate().isBefore(LocalDateTime.now());
    }

    private boolean isPublished(Notice notice) {
        return notice.getPublishedAt() == null
                || !notice.getPublishedAt().isAfter(LocalDateTime.now());
    }
}
