package college_management_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import college_management_backend.dto.StudentRequest;
import org.springframework.transaction.annotation.Transactional;

import college_management_backend.exception.DuplicateStudentException;

import college_management_backend.exception.StudentNotFoundException;
import college_management_backend.dto.StudentResponse;
import college_management_backend.entity.Student;
import college_management_backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public StudentResponse getStudentById(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
        new StudentNotFoundException(
                "Student not found with ID: " + studentId
        )
);

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

    public List<StudentResponse> getAllStudents() {

    List<Student> students = studentRepository.findAll();

    return students.stream()
            .map(student -> new StudentResponse(
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
            ))
            .collect(Collectors.toList());
        }

        @Transactional
        public StudentResponse createStudent(StudentRequest request) {

        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
                throw new DuplicateStudentException(
                        "Student with roll number " +
                        request.getRollNumber() +
                        " already exists"
                );
        }

        if (studentRepository.existsByUserId(request.getUserId())) {
                throw new DuplicateStudentException(
                        "User ID " +
                        request.getUserId() +
                        " is already linked to a student"
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

        Student savedStudent = studentRepository.save(student);

        return new StudentResponse(
                savedStudent.getStudentId(),
                savedStudent.getRollNumber(),
                savedStudent.getFirstName(),
                savedStudent.getLastName(),
                savedStudent.getDateOfBirth(),
                savedStudent.getGender(),
                savedStudent.getPhone(),
                savedStudent.getProgramId(),
                savedStudent.getAdmissionYear(),
                savedStudent.getCurrentSemester(),
                savedStudent.getStudentStatus()
        );
        }

        @Transactional
        public StudentResponse updateStudent(Long studentId, StudentRequest request) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found with ID: " + studentId
                        )
                );

        if (!student.getRollNumber().equals(request.getRollNumber())
                && studentRepository.existsByRollNumber(request.getRollNumber())) {

                throw new DuplicateStudentException(
                        "Student with roll number "
                                + request.getRollNumber()
                                + " already exists"
                );
        }

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

        Student updatedStudent = studentRepository.save(student);

        return new StudentResponse(
                updatedStudent.getStudentId(),
                updatedStudent.getRollNumber(),
                updatedStudent.getFirstName(),
                updatedStudent.getLastName(),
                updatedStudent.getDateOfBirth(),
                updatedStudent.getGender(),
                updatedStudent.getPhone(),
                updatedStudent.getProgramId(),
                updatedStudent.getAdmissionYear(),
                updatedStudent.getCurrentSemester(),
                updatedStudent.getStudentStatus()
        );
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

        Student updatedStudent = studentRepository.save(student);

        return new StudentResponse(
                updatedStudent.getStudentId(),
                updatedStudent.getRollNumber(),
                updatedStudent.getFirstName(),
                updatedStudent.getLastName(),
                updatedStudent.getDateOfBirth(),
                updatedStudent.getGender(),
                updatedStudent.getPhone(),
                updatedStudent.getProgramId(),
                updatedStudent.getAdmissionYear(),
                updatedStudent.getCurrentSemester(),
                updatedStudent.getStudentStatus()
        );
        }
}