package com.fixitnow.backend.Repository;

import com.fixitnow.backend.Model.Booking;
import com.fixitnow.backend.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Add this method to find a review by its booking
    Review findByBooking(Booking booking);
}