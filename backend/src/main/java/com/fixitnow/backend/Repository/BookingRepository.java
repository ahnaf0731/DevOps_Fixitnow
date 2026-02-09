package com.fixitnow.backend.Repository;

import com.fixitnow.backend.Model.Booking;
import com.fixitnow.backend.Model.Service;
import com.fixitnow.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(User customer);
    List<Booking> findByProvider(User provider);
    List<Booking> findByService(Service service);
}