'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Database, Users, FileText, Zap, Shield, Globe, CheckCircle, Copy, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const apiEndpoints = [
  {
    method: "GET",
    path: "/api/leads",
    description: "Retrieve all leads for the authenticated user",
    parameters: [],
    response: "Array of lead objects",
    example: `curl -X GET https://api.growthos.com/leads \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    codeExample: `const response = await fetch('/api/leads', {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`
  }
});
const leads = await response.json();`
  },
  {
    method: "POST",
    path: "/api/leads",
    description: "Create a new lead",
    parameters: ["name", "email", "company", "phone", "website"],
    response: "Created lead object",
    example: `curl -X POST https://api.growthos.com/leads \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp"
  }'`,
    codeExample: `const newLead = {
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp"
};

const response = await fetch('/api/leads', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newLead)
});`
  },
  {
    method: "POST",
    path: "/api/audits",
    description: "Start a new website audit",
    parameters: ["url"],
    response: "Audit job object with ID",
    example: `curl -X POST https://api.growthos.com/audits \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`,
    codeExample: `const audit = await fetch('/api/audits', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com'
  })
});`
  },
  {
    method: "GET",
    path: "/api/audits/{id}",
    description: "Get audit results by ID",
    parameters: ["id"],
    response: "Audit object with results",
    example: `curl -X GET https://api.growthos.com/audits/123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    codeExample: `const auditId = '123';
const response = await fetch(\`/api/audits/\${auditId}\`, {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`
  }
});
const audit = await response.json();`
  }
]

const webhooks = [
  {
    event: "lead.created",
    description: "Triggered when a new lead is created",
    payload: `{
  "event": "lead.created",
  "data": {
    "id": "lead_123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-12-01T10:00:00Z"
  }
}`
  },
  {
    event: "audit.completed",
    description: "Triggered when a website audit is completed",
    payload: `{
  "event": "audit.completed",
  "data": {
    "id": "audit_456",
    "url": "https://example.com",
    "overallScore": 85,
    "completedAt": "2024-12-01T10:30:00Z"
  }
}`
  },
  {
    event: "proposal.sent",
    description: "Triggered when a proposal is sent to a client",
    payload: `{
  "event": "proposal.sent",
  "data": {
    "id": "proposal_789",
    "clientName": "Acme Corp",
    "totalValue": 5000,
    "sentAt": "2024-12-01T11:00:00Z"
  }
}`
  }
]

export default function APIPage() {
  const [copiedCode, setCopiedCode] = useState("")

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Code className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">API Documentation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Developer API
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate GrowthOS into your applications with our RESTful API and webhooks.
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Get started with the GrowthOS API in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Get API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate your API key from the dashboard settings.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Authenticate</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your API key in the Authorization header.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-lg p-3 w-fit mx-auto mb-3">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Make Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Start making API calls to manage your data.
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Authentication</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY")}
                  >
                    {copiedCode === "Authorization: Bearer YOUR_API_KEY" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <code className="text-sm bg-background p-2 rounded block">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">API Endpoints</h2>
          <div className="space-y-8">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-lg font-mono">{endpoint.path}</code>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Parameters</h4>
                    {endpoint.parameters.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {endpoint.parameters.map((param) => (
                          <Badge key={param} variant="outline" className="font-mono">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No parameters required</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <p className="text-sm text-muted-foreground">{endpoint.response}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">cURL Example</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.example)}
                      >
                        {copiedCode === endpoint.example ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{endpoint.example}</code>
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">JavaScript Example</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(endpoint.codeExample)}
                      >
                        {copiedCode === endpoint.codeExample ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{endpoint.codeExample}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Webhooks */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Webhooks</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Webhook Events
              </CardTitle>
              <CardDescription>
                Receive real-time notifications about events in your GrowthOS account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {webhooks.map((webhook, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{webhook.event}</CardTitle>
                      <CardDescription>{webhook.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        <code>{webhook.payload}</code>
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Setting Up Webhooks</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Create a webhook endpoint in your application</li>
                  <li>2. Add the webhook URL in your GrowthOS dashboard</li>
                  <li>3. Select the events you want to receive</li>
                  <li>4. Test your webhook endpoint</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rate Limits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Rate Limits</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">Free Plan</div>
                  <p className="text-sm text-muted-foreground">100 requests/hour</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">Starter Plan</div>
                  <p className="text-sm text-muted-foreground">1,000 requests/hour</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">Pro Plan</div>
                  <p className="text-sm text-muted-foreground">10,000 requests/hour</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Rate limit headers are included in all API responses: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SDKs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">SDKs & Libraries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 w-fit mx-auto mb-4">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">JavaScript</h3>
                <p className="text-sm text-muted-foreground mb-4">npm install growthos-js</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 w-fit mx-auto mb-4">
                  <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Python</h3>
                <p className="text-sm text-muted-foreground mb-4">pip install growthos-python</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3 w-fit mx-auto mb-4">
                  <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Ruby</h3>
                <p className="text-sm text-muted-foreground mb-4">gem install growthos-ruby</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-3 w-fit mx-auto mb-4">
                  <Code className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">PHP</h3>
                <p className="text-sm text-muted-foreground mb-4">composer require growthos/php</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our developer support team is here to help you integrate GrowthOS into your applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/support">
                Contact Support
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://github.com/growthos/api-examples" target="_blank">
                View Examples <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
