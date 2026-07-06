package com.bao.todolist.model.dto;

import com.bao.todolist.model.TodoStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private TodoStatus status;
}
