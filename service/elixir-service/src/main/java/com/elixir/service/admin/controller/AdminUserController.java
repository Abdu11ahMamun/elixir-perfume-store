package com.elixir.service.admin.controller;

import com.elixir.service.common.dto.ApiResponse;
import com.elixir.service.user.dto.UserCreateRequest;
import com.elixir.service.user.dto.UserResponse;
import com.elixir.service.user.dto.UserUpdateRequest;
import com.elixir.service.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin Users", description = "Admin user management APIs")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    private final UserService userService;

    @Operation(summary = "Get all users", description = "Returns all non-deleted users.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            HttpServletRequest request
    ) {
        List<UserResponse> users = userService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Users retrieved successfully",
                        users,
                        request.getRequestURI()
                )
        );
    }

    @Operation(summary = "Get user by id", description = "Returns a user by id.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        UserResponse user = userService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User retrieved successfully",
                        user,
                        request.getRequestURI()
                )
        );
    }

    @Operation(summary = "Create user", description = "Creates a new admin or customer user.")
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody UserCreateRequest requestBody,
            HttpServletRequest request
    ) {
        UserResponse user = userService.create(requestBody);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        "User created successfully",
                        user,
                        request.getRequestURI()
                ));
    }

    @Operation(summary = "Update user", description = "Updates an existing user without changing password.")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest requestBody,
            HttpServletRequest request
    ) {
        UserResponse user = userService.update(id, requestBody);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User updated successfully",
                        user,
                        request.getRequestURI()
                )
        );
    }

    @Operation(summary = "Toggle user status", description = "Toggles user status between ACTIVE and BLOCKED.")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        UserResponse user = userService.toggleStatus(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User status updated successfully",
                        user,
                        request.getRequestURI()
                )
        );
    }

    @Operation(summary = "Delete user", description = "Soft deletes a user.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}