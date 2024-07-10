package com.ak.webapp.service;

import com.ak.webapp.model.ScheduleTask;
import com.ak.webapp.model.User;
import com.ak.webapp.repository.ScheduleTaskRepository;
import com.ak.webapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleTaskService {

    @Autowired
    private ScheduleTaskRepository scheduleTaskRepository;

    @Autowired
    private UserRepository userRepository;

    public ScheduleTask createOrUpdateTask(String username, LocalDate date, LocalTime startTime, LocalTime endTime, String taskContent) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Optional<ScheduleTask> existingTaskOpt = scheduleTaskRepository.findByUserAndDateAndStartTime(user, date, startTime);
            ScheduleTask task;
            if (existingTaskOpt.isPresent()) {
                task = existingTaskOpt.get();
                task.setTask(taskContent); // taskContent should be a plain string
                task.setEndTime(endTime);
            } else {
                task = new ScheduleTask(user, date, startTime, endTime, taskContent); // taskContent should be a plain string
            }
            return scheduleTaskRepository.save(task);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public ScheduleTask updateTask(Long id, String username, String taskDescription) {
        Optional<ScheduleTask> taskOpt = scheduleTaskRepository.findById(id);
        if (taskOpt.isPresent()) {
            ScheduleTask task = taskOpt.get();
            if (task.getUser().getUsername().equals(username)) {
                task.setTask(taskDescription); // taskDescription should be a plain string
                return scheduleTaskRepository.save(task);
            } else {
                throw new RuntimeException("Unauthorized");
            }
        } else {
            throw new RuntimeException("Task not found");
        }
    }

    public List<ScheduleTask> getTasksForDate(String username, LocalDate date) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return scheduleTaskRepository.findByUserAndDate(user, date);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void deleteTask(Long id, String username) {
        Optional<ScheduleTask> taskOpt = scheduleTaskRepository.findById(id);
        if (taskOpt.isPresent()) {
            ScheduleTask task = taskOpt.get();
            if (task.getUser().getUsername().equals(username)) {
                scheduleTaskRepository.delete(task);
            } else {
                throw new RuntimeException("Unauthorized");
            }
        } else {
            throw new RuntimeException("Task not found");
        }
    }
}
