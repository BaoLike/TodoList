package com.bao.todolist.controller;

import com.bao.todolist.model.TodoPriority;
import com.bao.todolist.model.TodoStatus;
import com.bao.todolist.model.dto.ApiResponse;
import com.bao.todolist.model.dto.TodoRequest;
import com.bao.todolist.model.dto.TodoResponse;
import com.bao.todolist.model.dto.UpdateStatusRequest;
import com.bao.todolist.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TodoResponse>>> getTodos(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) TodoStatus status,
            @RequestParam(required = false) TodoPriority priority,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TodoResponse> todos = todoService.getTodos(userDetails.getUsername(), status, priority, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.ok(todos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> getById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        TodoResponse todo = todoService.getById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok(todo));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoResponse>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TodoRequest request
    ) {
        TodoResponse created = todoService.create(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Todo created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody TodoRequest request
    ) {
        TodoResponse updated = todoService.update(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Todo updated", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TodoResponse>> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        TodoResponse updated = todoService.updateStatus(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        todoService.delete(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Todo deleted", null));
    }
}
