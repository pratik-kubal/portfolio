// Single source of truth for the "pratik-kubal.com v2" design copy + data.
// Verbatim from design_handoff_portfolio/design-reference/Portfolio.dc.html
// (projects() / npData() / initBellaDemo() / initBella() and the inline markup).
// Components read from here so copy lives in one typed place.

export type Theme = "light" | "dark" | "bw";

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "bw", label: "Noir" },
];

export const LINKS = {
  github: "https://github.com/pratik-kubal",
  linkedin: "https://www.linkedin.com/in/pratik-kubal/",
  email: "pratik-kubal@outlook.com",
  repo: "https://github.com/pratik-kubal/portfolio/",
  resume: "/pratik-kubal-resume.pdf", // user supplies the PDF in public/
} as const;

// ── Hero ────────────────────────────────────────────────────────────────────
export const hero = {
  kicker: "Who am I",
  name: "Pratik Kubal",
  subhead: "A software Engineer based in Philadelphia, PA.",
  muted: "Doing Pro bono volunteering for Philadelphia nonprofits since 2024",
  body: "With Five years building the AI loan-document platform behind a top mortgage-tech SaaS.",
  scrollHint: "What I've done",
  // Möbius mount props (from the page's <dc-import>): R=2.6, w=0.8, t=0.48, speed=30, tilt=0.
  mobius: { R: 2.6, w: 0.8, t: 0.48, speed: 30, tilt: 0 },
} as const;

// ── Project cards ────────────────────────────────────────────────────────────
export type Inline =
  | string
  | { text: string; bold?: boolean; href?: string };

export interface RichLine {
  parts: Inline[];
}

export type VizKind = "bella" | "ring" | "paperstack";

export interface Project {
  id: string; // anchor + first section gets #work
  screenLabel: string; // data-screen-label / spine label
  kicker: string;
  headline: string;
  /** Displayed metric. "" for the Bella card (the live demo is the "number"). */
  metric: string;
  /** Count-up target for animated metrics, if any. */
  count?: { from: number; to: number; suffix: string; decimals: number };
  metricCaption: string;
  /** The metric caption doubles as a highlight-to-ask demo on the Bella card. */
  metricCaptionIsHighlightDemo?: boolean;
  h3: string;
  body: string;
  bullets: string[];
  tags: string[];
  footnote?: RichLine;
  repo?: { href: string; text: string };
  viz: VizKind;
  vizTop: string; // small mono label above the viz
  /** Bella card viz caption (bold + rest). */
  vizCaption?: { bold: string; rest: string };
  /** Ring viz before/after captions. */
  ring?: {
    topBefore: string;
    topAfter: string;
    bottomBefore: string;
    bottomAfter: RichLine;
  };
  /** Paper-stack after caption. */
  paperstack?: { after: RichLine };
}

