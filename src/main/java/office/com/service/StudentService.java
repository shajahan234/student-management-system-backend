package office.com.service;

import office.com.entity.Student;
import office.com.entity.PaymentDetails;
import office.com.repository.StudentRepository;
import office.com.repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;

    // Student CRUD Operations
    public Student createStudent(Student student) {
        // if the frontend provided an initial paid amount, keep it; otherwise default
        // to 0
        if (student.getFeesPaid() == null) {
            student.setFeesPaid(0.0);
        }
        // join date: if none supplied, set to today
        if (student.getJoiningDate() == null) {
            student.setJoiningDate(java.time.LocalDate.now());
        }
        // calculate remaining fees based on provided values
        student.setRemainingFees(student.getTotalFees() - student.getFeesPaid());
        if (student.getRemainingFees() < 0) {
            student.setRemainingFees(0.0);
        }
        return studentRepository.save(student);
    }

    public Student getStudentById(@NonNull Long id) {
        Optional<Student> student = studentRepository.findById(id);
        return student.orElse(null);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student updateStudent(@NonNull Long id, Student studentDetails) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            Student existingStudent = student.get();
            existingStudent.setName(studentDetails.getName());
            existingStudent.setAge(studentDetails.getAge());
            existingStudent.setCourse(studentDetails.getCourse());
            existingStudent.setDetails(studentDetails.getDetails());
            existingStudent.setCity(studentDetails.getCity());
            existingStudent.setEmail(studentDetails.getEmail());
            existingStudent.setPhone(studentDetails.getPhone());
            existingStudent.setAddress(studentDetails.getAddress());
            existingStudent.setTotalFees(studentDetails.getTotalFees());
            // allow feesPaid to be updated directly as part of the edit form
            if (studentDetails.getFeesPaid() != null) {
                existingStudent.setFeesPaid(studentDetails.getFeesPaid());
            }
            // recalc remaining fees after changes
            existingStudent.setRemainingFees(existingStudent.getTotalFees() - existingStudent.getFeesPaid());
            if (existingStudent.getRemainingFees() < 0) {
                existingStudent.setRemainingFees(0.0);
            }
            // update joining date if provided
            if (studentDetails.getJoiningDate() != null) {
                existingStudent.setJoiningDate(studentDetails.getJoiningDate());
            }
            return studentRepository.save(existingStudent);
        }
        return null;
    }

    public boolean deleteStudent(@NonNull Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Search Operations
    public List<Student> searchByName(String name) {
        return studentRepository.findByName(name);
    }

    public List<Student> searchByCourse(String course) {
        return studentRepository.findByCourse(course);
    }

    public List<Student> searchByCity(String city) {
        return studentRepository.findByCity(city);
    }

    // Payment Operations
    public PaymentDetails recordPayment(@NonNull Long studentId, PaymentDetails paymentDetails) {
        Optional<Student> student = studentRepository.findById(studentId);
        if (student.isPresent()) {
            Student existingStudent = student.get();
            paymentDetails.setStudent(existingStudent);

            // Update student fees
            existingStudent.setFeesPaid(existingStudent.getFeesPaid() + paymentDetails.getAmountPaid());
            existingStudent.setRemainingFees(existingStudent.getTotalFees() - existingStudent.getFeesPaid());

            studentRepository.save(existingStudent);
            return paymentDetailsRepository.save(paymentDetails);
        }
        return null;
    }

    public List<PaymentDetails> getPaymentHistoryByStudent(@NonNull Long studentId) {
        return paymentDetailsRepository.findByStudentIdOrderByPaymentDateDesc(studentId);
    }

    public List<PaymentDetails> getPaymentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return paymentDetailsRepository.findByPaymentDateBetween(startDate, endDate);
    }

    public PaymentDetails getPaymentDetailsById(@NonNull Long paymentId) {
        Optional<PaymentDetails> payment = paymentDetailsRepository.findById(paymentId);
        return payment.orElse(null);
    }

    public PaymentDetails updatePayment(@NonNull Long paymentId, PaymentDetails paymentDetails) {
        Optional<PaymentDetails> payment = paymentDetailsRepository.findById(paymentId);
        if (payment.isPresent()) {
            PaymentDetails existingPayment = payment.get();
            Student student = existingPayment.getStudent();

            // Recalculate fees
            student.setFeesPaid(
                    student.getFeesPaid() - existingPayment.getAmountPaid() + paymentDetails.getAmountPaid());
            student.setRemainingFees(student.getTotalFees() - student.getFeesPaid());

            existingPayment.setPaymentDate(paymentDetails.getPaymentDate());
            existingPayment.setAmountPaid(paymentDetails.getAmountPaid());
            existingPayment.setPaymentMethod(paymentDetails.getPaymentMethod());
            existingPayment.setTransactionId(paymentDetails.getTransactionId());
            existingPayment.setRemarks(paymentDetails.getRemarks());

            studentRepository.save(student);
            return paymentDetailsRepository.save(existingPayment);
        }
        return null;
    }

    public boolean deletePayment(@NonNull Long paymentId) {
        Optional<PaymentDetails> payment = paymentDetailsRepository.findById(paymentId);
        if (payment.isPresent()) {
            PaymentDetails existingPayment = payment.get();
            Student student = existingPayment.getStudent();

            // Recalculate fees
            student.setFeesPaid(student.getFeesPaid() - existingPayment.getAmountPaid());
            student.setRemainingFees(student.getTotalFees() - student.getFeesPaid());

            studentRepository.save(student);
            paymentDetailsRepository.deleteById(paymentId);
            return true;
        }
        return false;
    }

    public Double getTotalPaidByStudent(@NonNull Long studentId) {
        List<PaymentDetails> payments = getPaymentHistoryByStudent(studentId);
        return payments.stream().mapToDouble(PaymentDetails::getAmountPaid).sum();
    }

    public Double getRemainingFeesByStudent(@NonNull Long studentId) {
        Optional<Student> student = studentRepository.findById(studentId);
        return student.map(Student::getRemainingFees).orElse(0.0);
    }
}
