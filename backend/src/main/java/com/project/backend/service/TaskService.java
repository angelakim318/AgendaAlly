package com.project.backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.project.backend.model.Task;
import com.project.backend.repository.TaskRepository;
import com.project.backend.dto.TaskDto;

@Service
public class TaskService {
  private final TaskRepository taskRepository;

  @Autowired
  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  public Task createTask(TaskDto taskDto) {
    Task task = new Task();
    task.setTitle(taskDto.getTitle());
    task.setDate(taskDto.getDate());
    task.setStatus(Task.TaskStatus.valueOf(taskDto.getStatus()));
    return taskRepository.save(task);
  }

  public List<Task> getTasksByUser(Long userId) {
    return taskRepository.findByUserId(userId);
  }

  public Task updateTask(Long taskId, TaskDto taskDto) {
    Task task = taskRepository.findById(taskId)
      .orElseThrow(() -> new IllegalArgumentException("Task not found"));
    task.setTitle(taskDto.getTitle());
    task.setDate(taskDto.getDate());
    task.setStatus(Task.TaskStatus.valueOf(taskDto.getStatus()));
    return taskRepository.save(task);
  }

  public void deleteTask(Long taskId) {
    taskRepository.deleteById(taskId);
  }
}
