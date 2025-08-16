import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About Me</h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm a passionate backend software developer with expertise in building scalable, high-performance systems.
              My journey in software development has been driven by a love for solving complex problems and creating
              efficient solutions.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              With experience in modern technologies and cloud platforms, I specialize in designing robust architectures
              that can handle millions of requests while maintaining optimal performance and reliability. I have 
              Achieved a 50% latency reduction in REST API Services, doubled document throughput of PDF processing in
              one quarter, and raised CI/CD success to 100% in two weeks by leveraging serverless architecture.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">5+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">10+</div>
                  <div className="text-sm text-muted-foreground">Complex Problems Solved</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <div className="w-64 h-64 bg-card rounded-full flex items-center justify-center">
                <div className="text-6xl">👨‍💻</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
