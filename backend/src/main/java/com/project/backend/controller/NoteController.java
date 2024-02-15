package com.project.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.project.backend.service.NoteService;
import com.project.backend.dto.NoteDto;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/notes")
public class NoteController {
  private final NoteService noteService;

  @Autowired
  public NoteController(NoteService noteService) {
    this.noteService = noteService;
  }

  @PostMapping("/task/{taskId}")
    public ResponseEntity<NoteDto> createOrUpdateNoteForTask(@PathVariable Long taskId, @RequestBody NoteDto noteDto) {
      NoteDto savedNoteDto = noteService.createOrUpdateNoteForTask(taskId, noteDto);
      return ResponseEntity.ok(savedNoteDto);
    }

  @GetMapping("/task/{taskId}")
  public ResponseEntity<NoteDto> getNoteByTaskId(@PathVariable Long taskId) {
    NoteDto noteDto = noteService.getNoteByTaskId(taskId);
    return ResponseEntity.ok(noteDto);
  }
}
