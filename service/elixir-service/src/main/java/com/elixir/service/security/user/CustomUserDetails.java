package com.elixir.service.security.user;

import com.elixir.service.user.entity.User;
import com.elixir.service.user.entity.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    public Long getId() {
        return user.getId();
    }

    public String getName() {
        return user.getName();
    }

    public User getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserStatus.ACTIVE.equals(user.getStatus());
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserStatus.ACTIVE.equals(user.getStatus());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserStatus.ACTIVE.equals(user.getStatus());
    }

    @Override
    public boolean isEnabled() {
        return UserStatus.ACTIVE.equals(user.getStatus());
    }
}