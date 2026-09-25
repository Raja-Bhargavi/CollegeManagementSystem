package college_management_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import college_management_backend.dto.StudentRequest;
import college_management_backend.dto.StudentResponse;
import college_management_backend.entity.Student;
import college_management_backend.exception.DuplicateStudentException;
import college_management_backend.exception.StudentNotFoundException;
import college_management_backend.repository.StudentRepository;
import college_management_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentService(
            StudentRepository studentRepository,
            UserRepository userRepository) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public StudentResponse getStudentById(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with ID: " + studentId
                        )
                );

        return toResponse(student);
    }

    public List<StudentResponse> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse getStudentByUsername(String username) {

        Long userId = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "User not found: " + username
                        )
                )
                .getUserId();

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student profile not found for user: " + username
                        )
                );

        return toResponse(student);
    }

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {

        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateStudentException(
                    "Student with roll number "
                            + request.getRollNumber()
                            + " already exists"
            );
        }

        if (studentRepository.existsByUserId(request.getUserId())) {
            throw new DuplicateStudentException(
                    "User ID "
                            + request.getUserId()
                            + " is already linked to a student"
            );
        }

        Student student = new Student();

        student.setUserId(request.getUserId());
        student.setRollNumber(request.getRollNumber());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setPhone(request.getPhone());
        student.setProgramId(request.getProgramId());
        student.setAdmissionYear(request.getAdmissionYear());
        student.setCurrentSemester(request.getCurrentSemester());
        student.setStudentStatus(request.getStudentStatus());

        return toResponse(studentRepository.save(student));
    }

    @Transactional
    public StudentResponse updateStudent(
            Long studentId,
            StudentRequest request) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with ID: " + studentId
                        )
                );

        if (!student.getRollNumber().equals(request.getRollNumber())
                && studentRepository.existsByRollNumberAndStudentIdNot(
                        request.getRollNumber(),
                        studentId)) {

            throw new DuplicateStudentException(
                    "Student with roll number "
                            + request.getRollNumber()
                            + " already exists"
            );
        }

        // userId is intentionally not changed.
        student.setRollNumber(request.getRollNumber());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setPhone(request.getPhone());
        student.setProgramId(request.getProgramId());
        student.setAdmissionYear(request.getAdmissionYear());
        student.setCurrentSemester(request.getCurrentSemester());
        student.setStudentStatus(request.getStudentStatus());

        return toResponse(studentRepository.save(student));
    }

    @Transactional
    public StudentResponse deactivateStudent(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with ID: " + studentId
                        )
                );

        student.setStudentStatus("INACTIVE");

        return toResponse(studentRepository.save(student));
    }

    private StudentResponse toResponse(Student student) {

        return new StudentResponse(
                student.getStudentId(),
                student.getRollNumber(),
                student.getFirstName(),
                student.getLastName(),
                student.getDateOfBirth(),
                student.getGender(),
                student.getPhone(),
                student.getProgramId(),
                student.getAdmissionYear(),
                student.getCurrentSemester(),
                student.getStudentStatus()
        );
    }
}