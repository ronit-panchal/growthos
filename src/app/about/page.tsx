import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Zap, Shield, Globe, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">About GrowthOS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Empowering agencies to grow faster
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We built GrowthOS to solve the biggest challenge agencies face: managing lead generation, 
            client delivery, and business growth in one unified platform.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                To provide agencies with the tools they need to scale their operations, 
                increase revenue, and deliver exceptional results to their clients without 
                the complexity of managing multiple disconnected systems.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Customer Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your growth is our success. We're obsessed with helping agencies achieve their goals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We continuously push boundaries with AI-powered features that save time and drive results.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Trust & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your data is sacred. We maintain the highest standards of security and privacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  GrowthOS was born from a simple observation: agencies were struggling with fragmented tools. 
                  One system for leads, another for client work, a third for proposals, and yet another for analytics.
                </p>
                <p>
                  Our founders, experienced agency operators themselves, knew there had to be a better way. 
                  They envisioned a unified platform that would handle everything from lead capture to client delivery.
                </p>
                <p>
                  Today, GrowthOS serves thousands of agencies worldwide, helping them streamline operations, 
                  increase revenue, and deliver exceptional results to their clients.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                  <p className="text-sm text-muted-foreground">Agencies Trust GrowthOS</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">$50M+</div>
                  <p className="text-sm text-muted-foreground">Revenue Generated</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                  <p className="text-sm text-muted-foreground">Uptime Guarantee</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-sm text-muted-foreground">Support Available</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-full mx-auto mb-4"></div>
                <CardTitle>Sarah Chen</CardTitle>
                <CardDescription>CEO & Co-Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Former agency operator with 15+ years experience scaling digital agencies.
                </p>
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary">Leadership</Badge>
                  <Badge variant="secondary">Strategy</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-full mx-auto mb-4"></div>
                <CardTitle>Alex Rodriguez</CardTitle>
                <CardDescription>CTO & Co-Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Full-stack engineer passionate about building scalable SaaS solutions.
                </p>
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary">Engineering</Badge>
                  <Badge variant="secondary">AI/ML</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-full mx-auto mb-4"></div>
                <CardTitle>Emily Johnson</CardTitle>
                <CardDescription>Head of Product</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Product visionary focused on creating intuitive user experiences.
                </p>
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary">Design</Badge>
                  <Badge variant="secondary">UX</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Join the Growth Revolution</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Thousands of agencies are already using GrowthOS to scale their operations. 
            Isn't it time you joined them?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
