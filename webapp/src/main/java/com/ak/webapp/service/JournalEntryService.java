package com.ak.webapp.service;

import com.ak.webapp.model.JournalEntry;
import com.ak.webapp.model.User;
import com.ak.webapp.repository.JournalEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class JournalEntryService {

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    public Optional<JournalEntry> findByUsernameAndDate(String username, LocalDateTime date) {
        return journalEntryRepository.findByUsernameAndDate(username, date);
    }

    public Optional<JournalEntry> findByUserAndDate(User user, LocalDateTime date) {
        return journalEntryRepository.findByUserAndDate(user, date);
    }

    public Optional<JournalEntry> findByIdAndUserUsername(Long id, String username) {
        return journalEntryRepository.findByIdAndUserUsername(id, username);
    }

    public JournalEntry save(JournalEntry journalEntry) {
        return journalEntryRepository.save(journalEntry);
    }

    public void delete(JournalEntry journalEntry) {
        journalEntryRepository.delete(journalEntry);
    }
}
