# Plan: WCAG 2.1 Accessibility Compliance Analyzer Agent

## Problem Statement
Create a custom Copilot agent (`.github/agents/wcag_accessibility_analyzer.md`) that analyzes any codebase's web frontend for compliance with the **Web Content Accessibility Guidelines (WCAG) 2.1** — W3C Recommendation. The agent must evaluate the current state of accessibility in the code and propose concrete actions to achieve each conformance level: **A**, **AA**, and **AAA**.

## Approach
Build a single agent definition file following the existing agent format in `.github/agents/`. The agent will encode comprehensive WCAG 2.1 knowledge including:

### WCAG 2.1 Core Structure

#### 4 Principles (POUR)
1. **Perceivable** — Information and UI components must be presentable in ways users can perceive
2. **Operable** — UI components and navigation must be operable
3. **Understandable** — Information and UI operation must be understandable
4. **Robust** — Content must be robust enough for assistive technologies

#### 13 Guidelines
- **1.1** Text Alternatives | **1.2** Time-based Media | **1.3** Adaptable | **1.4** Distinguishable
- **2.1** Keyboard Accessible | **2.2** Enough Time | **2.3** Seizures | **2.4** Navigable | **2.5** Input Modalities
- **3.1** Readable | **3.2** Predictable | **3.3** Input Assistance
- **4.1** Compatible

#### 78 Success Criteria by Level
- **Level A** (30 criteria): Minimum accessibility — must satisfy for basic conformance
- **Level AA** (20 criteria): Addresses major accessibility barriers — recommended target for most sites, legal requirement in many jurisdictions (EU EN 301 549, US Section 508, Spain RD 1112/2018)
- **Level AAA** (28 criteria): Highest level — not recommended as blanket requirement for entire sites

### 3 Conformance Levels
| Level | Requirement | Typical Use |
|-------|-------------|-------------|
| **A** | All 30 Level A success criteria met | Minimum legal compliance |
| **AA** | All Level A + 20 Level AA criteria met | Standard target (EU, Spain RD 1112/2018) |
| **AAA** | All Level A + AA + 28 AAA criteria met | Maximum accessibility (selective application) |

### Key Differences from ENS/ENI Agents
- WCAG focuses on **frontend/UI/markup** (HTML, CSS, JS, JSP, Thymeleaf) rather than backend security or interoperability
- Success criteria are **technology-specific** — the agent must understand HTML semantics, ARIA roles, CSS contrast, keyboard interaction, etc.
- **Automated vs. manual**: Some criteria can be verified from code (alt text, lang attribute, heading structure, form labels), others require visual/interactive testing (color contrast, keyboard navigation flow, screen reader behavior)
- **Legal context**: WCAG AA is mandatory for Spanish public sector websites per RD 1112/2018 (transposing EU Directive 2016/2102)

## Agent Capabilities

1. **Frontend Codebase Scan**: Analyze HTML/JSP/Thymeleaf templates, CSS/SCSS, JavaScript, ARIA attributes, form structures, navigation patterns
2. **WCAG Criterion Mapping**: Map findings to specific WCAG 2.1 success criteria with level indicators (A/AA/AAA)
3. **Gap Analysis per Level**: Identify which criteria are met, partially met, or missing for each conformance level
4. **Compliance Scoring**: Provide compliance percentages per principle, per guideline, and per level
5. **Remediation Roadmap**: Propose prioritized, concrete actions with code examples to achieve Level A → AA → AAA
6. **Tool Recommendations**: Suggest automated testing tools (axe-core, Lighthouse, pa11y, WAVE) for ongoing validation

## Complete Success Criteria Catalog (to encode in agent)

### Level A (30 criteria)
1.1.1 Non-text Content | 1.2.1 Audio-only/Video-only | 1.2.2 Captions (Prerecorded) | 1.2.3 Audio Description/Media Alternative | 1.3.1 Info and Relationships | 1.3.2 Meaningful Sequence | 1.3.3 Sensory Characteristics | 1.4.1 Use of Color | 1.4.2 Audio Control | 2.1.1 Keyboard | 2.1.2 No Keyboard Trap | 2.1.4 Character Key Shortcuts | 2.2.1 Timing Adjustable | 2.2.2 Pause, Stop, Hide | 2.3.1 Three Flashes or Below Threshold | 2.4.1 Bypass Blocks | 2.4.2 Page Titled | 2.4.3 Focus Order | 2.4.4 Link Purpose (In Context) | 2.5.1 Pointer Gestures | 2.5.2 Pointer Cancellation | 2.5.3 Label in Name | 2.5.4 Motion Actuation | 3.1.1 Language of Page | 3.2.1 On Focus | 3.2.2 On Input | 3.3.1 Error Identification | 3.3.2 Labels or Instructions | 4.1.1 Parsing | 4.1.2 Name, Role, Value

