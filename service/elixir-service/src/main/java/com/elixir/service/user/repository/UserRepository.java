package com.elixir.service.user.repository;

import com.elixir.service.user.entity.User;
import com.elixir.service.user.entity.UserRole;
import com.elixir.service.user.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByPhone(String phone);

	boolean existsByEmail(String email);

	Optional<User> findByPhone(String phone);

	Optional<User> findByEmail(String email);

	long countByRoleAndDeletedAtIsNull(UserRole role);

	long countByRoleAndStatusAndDeletedAtIsNullAndIdNot(UserRole role, UserStatus status, Long id);
}
