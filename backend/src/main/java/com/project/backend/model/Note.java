package com.project.backend.model;
import jakarta.persistence.*;

@Entity
public class Note {
  @Id 
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String content;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "task_id")
  private Task task;

  // Constructors
  public Note() {}

  public Note(Long id, String content) {
    this.id = id;
    this.content = content;
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

  public Task getTask() { return task; }

  public void setTask(Task task) { 
    this.task = task; 
  }
}
