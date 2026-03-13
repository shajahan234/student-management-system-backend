package office.com.controller;

import office.com.entity.Student;
import office.com.entity.PaymentDetails;
import office.com.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Student CRUD Endpoints
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student createdStudent = studentService.createStudent(student);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        if (student != null) {
            return new ResponseEntity<>(student, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody Student studentDetails) {
        Student updatedStudent = studentService.updateStudent(id, studentDetails);
        if (updatedStudent != null) {
            return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        boolean isDeleted = studentService.deleteStudent(id);
        if (isDeleted) {
            return new ResponseEntity<>("Student deleted successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);
    }

    // Student Search Endpoints
    @GetMapping("/search/name")
    public ResponseEntity<List<Student>> searchByName(@RequestParam String name) {
        List<Student> students = studentService.searchByName(name);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @GetMapping("/search/course")
    public ResponseEntity<List<Student>> searchByCourse(@RequestParam String course) {
        List<Student> students = studentService.searchByCourse(course);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @GetMapping("/search/city")
    public ResponseEntity<List<Student>> searchByCity(@RequestParam String city) {
        List<Student> students = studentService.searchByCity(city);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    // Payment Endpoints
    @PostMapping("/{studentId}/payments")
    public ResponseEntity<PaymentDetails> recordPayment(@PathVariable Long studentId,
            @Valid @RequestBody PaymentDetails paymentDetails) {
        PaymentDetails payment = studentService.recordPayment(studentId, paymentDetails);
        if (payment != null) {
            return new ResponseEntity<>(payment, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{studentId}/payments")
    public ResponseEntity<List<PaymentDetails>> getPaymentHistory(@PathVariable Long studentId) {
        List<PaymentDetails> payments = studentService.getPaymentHistoryByStudent(studentId);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    @GetMapping("/{studentId}/payments/{paymentId}")
    public ResponseEntity<PaymentDetails> getPaymentDetails(@PathVariable Long studentId,
            @PathVariable Long paymentId) {
        PaymentDetails payment = studentService.getPaymentDetailsById(paymentId);
        if (payment != null && payment.getStudent().getId().equals(studentId)) {
            return new ResponseEntity<>(payment, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{studentId}/payments/{paymentId}")
    public ResponseEntity<PaymentDetails> updatePayment(@PathVariable Long studentId,
            @PathVariable Long paymentId,
            @Valid @RequestBody PaymentDetails paymentDetails) {
        PaymentDetails updatedPayment = studentService.updatePayment(paymentId, paymentDetails);
        if (updatedPayment != null && updatedPayment.getStudent().getId().equals(studentId)) {
            return new ResponseEntity<>(updatedPayment, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{studentId}/payments/{paymentId}")
    public ResponseEntity<String> deletePayment(@PathVariable Long studentId, @PathVariable Long paymentId) {
        boolean isDeleted = studentService.deletePayment(paymentId);
        if (isDeleted) {
            return new ResponseEntity<>("Payment deleted successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Payment not found", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{studentId}/fees-summary")
    public ResponseEntity<FeesSummary> getFeesSummary(@PathVariable Long studentId) {
        Student student = studentService.getStudentById(studentId);
        if (student != null) {
            FeesSummary summary = new FeesSummary(
                    student.getTotalFees(),
                    student.getFeesPaid(),
                    student.getRemainingFees());
            return new ResponseEntity<>(summary, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Inner class for fees summary
    public static class FeesSummary {
        private Double totalFees;
        private Double feesPaid;
        private Double remainingFees;

        public FeesSummary(Double totalFees, Double feesPaid, Double remainingFees) {
            this.totalFees = totalFees;
            this.feesPaid = feesPaid;
            this.remainingFees = remainingFees;
        }

        public Double getTotalFees() {
            return totalFees;
        }

        public Double getFeesPaid() {
            return feesPaid;
        }

        public Double getRemainingFees() {
            return remainingFees;
        }
    }
}
