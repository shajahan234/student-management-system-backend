package office.com.repository;

import office.com.entity.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentDetails, Long> {

        // Find payments by student ID
        List<PaymentDetails> findByStudentIdOrderByPaymentDateDesc(Long studentId);

        // Find payments by payment method
        List<PaymentDetails> findByPaymentMethodOrderByPaymentDateDesc(String paymentMethod);

        // Find payments by date range
        List<PaymentDetails> findByPaymentDateBetweenOrderByPaymentDateDesc(LocalDate startDate, LocalDate endDate);

        // Find payments by student ID and payment method
        List<PaymentDetails> findByStudentIdAndPaymentMethodOrderByPaymentDateDesc(Long studentId,
                        String paymentMethod);

        // Find payments by student ID and date range
        List<PaymentDetails> findByStudentIdAndPaymentDateBetweenOrderByPaymentDateDesc(
                        Long studentId, LocalDate startDate, LocalDate endDate);

        // Find payments by payment method and date range
        List<PaymentDetails> findByPaymentMethodAndPaymentDateBetweenOrderByPaymentDateDesc(
                        String paymentMethod, LocalDate startDate, LocalDate endDate);

        // Find payments by student ID, payment method, and date range
        List<PaymentDetails> findByStudentIdAndPaymentMethodAndPaymentDateBetweenOrderByPaymentDateDesc(
                        Long studentId, String paymentMethod, LocalDate startDate, LocalDate endDate);

        // Custom query to get total revenue
        @Query("SELECT SUM(p.amountPaid) FROM PaymentDetails p")
        Double getTotalRevenue();

        // Custom query to get revenue for a specific date
        @Query("SELECT SUM(p.amountPaid) FROM PaymentDetails p WHERE p.paymentDate = :date")
        Double getRevenueForDate(@Param("date") LocalDate date);

        // Custom query to get revenue for a date range
        @Query("SELECT SUM(p.amountPaid) FROM PaymentDetails p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
        Double getRevenueForDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

        // Custom query to get payment count
        @Query("SELECT COUNT(p) FROM PaymentDetails p")
        Long getPaymentCount();

        // Custom query to get payment count for a specific date
        @Query("SELECT COUNT(p) FROM PaymentDetails p WHERE p.paymentDate = :date")
        Long getPaymentCountForDate(@Param("date") LocalDate date);
}
