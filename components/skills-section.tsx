import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    title: "Languages",
    skills: ["Python", "Java", "JavaScript", "R", "SQL", "GraphQL", "Bash", "TLA+"],
  },
  {
    title: "Frameworks & Libraries",
    skills: ["Node.js", "Next.js", "React", "Angular", "Cucumber", "Cypress"],
  },
  {
    title: "Databases",
    skills: ["Graph Database (Gremlin)", "NoSQL (MongoDB)", "Relational (MySQL, PostgreSQL)"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["AWS 10+ services", "CI/CD", "ZDT Deployment", "Blue-Green Deployment"],
  },
  {
    title: "Tools & Technologies",
    skills: ["Git", "Linux", "Nginx", "Microservices", "Postman", "Splunk"],
  },
  {
    title: "Architecture",
    skills: ["REST APIs", "OpenAPI", "OAuth", "MISMO"],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Skills & Technologies</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
