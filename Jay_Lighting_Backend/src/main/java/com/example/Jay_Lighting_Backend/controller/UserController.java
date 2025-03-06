package com.example.Jay_Lighting_Backend.controller;

import com.example.Jay_Lighting_Backend.model.User;
import com.example.Jay_Lighting_Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from any origin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody User user) {
        return userService.loginUser(user.getUsername(), user.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestParam String username, @RequestParam String newPassword) {
        if (userService.changePassword(username, newPassword)) {
            return ResponseEntity.ok("Password changed successfully");
        }
        return ResponseEntity.status(404).body("User not found");
    }
}
