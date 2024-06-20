package com.ak.webapp.repository;

import com.ak.webapp.model.ScheduleTask;
import com.ak.webapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleTaskRepository extends JpaRepository<ScheduleTask, Long> {
    Optional<ScheduleTask> findByUserAndDateAndTime(User user, LocalDate date, LocalTime time);
    List<ScheduleTask> findByUserAndDate(User user, LocalDate date);
}
