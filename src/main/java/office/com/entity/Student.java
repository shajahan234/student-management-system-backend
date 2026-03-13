package office.com.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import jakarta.validation.constraints.Email;
import java.util.List;

@Entity
@Data
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    @Column(length = 100)
    private String name;

    @NotNull(message = "Age is mandatory")
    @Positive(message = "Age must be a positive number")
    private Integer age;

    // Hibernate should treat this column as nullable during schema updates so that
    // adding it to an existing table with rows does not trigger a NOT NULL DDL
    // alteration (which previously resulted in a zero-date error). We enforce
    // non-null semantics at the service/controller layer instead of using
    // Bean Validation here, allowing the startup migration runner to populate
    // existing records.
    @Column(name = "joining_date", nullable = true)
    private java.time.LocalDate joiningDate;

    @NotBlank(message = "Course is mandatory")
    @Column(length = 100)
    private String course;

    @NotBlank(message = "Details is mandatory")
    @Column(columnDefinition = "TEXT")
    private String details;

    @NotBlank(message = "City is mandatory")
    @Column(length = 100)
    private String city;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    @Column(length = 100)
    private String email;

    @NotBlank(message = "Phone is mandatory")
    @Column(length = 15)
    private String phone;

    @NotNull(message = "Total fees is mandatory")
    @Positive(message = "Total fees must be a positive number")
    private Double totalFees;

    @NotNull(message = "Fees paid is mandatory")
    private Double feesPaid = 0.0;

    private Double remainingFees;

    @Column(columnDefinition = "TEXT")
    private String address;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<PaymentDetails> paymentHistory;

    // Constructors
    public Student() {
    }

    public Student(String name, Integer age, String course, String details, String city,
            String email, String phone, Double totalFees, String address) {
        this.name = name;
        this.age = age;
        this.course = course;
        this.details = details;
        this.city = city;
        this.email = email;
        this.phone = phone;
        this.totalFees = totalFees;
        this.feesPaid = 0.0;
        this.remainingFees = totalFees;
        this.address = address;
        this.joiningDate = java.time.LocalDate.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Double getTotalFees() {
        return totalFees;
    }

    public void setTotalFees(Double totalFees) {
        this.totalFees = totalFees;
        updateRemainingFees();
    }

    public Double getFeesPaid() {
        return feesPaid;
    }

    public void setFeesPaid(Double feesPaid) {
        this.feesPaid = feesPaid;
        updateRemainingFees();
    }

    public Double getRemainingFees() {
        return remainingFees;
    }

    public void setRemainingFees(Double remainingFees) {
        this.remainingFees = remainingFees;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public java.time.LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(java.time.LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public List<PaymentDetails> getPaymentHistory() {
        return paymentHistory;
    }

    public void setPaymentHistory(List<PaymentDetails> paymentHistory) {
        this.paymentHistory = paymentHistory;
    }

    private void updateRemainingFees() {
        this.remainingFees = this.totalFees - this.feesPaid;
        if (this.remainingFees < 0) {
            this.remainingFees = 0.0;
        }
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", course='" + course + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", totalFees=" + totalFees +
                ", feesPaid=" + feesPaid +
                ", remainingFees=" + remainingFees +
                ", city='" + city + '\'' +
                '}';
    }
}
