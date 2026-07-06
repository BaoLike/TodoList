package com.bao.todolist.service;

import com.bao.todolist.exception.ResourceNotFoundException;
import com.bao.todolist.model.Todo;
import com.bao.todolist.model.TodoPriority;
import com.bao.todolist.model.TodoStatus;
import com.bao.todolist.model.User;
import com.bao.todolist.model.dto.TodoRequest;
import com.bao.todolist.model.dto.TodoResponse;
import com.bao.todolist.model.dto.UpdateStatusRequest;
import com.bao.todolist.repository.TodoRepository;
import com.bao.todolist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public Page<TodoResponse> getTodos(String username, TodoStatus status, TodoPriority priority, String keyword, Pageable pageable) {
        User user = getUser(username);
        String keywordPattern = (keyword != null && !keyword.isBlank())
                ? "%" + keyword.toLowerCase() + "%"
                : "%";
        return todoRepository.findByFilters(user.getId(), status, priority, keywordPattern, pageable)
                .map(this::toResponse);
    }

    public TodoResponse getById(String username, Long id) {
        Todo todo = findTodoForUser(username, id);
        return toResponse(todo);
    }

    @Transactional
    public TodoResponse create(String username, TodoRequest request) {
        User user = getUser(username);
        Todo todo = Todo.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : com.bao.todolist.model.TodoPriority.MEDIUM)
                .user(user)
                .build();
        return toResponse(todoRepository.save(todo));
    }

    @Transactional
    public TodoResponse update(String username, Long id, TodoRequest request) {
        Todo todo = findTodoForUser(username, id);
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        if (request.getPriority() != null) {
            todo.setPriority(request.getPriority());
        }
        return toResponse(todoRepository.save(todo));
    }

    @Transactional
    public TodoResponse updateStatus(String username, Long id, UpdateStatusRequest request) {
        Todo todo = findTodoForUser(username, id);
        todo.setStatus(request.getStatus());
        return toResponse(todoRepository.save(todo));
    }

    @Transactional
    public void delete(String username, Long id) {
        Todo todo = findTodoForUser(username, id);
        todoRepository.delete(todo);
    }

    private Todo findTodoForUser(String username, Long id) {
        User user = getUser(username);
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Todo not found with id: " + id);
        }
        return todo;
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private TodoResponse toResponse(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .status(todo.getStatus())
                .priority(todo.getPriority())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }
}
