import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Clock, Users, Target, Zap, Shield, FileText, Star, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const tutorials = [
  {
    id: 1,
    title: "Getting Started with GrowthOS",
    description: "Complete walkthrough of setting up your account and understanding the dashboard.",
    duration: "15 min",
    difficulty: "Beginner",
    category: "Getting Started",
    thumbnail: "/tutorials/getting-started.jpg",
    videoUrl: "#",
    featured: true,
    topics: ["Account setup", "Dashboard overview", "Basic navigation"]
  },
  {
    id: 2,
    title: "Lead Management Mastery",
    description: "Learn how to import, organize, and manage your leads effectively.",
    duration: "22 min",
    difficulty: "Beginner",
    category: "Leads",
    thumbnail: "/tutorials/lead-management.jpg",
    videoUrl: "#",
    featured: false,
    topics: ["Lead import", "CRM setup", "Pipeline management"]
  },
  {
    id: 3,
    title: "Running Website Audits",
    description: "Step-by-step guide to performing comprehensive website audits.",
    duration: "18 min",
    difficulty: "Intermediate",
    category: "Audits",
    thumbnail: "/tutorials/website-audits.jpg",
    videoUrl: "#",
    featured: false,
    topics: ["Audit setup", "Analysis tools", "Report generation"]
  },
  {
    id: 4,
    title: "Creating Outreach Campaigns",
    description: "Build automated outreach sequences that convert prospects into clients.",
    duration: "25 min",
    difficulty: "Intermediate",
    category: "Outreach",
    thumbnail: "/tutorials/outreach-campaigns.jpg",
    videoUrl: "#",
    featured: false,
    topics: ["Campaign setup", "Email templates", "Automation rules"]
  },
  {
    id: 5,
    title: "Professional Proposal Creation",
    description: "Create compelling proposals that win clients and showcase your value.",
    duration: "20 min",
    difficulty: "Intermediate",
    category: "Proposals",
    thumbnail: "/tutorials/proposal-creation.jpg",
    videoUrl: "#",
    featured: false,
    topics: ["Proposal templates", "Pricing tables", "Client presentation"]
  },
  {
    id: 6,
    title: "Team Collaboration Features",
    description: "How to effectively collaborate with your team using GrowthOS.",
    duration: "16 min",
    difficulty: "Advanced",
    category: "Teams",
    thumbnail: "/tutorials/team-collaboration.jpg",
    videoUrl: "#",
    featured: false,
    topics: ["Team invites", "Role management", "Workflow automation"]
  },
  {
    id: 7,
    title: "Analytics and Reporting",
    description: "Understanding your metrics and creating insightful reports.",
    duration: "19 min",
    difficulty: "Advanced",
    category: "Analytics",
    thumbnail: "/tutorials/analytics-reporting.jpg",
    videoUrl: "#",
    featured: false,
    topics: ["Dashboard metrics", "Custom reports", "Data export"]
  },
  {
    id: 8,
    title: "Advanced Automation Workflows",
    description: "Set up complex automation to save time and increase efficiency.",
    duration: "28 min",
    difficulty: "Advanced",
    category: "Automation",
    thumbnail: "/tutorials/automation-workflows.jpg",
    videoUrl: "#",
    featured: false,
    topics: ["Workflow builder", "Triggers and actions", "Integration setup"]
  }
]

const categories = [
  { name: "Getting Started", icon: Target, count: 1, color: "bg-green-100 text-green-800" },
  { name: "Leads", icon: Users, count: 1, color: "bg-blue-100 text-blue-800" },
  { name: "Audits", icon: Shield, count: 1, color: "bg-purple-100 text-purple-800" },
  { name: "Outreach", icon: Zap, count: 1, color: "bg-orange-100 text-orange-800" },
  { name: "Proposals", icon: FileText, count: 1, color: "bg-pink-100 text-pink-800" },
  { name: "Teams", icon: Users, count: 1, color: "bg-indigo-100 text-indigo-800" },
  { name: "Analytics", icon: Target, count: 1, color: "bg-red-100 text-red-800" },
  { name: "Automation", icon: Zap, count: 1, color: "bg-yellow-100 text-yellow-800" }
]

export default function TutorialsPage() {
  const featuredTutorial = tutorials.find(tutorial => tutorial.featured)
  const regularTutorials = tutorials.filter(tutorial => !tutorial.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Play className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Video Tutorials</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Learn by Watching
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Step-by-step video tutorials to help you master GrowthOS and grow your agency faster.
          </p>
        </div>

        {/* Featured Tutorial */}
        {featuredTutorial && (
          <div className="mb-16">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-primary/20 rounded-full p-6 w-fit mx-auto mb-6">
                      <Play className="h-12 w-12 text-primary" />
                    </div>
                    <Badge className="mb-4">Featured Tutorial</Badge>
                    <h2 className="text-2xl font-bold mb-4">{featuredTutorial.title}</h2>
                    <p className="text-muted-foreground mb-6">{featuredTutorial.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredTutorial.duration}</span>
                      </div>
                      <Badge variant="outline">{featuredTutorial.difficulty}</Badge>
                    </div>
                    <div className="flex gap-3">
                      <Button size="lg" asChild>
                        <Link href={featuredTutorial.videoUrl}>
                          <Play className="h-4 w-4 mr-2" />
                          Watch Now
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href={`/tutorials/${featuredTutorial.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-semibold mb-4">What You'll Learn</h3>
                  <div className="space-y-3">
                    {featuredTutorial.topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Perfect for beginners</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This tutorial covers everything you need to get started with GrowthOS, 
                      even if you have no prior experience.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} tutorial</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* All Tutorials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{tutorial.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{tutorial.duration}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{tutorial.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    {tutorial.topics.slice(0, 2).map((topic, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{topic}</span>
                      </div>
                    ))}
                    {tutorial.topics.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{tutorial.topics.length - 2} more topics
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={tutorial.videoUrl}>
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/tutorials/${tutorial.id}`}>
                        Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Get Started", description: "Account setup and basics", tutorial: tutorials[0] },
              { step: 2, title: "Manage Leads", description: "Import and organize leads", tutorial: tutorials[1] },
              { step: 3, title: "Run Audits", description: "Website analysis", tutorial: tutorials[2] },
              { step: 4, title: "Scale Operations", description: "Advanced features", tutorial: tutorials[7] }
            ].map((step) => (
              <Card key={step.step} className="relative">
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {step.step}
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href={step.tutorial.videoUrl}>
                      Start Learning
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Complement your learning with our comprehensive documentation and community support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  In-depth guides and API documentation
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/docs">Browse Docs</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our Discord community for help and tips
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="https://discord.gg" target="_blank">Join Discord</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Blog</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Latest tips and industry insights
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/blog">Read Blog</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
