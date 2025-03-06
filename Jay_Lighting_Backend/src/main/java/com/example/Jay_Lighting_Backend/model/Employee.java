package com.example.Jay_Lighting_Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long empId;
     private String name;
     private String address;
     private Long id_number;
     private Long phoneNo;
     private String email;

    public Long getId() {
        return empId;
    }

    public void setId(Long id) {
        this.empId = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Long getId_number() {
        return id_number;
    }

    public void setId_number(Long id_number) {
        this.id_number = id_number;
    }

    public Long getPhone_no() {
        return phoneNo;
    }

    public void setPhone_no(Long phone_no) {
        this.phoneNo = phone_no;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
