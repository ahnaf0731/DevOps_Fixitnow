package com.fixitnow.backend.Repository;

import com.fixitnow.backend.Model.Address;
import com.fixitnow.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AddressRepository extends JpaRepository<Address, Long> {
    Address findByUser(User user);
    /// It retrieves the address associated with a specific User. Spring Data JPA automatically implements this method based on naming conventions.
}