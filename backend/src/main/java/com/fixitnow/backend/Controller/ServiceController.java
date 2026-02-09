// ServiceController.java
package com.fixitnow.backend.Controller;

import com.fixitnow.backend.Model.Service;
import com.fixitnow.backend.Repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    // ✅ GET: Get all services
    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    // ✅ GET: Get one service by ID
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Optional<Service> service = serviceRepository.findById(id);
        if (service.isPresent()) {
            return ResponseEntity.ok(service.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ POST: Create new service
    @PostMapping
    public Service createService(@RequestBody Service service) {
        return serviceRepository.save(service);
    }

    // ✅ PUT: Update service
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service updatedService) {
        if (!serviceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        updatedService.setSerId(id);
        Service saved = serviceRepository.save(updatedService);
        return ResponseEntity.ok(saved);
    }

    // ✅ DELETE: Delete service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        if (!serviceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        serviceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}