# Experience: Software Engineer I — Dark Matter Technologies
## Apr 2020 – Sep 2022 · Philadelphia, PA · FinTech / Mortgage-Tech SaaS · Product: AIVA

### Cross-Position Section
First role after M.S. in Computer Science from University at Buffalo. Joined the AIVA (AI Virtual Assistant) team and grew from junior contributor to taking on increasingly complex backend work — rearchitecting the loan processing engine, optimizing database queries, and establishing testing practices. Promoted to SWE II after demonstrating technical initiative and mentoring capability.

**CL framing:** Hit the ground running after completing M.S., taking full ownership of the PDF processing pipeline rearchitecture as a solo project and establishing testing culture that reached 70% org-wide coverage. Natural progression from deep backend contributor to the migration lead and process champion in the SWE II role.

---

### Achievement SWE1-A: Loan Processing Engine Rearchitecture
**Source:** All 34 resumes (core achievement)
**User's role:** Sole developer — parallelized PDF processing pipeline: PDFs split into individual loan document sets in AWS Step Functions, each set running in a Lambda worker.

**Context:** The AIVA document classification pipeline processed loan PDFs sequentially, creating bottlenecks. User rearchitected it for parallel processing.

**Bullet variants:**
- **2L:** Re-architected loan processing engine in Java using parallel streams and multithreading, achieving 50% faster execution and 2x throughput.
- **3L:** Re-architected the Java loan processing engine using parallel streams and multi-threading (concurrency controls — mutexes/semaphores), achieving 50% faster execution and 2x throughput; introduced idempotent processing and back-pressure handling for production reliability.
- **1L:** Rearchitected loan processing engine with parallel streams, achieving 50% faster execution and 2x throughput.

**Key skills:** Java, parallel streams, multithreading, AWS Step Functions, AWS Lambda, performance engineering
**ATS keywords:** Java, parallel processing, multithreading, throughput, performance optimization, Step Functions, Lambda
**Reframing notes:**
- Availity: Add concurrency details — "mutexes/semaphores, idempotent processing, back-pressure handling"
- Java SE: Frame as "doubling throughput to 10 loans/sec"
- Quant: Emphasize event processing and throughput angle
- General: Lead with 50%/2x metrics

---

### Achievement SWE1-B: Java Testability (Dependency Injection)
**Source:** All 34 resumes
**User's role:** Developer

**Context:** Improved testability of Java services by introducing dependency injection patterns.

**Bullet variants:**
- **2L:** Improved testability of Java services via dependency injection, boosting automated test coverage by over 10% in one quarter.
- **3L:** Improved testability of Java microservices via dependency injection, raising automated test coverage to 70% org-wide; implemented JUnit and Cypress test suites across the engineering org.
- **1L:** Improved Java service testability via dependency injection, boosting test coverage over 10% in one quarter.

**Key skills:** Java, dependency injection, TDD, JUnit, Cypress, test automation
**ATS keywords:** dependency injection, test coverage, TDD, JUnit, Cypress, automated testing
**Reframing notes:**
- Mode 2: Extend to include 70% org-wide coverage and regression reduction
- Java SE: Emphasize OOP/OOD patterns
- General: Solid testing bullet for any role

---

### Achievement SWE1-C: GraphQL Query Optimization
**Source:** All 34 resumes
**User's role:** Developer

**Context:** Key API endpoints had slow response times due to unoptimized GraphQL queries.

**Bullet variants:**
- **2L:** Optimized GraphQL queries and schema design to diminish API response times by 900 ms for key endpoints, decreasing client-side latency and enhancing end-user experience.
- **1L:** Optimized GraphQL queries, reducing average API response time by 900 ms for key endpoints.

**Key skills:** GraphQL, query optimization, API performance, schema design
**ATS keywords:** GraphQL, query optimization, API performance, latency reduction
**Reframing notes:**
- Backend: Emphasize schema design aspect
- Forward Deployed: Frame as "customer-facing endpoint" optimization
- General: Strong performance optimization bullet

---

### Achievement SWE1-D: Mentoring 3 Junior Developers
**Source:** All 34 resumes
**User's role:** Formal mentor

**Context:** Assigned as formal mentor to 3 junior developers joining the AIVA team.

