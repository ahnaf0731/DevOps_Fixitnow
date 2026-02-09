package com.fixitnow.backend.Repository;

import com.fixitnow.backend.Model.Booking;
import com.fixitnow.backend.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Add this method to find payment by its booking
    Payment findByBooking(Booking booking);
}