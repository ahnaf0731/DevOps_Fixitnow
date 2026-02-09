package com.fixitnow.backend.Controller;

import com.fixitnow.backend.Repository.BookingRepository;
import com.fixitnow.backend.Model.Booking;
import com.fixitnow.backend.Model.Review;
import com.fixitnow.backend.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {
    @Autowired private ReviewRepository reviewRepo;
    @Autowired private BookingRepository bookingRepo;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Map<String, Object> payload) {
        try {
            Long bookingId = payload.get("bookingId") != null ? 
                Long.valueOf(payload.get("bookingId").toString()) : null;
            
            if (bookingId == null) {
                return ResponseEntity.badRequest().body("Booking ID is required");
            }
            
            Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            Review review = new Review();
            review.setBooking(booking);
            review.setRating(payload.get("rating") != null ? 
                Integer.valueOf(payload.get("rating").toString()) : 5);
            review.setComment((String) payload.get("comment"));
            
            return ResponseEntity.ok(reviewRepo.save(review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating review: " + e.getMessage());
        }
    }

    @GetMapping("/booking/{bookId}")
    public Review getByBooking(@PathVariable Long bookId) {
        return reviewRepo.findByBooking(bookingRepo.findById(bookId).orElseThrow());
    }
}