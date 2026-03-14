<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 (template) → 1.0.0
  Bump rationale: MAJOR — first ratification of project constitution.

  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (7 principles)
    - Technology & Architecture Constraints
    - Development Workflow & Quality Gates
    - Governance

  Removed sections: N/A

  Templates requiring updates:
    - .specify/templates/plan-template.md        ✅ compatible (Constitution Check section exists)
    - .specify/templates/spec-template.md         ✅ compatible (no constitution-specific tokens)
    - .specify/templates/tasks-template.md        ✅ compatible (phase structure aligns with principles)
    - .specify/templates/checklist-template.md    ✅ compatible (generic template)
    - .specify/templates/commands/               ✅ no command files exist

  Follow-up TODOs: none
-->

# Spring Framework Petclinic Constitution

## Core Principles

### I. Layered Architecture Integrity

Every change MUST respect the canonical 3-layer architecture
(Presentation → Service → Repository). Cross-layer calls MUST
follow this direction; no controller may access a repository
directly, and no repository may reference a controller or service.

- Presentation layer (`web/`): controllers, formatters, validators,
  JSP views and custom tags.
- Service layer (`service/`): business logic, transaction boundaries
  (`@Transactional`), and cache management (`@Cacheable`).
- Repository layer (`repository/`): data access via JDBC, JPA, or
  Spring Data JPA implementations selectable by Spring Profile.

**Rationale**: The project exists to demonstrate clean separation
of concerns in a traditional Spring MVC application. Violating
layer boundaries defeats its educational and architectural purpose.

### II. XML Configuration Fidelity

The application's Spring context MUST remain 100% XML-configured.
Introduction of `@Configuration` classes or Spring Boot
auto-configuration is prohibited unless explicitly approved via a
constitution amendment.

- Bean definitions reside in
  `src/main/resources/spring/*.xml`.
- New beans MUST be declared in the appropriate XML file
  (`business-config.xml`, `mvc-core-config.xml`, etc.).

**Rationale**: This fork's raison d'être is to maintain a plain
Spring Framework configuration style as a counterpoint to the
Spring Boot canonical version.

### III. Multi-Profile Persistence

The triple persistence strategy (JDBC, JPA, Spring Data JPA) MUST
be preserved. Any new repository operation MUST be implemented
across all three profiles or explicitly justified and documented
as a known gap.

- Profiles: `jdbc`, `jpa`, `spring-data-jpa`.
- Database drivers: H2 (default), HSQLDB, MySQL, PostgreSQL.
- Schema scripts MUST exist for every supported database under
  `src/main/resources/db/<db>/`.

**Rationale**: The multi-profile design is core to the project's
value as a teaching and comparison tool for persistence strategies.

### IV. Test-First Quality (NON-NEGOTIABLE)

All new or modified functionality MUST be accompanied by tests.

- Unit tests: JUnit 5 + Mockito + AssertJ.
- Controller tests: Spring `MockMvc` with `@WebMvcTest` or full
  context.
- Integration tests: MUST cover all three persistence profiles
  when data-access logic is changed.
- **JaCoCo coverage gates**: ≥ 80 % line coverage, ≥ 75 % branch
  coverage on new or modified code. Failure to meet these
  thresholds blocks merge.
- Red-Green-Refactor cycle SHOULD be followed; tests SHOULD fail
  before implementation is added.

**Rationale**: The project is CI-gated with SonarCloud and JaCoCo.
Insufficient test coverage degrades quality signals and community
trust.

### V. Observability & Structured Logging

- Every `@Service` and `@Controller` MUST use SLF4J
  (`@Slf4j` or explicit `LoggerFactory`).
- Public methods in services SHOULD log entry with relevant
  parameters at `INFO` or `DEBUG` level.
- All `catch` blocks MUST log the full stack trace via
  `log.error("descriptive message", exception)`.
- The `CallMonitoringAspect` (JMX) MUST remain active for
  runtime invocation metrics.

**Rationale**: Operational visibility is required for a
demonstrative application and aligns with enterprise-grade
monitoring expectations.

