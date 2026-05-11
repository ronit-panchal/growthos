import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Zap, Shield, HeadphonesIcon, Rocket, CheckCircle, ArrowRight, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Everything you need to succeed
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how to use GrowthOS to accelerate your agency growth, from lead capture to proposal delivery.
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Lead Capture</CardTitle>
                <CardDescription>
                  Import leads from CSV, LinkedIn, or manual entry. Score leads based on custom criteria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/leads">
                    Add Leads <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">2. Website Audits</CardTitle>
                <CardDescription>
                  Enter prospect's website URL. AI analyzes SEO, performance, UX, accessibility.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/audits">
                    Run Audit <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">3. Outreach</CardTitle>
                <CardDescription>
                  Select target leads. Choose from proven templates. Set up multi-touch sequences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/outreach">
                    Start Outreach <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">4. Proposals</CardTitle>
                <CardDescription>
                  Convert qualified leads to proposals. Create with pricing tables. Track status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/proposals">
                    Create Proposal <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">5. Analytics</CardTitle>
                <CardDescription>
                  Monitor conversion rates. A/B test templates. Optimize based on data insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard">
                    View Analytics <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Documentation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lead Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Lead Management
                </CardTitle>
                <CardDescription>
                  Complete CRM system with pipeline management and lead scoring.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What you can do:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Import leads from CSV, LinkedIn, or manual entry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Organize leads in Kanban pipeline stages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Score leads based on custom criteria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Track communication history and notes</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits for your business:</h4>
                  <p className="text-sm text-muted-foreground">
                    Never lose track of potential clients. Convert 30% more leads with systematic follow-up and pipeline management.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Website Audits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  AI Website Audits
                </CardTitle>
                <CardDescription>
                  Automated website analysis with actionable insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What you can do:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Analyze SEO, performance, UX, and accessibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Generate detailed PDF reports with recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Use as lead magnet or sales tool</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Track audit history and improvements</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits for your business:</h4>
                  <p className="text-sm text-muted-foreground">
                    Impress prospects with professional audits. Close deals faster by showing concrete improvement opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Outreach Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Outreach Campaigns
                </CardTitle>
                <CardDescription>
                  AI-powered email and LinkedIn outreach sequences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What you can do:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Create multi-touch outreach sequences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Choose from proven templates or customize</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Set different tones (professional, casual, friendly)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Track open rates, replies, and engagement</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits for your business:</h4>
                  <p className="text-sm text-muted-foreground">
                    Save 20+ hours per week on manual outreach. Increase response rates by 40% with AI-optimized sequences.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Proposal Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Proposal Builder
                </CardTitle>
                <CardDescription>
                  Professional proposals with pricing and tracking.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What you can do:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Create professional proposals with custom sections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Add pricing tables and payment terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Track proposal views and engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Convert leads directly to proposals</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits for your business:</h4>
                  <p className="text-sm text-muted-foreground">
                    Create proposals 5x faster. Track client engagement and follow up at the right time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Key Benefits for Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">20+</div>
                  <p className="text-sm text-muted-foreground">Hours saved per week on manual tasks</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">30-50%</div>
                  <p className="text-sm text-muted-foreground">Increase in lead conversion rates</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Faster</div>
                  <p className="text-sm text-muted-foreground">Close deals with automated follow-ups</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Professional</div>
                  <p className="text-sm text-muted-foreground">Tools without enterprise pricing</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Unified</div>
                  <p className="text-sm text-muted-foreground">All data in one place, no scattered spreadsheets</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Scalable</div>
                  <p className="text-sm text-muted-foreground">Grow from freelancer to enterprise</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Free", users: "Freelancers", description: "Test the platform" },
              { name: "Starter", users: "Small agencies", description: "Grow your client base" },
              { name: "Pro", users: "Growing teams", description: "Scale operations" },
              { name: "Enterprise", users: "Large agencies", description: "Custom solutions" }
            ].map((plan, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.users}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/pricing">
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <HeadphonesIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our support team is here to help you get the most out of GrowthOS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/support">
                Contact Support
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tutorials">
                Watch Tutorials
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
