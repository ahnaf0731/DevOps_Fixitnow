package com.fixitnow.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long revId;
    private Integer rating; // 1-5
    private String comment;

    @OneToOne
    @JoinColumn(name = "book_id")
    private Booking booking;

    // Getters & Setters
    public Long getRevId() { return revId; }
    public void setRevId(Long revId) { this.revId = revId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
}