export const projects: Project[] = [
  {
    id: "work",
    screenLabel: "AI Engineering",
    kicker: "AI Engineering",
    headline: "An assistant that answers the questions you have about my career",
    metric: "",
    metricCaption: "You can highlight any text on this page to ask Bella about it",
    metricCaptionIsHighlightDemo: true,
    h3: "Or open an Interactive chat at the bottom right of the page",
    body: "Candidates usually have to pick and choose what to put in a resume to the recruiter for a specific job, usually this takes practice and still might not accurate. This wastes time of both recruiter and the candidate. This time can be used either by recruiter to find better suited candidates or by candidates to apply for more jobs. Hence creating a assistant to answer exact questions helps recruiter and me to save time.",
    bullets: [
      "Created API Backend connected to Claude API to drive interactions",
      "Implemented mechanism to save questions asked by visitors for analysis in serverless database",
      "Designed through Claude Design and Implemented using Claude Code after researching design principles",
    ],
    tags: [
      "Next.js",
      "React",
      "Tailwind",
      "Claude API",
      "Vercel",
      "Jest/Cypress",
      "Anime.js",
      "Rough.js",
    ],
    repo: { href: LINKS.repo, text: "Repo ↗" },
    viz: "bella",
    vizTop: "ChatBot",
    vizCaption: {
      bold: "Ask it anything",
      rest: " ·  Answers questions about my background, skills, and impact",
    },
  },
  {
    id: "project-management",
    screenLabel: "Project Management",
    kicker: "project management",
    headline: "From graph-database bottleneck to sub-100ms in Two Quarters",
    metric: "90%",
    count: { from: 0, to: 90, suffix: "%", decimals: 0 },
    metricCaption: "API latency cut · ~100K req/day",
    h3: "Refactor & Re-Architect Migration",
    body: "Our idea was to transition core functionality to Aurora and carefully switch the API used by services through feature flags to ensure business continuity. I would have to plan the change to Data structure and Application queries; with a Data migration and Application code.",
    bullets: [
      "Created a migration roadmap with clear timelines and risk mitigation steps.",
      "Engaged all stakeholders such as Product, DevOps, QA and other Engineers to align on requirements and success metrics.",
      "Managed parallel testing and staged rollout to avoid client impact.",
      "Added a No-Code Rules Engine",
    ],
    tags: ["JavaScript", "Python", "SQL", "React.js"],
    footnote: {
      parts: [
        "Internal platform — Dark Matter's ",
        {
          text: "Aiva Docs ↗",
          href: "https://dmatter.com/intelligent-document-management",
        },
        " (classifies 1,100+ mortgage doc types, extracts 1,200+ data elements)",
      ],
    },
    viz: "ring",
    vizTop: "",
    ring: {
      topBefore:
        "Before — Risk of SLA breaches and increased costs in bigger loan packages",
      topAfter: "After —  Migration to AWS Aurora Serverless",
      bottomBefore: "~1 second round-trip",
      bottomAfter: {
        parts: [
          { text: "Zero service interruptions", bold: true },
          " · −60% database load · ~$10K/year infrastructure savings",
        ],
      },
    },
  },
  {
    id: "technical-challenge",
    screenLabel: "Technical Challenge",
    kicker: "technical challenge",
    headline: "Creating software which keeps up to increasing customer demands",
    metric: "1.0×",
    count: { from: 1.0, to: 2.4, suffix: "×", decimals: 1 },
    metricCaption: "performance throughput after change · with half the cost",
    h3: "Redesigning Core PDF Processing Service",
    body: "I was tasked with designing a faster, more scalable document-processing system that would reduce costs and meet SLA requirements without requiring a full system rewrite. Since we were handling NPI information in terms of documents like Credit report or Bank Statements I had to ensure my plans met with performance, compliance, and maintainability guidelines.",
    bullets: [
      "Collaborated with DevOps to design a fault-tolerant AWS Step Functions pipeline with Lambda functions for processing.",
      "Automated infrastructure with CloudFormation to speed up deployment and reduce human error.",
      "Trained the support team on monitoring tools and troubleshooting processes.",
    ],
    tags: [
      "Java",
      "Infrastructure as Code (IaC)",
      "Aspose",
      "Object Oriented Programming Principles",
    ],
    footnote: { parts: ["Internal tooling on the same Aiva Docs platform"] },
    viz: "paperstack",
    vizTop: "Loan Documents",
    paperstack: {
      after: {
        parts: [
          { text: "Eliminated SLA risks", bold: true },
          " · Improved client satisfaction scores",
        ],
      },
    },
  },
];

// ── Nonprofit ────────────────────────────────────────────────────────────────
export interface NonprofitEntry {
  title: string;
  body?: string;
  body2?: string;
  bodyPre?: string;
  link?: { text: string; href: string };
}

export const nonprofitHeading = "Non Profits and Pro-bono Volunteering";

export const nonprofit: NonprofitEntry[] = [
  {
    title: "Compass Pro Bono",
    body: "Stepped up from team member (Since 2024) to a leadership seat owning scope, timelines, client communication, and deliverables. On prior 2024 Compass engagements, I've worked with Technology & Funding Strategies for two other Non Profits.",
    body2:
      "This year our six-person team delivered AI Technology assistance to a major Philadelphia SGO (Scholarship Granting Organization). I worked with their Program Team to gather requirements for providing them AI Recommendations and their leadership team to highlight some Funding Opportunities for their implementation.",
  },
  {
    title: "Web engineering — West Philly Porchfest",
    bodyPre:
      "Web design and development for 10 year old Philadelphia community arts festival. I worked with their Github Repository to create a Vercel Pipeline to preview builds and ran Dev-Ops for their production website. ",
    link: { text: "westphillyporchfest.com ↗", href: "https://westphillyporchfest.com/" },
  },
];

