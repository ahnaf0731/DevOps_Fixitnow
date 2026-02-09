package com.fixitnow.backend.Repository;

import com.fixitnow.backend.Model.Category;
import com.fixitnow.backend.Model.Service;
import com.fixitnow.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByCategory(Category category);
    List<Service> findByProvider(User provider);
}