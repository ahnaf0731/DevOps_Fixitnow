package com.fixitnow.backend.Controller;

import com.fixitnow.backend.Repository.BookingRepository;
import com.fixitnow.backend.Model.Booking;
import com.fixitnow.backend.Model.Payment;
import com.fixitnow.backend.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
    @Autowired private PaymentRepository paymentRepo;
    @Autowired private BookingRepository bookingRepo;

    @PostMapping
    public Payment pay(@RequestBody Payment payment, @RequestParam Long bookId) {
        Booking booking = bookingRepo.findById(bookId).orElseThrow();
        payment.setBooking(booking);
        payment.setPayDate(java.time.LocalDate.now());
        return paymentRepo.save(payment);
    }

    @GetMapping("/booking/{bookId}")
    public Payment getByBooking(@PathVariable Long bookId) {
        return paymentRepo.findByBooking(bookingRepo.findById(bookId).orElseThrow());
    }
}