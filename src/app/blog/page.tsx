import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, TrendingUp, Zap, Target, Users } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "10 Ways to Increase Your Agency's Lead Conversion Rate",
    excerpt: "Discover proven strategies to turn more leads into paying clients using data-driven approaches and automation.",
    author: "Sarah Chen",
    date: "2024-12-01",
    readTime: "8 min",
    category: "Lead Generation",
    image: "/blog/conversion-rate.jpg",
    featured: true,
    tags: ["conversion", "leads", "strategy"]
  },
  {
    id: 2,
    title: "The Ultimate Guide to Website Audits for Agencies",
    excerpt: "Learn how to perform comprehensive website audits that impress prospects and demonstrate your expertise.",
    author: "Alex Rodriguez",
    date: "2024-11-28",
    readTime: "12 min",
    category: "Audits",
    image: "/blog/website-audits.jpg",
    featured: false,
    tags: ["audits", "technical", "prospecting"]
  },
  {
    id: 3,
    title: "Automating Your Outreach: A Complete Guide",
    excerpt: "Save 20+ hours per week with intelligent outreach automation that still feels personal and authentic.",
    author: "Emily Johnson",
    date: "2024-11-25",
    readTime: "10 min",
    category: "Outreach",
    image: "/blog/outreach-automation.jpg",
    featured: false,
    tags: ["automation", "outreach", "efficiency"]
  },
  {
    id: 4,
    title: "Pricing Strategies for Digital Agencies in 2024",
    excerpt: "How to price your services profitably while remaining competitive in today's market.",
    author: "Sarah Chen",
    date: "2024-11-22",
    readTime: "6 min",
    category: "Business",
    image: "/blog/pricing-strategies.jpg",
    featured: false,
    tags: ["pricing", "business", "strategy"]
  },
  {
    id: 5,
    title: "Building a Proposal That Converts: Data-Driven Approach",
    excerpt: "Create proposals that address client pain points and demonstrate clear ROI.",
    author: "Alex Rodriguez",
    date: "2024-11-20",
    readTime: "9 min",
    category: "Proposals",
    image: "/blog/proposal-conversion.jpg",
    featured: false,
    tags: ["proposals", "conversion", "client success"]
  },
  {
    id: 6,
    title: "Scaling Your Agency: From 1 to 10 Employees",
    excerpt: "Practical steps to scale your agency operations without sacrificing quality or client satisfaction.",
    author: "Emily Johnson",
    date: "2024-11-18",
    readTime: "15 min",
    category: "Growth",
    image: "/blog/scaling-agency.jpg",
    featured: false,
    tags: ["scaling", "team", "operations"]
  }
]

const categories = [
  { name: "Lead Generation", icon: Target, count: 3 },
  { name: "Audits", icon: Zap, count: 2 },
  { name: "Outreach", icon: Users, count: 2 },
  { name: "Business", icon: TrendingUp, count: 4 },
  { name: "Proposals", icon: Target, count: 2 },
  { name: "Growth", icon: TrendingUp, count: 3 }
]

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">GrowthOS Blog</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Insights for Agency Growth
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert tips, strategies, and case studies to help you scale your agency and close more deals.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                    <Badge className="mb-4">Featured Article</Badge>
                    <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <Button size="lg" asChild>
                      <Link href={`/blog/${featuredPost.id}`}>
                        Read Full Article <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
                        <p className="text-sm text-muted-foreground">Higher Conversion Rates</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
                        <p className="text-sm text-muted-foreground">Hours Saved Weekly</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">3x</div>
                        <p className="text-sm text-muted-foreground">Faster Deal Closing</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                        <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} articles</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link href={`/blog/${post.id}`}>
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest agency growth strategies, product updates, and exclusive content delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
            />
            <Button>Subscribe</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
