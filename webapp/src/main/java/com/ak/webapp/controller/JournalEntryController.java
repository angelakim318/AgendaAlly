package com.ak.webapp.controller;

import com.ak.webapp.model.JournalEntry;
import com.ak.webapp.model.User;
import com.ak.webapp.respository.JournalEntryRepository;
import com.ak.webapp.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/journal")
public class JournalEntryController {

    @Autowired
    private JournalEntryRepository journalEntryRepository;

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
            Optional<JournalEntry> existingEntry = journalEntryRepository.findByUserAndDate(user, startOfDay);

            if (existingEntry.isPresent()) {
                JournalEntry updatedEntry = existingEntry.get();
                updatedEntry.setContent(journalEntry.getContent());
                journalEntryRepository.save(updatedEntry);
                return ResponseEntity.ok(updatedEntry);
            } else {
                journalEntry.setUser(user);
                journalEntry.setDate(startOfDay);
                JournalEntry savedEntry = journalEntryRepository.save(journalEntry);
                return ResponseEntity.status(HttpStatus.CREATED).body(savedEntry);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{date}")
    public ResponseEntity<JournalEntry> getEntry(@PathVariable String date, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        LocalDate entryDate = LocalDate.parse(date);
        LocalDateTime startOfDay = entryDate.atStartOfDay();
        System.out.println("Fetching entry for date: " + startOfDay);

        Optional<JournalEntry> journalEntry = journalEntryRepository.findByUsernameAndDate(username, startOfDay);
        journalEntry.ifPresent(entry -> System.out.println("Found journal entry: " + entry));

        return journalEntry.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }



    @PutMapping("/{id}")
    public ResponseEntity<JournalEntry> updateEntry(@PathVariable Long id, @RequestBody JournalEntry updatedEntry, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        Optional<JournalEntry> journalEntry = journalEntryRepository.findByIdAndUserUsername(id, username);
        if (journalEntry.isPresent()) {
            JournalEntry existingEntry = journalEntry.get();
            existingEntry.setContent(updatedEntry.getContent());
            journalEntryRepository.save(existingEntry);
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
        Optional<JournalEntry> journalEntry = journalEntryRepository.findByIdAndUserUsername(id, username);
        if (journalEntry.isPresent()) {
            journalEntryRepository.delete(journalEntry.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
