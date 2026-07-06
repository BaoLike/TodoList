package com.bao.todolist.repository;

import com.bao.todolist.model.Todo;
import com.bao.todolist.model.TodoPriority;
import com.bao.todolist.model.TodoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("""
            SELECT t FROM Todo t
            WHERE t.user.id = :userId
              AND (:status IS NULL OR t.status = :status)
              AND (:priority IS NULL OR t.priority = :priority)
              AND LOWER(t.title) LIKE :keyword
            """)
    Page<Todo> findByFilters(
            @Param("userId") Long userId,
            @Param("status") TodoStatus status,
            @Param("priority") TodoPriority priority,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
