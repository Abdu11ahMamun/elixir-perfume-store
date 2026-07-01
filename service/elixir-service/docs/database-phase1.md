# ÉLIXIR Database Phase 1 Documentation

## Purpose

This document describes the approved Phase 1 database foundation for the ÉLIXIR Spring Boot backend.

Phase 1 includes only:

- Entities
- Enums
- Database schema
- Flyway baseline migration

It does not include repositories, services, controllers, DTOs, security, JWT, authentication, or business logic.

---

## Database Design Decisions

The database uses MySQL 8.

All business entities extend `BaseEntity`, which provides:

- `id`
- `created_at`
- `updated_at`
- `deleted_at`

Soft delete is supported through `deleted_at`.

Entity relationships are intentionally unidirectional for now.

Current relationships:

- Product → Category
- Product → OfferTag
- ProductSize → Product
- Order → User
- OrderItem → Order
- OrderItem → ProductSize

All `ManyToOne` relationships use `FetchType.LAZY`.

---

## Why Flyway Was Introduced

Flyway was introduced to make database schema changes version-controlled and repeatable.

Before Flyway, Hibernate `ddl-auto=update` was used to generate tables during development.

However, Hibernate `update` is not reliable for production schema management, especially for:

- column defaults
- check constraints
- column type changes
- repeatable migrations
- team-based development

Flyway ensures a new developer can clone the repository, run the application, and obtain the complete approved database schema.

---

## Why `validate` Replaces `update`

Hibernate `ddl-auto=update` can silently modify the database.

That is unsafe for production and team development.

The project now uses:

```properties
spring.jpa.hibernate.ddl-auto=validate