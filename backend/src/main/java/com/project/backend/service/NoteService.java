package com.project.backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.backend.model.Note;
import com.project.backend.repository.NoteRepository;
import com.project.backend.dto.NoteDto;
import com.project.backend.model.Task;
import com.project.backend.repository.TaskRepository;

@Service
public class NoteService {
  private final NoteRepository noteRepository;
  private final TaskRepository taskRepository;

  @Autowired
  public NoteService(NoteRepository noteRepository, TaskRepository taskRepository) {
    this.noteRepository = noteRepository;
    this.taskRepository = taskRepository;
  }

  public NoteDto createOrUpdateNoteForTask(Long taskId, NoteDto noteDto) {
    Task task = taskRepository.findById(taskId)
      .orElseThrow(() -> new IllegalArgumentException("Task not found"));
    Note note = task.getNote();
    if (note == null) {
        note = new Note();
        task.setNote(note);
        note.setTask(task);
    }
    note.setContent(noteDto.getContent());
    Note savedNote = noteRepository.save(note);
    return new NoteDto(savedNote.getId(), savedNote.getContent(), taskId);
  }

  public NoteDto getNoteByTaskId(Long taskId) {
    Note note = noteRepository.findByTaskId(taskId)
      .orElseThrow(() -> new IllegalArgumentException("Note not found for task"));
    return new NoteDto(note.getId(), note.getContent(), taskId);
  }
}
