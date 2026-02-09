package com.fixitnow.backend.Model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payId;
    private Double amount;
    private String payMethod;
    private LocalDate payDate;
    private String status; // SUCCESS, FAILED, PENDING

    @OneToOne
    @JoinColumn(name = "book_id")
    private Booking booking;

    // Getters & Setters
    public Long getPayId() { return payId; }
    public void setPayId(Long payId) { this.payId = payId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getPayMethod() { return payMethod; }
    public void setPayMethod(String payMethod) { this.payMethod = payMethod; }
    public LocalDate getPayDate() { return payDate; }
    public void setPayDate(LocalDate payDate) { this.payDate = payDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
}