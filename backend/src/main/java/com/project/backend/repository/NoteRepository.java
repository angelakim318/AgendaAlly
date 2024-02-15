package com.project.backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.backend.model.Note;

public interface NoteRepository extends JpaRepository<Note, Long>{
  
  Optional<Note> findByTaskId(Long taskId);

}
