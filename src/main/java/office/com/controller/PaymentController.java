package office.com.controller;

import office.com.dto.PaymentDTO;
import office.com.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStudent(@PathVariable Long studentId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByStudent(studentId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/method/{paymentMethod}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByMethod(@PathVariable String paymentMethod) {
        List<PaymentDTO> payments = paymentService.getPaymentsByMethod(paymentMethod);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PaymentDTO> payments = paymentService.getPaymentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/student/{studentId}/method/{paymentMethod}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStudentAndMethod(
            @PathVariable Long studentId,
            @PathVariable String paymentMethod) {
        List<PaymentDTO> payments = paymentService.getPaymentsByStudentAndMethod(studentId, paymentMethod);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/student/{studentId}/date-range")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStudentAndDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PaymentDTO> payments = paymentService.getPaymentsByStudentAndDateRange(studentId, startDate, endDate);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/method/{paymentMethod}/date-range")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByMethodAndDateRange(
            @PathVariable String paymentMethod,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PaymentDTO> payments = paymentService.getPaymentsByMethodAndDateRange(paymentMethod, startDate, endDate);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/student/{studentId}/method/{paymentMethod}/date-range")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStudentMethodAndDateRange(
            @PathVariable Long studentId,
            @PathVariable String paymentMethod,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PaymentDTO> payments = paymentService.getPaymentsByStudentMethodAndDateRange(
                studentId, paymentMethod, startDate, endDate);
        return ResponseEntity.ok(payments);
    }

    @PostMapping
    public ResponseEntity<PaymentDTO> addPayment(@RequestBody PaymentDTO paymentDTO) {
        PaymentDTO savedPayment = paymentService.addPayment(
                paymentDTO.getStudentId(),
                paymentDTO.getAmountPaid(),
                paymentDTO.getPaymentMethod(),
                paymentDTO.getTransactionId(),
                paymentDTO.getRemarks());
        return ResponseEntity.ok(savedPayment);
    }

    @GetMapping("/revenue/total")
    public ResponseEntity<Double> getTotalRevenue() {
        Double totalRevenue = paymentService.getTotalRevenue();
        return ResponseEntity.ok(totalRevenue);
    }

    @GetMapping("/revenue/date/{date}")
    public ResponseEntity<Double> getRevenueForDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Double revenue = paymentService.getRevenueForDate(date);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/revenue/date-range")
    public ResponseEntity<Double> getRevenueForDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Double revenue = paymentService.getRevenueForDateRange(startDate, endDate);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getPaymentCount() {
        Long count = paymentService.getPaymentCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/date/{date}")
    public ResponseEntity<Long> getPaymentCountForDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long count = paymentService.getPaymentCountForDate(date);
        return ResponseEntity.ok(count);
    }
}