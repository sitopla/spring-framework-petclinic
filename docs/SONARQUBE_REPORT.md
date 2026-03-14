# SonarQube Code Quality Report — Spring Framework Petclinic

**Project:** Spring Framework Petclinic (`petclinic_legacy`)  
**SonarQube Version:** 26.1.0.118079  
**Report Date:** 2026-02-27  
**Quality Gate Status:** ✅ **PASSED (OK)**

---

## 1. Executive Summary

| Metric | Value |
|---|---|
| **Lines of Code** | 9,821 (12,634 total lines) |
| **Quality Gate** | ✅ OK |
| **Code Coverage** | 83.4% |
| **Unit Tests** | 75 (100% success rate) |
| **Technical Debt** | 109 min (~1h 49min) |
| **Technical Debt Ratio** | 0.0% |
| **Duplicated Lines** | 0.0% |
| **Cyclomatic Complexity** | 229 |
| **Cognitive Complexity** | 82 |

### Ratings

| Category | Rating | Description |
|---|---|---|
| **Maintainability** | 🟢 **A** | Excellent — minimal technical debt |
| **Reliability** | 🟡 **C** | Needs attention — bugs detected |
| **Security** | 🟢 **A** | Excellent — no vulnerabilities |

---

## 2. Issues Summary by Severity

| Severity | Count |
|---|---|
| 🔴 Blocker | **0** |
| 🟠 Critical | **1** |
| 🟡 Major | **26** |
| 🔵 Minor | **27** |
| ⚪ Info | **0** |
| **Total** | **54** |

---

## 3. Issues Breakdown by Type

| Type | Count |
|---|---|
| 🐛 Bugs | **3** |
| 🔓 Vulnerabilities | **0** |
| 🔧 Code Smells | **51** |
| 🔥 Security Hotspots | **0** |

---

## 4. Code Coverage Metrics

| Metric | Value | Threshold |
|---|---|---|
| **Line Coverage** | 83.4% | ≥ 80% ✅ |
| **Unit Tests** | 75 | — |
| **Test Success Rate** | 100% | — |
| **Test Errors** | 0 | — |
| **Test Failures** | 0 | — |

> ✅ Coverage meets the JaCoCo quality gate threshold of 80% line coverage.

---

## 5. Detailed Issue Analysis

### 5.1 🟠 CRITICAL Issues (1)

#### CRIT-1: Cognitive Complexity Too High
- **Rule:** `java:S3776` — Cognitive Complexity of methods should not be too high
- **File:** `src/main/java/org/springframework/samples/petclinic/repository/jdbc/OneToManyResultSetExtractor.java`
- **Line:** 88
- **Message:** Refactor this method to reduce its Cognitive Complexity from **22** to the allowed **15**.
- **Impact:** MAINTAINABILITY (HIGH)
- **Recommendation:** Break down the method into smaller, focused helper methods. Extract complex conditions and reduce nesting depth.

---

### 5.2 🐛 BUG Issues (3)