// ── About ────────────────────────────────────────────────────────────────────
export const aboutHeading = "My Story & Pitch";

export const about: string[] = [
  "I have 5 years of software work experience, 1.5 years of Masters specialization in Machine Learning in Buffalo, and 1 year of data analytics for a consultancy startup in Mumbai which has given me confidence to tackle full stack in its complete breath. Through pro bono engagements with Non Profits in Philadelphia has taught me what dealing with incomplete requirements and uncertainty looks like.",
  "That's why I'm a Go-to-Market(GTM) engineer to handle your backend, frontend, or even networking across clients; and be comfortable working with Sales, Finance, or Funding teams to solve their problems. As a team member I'm the engineer who revives quality when it slips like in my organization, I restarted the cross-team code-review program after our senior mentor left, raised org-wide test coverage to 70% through dependency-injection patterns which became go-to in the organization, and replaced a core 50% deployment success to 100% success CI/CD pipeline.",
];

// ── Footer ───────────────────────────────────────────────────────────────────
export const footer = {
  tagline: "Personal Portfolio website for Pratik Kubal",
  // Static fallback shown when /api/now-playing has no data / no JS.
  spotifyFallback: { title: "Shadow · Chromatics", album: "Shadow" },
  sitemap: [
    { label: "Work", href: "#work" },
    { label: "Nonprofit", href: "#nonprofit" },
    { label: "About", href: "#about" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
    { label: "Terms", href: "/terms" },
  ],
  elsewhere: [
    { label: "pratik-kubal@outlook.com ↗", href: `mailto:${LINKS.email}` },
    { label: "GitHub ↗", href: LINKS.github },
    { label: "LinkedIn ↗", href: LINKS.linkedin },
    { label: "Resume ↗", href: LINKS.resume },
  ],
  copyrightLeft: "© 2026 Pratik Kubal. All rights reserved. Go Birds.",
  copyrightRight: "Built with Responsible AI Practices",
} as const;

// ── Scripted right-column Bella demo (Project: AI Engineering) ───────────────
// This stays a scripted, scroll-scrubbed demo — separate from the live widget.
export interface DemoMsg {
  who: "r" | "b";
  text?: string;
  html?: string;
}

export const bellaDemoMsgs: DemoMsg[] = [
  { who: "r", text: "Hey Bella! Give me the short version of who Pratik is." },
  {
    who: "b",
    html: 'Happy to. He\'s a full-stack engineer, five years deep on a fintech document-AI platform — strongest in <b style="font-weight:600;">Java &amp; AWS</b> backend with React on top.',
  },
  { who: "r", text: "Love it. Any numbers that show impact?" },
  {
    who: "b",
    html: 'Plenty — a database migration that cut API latency <b style="font-weight:600;">~90%</b>, and a rules tool that pushed throughput <b style="font-weight:600;">2.4×</b> to 120K pages/hr.',
  },
  { who: "r", text: "Great. What's he doing right now?" },
  {
    who: "b",
    html: "He's between roles by choice, investing the gap in pro bono engineering leadership and AI-platform depth. Want the project breakdown?",
  },
];

export const bellaDemoNotes: { at: number; tag: string; text: string }[] = [
  { at: 1, tag: "GROUNDED", text: "Every claim maps to a line on the résumé — no invented detail." },
  { at: 3, tag: "SPECIFIC", text: "Cites the exact metric, not a vibe." },
  { at: 5, tag: "OPENS A THREAD", text: "Ends by offering the next natural question." },
];

// ── Live Bella widget ────────────────────────────────────────────────────────
export const bellaWidget = {
  name: "Bella",
  role: "Pratik's recruiting assistant",
  greeting:
    "Hi! I'm Bella — I help recruiters get quick, honest answers about Pratik's work. What would you like to know?",
  inputPlaceholder: "Ask Bella anything…",
  // { query: the message actually sent, label: the chip text }
  chips: [
    { query: "What's his strongest tech stack?", label: "Strongest tech stack?" },
    { query: "Is he open to remote roles?", label: "Open to remote?" },
    { query: "Walk me through the 90% latency win", label: "The 90% latency win" },
    { query: "Why is he between roles right now?", label: "Why between roles?" },
  ],
} as const;
