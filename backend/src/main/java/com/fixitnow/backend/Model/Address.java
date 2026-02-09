package com.fixitnow.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addId;
    private String line1, city, district, country, postalCode;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters & Setters
    public Long getAddId() { return addId; }
    public void setAddId(Long addId) { this.addId = addId; }
    public String getLine1() { return line1; }
    public void setLine1(String line1) { this.line1 = line1; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}