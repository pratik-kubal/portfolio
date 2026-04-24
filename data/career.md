## Purpose

Single consolidated profile for Pratik Kubal — used as the LLM context for the recruiter Q&A chat at pratik-kubal.com. Built from the structured experience files in `data/experience/`. If something here conflicts with those files, the experience files are authoritative (they carry provenance and role-by-role detail).

---

## Personal Information

| Field | Value |
|---|---|
| **Name** | Pratik Kubal |
| **Email** | pratik-kubal@outlook.com |
| **Phone** | +1 (716) 208-8963 |
| **Location** | Philadelphia, PA |
| **LinkedIn** | linkedin.com/in/pratik-kubal |
| **GitHub** | github.com/pratik-kubal |
| **Personal Website / Portfolio** | pratik-kubal.com |
| **Work Authorization** | Marriage-based green-card adjustment of status in progress; currently on B-2 after H-1B lapsed with the May 2025 RIF. Will hold permanent U.S. work authorization — no visa sponsorship required — upon EAD / Green Card issuance |
| **Remote Work** | Open to fully remote roles anywhere in the United States |
| **Hybrid / On-site** | Open to hybrid or in-person work within ~10 miles of Philadelphia, PA or Malvern, PA |
| **Availability** | 40 hrs/week with U.S. timezone overlap; start date contingent on EAD / Green Card issuance (pending) |

---

## Summary

Backend-leaning full-stack software engineer with 5 years of production experience in fintech / mortgage-tech SaaS, all on the AIVA loan-document AI platform at Dark Matter Technologies (Apr 2020 – May 2025, promoted from SWE I to SWE II). Strongest in Java + AWS: led a Neptune → Aurora Serverless migration on a ~100K-request/day platform that cut API latency 90% and saved ~$10K/year, rearchitected the loan-processing engine for 2× throughput, and built self-service tooling that eliminated manual config deploys for two teams.

Consistently the engineer who revived quality and process — restarted the cross-team code review program after the senior mentor left, raised org-wide test coverage to 70% via dependency-injection patterns, and replaced a 24-hour deployment cycle with a 4-hour CI/CD pipeline. Comfortable across the stack (React/Next.js for self-service UIs and a personal AI-powered resume Q&A app), and partners well with Product and Data teams.

