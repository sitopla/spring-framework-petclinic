# Plan: ENS Compliance Analyzer Agent

## Problem Statement
Create a custom Copilot agent (`.github/agents/ens_compliance_analyzer.md`) that analyzes any codebase for compliance with the **Esquema Nacional de Seguridad (ENS)** — Real Decreto 311/2022 (BOE-A-2022-7191). The agent must evaluate the current state of security measures in the code and propose concrete actions to achieve each ENS category level (BÁSICA, MEDIA, ALTA).

## Approach
Build a single agent definition file following the existing agent format in `.github/agents/`. The agent will encode comprehensive ENS knowledge including:
- The 5 security dimensions (Confidencialidad, Integridad, Trazabilidad, Autenticidad, Disponibilidad)
- The 3 category levels (BÁSICA, MEDIA, ALTA) and their corresponding security levels (BAJO, MEDIO, ALTO)
- All 73 security measures from Annex II organized in 3 frameworks:
  - **Marco organizativo [org]**: org.1–org.4
  - **Marco operacional [op]**: op.pl, op.acc, op.exp, op.ext, op.nub, op.cont, op.mon
  - **Medidas de protección [mp]**: mp.if, mp.per, mp.eq, mp.com, mp.si, mp.sw, mp.info, mp.s
- Reinforcement levels (R1, R2, R3...) per measure and category

## Agent Capabilities
1. **Codebase Security Scan**: Analyze source code, configuration files, CI/CD pipelines, Docker configs, dependencies, and infrastructure-as-code for security-relevant patterns
2. **ENS Mapping**: Map discovered security controls to specific ENS measures
3. **Gap Analysis**: Identify which ENS measures are met, partially met, or missing for each category level
4. **Compliance Scoring**: Provide a compliance percentage per category (BÁSICA, MEDIA, ALTA)
5. **Remediation Roadmap**: Propose prioritized, concrete actions to achieve compliance at each level

## Todos
1. **create-ens-agent** — Create the `.github/agents/ens_compliance_analyzer.md` agent definition file with full ENS knowledge, analysis methodology, and output format

## Key ENS Reference (RD 311/2022)
- **Source**: https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191
- **Annex I**: Category determination (dimensions → levels → category)
- **Annex II**: 73 security measures with reinforcements per level
- **Annex III**: Security audit levels and interpretation
- **Annex IV**: Glossary of terms
