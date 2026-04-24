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
  pronunciation: "/ˈpraː.tIk ˈkuː.baːl/",
  bio: "I'm a full-stack software engineer with 5+ years building scalable, cloud-native microservices and APIs on AWS — mostly in FinTech. I've led database migrations, shipped CI/CD pipelines that cut deploys from days to hours.",
  eyebrow: "◦ a career, on the record",
  ledeBefore: "Engineer of ",
  ledeEm: "quiet",
  ledeAfter: " systems & sharp tools.",
  chatOpener:
    "Ask me anything you'd ask in a real screen.",
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
  projectsNote:
    "Fun fact — you're standing inside one of them right now. Try the chat above.",
  projects: [
    {
      id: "rules-engine",
      name: "rules-engine",
      year: "2022",
      status: "shipped",
      blurb:
        "Java rules-management microservice for loan document classification — Product Managers edit rules on the fly without redeploys, zero SLA breaches on AWS Lambda.",
      metric: "50K→120K pages/hr",
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
      year: "2025—now",
      role: "Independent · Pro Bono Leadership",
      where: "Compass Pro Bono · West Philly Porchfest",
      what: "Deputy Project Leader on a Compass Pro Bono engagement for the Children's Scholarship Fund of Philadelphia; web design and development volunteer for West Philly Porchfest; active AI-platform upskilling — Claude Code, Azure AI Engineer and AWS certifications in progress.",
    },
    {
      year: "2022—25",
      role: "Software Engineer II",
      where: "Dark Matter Technologies",
      what: "Led Neptune→Aurora Serverless migration (−90% API latency, ~$10K/yr saved) on the AIVA loan-processing platform; built CI/CD pipelines that cut deploys from 24h to 4h; shipped a self-service React micro-frontend and revived the cross-team code review program.",
    },
    {
      year: "2024",
      role: "Volunteer Engineer",
      where: "Compass Pro Bono",
      what: "Designed a Salesforce integration for a Philadelphia non-profit with a 4-person team — eliminated 4 of every 5 manual data-entry steps.",
    },
    {
      year: "2020—22",
      role: "Software Engineer I",
      where: "Dark Matter Technologies",
      what: "Rearchitected the Java loan-processing pipeline with parallel streams (2× throughput); optimized GraphQL endpoints (−900ms); raised org-wide automated test coverage to 70% via dependency injection; mentored 3 junior developers.",
    },
  ] as TimelineEntry[],
  education: [
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
    "Walk me through your background.",
    "What's your strongest technical project?",
    "Do you need visa sponsorship?",
    "Why the gap since May 2025?",
  ],
} as const;

export type Person = typeof person;
