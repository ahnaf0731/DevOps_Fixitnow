package com.fixitnow.backend.Controller;

import com.fixitnow.backend.Repository.AddressRepository;
import com.fixitnow.backend.Model.Address;
import com.fixitnow.backend.Model.User;
import com.fixitnow.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {
    @Autowired private AddressRepository addressRepo;
    @Autowired private UserRepository userRepo;

    @PostMapping
    public Address add(@RequestBody Address address, @RequestParam Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        address.setUser(user);
        return addressRepo.save(address);
    }

    @GetMapping("/user/{userId}")
    public Address getByUser(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return addressRepo.findByUser(user);
    }
}