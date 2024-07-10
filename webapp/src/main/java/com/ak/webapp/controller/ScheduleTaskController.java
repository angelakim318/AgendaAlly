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
import java.util.Map;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleTaskController {

    @Autowired
    private ScheduleTaskService scheduleTaskService;

    @PostMapping("/{date}/{startTime}/{endTime}")
    public ResponseEntity<String> createOrUpdateTask(@PathVariable String date, @PathVariable String startTime,
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

        List<ScheduleTask> tasksForDate = scheduleTaskService.getTasksForDate(username, taskDate);

        boolean isOverlapping = tasksForDate.stream().anyMatch(task ->
                (taskStartTime.isBefore(task.getEndTime()) && taskEndTime.isAfter(task.getStartTime()))
        );

        if (isOverlapping) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The task overlaps with an existing task.");
        }

        ScheduleTask task = scheduleTaskService.createOrUpdateTask(username, taskDate, taskStartTime, taskEndTime, taskContent);
        return ResponseEntity.ok(task.toString());
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

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleTask> updateTask(@PathVariable Long id, @RequestBody Map<String, String> taskDescription,
                                                   Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        ScheduleTask task = scheduleTaskService.updateTask(id, username, taskDescription.get("description")); // taskDescription should be a plain string
        return ResponseEntity.ok(task);
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
