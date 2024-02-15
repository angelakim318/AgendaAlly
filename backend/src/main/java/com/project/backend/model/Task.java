package com.project.backend.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Task {
  public enum TaskStatus {
    PENDING, COMPLETED
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String title;
  private LocalDate date;

  @Enumerated(EnumType.STRING)
  private TaskStatus status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  @OneToOne(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private Note note;

  // Constructors
  public Task() {}

  public Task(Long id, String title, LocalDate date, TaskStatus status) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.status = status;
  }

  // Getters and Setters
  public Long getId() { return id; }

  public void setId(Long id) { 
    this.id = id; 
  }

  public String getTitle() { return title; }

  public void setTitle(String title) { 
    this.title = title; 
  }

  public LocalDate getDate() { return date; }

  public void setDate(LocalDate date) { 
    this.date = date; 
  }

  public TaskStatus getStatus() { return status; }

  public void setStatus(TaskStatus status) { 
    this.status = status; 
  }

  public User getUser() { return user; }

  public void setUser(User user) { 
    this.user = user; 
  }

  public Note getNote() { return note; }

  public void setNote(Note note) {
      this.note = note;
      note.setTask(this);
  }
}
