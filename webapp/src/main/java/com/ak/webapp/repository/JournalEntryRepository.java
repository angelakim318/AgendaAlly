package com.ak.webapp.repository;

import com.ak.webapp.model.JournalEntry;
import com.ak.webapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

    @Query("SELECT je FROM JournalEntry je WHERE je.user.username = :username AND je.date = :date")
    Optional<JournalEntry> findByUsernameAndDate(@Param("username") String username, @Param("date") LocalDateTime date);

    Optional<JournalEntry> findByUserAndDate(User user, LocalDateTime date);

    Optional<JournalEntry> findByIdAndUserUsername(Long id, String username);
}
