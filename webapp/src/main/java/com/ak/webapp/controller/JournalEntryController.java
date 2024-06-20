package com.ak.webapp.controller;

import com.ak.webapp.model.JournalEntry;
import com.ak.webapp.model.User;
import com.ak.webapp.repository.UserRepository;
import com.ak.webapp.service.JournalEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/journal")
public class JournalEntryController {

    @Autowired
    private JournalEntryService journalEntryService;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(JournalEntryController.class);

    @PostMapping("/{date}")
    public ResponseEntity<JournalEntry> createEntry(@PathVariable String date, @RequestBody JournalEntry journalEntry, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            LocalDate entryDate = LocalDate.parse(date);
            LocalDateTime startOfDay = entryDate.atStartOfDay();

            Optional<JournalEntry> existingEntry = journalEntryService.findByUserAndDate(user, startOfDay);

            if (existingEntry.isPresent()) {
                JournalEntry entryToUpdate = existingEntry.get();
                entryToUpdate.setContent(journalEntry.getContent());
                JournalEntry updatedEntry = journalEntryService.save(entryToUpdate);
                return ResponseEntity.ok(updatedEntry);
            } else {
                JournalEntry newEntry = new JournalEntry(user, startOfDay, journalEntry.getContent());
                JournalEntry savedEntry = journalEntryService.save(newEntry);
                return ResponseEntity.ok(savedEntry);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{date}")
    public ResponseEntity<?> getEntry(@PathVariable String date, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        LocalDate entryDate = LocalDate.parse(date);
        LocalDateTime startOfDay = entryDate.atStartOfDay();
        logger.debug("Fetching entry for date: " + startOfDay);

        Optional<JournalEntry> journalEntry = journalEntryService.findByUsernameAndDate(username, startOfDay);
        journalEntry.ifPresent(entry -> logger.debug("Found journal entry: " + entry));

        if (journalEntry.isPresent()) {
            return ResponseEntity.ok(journalEntry.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No journal entry found for the given date");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalEntry> updateEntry(@PathVariable Long id, @RequestBody JournalEntry updatedEntry, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        Optional<JournalEntry> journalEntry = journalEntryService.findByIdAndUserUsername(id, username);
        if (journalEntry.isPresent()) {
            JournalEntry existingEntry = journalEntry.get();
            existingEntry.setContent(updatedEntry.getContent());
            journalEntryService.save(existingEntry);
            return ResponseEntity.ok(existingEntry);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        Optional<JournalEntry> journalEntry = journalEntryService.findByIdAndUserUsername(id, username);
        if (journalEntry.isPresent()) {
            journalEntryService.delete(journalEntry.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
