package com.fixitnow.backend.Model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long catId;
    private String catName, description;

    @OneToMany(mappedBy = "category")
    private List<Service> services;

    // Getters & Setters
    public Long getCatId() { return catId; }
    public void setCatId(Long catId) { this.catId = catId; }
    public String getCatName() { return catName; }
    public void setCatName(String catName) { this.catName = catName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<Service> getServices() { return services; }
    public void setServices(List<Service> services) { this.services = services; }
}