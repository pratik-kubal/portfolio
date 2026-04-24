export type Fact = { k: string; v: string };

export type Social = {
  k: string;
  label: string;
  handle: string;
  url: string;
};

export type Project = {
  id: string;
  name: string;
  year: string;
  status: "active" | "shipped" | "archived";
  blurb: string;
  metric: string;
};

export type TimelineEntry = {
  year: string;
  role: string;
  where: string;
  what: string;
};

export const person = {
  name: "Pratik Kubal",
  role: "Full-Stack Software Engineer",
  based: "Philadelphia, PA",
  pronunciation: "/ˈprɑː.tɪk ˈkuː.bɑːl/",
  bio: "I'm a full-stack software engineer with 5+ years building scalable, cloud-native microservices and APIs on AWS — mostly in FinTech. I've led database migrations, shipped CI/CD pipelines that cut deploys from days to hours, and integrated AI/LLM tooling into real products.",
  eyebrow: "◦ a portfolio, conversationally",
  ledeBefore: "Engineer of ",
  ledeEm: "quiet",
  ledeAfter: " systems & sharp tools.",
  chatOpener:
    "Hi Visitor!",
  facts: [
    { k: "Lives", v: "Philadelphia, PA" },
    { k: "Occupation", v: "Software Engineer" },
    { k: "Education", v: "M.S. Computer Science" },
    { k: "Known for", v: "Backend, FinTech, AWS" },
  ] as Fact[],
  socials: [
    {
      k: "github",
      label: "GitHub",
      handle: "@pratik-kubal",
      url: "https://github.com/pratik-kubal",
    },
    {
      k: "linkedin",
      label: "LinkedIn",
      handle: "in/pratik-kubal",
      url: "https://www.linkedin.com/in/pratik-kubal/",
    },
    {
      k: "twitter",
      label: "X",
      handle: "@pratik_kubal",
      url: "https://x.com/pratik_kubal",
    },
    {
      k: "email",
      label: "Email",
      handle: "pratik-kubal@outlook.com",
      url: "mailto:pratik-kubal@outlook.com",
    },
  ] as Social[],
  projects: [
    {
      id: "resume-qa",
      name: "resume-qa",
      year: "2025",
      status: "active",
      blurb:
        "Interactive AI-driven resume Q&A — the site you're on, backed by a RAG pipeline.",
      metric: "2x recruiter interactions",
    },
    {
      id: "rules-engine",
      name: "rules-engine",
      year: "2022",
      status: "shipped",
      blurb:
        "Java rules-based microservice for loan document classification, with PM-editable rules.",
      metric: "2.4x throughput",
    },
    {
      id: "srgan-compress",
      name: "srgan-compress",
      year: "2020",
      status: "archived",
      blurb:
        "SR-GAN for pathology gigapixel image compression — capstone research, featured at USCAP.",
      metric: "75% ratio gain",
    },
  ] as Project[],
  timeline: [
    {
      year: "2022—25",
      role: "Software Engineer II",
      where: "Dark Matter Technologies",
      what: "FinTech platform, Neptune→Aurora migration, CI/CD.",
    },
    {
      year: "2020—22",
      role: "Software Engineer I",
      where: "Dark Matter Technologies",
      what: "Java services, GraphQL, IaC on AWS.",
    },
    {
      year: "2017—20",
      role: "M.S. Computer Science",
      where: "University at Buffalo (SUNY)",
      what: "Distributed systems, ML, capstone on image compression.",
    },
    {
      year: "2013—17",
      role: "B.E. Computer Engineering",
      where: "University of Mumbai",
      what: "Core CS fundamentals, OOP, networks.",
    },
  ] as TimelineEntry[],
  prompts: [
    "What's his recent work?",
    "Tell me about the RAG app",
    "How do I get in touch?",
    "What's his stack?",
  ],
} as const;

export type Person = typeof person;
