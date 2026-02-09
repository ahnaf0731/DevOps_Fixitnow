package com.fixitnow.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;
    private LocalDate bookingDate;
    private String status; // PENDING, CONFIRMED, COMPLETED

    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnoreProperties({"password", "bookings"})
    private User customer;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    @JsonIgnoreProperties({"password", "bookings"})
    private User provider;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ser_id")
    @JsonIgnoreProperties({"bookings"})
    private Service service;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"booking"})
    private Payment payment;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"booking"})
    private Review review;

    // Getters & Setters
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }
    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }
    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }
}