package com.project.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.project.backend.model.User;
import com.project.backend.repository.UserRepository;
import com.project.backend.dto.RegistrationDto;
import com.project.backend.dto.UserDto;
import com.project.backend.exception.UserAlreadyExistsException;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;                             

  @Autowired
  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User registerUser(RegistrationDto registrationDto) {
    if (userRepository.findByUsername(registrationDto.getUsername()).isPresent()) {
      throw new UserAlreadyExistsException("User with username: " + registrationDto.getUsername() + " already exists");
    }
    
    if (!registrationDto.getPassword().equals(registrationDto.getConfirmPassword())) {
      throw new IllegalArgumentException("Passwords do not match");
    }
    User user = new User();
    user.setFirstName(registrationDto.getFirstName());
    user.setUsername(registrationDto.getUsername());
    user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
    return userRepository.save(user);
  }

  public User updateUserProfile(Long userId, UserDto userDto) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
    user.setFirstName(userDto.getFirstName());
    user.setUsername(userDto.getUsername());
    return userRepository.save(user);
  }

  public UserDto findUserByUsername(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
    return toUserDto(user);
  }

  public UserDto toUserDto(User user) {
    UserDto userDto = new UserDto();
    userDto.setFirstName(user.getFirstName());
    userDto.setUsername(user.getUsername());
    return userDto;
  }
}