**Bullet variants:**
- **2L:** Mentored 3 junior developers, accelerating onboarding and shortening ramp-up time by 1 sprint, enabling 2 additional successful project completions.
- **1L:** Mentored 3 junior developers (formal role), shortening ramp-up by 1 sprint and enabling 2 additional project completions.

**Key skills:** Mentoring, onboarding, team development, knowledge transfer
**ATS keywords:** mentoring, onboarding, team productivity, leadership
**Reframing notes:**
- Senior roles: HIGH — demonstrates leadership readiness
- All roles: Strong soft skill bullet, always include when space allows

---

### Achievement SWE1-E: On-Call & Incident Response
**Source:** Most resumes
**User's role:** On-call responder, runbook author

**Context:** Participated in production on-call rotation and established postmortem practices.

**Bullet variants:**
- **2L:** Participated in on-call rotations and wrote runbooks/incident playbooks; improved SLO compliance and reduced incident recurrence by instituting postmortems and targeted alerts (cutting resolution time by nearly a third).
- **3L:** Owned on-call rotation and incident response for backend services, led postmortems and reliability fixes that prevented nearly 1 in 3 recurring incidents and improved uptime for critical flows.
- **1L:** Managed on-call rotation, authored runbooks, and prevented nearly 1 in 3 recurring incidents via postmortems.

**Key skills:** On-call, incident response, runbooks, postmortems, SLO compliance, alerting
**ATS keywords:** on-call, incident response, SLO, MTTR, postmortem, runbooks
**Reframing notes:**
- Backend SE: Use "Owned" verb — stronger ownership framing
- Mode 2: HIGH — core incident management
- SRE-adjacent roles: HIGH
- General: MEDIUM — shows operational maturity

---

### Achievement SWE1-F: PostgreSQL Query Optimization
**Source:** Availity comprehensive, Java SE
**User's role:** Developer

**Context:** Optimized PostgreSQL queries for core RESTful API endpoints.

**Bullet variants:**
- **2L:** Optimized PostgreSQL queries for core RESTful API endpoints, trimming average execution time from 1.2s to 300ms (75% reduction).
- **1L:** Optimized PostgreSQL queries, reducing execution time from 1.2s to 300ms (75% reduction).

**Key skills:** PostgreSQL, SQL optimization, query tuning, REST APIs
**ATS keywords:** PostgreSQL, SQL optimization, query performance, database tuning
**Reframing notes:**
- Java/Backend: MEDIUM — database performance depth
- General: Can combine with GraphQL optimization or use as standalone

---

### Achievement SWE1-G: IaC with CloudFormation
**Source:** Availity comprehensive
**User's role:** Developer

**Context:** Implemented infrastructure-as-code for environment provisioning.

**Bullet variants:**
- **2L:** Implemented infrastructure-as-code with AWS CloudFormation to provision and maintain environments, enabling repeatable, auditable deployments; automated Graph DB deployments with Step Functions, achieving 100% deployment reliability.
- **1L:** Implemented IaC with CloudFormation for repeatable deployments; automated Graph DB deploys with 100% reliability.

**Key skills:** AWS CloudFormation, IaC, Step Functions, infrastructure automation
**ATS keywords:** CloudFormation, IaC, infrastructure-as-code, automation, deployment reliability
**Reframing notes:**
- Cloud Platform: HIGH — core IaC achievement
- DevOps roles: HIGH
- General: MEDIUM — shows infrastructure awareness

---

### Achievement SWE1-H: Root Cause Analysis
**Source:** Mode 2
**User's role:** Developer

**Context:** Systematic RCA for production defects with preventive fixes.

**Bullet variants:**
- **2L:** Performed root cause analysis for production defects and implemented preventive fixes and monitoring that reduced recurrence of critical defects over 4 months.
- **1L:** Performed RCA for production defects, reducing critical defect recurrence in 4 months.

**Key skills:** Root cause analysis, debugging, monitoring, defect prevention
**ATS keywords:** root cause analysis, RCA, defect reduction, monitoring, production support
**Reframing notes:**
- Mode 2: HIGH — core support/RCA bullet
- General: LOW — use only when production support emphasized
