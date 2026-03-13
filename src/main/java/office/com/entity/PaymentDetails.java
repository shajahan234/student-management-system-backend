package office.com.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Entity
@Table(name = "payment_details")
public class PaymentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonBackReference
    private Student student;

    @NotNull(message = "Payment date is mandatory")
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @NotNull(message = "Amount paid is mandatory")
    @Positive(message = "Amount paid must be a positive number")
    @Column(name = "amount_paid")
    private Double amountPaid;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // CASH, CHEQUE, ONLINE, etc.

    @Column(name = "transaction_id", length = 100)
    private String transactionId; // For online payments

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    // Constructors
    public PaymentDetails() {
    }

    public PaymentDetails(Student student, LocalDate paymentDate, Double amountPaid, String paymentMethod) {
        this.student = student;
        this.paymentDate = paymentDate;
        this.amountPaid = amountPaid;
        this.paymentMethod = paymentMethod;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    @Override
    public String toString() {
        return "PaymentDetails{" +
                "id=" + id +
                ", paymentDate=" + paymentDate +
                ", amountPaid=" + amountPaid +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", transactionId='" + transactionId + '\'' +
                '}';
    }
}
