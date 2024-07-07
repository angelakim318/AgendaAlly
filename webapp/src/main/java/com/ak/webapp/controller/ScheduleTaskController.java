package com.ak.webapp.controller;

import com.ak.webapp.model.ScheduleTask;
import com.ak.webapp.service.ScheduleTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleTaskController {

    @Autowired
    private ScheduleTaskService scheduleTaskService;

    @PostMapping("/{date}/{startTime}/{endTime}")
    public ResponseEntity<ScheduleTask> createOrUpdateTask(@PathVariable String date, @PathVariable String startTime,
                                                           @PathVariable String endTime, @RequestBody String taskContent,
                                                           Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        LocalDate taskDate = LocalDate.parse(date);
        LocalTime taskStartTime = LocalTime.parse(startTime);
        LocalTime taskEndTime = LocalTime.parse(endTime);

        ScheduleTask task = scheduleTaskService.createOrUpdateTask(username, taskDate, taskStartTime, taskEndTime, taskContent);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/{date}")
    public ResponseEntity<List<ScheduleTask>> getTasksForDate(@PathVariable String date, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        LocalDate taskDate = LocalDate.parse(date);
        List<ScheduleTask> tasks = scheduleTaskService.getTasksForDate(username, taskDate);
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        scheduleTaskService.deleteTask(id, username);
        return ResponseEntity.ok().build();
    }
}
