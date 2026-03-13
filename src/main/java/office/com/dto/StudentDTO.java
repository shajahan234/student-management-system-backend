package office.com.dto;

public class StudentDTO {
    private Long id;
    private String name;
    private Integer age;
    private String course;
    private String details;
    private Double feespaid;
    private String city;

    public StudentDTO() {
    }

    public StudentDTO(Long id, String name, Integer age, String course, String details, Double feespaid, String city) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.course = course;
        this.details = details;
        this.feespaid = feespaid;
        this.city = city;
    }

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

    public Double getFeespaid() {
        return feespaid;
    }

    public void setFeespaid(Double feespaid) {
        this.feespaid = feespaid;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
