package com.project.backend.dto;

public class UserDto {
  private String firstName;
  private String username;

  // Constructors
  public UserDto() {}

  public UserDto(String firstName, String username) {
    this.firstName = firstName;
    this.username = username;
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
}
