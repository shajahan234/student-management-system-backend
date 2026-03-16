package office.com.service;

import office.com.dto.PaymentDTO;
import office.com.entity.PaymentDetails;
import office.com.entity.Student;
import office.com.repository.PaymentRepository;
import office.com.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Transactional
    public PaymentDTO addPayment(@NonNull Long studentId, Double amountPaid, String paymentMethod,
            String transactionId, String remarks) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Create payment details
        PaymentDetails payment = new PaymentDetails();
        payment.setStudent(student);
        payment.setAmountPaid(amountPaid);
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId(transactionId);
        payment.setRemarks(remarks);

        // Save payment
        PaymentDetails savedPayment = paymentRepository.save(payment);

        // Update student's fees
        student.setFeesPaid(student.getFeesPaid() + amountPaid);
        student.setRemainingFees(student.getTotalFees() - student.getFeesPaid());
        studentRepository.save(student);

        return convertToDTO(savedPayment);
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .sorted((p1, p2) -> p2.getPaymentDate().compareTo(p1.getPaymentDate()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByStudent(@NonNull Long studentId) {
        return paymentRepository.findByStudentIdOrderByPaymentDateDesc(studentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByMethod(String paymentMethod) {
        return paymentRepository.findByPaymentMethodOrderByPaymentDateDesc(paymentMethod)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findByPaymentDateBetweenOrderByPaymentDateDesc(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByStudentAndMethod(@NonNull Long studentId, String paymentMethod) {
        return paymentRepository.findByStudentIdAndPaymentMethodOrderByPaymentDateDesc(studentId, paymentMethod)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByStudentAndDateRange(@NonNull Long studentId, LocalDate startDate,
            LocalDate endDate) {
        return paymentRepository
                .findByStudentIdAndPaymentDateBetweenOrderByPaymentDateDesc(studentId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByMethodAndDateRange(String paymentMethod, LocalDate startDate,
            LocalDate endDate) {
        return paymentRepository
                .findByPaymentMethodAndPaymentDateBetweenOrderByPaymentDateDesc(paymentMethod, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByStudentMethodAndDateRange(@NonNull Long studentId, String paymentMethod,
            LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findByStudentIdAndPaymentMethodAndPaymentDateBetweenOrderByPaymentDateDesc(
                studentId, paymentMethod, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Double getTotalRevenue() {
        return paymentRepository.getTotalRevenue() != null ? paymentRepository.getTotalRevenue() : 0.0;
    }

    public Double getRevenueForDate(LocalDate date) {
        return paymentRepository.getRevenueForDate(date) != null
                ? paymentRepository.getRevenueForDate(date)
                : 0.0;
    }

    public Double getRevenueForDateRange(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.getRevenueForDateRange(startDate, endDate) != null
                ? paymentRepository.getRevenueForDateRange(startDate, endDate)
                : 0.0;
    }

    public Long getPaymentCount() {
        return paymentRepository.getPaymentCount() != null ? paymentRepository.getPaymentCount() : 0L;
    }

    public Long getPaymentCountForDate(LocalDate date) {
        return paymentRepository.getPaymentCountForDate(date) != null
                ? paymentRepository.getPaymentCountForDate(date)
                : 0L;
    }

    private PaymentDTO convertToDTO(PaymentDetails payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setStudentId(payment.getStudent().getId());
        dto.setStudentName(payment.getStudent().getName());
        dto.setStudentEmail(payment.getStudent().getEmail());
        dto.setAmountPaid(payment.getAmountPaid());
        dto.setPaymentDate(payment.getPaymentDate().atStartOfDay());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setTransactionId(payment.getTransactionId());
        dto.setRemarks(payment.getRemarks());
        return dto;
    }
}