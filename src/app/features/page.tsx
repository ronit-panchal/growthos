import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, Zap, Shield, FileText, BarChart3, Settings, Globe, Lock, CheckCircle, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

const features = [
  {
    id: 1,
    title: "Lead Management CRM",
    description: "Complete CRM system with Kanban pipeline, lead scoring, and contact management.",
    icon: Users,
    color: "bg-blue-500",
    benefits: [
      "Import leads from CSV, LinkedIn, or manual entry",
      "Score leads based on custom criteria",
      "Organize in Kanban pipeline stages",
      "Track communication history"
    ],
    useCases: [
      "Import leads from CSV, LinkedIn, or manual entry",
      "Score leads based on custom criteria",
      "Organize in Kanban pipeline stages",
      "Track prospect status from lead to close"
    ],
    availableIn: ["Free (10)", "Starter (500)", "Pro (5,000)", "Enterprise (Unlimited)"]
  },
  {
    id: 2,
    title: "AI Website Audits",
    description: "Automated website analysis providing SEO, UX, performance, and accessibility scores.",
    icon: Shield,
    color: "bg-green-500",
    benefits: [
      "Enter prospect's website URL",
      "AI analyzes SEO, performance, UX, accessibility",
      "Generate detailed PDF report with recommendations",
      "Use as lead magnet or sales tool"
    ],
    useCases: [
      "Enter prospect's website URL",
      "AI analyzes SEO, performance, UX, accessibility",
      "Generate detailed PDF report with recommendations",
      "Use as lead magnet or sales tool"
    ],
    availableIn: ["Free (1/mo)", "Starter (25/mo)", "Pro (100/mo)", "Enterprise (500/mo)"]
  },
  {
    id: 3,
    title: "AI Outreach Generator",
    description: "Intelligent campaign creation with customizable sequences for email and LinkedIn.",
    icon: Zap,
    color: "bg-purple-500",
    benefits: [
      "Select target leads",
      "Choose from proven templates (3/10/50/unlimited)",
      "Set up multi-touch sequences (email + LinkedIn)",
      "Track open rates, replies, and engagement"
    ],
    useCases: [
      "Select target leads",
      "Choose from proven templates or create custom",
      "Set up multi-touch sequences (email + LinkedIn)",
      "Track open rates, replies, and engagement"
    ],
    availableIn: ["Free (3 templates)", "Starter (10 campaigns)", "Pro (50 campaigns)", "Enterprise (Unlimited)"]
  },
  {
    id: 4,
    title: "Proposal Builder",
    description: "Professional proposal creation with customizable sections, pricing tables, and tracking.",
    icon: FileText,
    color: "bg-orange-500",
    benefits: [
      "Convert qualified leads to proposals",
      "Use AI to suggest services based on audit results",
      "Create professional proposals with pricing tables",
      "Track proposal status and follow-ups"
    ],
    useCases: [
      "Convert qualified leads to proposals",
      "Use AI to suggest services based on audit results",
      "Create professional proposals with pricing tables",
      "Track proposal status and follow-ups"
    ],
    availableIn: ["Free (1 template)", "Starter (5 templates)", "Pro (20 templates)", "Enterprise (Unlimited)"]
  },
  {
    id: 5,
    title: "Analytics & Optimization",
    description: "Comprehensive analytics and reporting for tracking performance and ROI.",
    icon: BarChart3,
    color: "bg-red-500",
    benefits: [
      "Monitor conversion rates at each stage",
      "A/B test outreach templates",
      "Track team performance metrics",
      "Optimize based on data insights"
    ],
    useCases: [
      "Monitor conversion rates at each stage",
      "A/B test outreach templates",
      "Track team performance metrics",
      "Optimize based on data insights"
    ],
    availableIn: ["Free (Basic)", "Starter (Basic)", "Pro (Advanced)", "Enterprise (Advanced + Custom)"]
  },
  {
    id: 6,
    title: "Team Collaboration",
    description: "Multi-user workspace with role-based access and collaboration tools.",
    icon: Settings,
    color: "bg-indigo-500",
    benefits: [
      "Role-based permissions",
      "Team activity tracking",
      "Shared workspaces",
      "Collaboration tools"
    ],
    useCases: [
      "Work together on leads and projects",
      "Maintain data security with roles",
      "Track team performance",
      "Scale operations efficiently"
    ],
    availableIn: ["1 user", "2 users", "5 users", "25+ users"]
  },
  {
    id: 7,
    title: "Integrations",
    description: "Connect with your favorite tools and streamline your workflow.",
    icon: Globe,
    color: "bg-teal-500",
    benefits: [
      "Third-party app integrations",
      "API access for custom solutions",
      "Webhook support",
      "Data synchronization"
    ],
    useCases: [
      "Connect existing tools",
      "Automate data transfer",
      "Build custom workflows",
      "Maintain data consistency"
    ],
    availableIn: ["Limited", "Basic", "Full", "Custom"]
  },
  {
    id: 8,
    title: "Security & Compliance",
    description: "Enterprise-grade security with data encryption and compliance standards.",
    icon: Lock,
    color: "bg-gray-500",
    benefits: [
      "256-bit SSL encryption",
      "GDPR compliance",
      "Regular security audits",
      "Data backup and recovery"
    ],
    useCases: [
      "Protect sensitive client data",
      "Maintain regulatory compliance",
      "Ensure business continuity",
      "Build client trust"
    ],
    availableIn: ["Standard", "Standard", "Enhanced", "Enterprise"]
  }
]

