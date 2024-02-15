package com.project.backend.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.project.backend.model.User;
import com.project.backend.service.UserService;
import com.project.backend.dto.RegistrationDto;
import com.project.backend.dto.UserDto;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody RegistrationDto registrationDto) {
    User user = userService.registerUser(registrationDto);
    UserDto userDto = userService.toUserDto(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
  }

  @PutMapping("/{userId}")
  public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestBody UserDto userDto) {
    User updatedUser = userService.updateUserProfile(userId, userDto);
    return ResponseEntity.ok().body(userService.toUserDto(updatedUser));
  }

  @GetMapping("/{username}")
  public ResponseEntity<UserDto> findUserByUsername(@PathVariable String username) {
    return ResponseEntity.ok(userService.findUserByUsername(username));
  }
}