**Currently (May 2025 – Present):** Actively interviewing after a reduction-in-force at Dark Matter Technologies. H-1B status lapsed with the RIF and transitioned to B-2 while a marriage-based green-card application is processed — so the next role will not require sponsorship, but cannot start until the EAD / Green Card is in hand. Using the transition to lead a Compass Pro Bono engagement as Deputy Project Leader (Children's Scholarship Fund of Philadelphia), volunteer web engineering for West Philly Porchfest, and invest in AI-platform depth (Claude Code training; Azure AI Engineer Associate and AWS certifications in progress). Based in Philadelphia, open to remote (U.S.) or hybrid/in-person around Philadelphia or Malvern, PA.

---

## Work Experience

### Current — Pro Bono Leadership, Volunteer Engineering, AI Upskilling
**May 2025 – Present · Philadelphia, PA · Actively interviewing**

Position was eliminated at Dark Matter Technologies in May 2025 as part of a company-wide reduction in force. H-1B status lapsed and was replaced with B-2 while a marriage-based green-card application is processed; once the EAD / Green Card issues, will hold permanent U.S. work authorization with no sponsorship required. In the meantime, has stepped into project leadership on a pro bono engagement, contributed volunteer engineering to a local community organization, and invested in AI-platform depth through certifications — while interviewing for the next full-time role.

- **Pro bono project leadership — Compass Pro Bono (Deputy Project Leader).** Leading the pro bono project team serving the Children's Scholarship Fund of Philadelphia (CSFP). A step up from the 2024 Compass engagement (team member) to a leadership seat responsible for scope, timelines, client communication, and deliverables.
- **Volunteer web engineering — West Philly Porchfest (westphillyporchfest.com).** Contributing web design and development to the Philadelphia community arts festival.
- **AI-platform upskilling.** Working through Anthropic's Claude Code training; Azure AI Engineer Associate certification in progress; AWS certification in progress. Complements production AI/LLM experience from the AIVA platform and the personal Interactive AI-Driven Resume Q&A Web App (shipped Aug 2025 during this period — see Projects).

---

### Software Engineer II — Dark Matter Technologies
**Sep 2022 – May 2025 · Philadelphia, PA · FinTech / Mortgage-Tech SaaS · Product: AIVA (AI Virtual Assistant for loan document extraction & classification)**

Promoted to SWE II after 2.5 years on the AIVA team. Led the flagship database migration, built developer self-service tooling, revived quality processes (code reviews, CI/CD), and partnered cross-functionally with Product and Data. This role marked the progression from individual contributor to technical lead on high-impact initiatives.

**Flagship work**

- **AWS Neptune → Aurora Serverless migration (lead).** Led migration of the AIVA loan-processing platform (~100K daily requests) off AWS Neptune onto Aurora Serverless. Rewrote Java backend services with optimized SQL query patterns; authored technical design docs and operational runbooks. Cut API latency 90% (~1s → sub-100ms), reduced DB load 60%, saved ~$10K/year.
- **Self-service React micro-frontend.** Built from scratch in two quarters (PM provided wireframes; Pratik scoped features and led development). Replaced manual deployments with a self-service UI that let two teams own their own configs, formally measured to lift document-classification throughput 2.4× (50K → 120K pages/hr) with zero SLA breaches. Stack: React.js, JavaScript, HTML/CSS; included unit/integration tests and monitoring hooks. (Sometimes referred to internally as the "Rules Based Document Classification System" — same body of work.)

**Reliability and automation**

- **Python remediation scripts.** Sole developer. One-off scripts that near-eliminated SLA breaches in 2 weeks; the broader Python alerting/auto-remediation effort cut MTTR from ~40 min to ~5 min and removed recurring P2 incidents.
- **CI/CD pipelines.** Built with GitHub Actions (code/security checks) and AWS CodeDeploy/CodePipeline (build artifacts). Cut deployment cycles from 24 hours to 4 hours (83% reduction) across 3 services, enabling on-demand releases and faster rollback.
- **Service monitoring & SLI/SLO.** Implemented monitoring/alerting (Grafana), defined SLIs/SLOs for critical APIs; reduced incident MTTR by 35%.
- **Incident response (P1/P2).** Resolved production incidents using automated remediation and runbooks; consistently met SLA targets. Tracked incidents and change requests in JIRA, coordinating QA, infra, and product teams to close within SLA.
- **Stakeholder communication.** Translated technical implications of change requests and release plans for product owners and IT stakeholders so approvals were informed and disruptions were minimized.

**Architecture and platform**

- **Event pipelines (Step Functions + SQS).** Designed event-driven pipelines that decoupled loan-processing microservices, lifting throughput to 100 transactions/min and improving fault tolerance.
- **API Gateway / WAF integration (assisted).** Contributed to centralized API Gateway/WAF patterns that let 6 services adopt standardized API contracts and centralized WAF policies. (Contributing role, not sole owner.)
- **DynamoDB document store.** Implemented a DynamoDB-backed document store to accelerate query performance for RESTful endpoints.

**Cross-functional and process leadership**

- **Cross-functional feature delivery.** Partnered with Product and Data over 6 Agile sprints to translate business requirements into REST APIs and microservices; shipped 3 features that lifted adoption 40% and improved downstream SLO compliance.
- **Code review program (revived).** Re-started the monthly cross-team code review program after the senior mentor left and code quality slipped. Conducted 150+ reviews focused on secure coding and OOP/OOD; reduced post-release defects within six months.
- **Scrum facilitation.** Coordinated daily stand-ups and backlog refinements across remote teams, improving sprint predictability.
- **Customer-facing scoping.** Led remote requirements / scoping sessions with customers, translating business workflows into technical specifications.

**Documentation and data**

- **Platform docs and runbooks.** Authored runbooks and IaC module docs; led knowledge-sharing sessions that improved team onboarding and adoption of platform patterns.
- **API documentation (OpenAPI / Swagger).** Authored end-to-end API specs and runbooks as part of Definition of Done.
- **Data pipelines (Python / SQL).** Designed pipelines integrating disparate customer systems; eliminated 2 of every 5 hours of manual reconciliation and provided near-real-time reporting for customer dashboards.

---

### Software Engineer I — Dark Matter Technologies
**Apr 2020 – Sep 2022 · Philadelphia, PA · FinTech / Mortgage-Tech SaaS · Product: AIVA**

First role after the M.S. in Computer Science. Joined the AIVA team and grew from junior contributor to taking on the loan-processing rearchitecture, database tuning, and test-culture work that earned the SWE II promotion.

- **Loan processing engine rearchitecture (sole developer).** Re-architected the Java loan-processing engine using parallel streams and multithreading (with mutexes/semaphores, idempotent processing, back-pressure handling). PDFs were split into individual loan-document sets in AWS Step Functions, with each set processed by a Lambda worker. Achieved 50% faster execution and 2× throughput.
- **Java testability via dependency injection.** Introduced DI patterns across Java services; raised automated test coverage to 70% org-wide via JUnit and Cypress suites (+10% in one quarter).
- **GraphQL query optimization.** Reduced API response times by 900 ms on key endpoints via query and schema redesign.
- **PostgreSQL query optimization.** Trimmed average execution time on core RESTful endpoints from 1.2s to 300 ms (75% reduction).
- **IaC with AWS CloudFormation.** Provisioned and maintained environments via infrastructure-as-code; automated Graph DB deployments through Step Functions for 100% deployment reliability.
- **Mentoring (formal).** Assigned mentor for 3 junior developers joining the AIVA team. Shortened ramp-up by one sprint, enabling 2 additional successful project completions.
- **On-call & incident response.** Owned a piece of the production on-call rotation; authored runbooks and incident playbooks. Instituted postmortems and targeted alerting that improved SLO compliance and prevented nearly 1 in 3 recurring incidents (cut resolution time by ~33%).
- **Root cause analysis.** Systematic RCA for production defects with preventive fixes and monitoring, reducing critical defect recurrence over 4 months.

---

## Projects

### Interactive AI-Driven Resume Q&A Web App
**Aug 2025 · Live at pratik-kubal.com · Sole developer**

Personal project that turned the static resume into a conversational AI assistant for recruiters. Full-stack Next.js app with a retrieval-augmented generation (RAG) pipeline over the resume content, exposing a real-time chat that answers questions about background, skills, and impact.

- **Stack:** React.js, Next.js, Tailwind CSS, OpenAI API, Vercel, GitHub Actions, Jest, Cypress.
- **CI/CD with GitHub Actions** — automated test + deploy, reducing deploy time from 30 min to 5 min.
- **80% test coverage** via Jest (unit) and Cypress (integration).
- **Caching on Next.js API routes** to handle live Q&A — cut average API latency by ~300 ms.
- **Analytics on incoming questions** to identify the top 5 recruiter queries and guide the roadmap.

---

## Volunteer Experience

### Compass Pro Bono — Salesforce Integration for a Non-Profit
**Feb 2024 – May 2024 · Philadelphia, PA · Team member (4-person volunteer team)**

Pro bono technology consulting for a non-profit. Collaborated with the four-person volunteer team to design and recommend a Salesforce integration in 3 months that eliminated 4 of 5 manual data entry steps and streamlined the org's data workflows. Authored step-by-step implementation and maintenance documentation so non-technical staff could operate the workflow without engineering support.

---

## Skills

**Languages:** Java, Python, JavaScript, SQL, HTML/CSS

**Backend & APIs:** Java microservices, REST APIs, GraphQL, event-driven architecture, dependency injection, OpenAPI/Swagger

**Frontend:** React.js, Next.js, Tailwind CSS, micro-frontend architecture

**AWS:** Lambda, Step Functions, Aurora Serverless, Neptune (graph), DynamoDB, API Gateway, WAF, CodeDeploy, CodePipeline, CloudFormation (IaC)

**Databases:** PostgreSQL, Aurora Serverless, DynamoDB, AWS Neptune; SQL query optimization

**Data & AI:** Python/SQL data pipelines and ETL, retrieval-augmented generation (RAG), OpenAI API integration

**DevOps & SRE:** GitHub Actions, AWS CodeDeploy, end-to-end CI/CD, Grafana, SLI/SLO definition, on-call, runbooks, postmortems, MTTR reduction

**Testing:** JUnit, Jest, Cypress, TDD, dependency injection for testability

**Process & Leadership:** Agile/Scrum, sprint planning and facilitation, code review programs, mentoring, technical design docs, JIRA change management, cross-functional partnership with Product and Data, customer-facing requirements/scoping

---

## Education

**M.S. in Computer Science — University at Buffalo (SUNY)**

Joined Dark Matter Technologies as the first role after completing the M.S. (Apr 2020 start).

---

## Job-Search Positioning

- **Primary fit:** Backend / full-stack SWE roles in fintech, AI-platform, or developer-tooling teams. Strongest as a senior IC who owns migrations, performance/reliability work, and self-service tooling end-to-end. Current AI upskilling (Claude Code, Azure AI Engineer Associate in progress, AWS certification in progress) reinforces the AI-platform angle on top of production AI/LLM experience from the AIVA platform and the Resume Q&A project.
- **Secondary fit:** Forward-deployed / integration-engineer roles (customer-facing scoping + Python/SQL data pipelines + Salesforce experience). Reinforced since May 2025 by the Deputy Project Leader role at Compass Pro Bono — leading scope, timelines, and client communication on a pro bono engagement for a Philadelphia non-profit.
- **Availability:** Actively interviewing — position eliminated at Dark Matter Technologies (May 2025 RIF). H-1B lapsed; currently on B-2 while a marriage-based green-card application is pending. Cannot start until the EAD / Green Card is in hand; at that point will hold permanent U.S. work authorization with no sponsorship required. Open to fully remote (U.S.) or hybrid/on-site within ~10 miles of Philadelphia or Malvern, PA. 40 hrs/week, U.S. timezone overlap.