#### BUG-1: Potential NullPointerException
- **Rule:** `java:S2259` — Null pointers should not be dereferenced
- **File:** `src/main/java/org/springframework/samples/petclinic/repository/jdbc/JdbcPetRepositoryImpl.java`
- **Lines:** 75–79
- **Severity:** MAJOR
- **Message:** A "NullPointerException" could be thrown; "single" is nullable here.
- **CWE:** [CWE-476 — NULL Pointer Dereference](https://cwe.mitre.org/data/definitions/476)
- **Recommendation:** Add null check before dereferencing the `single` variable.

#### BUG-2: Unbound Template Variable `petId`
- **Rule:** `java:S6856` — Bind template variable to a method parameter
- **File:** `src/main/java/org/springframework/samples/petclinic/web/PetController.java`
- **Line:** 99
- **Severity:** MAJOR
- **Message:** Bind template variable "petId" to a method parameter.
- **Recommendation:** Add `@PathVariable("petId")` annotation to the method parameter.

#### BUG-3: Unbound Template Variable `ownerId`
- **Rule:** `java:S6856` — Bind template variable to a method parameter
- **File:** `src/main/java/org/springframework/samples/petclinic/web/VisitController.java`
- **Line:** 75
- **Severity:** MAJOR
- **Message:** Bind template variable "ownerId" to a method parameter.
- **Recommendation:** Add `@PathVariable("ownerId")` annotation to the method parameter.

---

### 5.3 🟡 MAJOR Code Smells (Java) — Selected Highlights

| # | Rule | File | Line | Message |
|---|---|---|---|---|
| 1 | `java:S1192` | `JdbcOwnerRepositoryImpl.java` | 71 | Define a constant for duplicated string literal (×3) |
| 2 | `java:S1192` | `OneToManyResultSetExtractor.java` | 113 | Define a constant for duplicated string literal |
| 3 | `java:S107` | `OneToManyResultSetExtractor.java` | 70 | Constructor has too many parameters (8). Max allowed: 7 |
| 4 | `java:S3740` | `OneToManyResultSetExtractor.java` | 88 | Provide the parameterized type for this generic |
| 5 | `java:S3740` | `OneToManyResultSetExtractor.java` | 95 | Provide the parameterized type for this generic |
| 6 | `java:S3740` | `OneToManyResultSetExtractor.java` | 141 | Provide the parameterized type for this generic |

### 5.4 🟡 MAJOR Web/CSS Issues

| # | Rule | File | Line | Message |
|---|---|---|---|---|
| 1 | `Web:S6853` | `findOwners.jsp` | 17 | Form label must be associated with a control |
| 2 | `Web:S6853` | `createOrUpdatePetForm.jsp` | 24 | Form label must be associated with a control |
| 3 | `css:S4666` | `petclinic.css` | 7913 | Unexpected duplicate selector "h3, .h3" |
| 4 | `css:S4666` | `petclinic.css` | 7923 | Unexpected duplicate selector ".navbar" |
| 5 | `css:S125` | `petclinic.css` | 7957 | Remove commented out code |
| 6 | `css:S7924` | `petclinic.css` | 7974 | Text does not meet minimal contrast requirement |
| 7 | `css:S125` | `header.scss` | 40 | Remove commented out code |
| 8 | `css:S7924` | `header.scss` | 59 | Text does not meet minimal contrast requirement |
| 9 | `css:S125` | `typography.scss` | 53 | Remove commented out code |
| 10 | `css:S125` | `typography.scss` | 54 | Remove commented out code |

### 5.5 🔵 MINOR Issues (27)

| Rule | Count | Description |
|---|---|---|
| `java:S6212` | 24 | Use `var` instead of explicit type declaration |
| `java:S1130` | 3 | Remove unnecessary thrown exception declarations |

**Files affected by `java:S6212` (use `var`):**
- `PetclinicInitializer.java` (lines 56, 64, 77)
- `JdbcOwnerRepositoryImpl.java` (line 123)
- `JdbcPetRepositoryImpl.java` (line 83)
- `JdbcPetRowMapper.java` (line 32)
- `JdbcVisitRowMapper.java` (line 34)
- `OneToManyResultSetExtractor.java` (lines 90, 94, 96, 98, 101, 104, 109, 121, 129, 132, 134, 137, 139, 145, 146, 148, 149)

**Files affected by `java:S1130` (unnecessary throws):**
- `AbstractClinicServiceTests.java` (lines 153, 193)
- `PetTypeFormatterTests.java` (line 54)

---

## 6. Key Findings & Priority Actions

### 🔴 Priority 1 — Bugs (Fix Immediately)
1. **NullPointerException risk** in `JdbcPetRepositoryImpl.java` — potential runtime crash
2. **Unbound template variables** in `PetController.java` and `VisitController.java` — may cause 500 errors

### 🟠 Priority 2 — Critical Code Smells
3. **High Cognitive Complexity** (22 vs allowed 15) in `OneToManyResultSetExtractor.java` — hampers maintainability

### 🟡 Priority 3 — Major Code Smells & Web Issues
4. **Duplicated string literals** — extract to constants
5. **Raw generic types** — add type parameters
6. **Accessibility issues** — form labels and contrast ratios
7. **Commented-out code** — clean up CSS/SCSS files

### 🔵 Priority 4 — Minor Improvements
8. **Use `var` keyword** — modernize local variable declarations (24 instances)
9. **Remove unnecessary throws** — clean up test method signatures (3 instances)

---

## 7. Recommendations

1. **Immediate:** Fix the 3 bugs (NullPointerException, unbound template variables) to improve reliability rating from C to A.
2. **Short-term:** Refactor `OneToManyResultSetExtractor` to reduce cognitive complexity below 15.
3. **Medium-term:** Address major code smells (duplicated literals, raw types, constructor parameters).
4. **Ongoing:** Apply `var` keyword usage and clean up unnecessary throws declarations.
5. **Maintain:** Coverage is excellent at 83.4% — continue to maintain above 80% threshold.

---

*Report generated by SonarQube analysis via GitHub Copilot CLI.*
