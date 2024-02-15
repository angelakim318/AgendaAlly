package com.project.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.backend.model.Task;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
  
  List<Task> findByUserId(Long userId);
  
}
