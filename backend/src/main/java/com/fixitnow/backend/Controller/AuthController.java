package com.fixitnow.backend.Controller;

import com.fixitnow.backend.Model.User;
import com.fixitnow.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // React dev server
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // check duplicate email
        if (userRepo.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(409).body("Email already in use");
        }
        User saved = userRepo.save(user);
        // do not send password back
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User found = userRepo.findByEmail(user.getEmail());
        if (found == null || !found.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
        found.setPassword(null); // don’t leak password
        return ResponseEntity.ok(found);
    }
}
