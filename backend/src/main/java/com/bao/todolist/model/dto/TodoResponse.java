package com.bao.todolist.model.dto;

import com.bao.todolist.model.TodoPriority;
import com.bao.todolist.model.TodoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoResponse {
    private Long id;
    private String title;
    private String description;
    private TodoStatus status;
    private TodoPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