### VI. Internationalization Completeness

Any user-facing string added to JSP views MUST be externalized
into the message bundles (`messages*.properties`) for all
supported locales: default, `en`, `de`, `es`.

**Rationale**: The project advertises i18n support; incomplete
translations break the contract with contributors and users.

### VII. Simplicity & YAGNI

- New dependencies MUST solve a demonstrated need; speculative
  additions are rejected.
- Complexity MUST be justified in the PR description when adding
  cross-cutting concerns, new Maven profiles, or AOP aspects.
- Prefer standard Spring mechanisms over third-party libraries
  when Spring provides equivalent functionality.

**Rationale**: As a reference application, unnecessary complexity
hinders its educational value.

## Technology & Architecture Constraints

- **Java version**: 17+ (enforced by `maven-enforcer-plugin`).
- **Framework**: Spring Framework 7.x (non-Boot). No Spring Boot
  starters permitted.
- **Build tool**: Apache Maven ≥ 3.8.4 with Maven Wrapper.
- **Packaging**: WAR deployed to Jetty/Tomcat.
- **View technology**: JSP + JSTL + custom `.tag` files. No SPA
  frameworks (React, Angular, Vue) in the main branch.
- **CSS pipeline**: SCSS compiled via `libsass-maven-plugin`
  (profile `css`).
- **Containerization**: Google Jib only — no hand-written
  Dockerfiles.
- **CI/CD**: GitHub Actions (`maven-build-main.yml`,
  `maven-build-pull-request.yml`). SonarCloud + JaCoCo analysis
  on every push to `main`.
- **Dependency updates**: Dependabot monthly for Maven.

## Development Workflow & Quality Gates

### Branching & Commits

- Feature branches MUST originate from `main`.
- Commit messages MUST follow Conventional Commits
  (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
- Squash-merge to `main` is the default merge strategy.

### Pre-Merge Quality Gates

| Gate | Tool | Threshold |
|------|------|-----------|
| Compilation | `mvn compile` (JDK 17 + 21 matrix) | Zero errors |
| Unit & Integration Tests | `mvn verify` | All pass |
| Line Coverage | JaCoCo | ≥ 80 % |
| Branch Coverage | JaCoCo | ≥ 75 % |
| Static Analysis | SonarCloud | Quality Gate pass |
| Bean Validation | Hibernate Validator 9.x | Zero violations |

### Code Review Requirements

- Every PR MUST be reviewed by at least one maintainer.
- Reviewer MUST verify constitution compliance (layer boundaries,
  XML config, multi-profile persistence, test coverage).
- Reviewer SHOULD run `mvn verify` locally before approving.

## Governance

This constitution is the supreme governing document for the
Spring Framework Petclinic project. It supersedes informal
practices, ad-hoc decisions, and individual preferences.

### Amendment Procedure

1. Propose changes via a PR modifying
   `.specify/memory/constitution.md`.
2. The PR description MUST include: rationale, impacted principles,
   and a migration plan for existing code if applicable.
3. At least two maintainers MUST approve the amendment PR.
4. Upon merge, the `CONSTITUTION_VERSION` MUST be incremented
   following semantic versioning:
   - **MAJOR**: Principle removal or backward-incompatible
     redefinition.
   - **MINOR**: New principle, section, or material expansion.
   - **PATCH**: Clarifications, typo fixes, non-semantic changes.

### Compliance Review

- Constitution compliance MUST be checked at the start of every
  implementation plan (see `plan-template.md` → Constitution
  Check).
- Violations discovered in existing code SHOULD be filed as issues
  with the label `constitution-debt`.

### Runtime Guidance

For day-to-day development guidance, refer to:
- `docs/TECHNOLOGY_STACK_ES.md` — technology decisions.
- `docs/ARCHITECTURE_ES.md` — architectural patterns.
- `docs/FUNCTIONAL_REQUIREMENTS_ES.md` — feature scope.
- `readme.md` — setup and contribution instructions.

**Version**: 1.0.0 | **Ratified**: 2026-03-14 | **Last Amended**: 2026-03-14
