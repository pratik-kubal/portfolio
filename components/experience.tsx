"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { useReveal } from "@/lib/use-reveal";

const projects = [
  {
    title: "PDF Microprocessing Service",
    description:
      "Led creating faster, more scalable document-processing system to modernize the PDF processing workflow, working with DevOps, QA, and compliance teams to ensure a smooth rollout",
    technologies: ["Java", "AWS Step Functions", "AWS CloudFormation", "AWS Lambda", "Aspose PDF"], 
  },
  {
    title: "AWS Neptune to AWS RDS Migration",
    description:
      "Migrated a performance-critical microservice from AWS Neptune to AWS RDS under a tight deadline and zero tolerance for downtime, by coordinated across engineering, DevOps, QA, and compliance teams to plan, execute, and monitor the migration.",
    technologies: ["Node.Js", "Javascript", "Python", "AWS Neptune", "AWS RDS", "REST APIs", "Blue/Green Deployment"],
  },
  {
    title: "Optimizing a Graph Database",
    description:
      "Optimized End to End Graph database from deployment to query performance by better query design, caching, and better deployment pipeline which reduced costs by 10K per year and improved performance by more than 50% latency reduction.",
    technologies: ["Graph QL (Gremlin)", "Dynamo DB", "Cloudformation"],
  },
  {
    title: "Volunteer Technology & Data Strategy Consultant",
    description:
      "Collaborated with a team of 6 business professionals over 4 months to provide Breathing Room Foundation with a Technology & Data Strategy assistance. My role was to come up with a design, a plan of implementation, and costs of the design for integrating different systems used to gather data into a central location.",
    technologies: [],
  },
]

export function Experience() {
  const ref = useReveal();
  return (
    <section id="projects" className="py-20 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience</h2>

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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
