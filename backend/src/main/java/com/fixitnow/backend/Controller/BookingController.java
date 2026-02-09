package com.fixitnow.backend.Controller;

import com.fixitnow.backend.Repository.BookingRepository;
import com.fixitnow.backend.Model.Booking;
import com.fixitnow.backend.Model.Service;
import com.fixitnow.backend.Model.User;
import com.fixitnow.backend.Repository.ServiceRepository;
import com.fixitnow.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    @Autowired private BookingRepository bookingRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ServiceRepository serviceRepo;

    @PostMapping
    public ResponseEntity<?> book(@RequestBody Map<String, Object> payload) {
        try {
            Booking booking = new Booking();
            
            // Extract IDs from payload
            Long customerId = payload.get("customerId") != null ? 
                Long.valueOf(payload.get("customerId").toString()) : null;
            Long serviceId = payload.get("serId") != null ? 
                Long.valueOf(payload.get("serId").toString()) : null;
            Long providerId = payload.get("providerId") != null ? 
                Long.valueOf(payload.get("providerId").toString()) : null;
            
            if (customerId != null) {
                User customer = userRepo.findById(customerId).orElseThrow();
                booking.setCustomer(customer);
            }
            
            if (providerId != null) {
                User provider = userRepo.findById(providerId).orElseThrow();
                booking.setProvider(provider);
            }
            
            if (serviceId != null) {
                Service service = serviceRepo.findById(serviceId).orElseThrow();
                booking.setService(service);
            }
            
            // Set booking date
            String dateStr = (String) payload.get("bookingDate");
            if (dateStr != null && !dateStr.isEmpty()) {
                booking.setBookingDate(LocalDate.parse(dateStr));
            } else {
                booking.setBookingDate(LocalDate.now());
            }
            
            // Set status
            String status = (String) payload.get("status");
            booking.setStatus(status != null ? status : "PENDING");
            
            return ResponseEntity.ok(bookingRepo.save(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating booking: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyBookings(@RequestParam(required = false) Long userId, 
                                            @RequestParam(required = false) String role) {
        if (userId == null) {
            return ResponseEntity.ok(bookingRepo.findAll());
        }
        
        User user = userRepo.findById(userId).orElseThrow();
        
        if ("provider".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(bookingRepo.findByProvider(user));
        } else {
            return ResponseEntity.ok(bookingRepo.findByCustomer(user));
        }
    }

    @GetMapping("/customer/{customerId}")
    public List<Booking> getByCustomer(@PathVariable Long customerId) {
        User customer = userRepo.findById(customerId).orElseThrow();
        return bookingRepo.findByCustomer(customer);
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long bookingId, @RequestBody Map<String, String> payload) {
        try {
            Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            String newStatus = payload.get("status");
            if (newStatus != null && !newStatus.isEmpty()) {
                booking.setStatus(newStatus.toUpperCase());
                bookingRepo.save(booking);
                return ResponseEntity.ok(booking);
            }
            
            return ResponseEntity.badRequest().body("Status is required");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        try {
            Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            booking.setStatus("CANCELLED");
            bookingRepo.save(booking);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error cancelling booking: " + e.getMessage());
        }
    }
}