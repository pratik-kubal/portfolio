export type TopicId =
  | "events"
  | "shuttle"
  | "restaurants"
  | "jobs"
  | "parks"
  | "sponsor"
  | "safety"
  | "business"
  | "rehab"
  | "contact";

export interface Topic {
  id: TopicId;
  label: string;
  q: string;
  context: string;
}

export const TOPICS: Topic[] = [
  {
    id: "events",
    label: "Events",
    q: "How can I find events near me?",
    context:
      "University City hosts about 40 free public events per year — markets, outdoor films, jazz nights, concerts. Most happen between April and October at Drexel Square, Clark Park, Cedar Park, and 40th & Walnut.",
  },
  {
    id: "shuttle",
    label: "Shuttle Map",
    q: "Where does the City Shuttle run?",
    context:
      "The City Shuttle is a free continuous loop, weekdays 7am–7pm, with 6 stops between 30th St Station and Cedar Park (via Drexel Square, Penn Campus, Market & 40th, and Clark Park).",
  },
  {
    id: "restaurants",
    label: "Restaurants",
    q: "What restaurants do you recommend?",
    context:
      "There are 40+ restaurants in University City, ranging from longtime favorites (White Dog Café, Han Dynasty, Renata's Kitchen, Sang Kee Noodle) to new openings within a 10-minute walk of campus.",
  },
  {
    id: "jobs",
    label: "Jobs",
    q: "Can the city help me find a job?",
    context:
      "The Skills Initiative connects residents with hiring partners across health, hospitality, and the trades. Workflow: short profile (about 5 min) → coach matching → interview prep & wardrobe support → 90-day onboarding follow-up. Average match time last quarter: 11 days.",
  },
  {
    id: "parks",
    label: "Parks",
    q: "What parks are near me?",
    context:
      "Three parks in the district. Clark Park (9.1 acres — farmers market, off-leash, concerts). Cedar Park (2.4 acres — playground, jazz nights). Drexel Square (1.3 acres — food trucks, movies, wifi).",
  },
  {
    id: "sponsor",
    label: "Sponsor My Event",
    q: "Can the city sponsor my event?",
    context:
      "The city co-sponsors roughly 40 community events a year. Criteria: free and open to the public; hosted within district boundaries; submitted at least 6 weeks ahead; aligned with a community partner. Decisions in 10 business days.",
  },
  {
    id: "safety",
    label: "Clean & Safe",
    q: "What is the Clean & Safe program?",
    context:
      "Clean & Safe is the district's on-the-ground services team. By the numbers: 42 ambassadors, 7-day coverage, 14k bags of trash collected per year, average response under 5 minutes. Services: walk-alongs, graffiti reporting, escort requests.",
  },
  {
    id: "business",
    label: "Doing Business",
    q: "How do I start a business here?",
    context:
      "Three programs cover the full lifecycle of opening a storefront. Storefront Improvement: matching grants up to $15,000 for facade, signage, and lighting upgrades. Commercial Corridor Match: help finding the right block, broker, and rent benchmark. Permit Concierge: one human guides L&I, zoning, and health in parallel.",
  },
  {
    id: "rehab",
    label: "Home Rehab",
    q: "Can you help me rehab my home?",
    context:
      "The Home Repair Loan Program offers low-interest financing for owner-occupied homes within the district. Up to $25,000 per household; 0% interest for households under 80% AMI. Roof, plumbing, electrical, and accessibility work qualify.",
  },
  {
    id: "contact",
    label: "Contact",
    q: "How do I reach a real human?",
    context:
      "Contact channels. General questions: help@citydesk.org, Mon–Fri. Clean & Safe dispatch: (215) 555-0188, 24/7. Press: press@citydesk.org, Mon–Fri. Walk-in: 3940 Chestnut St, 9am–5pm.",
  },
];
