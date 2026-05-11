'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HeadphonesIcon, MessageSquare, BookOpen, Video, Mail, Phone, Clock, Search, CheckCircle, AlertCircle, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const helpCategories = [
    { id: "getting-started", name: "Getting Started", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    { id: "features", name: "Features", icon: HelpCircle, color: "bg-blue-100 text-blue-800" },
    { id: "billing", name: "Billing", icon: AlertCircle, color: "bg-orange-100 text-orange-800" },
    { id: "technical", name: "Technical Issues", icon: MessageSquare, color: "bg-red-100 text-red-800" }
  ]

  const helpArticles = [
    {
      id: 1,
      category: "getting-started",
      title: "How to Create Your First Account",
      description: "Step-by-step guide to setting up your GrowthOS account",
      difficulty: "Beginner",
      readTime: "3 min"
    },
    {
      id: 2,
      category: "getting-started",
      title: "Importing Your First Leads",
      description: "Learn how to import leads from CSV or manual entry",
      difficulty: "Beginner",
      readTime: "5 min"
    },
    {
      id: 3,
      category: "features",
      title: "Running Website Audits",
      description: "Complete guide to using AI-powered website audits",
      difficulty: "Intermediate",
      readTime: "8 min"
    },
    {
      id: 4,
      category: "features",
      title: "Creating Outreach Campaigns",
      description: "Set up automated email and LinkedIn sequences",
      difficulty: "Intermediate",
      readTime: "10 min"
    },
    {
      id: 5,
      category: "billing",
      title: "Understanding Your Subscription",
      description: "Learn about plans, billing cycles, and upgrades",
      difficulty: "Beginner",
      readTime: "4 min"
    },
    {
      id: 6,
      category: "technical",
      title: "Troubleshooting Login Issues",
      description: "Common login problems and how to fix them",
      difficulty: "Beginner",
      readTime: "3 min"
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <HeadphonesIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Support Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            How Can We Help You?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers, get support, and learn how to make the most of GrowthOS.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive guides and API docs
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/docs">Browse Docs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Step-by-step video guides
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/tutorials">Watch Videos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our support team
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get help via email
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search and Categories */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {helpCategories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                )
              })}
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Categories
              </Button>
            </div>
          </div>
        </div>

        {/* Help Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const category = helpCategories.find(cat => cat.id === article.category)
              return (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className={category?.color}>
                        {category?.name}
                      </Badge>
                      <Badge variant="outline">{article.readTime}</Badge>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{article.difficulty}</Badge>
                      <Button variant="ghost" size="sm">
                        Read More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Still Need Help?
              </CardTitle>
              <CardDescription>
                Can't find what you're looking for? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={4} placeholder="Describe your issue in detail..." />
              </div>
              <Button className="w-full">Send Support Request</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Support Availability
              </CardTitle>
              <CardDescription>
                Our support team is available during these hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@growthos.com</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">24/7</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Chat with our team</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">9 AM - 6 PM PST</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Enterprise Only</Badge>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Response Times</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Critical Issues</span>
                    <Badge variant="destructive" className="text-xs">1 hour</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Technical Support</span>
                    <Badge variant="secondary" className="text-xs">4 hours</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>General Questions</span>
                    <Badge variant="outline" className="text-xs">24 hours</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community */}
        <div className="mt-12 text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Connect with other GrowthOS users, share tips, and get help from our amazing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="https://discord.gg" target="_blank">
                Join Discord
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/blog">
                Read Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
