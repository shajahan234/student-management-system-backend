package office.com.repository;

import office.com.entity.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, Long> {
    List<PaymentDetails> findByStudentId(Long studentId);

    List<PaymentDetails> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    List<PaymentDetails> findByStudentIdOrderByPaymentDateDesc(Long studentId);
}