const plans = ["Free", "Starter", "Pro", "Enterprise"]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Platform Features</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Everything You Need to Grow
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to help agencies capture leads, deliver results, and scale operations.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.slice(0, 4).map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`${feature.color} rounded-lg p-3 w-fit mx-auto mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Detailed Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Detailed Feature Breakdown</h2>
          <div className="space-y-12">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className={`${feature.color} p-6 lg:p-8 flex items-center justify-center`}>
                      <div className="text-center text-white">
                        <Icon className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-white/90">{feature.description}</p>
                      </div>
                    </div>
                    <div className="lg:col-span-2 p-6 lg:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Key Benefits
                          </h4>
                          <ul className="space-y-2">
                            {feature.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Use Cases
                          </h4>
                          <ul className="space-y-2">
                            {feature.useCases.map((useCase, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span>{useCase}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-3">Available in Plans</h4>
                        <div className="flex flex-wrap gap-2">
                          {feature.availableIn.map((plan, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {plan}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Typical User Workflow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Typical User Workflow</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <CardHeader>
                  <CardTitle className="text-sm">Lead Capture</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Import from CSV, LinkedIn</li>
                    <li>Score leads by criteria</li>
                    <li>Organize in pipeline</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <CardHeader>
                  <CardTitle className="text-sm">Website Audits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Enter website URL</li>
                    <li>AI analyzes SEO, UX</li>
                    <li>Generate PDF report</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <CardHeader>
                  <CardTitle className="text-sm">Outreach</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Select target leads</li>
                    <li>Choose templates</li>
                    <li>Set up sequences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <CardHeader>
                  <CardTitle className="text-sm">Proposals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Convert leads to proposals</li>
                    <li>Create with pricing</li>
                    <li>Track status</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                <CardHeader>
                  <CardTitle className="text-sm">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>Monitor conversions</li>
                    <li>A/B test templates</li>
                    <li>Optimize performance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
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

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Feature</th>
                      {plans.map((plan) => (
                        <th key={plan} className="text-center p-4">{plan}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature) => (
                      <tr key={feature.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <feature.icon className="h-4 w-4 text-primary" />
                            <span className="font-medium">{feature.title}</span>
                          </div>
                        </td>
                        {feature.availableIn.map((availability, index) => (
                          <td key={index} className="text-center p-4">
                            {availability.includes("Unlimited") ? (
                              <Badge className="bg-green-100 text-green-800">Unlimited</Badge>
                            ) : availability.includes("Limited") ? (
                              <Badge variant="outline">Limited</Badge>
                            ) : availability.includes("Basic") ? (
                              <Badge variant="secondary">Basic</Badge>
                            ) : availability.includes("Advanced") ? (
                              <Badge className="bg-blue-100 text-blue-800">Advanced</Badge>
                            ) : availability.includes("Standard") ? (
                              <Badge variant="outline">Standard</Badge>
                            ) : availability.includes("Enhanced") ? (
                              <Badge className="bg-purple-100 text-purple-800">Enhanced</Badge>
                            ) : availability.includes("Enterprise") ? (
                              <Badge className="bg-orange-100 text-orange-800">Enterprise</Badge>
                            ) : availability.includes("user") ? (
                              <span className="text-sm">{availability}</span>
                            ) : availability.includes("mo") ? (
                              <span className="text-sm">{availability}</span>
                            ) : availability === "1" ? (
                              <span className="text-sm">1 template</span>
                            ) : availability === "5" ? (
                              <span className="text-sm">5 templates</span>
                            ) : availability === "20" ? (
                              <span className="text-sm">20 templates</span>
                            ) : availability === "10" ? (
                              <span className="text-sm">10 campaigns</span>
                            ) : availability === "50" ? (
                              <span className="text-sm">50 campaigns</span>
                            ) : availability === "25" ? (
                              <span className="text-sm">25 audits</span>
                            ) : availability === "100" ? (
                              <span className="text-sm">100 audits</span>
                            ) : availability === "500" ? (
                              <span className="text-sm">500 audits</span>
                            ) : availability === "2 users" ? (
                              <span className="text-sm">2 users</span>
                            ) : availability === "5 users" ? (
                              <span className="text-sm">5 users</span>
                            ) : availability === "25+ users" ? (
                              <span className="text-sm">25+ users</span>
                            ) : availability === "Full" ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : availability === "Custom" ? (
                              <Badge className="bg-orange-100 text-orange-800">Custom</Badge>
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Use Cases by Industry */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Industry Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Digital Marketing Agencies</CardTitle>
                <CardDescription>
                  Perfect for agencies managing multiple client campaigns and lead generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Multi-client management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Campaign tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">ROI reporting</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>SEO & Web Development</CardTitle>
                <CardDescription>
                  Ideal for agencies offering website audits and optimization services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Website audit tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Technical SEO analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Progress tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Consulting Firms</CardTitle>
                <CardDescription>
                  Great for consultants managing client relationships and proposals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Client management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Proposal generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Delivery tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Agency?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start with our free plan and upgrade as you grow. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
