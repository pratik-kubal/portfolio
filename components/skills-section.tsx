import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    title: "Languages",
    skills: ["Python", "Java", "JavaScript", "TypeScript", "Go", "SQL"],
  },
  {
    title: "Frameworks & Libraries",
    skills: ["Django", "FastAPI", "Spring Boot", "Node.js", "Express.js", "React"],
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Elasticsearch"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"],
  },
  {
    title: "Tools & Technologies",
    skills: ["Git", "Linux", "Nginx", "RabbitMQ", "Apache Kafka", "Microservices"],
  },
  {
    title: "Architecture",
    skills: ["REST APIs", "GraphQL", "Event-Driven", "CQRS", "Domain-Driven Design"],
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
