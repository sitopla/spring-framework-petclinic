# Plan: ENI Compliance Analyzer Agent

## Problem Statement
Create a custom Copilot agent (`.github/agents/eni_compliance_analyzer.md`) that analyzes any codebase for compliance with the **Esquema Nacional de Interoperabilidad (ENI)** — Real Decreto 4/2010 (BOE-A-2010-1331), consolidated text updated 06/11/2024. The agent must evaluate the current state of interoperability measures in the code and propose concrete actions to achieve full ENI compliance across all three interoperability dimensions (organizational, semantic, technical).

## Approach
Build a single agent definition file following the existing agent format in `.github/agents/`. The agent will encode comprehensive ENI knowledge including:

### ENI Core Structure (RD 4/2010, 12 Chapters)
- **Chapter I** — General provisions (Arts. 1-3): Scope, definitions, applicability
- **Chapter II** — Basic principles (Arts. 4-7): Integral interoperability, multidimensional approach, multilateral solutions
- **Chapter III** — Organizational interoperability (Arts. 8-9): Services via electronic means, administrative information inventories
- **Chapter IV** — Semantic interoperability (Art. 10): Semantic assets, common data exchange models
- **Chapter V** — Technical interoperability (Art. 11): Open standards, standard selection criteria, technology neutrality
- **Chapter VI** — Common infrastructures and services (Art. 12): Shared platforms (Red SARA, Cl@ve, SIA, DIR3)
- **Chapter VII** — Public administration communications (Arts. 13-15): SARA network, addressing plan, official time synchronization
- **Chapter VIII** — Reuse and transfer of technology (Arts. 16-17): Open-source licensing (EUPL), reuse of applications, CTT directory
- **Chapter IX** — Electronic signature (Arts. 18-20): Signature policy, certificates, trusted lists (TSL)
- **Chapter X** — Document recovery and preservation (Arts. 21-24): Document management policy, security, formats, digitization
- **Chapter XI** — Conformity norms (Arts. 25-28): E-headquarters/registries, lifecycle, control mechanisms, publication
- **Chapter XII** — Permanent update (Art. 29)

### 12 Normas Técnicas de Interoperabilidad (NTIs)
1. NTI de Catálogo de estándares
2. NTI de Documento electrónico
3. NTI de Digitalización de documentos
4. NTI de Expediente electrónico
5. NTI de Política de firma electrónica y certificados
6. NTI de Protocolos de intermediación de datos
7. NTI de Relación de modelos de datos comunes
8. NTI de Política de gestión de documentos electrónicos
9. NTI de Requisitos de conexión a la Red SARA
10. NTI de Procedimientos de copiado auténtico y conversión de documentos
11. NTI de Modelo de datos para el intercambio de asientos entre registros (SICRES)
12. NTI de Reutilización de recursos de información

### Three Interoperability Dimensions (Analysis Axes)
- **Organizativa**: Service catalogs, administrative inventories, SLAs, governance
- **Semántica**: Common data models, metadata schemas, semantic center (CISE)
- **Técnica**: Open standards, APIs, formats, protocols, network connectivity

## Agent Capabilities
1. **Codebase Interoperability Scan**: Analyze source code, APIs, data models, configurations, document formats, and infrastructure for interoperability patterns
2. **ENI Mapping**: Map findings to specific ENI articles and NTIs
3. **Gap Analysis per Dimension**: Identify which ENI requirements are met, partially met, or missing for each interoperability dimension
4. **Compliance Scoring**: Provide compliance percentages per dimension (organizational, semantic, technical) and per chapter
5. **Remediation Roadmap**: Propose prioritized, concrete actions to achieve full ENI compliance

## Key Differences from ENS Agent
- ENI has **no category levels** (BÁSICA/MEDIA/ALTA) — it's a binary comply/don't comply framework
- ENI focuses on **interoperability** (data exchange, standards, formats) rather than **security** (encryption, authentication)
- ENI compliance is measured across **3 dimensions** (organizativa, semántica, técnica) rather than 5 security dimensions
- ENI references 12 **Normas Técnicas de Interoperabilidad** as mandatory development standards

## Todos
1. **create-eni-agent** — Create the `.github/agents/eni_compliance_analyzer.md` agent definition file with full ENI knowledge, analysis methodology, and output format

## Key ENI Reference
- **Regulation**: Real Decreto 4/2010, de 8 de enero (BOE-A-2010-1331)
- **Source**: https://www.boe.es/buscar/act.php?id=BOE-A-2010-1331
- **Consolidated text**: Last updated 06/11/2024
- **Modified by**: RD 203/2021, RD 1495/2011, RD 1125/2024
