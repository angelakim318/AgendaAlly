package com.project.backend.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import com.project.backend.model.Task;
import com.project.backend.service.TaskService;
import com.project.backend.dto.TaskDto;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/tasks")
public class TaskController {
  private final TaskService taskService;

  @Autowired
  public TaskController(TaskService taskService) {
    this.taskService = taskService;
  }

  @PostMapping
  public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto) {
    Task task = taskService.createTask(taskDto);
    TaskDto responseDto = new TaskDto();
    responseDto.setId(task.getId());
    responseDto.setTitle(task.getTitle());
    responseDto.setDate(task.getDate());
    responseDto.setStatus(task.getStatus().toString()); // Convert enum to string
    return ResponseEntity.ok(responseDto);  
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<TaskDto>> getTasksByUser(@PathVariable Long userId) {
      List<Task> tasks = taskService.getTasksByUser(userId);
      List<TaskDto> taskDtos = tasks.stream()
        .map(task -> {
          TaskDto dto = new TaskDto();
          dto.setId(task.getId());
          dto.setTitle(task.getTitle());
          dto.setDate(task.getDate());
          dto.setStatus(task.getStatus().toString());
          return dto;
      })
      .collect(Collectors.toList());
      return ResponseEntity.ok(taskDtos);
  }

  @PutMapping("/{taskId}")
  public ResponseEntity<TaskDto> updateTask(@PathVariable Long taskId, @RequestBody TaskDto taskDto) {
      Task updatedTask = taskService.updateTask(taskId, taskDto);
      TaskDto responseDto = new TaskDto();
      responseDto.setId(updatedTask.getId());
      responseDto.setTitle(updatedTask.getTitle());
      responseDto.setDate(updatedTask.getDate());
      responseDto.setStatus(updatedTask.getStatus().toString()); // Convert enum to string 
      return ResponseEntity.ok(responseDto);
  }

  @DeleteMapping("/{taskId}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
      taskService.deleteTask(taskId);
      return ResponseEntity.ok().build();
  }
}
