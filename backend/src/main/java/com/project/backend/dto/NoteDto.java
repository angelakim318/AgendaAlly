package com.project.backend.dto;

public class NoteDto {
  private Long id;
  private String content;
  private Long taskId;
  
  public NoteDto() {}

  public NoteDto(Long id, String content, Long taskId) {
    this.id = id;
    this.content = content;
    this.taskId = taskId;
  }

  // Getters and Setters
  public Long getId() { return id; }

  public void setId(Long id) { 
    this.id = id; 
  }

  public String getContent() { return content; }

  public void setContent(String content) { 
    this.content = content; 
  }

  public Long getTaskId() { return taskId; }

  public void setTask(Long taskId) { 
    this.taskId = taskId; 
  }
}
