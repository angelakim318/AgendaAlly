package com.ak.webapp.controller;

import com.ak.webapp.dto.UserUpdateDto;
import com.ak.webapp.model.User;
import com.ak.webapp.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserUpdateDto userUpdateDto, Principal principal) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Ensure the user making the request is updating their own profile
            if (!user.getUsername().equals(principal.getName())) {
                throw new RuntimeException("Unauthorized");
            }

            user.setFirstName(userUpdateDto.getFirstName());
            user.setLastName(userUpdateDto.getLastName());

            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
