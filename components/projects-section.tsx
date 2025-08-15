import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "E-Commerce Microservices Platform",
    description:
      "Built a scalable e-commerce platform using microservices architecture with Docker and Kubernetes. Handles 100k+ daily transactions with 99.9% uptime.",
    technologies: ["Python", "Django", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
    github: "#",
    demo: "#",
  },
  {
    title: "Real-time Analytics Dashboard",
    description:
      "Developed a real-time analytics system processing millions of events per day using Apache Kafka and Elasticsearch for instant data visualization.",
    technologies: ["Java", "Spring Boot", "Apache Kafka", "Elasticsearch", "React", "WebSocket"],
    github: "#",
    demo: "#",
  },
  {
    title: "API Gateway & Authentication Service",
    description:
      "Created a centralized API gateway with JWT-based authentication, rate limiting, and request routing for multiple microservices.",
    technologies: ["Node.js", "Express.js", "JWT", "Redis", "MongoDB", "Nginx"],
    github: "#",
    demo: "#",
  },
  {
    title: "Distributed Task Queue System",
    description:
      "Built a distributed task processing system using RabbitMQ and Celery to handle background jobs and scheduled tasks efficiently.",
    technologies: ["Python", "Celery", "RabbitMQ", "PostgreSQL", "Docker", "Monitoring"],
    github: "#",
    demo: "#",
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Projects</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
