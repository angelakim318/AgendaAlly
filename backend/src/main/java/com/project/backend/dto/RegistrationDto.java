package com.project.backend.dto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class RegistrationDto {
  @NotEmpty(message = "First name is required")
  private String firstName;

  @NotEmpty(message = "Username is required")
  private String username;

  @NotEmpty(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters long")
  private String password;

  // Constructors
  public RegistrationDto() {}

  public RegistrationDto(String firstName, String username, String password) {
    this.firstName = firstName;
    this.username = username;
    this.password = password;
  }

  // Getters and Setters
  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
