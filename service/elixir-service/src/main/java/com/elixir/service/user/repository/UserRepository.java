package com.elixir.service.user.repository;

import com.elixir.service.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByPhone(String phone);

	boolean existsByEmail(String email);

	Optional<User> findByPhone(String phone);

	Optional<User> findByEmail(String email);
}
