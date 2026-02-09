package com.fixitnow.backend.Controller;

import com.fixitnow.backend.Repository.CategoryRepository;
import com.fixitnow.backend.Model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {
    @Autowired private CategoryRepository categoryRepo;

    @GetMapping
    public List<Category> getAll() { return categoryRepo.findAll(); }

    @PostMapping
    public Category add(@RequestBody Category category) {
        return categoryRepo.save(category);
    }
}