### Level AA (20 criteria)
1.2.4 Captions (Live) | 1.2.5 Audio Description | 1.3.4 Orientation | 1.3.5 Identify Input Purpose | 1.4.3 Contrast (Minimum) 4.5:1 | 1.4.4 Resize Text | 1.4.5 Images of Text | 1.4.10 Reflow | 1.4.11 Non-text Contrast | 1.4.12 Text Spacing | 1.4.13 Content on Hover or Focus | 2.4.5 Multiple Ways | 2.4.6 Headings and Labels | 2.4.7 Focus Visible | 3.1.2 Language of Parts | 3.2.3 Consistent Navigation | 3.2.4 Consistent Identification | 3.3.3 Error Suggestion | 3.3.4 Error Prevention (Legal/Financial) | 4.1.3 Status Messages

### Level AAA (28 criteria)
1.2.6 Sign Language | 1.2.7 Extended Audio Description | 1.2.8 Media Alternative | 1.2.9 Audio-only (Live) | 1.3.6 Identify Purpose | 1.4.6 Contrast (Enhanced) 7:1 | 1.4.7 Low/No Background Audio | 1.4.8 Visual Presentation | 1.4.9 Images of Text (No Exception) | 2.1.3 Keyboard (No Exception) | 2.2.3 No Timing | 2.2.4 Interruptions | 2.2.5 Re-authenticating | 2.2.6 Timeouts | 2.3.2 Three Flashes | 2.3.3 Animation from Interactions | 2.4.8 Location | 2.4.9 Link Purpose (Link Only) | 2.4.10 Section Headings | 2.5.5 Target Size (44×44 CSS px) | 2.5.6 Concurrent Input Mechanisms | 3.1.3 Unusual Words | 3.1.4 Abbreviations | 3.1.5 Reading Level | 3.1.6 Pronunciation | 3.2.5 Change on Request | 3.3.5 Help | 3.3.6 Error Prevention (All)

## Code-Verifiable vs. Manual-Only Criteria

### Highly Code-Verifiable (from source code analysis)
- `alt` attributes on images (1.1.1)
- `lang` attribute on `<html>` (3.1.1)
- Heading hierarchy `<h1>`-`<h6>` (1.3.1, 2.4.6, 2.4.10)
- Form `<label>` associations (3.3.2, 1.3.1)
- `<title>` element (2.4.2)
- Skip navigation links (2.4.1)
- ARIA roles, states, properties (4.1.2, 4.1.3)
- `autocomplete` attributes (1.3.5)
- Table structure `<th>`, `scope`, `headers` (1.3.1)
- Valid HTML structure (4.1.1)
- `tabindex` usage (2.1.1, 2.4.3)
- CSS `outline: none` without alternative focus styles (2.4.7)
- `prefers-reduced-motion` media query (2.3.3)
- Viewport meta tag and text resize (1.4.4, 1.4.10)

### Partially Code-Verifiable (need CSS/JS context)
- Color contrast ratios (1.4.3, 1.4.6, 1.4.11) — need computed styles
- Keyboard trap detection (2.1.2) — need JS event handler analysis
- Focus management (2.4.3, 2.4.7) — need JS and CSS analysis
- Error handling patterns (3.3.1, 3.3.3) — need form validation logic review

### Manual/Visual Testing Required
- Meaningful alt text content quality (1.1.1)
- Actual keyboard navigation experience (2.1.1)
- Screen reader compatibility (4.1.2)
- Cognitive load assessment (3.1.5)
- Real-time media alternatives (1.2.4)

## Spanish Legal Context
- **RD 1112/2018**: Transposes EU Directive 2016/2102 — requires WCAG 2.1 Level AA for all Spanish public sector websites and apps
- **EN 301 549**: European standard referencing WCAG 2.1
- **Complementary to ENS/ENI**: WCAG compliance may be required alongside ENS security and ENI interoperability for public administration systems

## Todos
1. **create-wcag-agent** — Create `.github/agents/wcag_accessibility_analyzer.md` with full WCAG 2.1 knowledge, all 78 success criteria with code-evidence mapping, 4-principle analysis methodology, level-graduated scoring, and remediation roadmap format

## Key WCAG Reference
- **Standard**: WCAG 2.1 (W3C Recommendation, 05 June 2018, updated 21 September 2023)
- **Source**: https://www.w3.org/TR/WCAG21/
- **Quick Reference**: https://www.w3.org/WAI/WCAG21/quickref/
- **Techniques**: https://www.w3.org/WAI/WCAG21/Techniques/
- **Understanding**: https://www.w3.org/WAI/WCAG21/Understanding/
