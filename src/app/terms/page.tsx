import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Shield, Users, CreditCard, AlertTriangle, CheckCircle } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Terms of Service</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            By using GrowthOS, you agree to these terms and conditions.
          </p>
        </div>

        {/* Last Updated */}
        <div className="mb-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Last Updated:</strong> December 2024 | 
                <strong>Effective Date:</strong> December 1, 2024
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terms Content */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Acceptance of Terms
              </CardTitle>
              <CardDescription>
                By accessing and using GrowthOS, you accept and agree to be bound by these terms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you do not agree to these terms, you may not access or use GrowthOS. 
                These terms apply to all users of the service, including without limitation users who are browsers, 
                vendors, customers, merchants, and/or contributors of content.
              </p>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Description of Service
              </CardTitle>
              <CardDescription>
                GrowthOS is an AI-powered agency operating system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Core Features</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Lead management and CRM functionality</li>
                    <li>AI-powered website audits and analysis</li>
                    <li>Automated outreach campaign generation</li>
                    <li>Professional proposal creation and tracking</li>
                    <li>Team collaboration and management tools</li>
                    <li>Analytics and reporting dashboards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Availability</h4>
                  <p className="text-sm text-muted-foreground">
                    We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. 
                    The service may be temporarily unavailable for maintenance, updates, or other reasons.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Accounts
              </CardTitle>
              <CardDescription>
                Account creation, responsibilities, and security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Account Creation</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>You must provide accurate, complete, and current information</li>
                    <li>You must be of legal age to enter into a binding contract</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>One person or entity may not maintain more than one free account</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Account Responsibilities</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Maintain the confidentiality of your password</li>
                    <li>Notify us immediately of unauthorized use</li>
                    <li>Provide accurate contact information</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plans and Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Subscription Plans and Billing
              </CardTitle>
              <CardDescription>
                Pricing, payment terms, and subscription management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Subscription Plans</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Free: 10 leads, 1 audit/month, basic features</li>
                    <li>Starter ($49/month): 500 leads, 25 audits/month, advanced features</li>
                    <li>Pro ($149/month): 5,000 leads, 100 audits/month, full features</li>
                    <li>Enterprise ($499/month): Unlimited leads, custom features</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Terms</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Monthly subscriptions are billed in advance</li>
                    <li>Annual subscriptions receive a 20% discount</li>
                    <li>All payments are processed through secure third-party processors</li>
                    <li>Prices are subject to change with 30 days notice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Refunds</h4>
                  <p className="text-sm text-muted-foreground">
                    We offer a 30-day money-back guarantee for new paid subscriptions. 
                    After 30 days, refunds are provided at our discretion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Acceptable Use
              </CardTitle>
              <CardDescription>
                Guidelines for using GrowthOS responsibly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Permitted Uses</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Managing legitimate business leads and contacts</li>
                    <li>Creating professional proposals for clients</li>
                    <li>Conducting website audits for business purposes</li>
                    <li>Collaborating with team members</li>
                    <li>Analyzing business metrics and performance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Prohibited Uses</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Sending unsolicited bulk communications (spam)</li>
                    <li>Using the service for illegal activities</li>
                    <li>Violating applicable laws or regulations</li>
                    <li>Infringing on intellectual property rights</li>
                    <li>Attempting to gain unauthorized access to systems</li>
                    <li>Reselling or redistributing the service</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
              <CardDescription>
                Ownership of content and intellectual property.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">GrowthOS Property</h4>
                  <p className="text-sm text-muted-foreground">
                    The service, including its software, text, graphics, logos, and interfaces, 
                    is owned by GrowthOS and protected by intellectual property laws.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">User Content</h4>
                  <p className="text-sm text-muted-foreground">
                    You retain ownership of content you create or upload. You grant us a license 
                    to use, modify, and display your content solely to provide the service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Feedback</h4>
                  <p className="text-sm text-muted-foreground">
                    Any feedback or suggestions you provide may be used by GrowthOS to improve 
                    the service without obligation or compensation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                How we handle your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the service, to understand our practices. By using GrowthOS, you consent 
                to the collection and use of information as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Termination
              </CardTitle>
              <CardDescription>
                Account termination and service discontinuation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">User Termination</h4>
                  <p className="text-sm text-muted-foreground">
                    You may terminate your account at any time through your account settings or by 
                    contacting our support team. No refunds will be provided for partial months.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">GrowthOS Termination</h4>
                  <p className="text-sm text-muted-foreground">
                    We may suspend or terminate your account for violation of these terms, 
                    non-payment, or other reasons at our discretion. We will provide notice 
                    when possible, except in cases of immediate termination.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Effect of Termination</h4>
                  <p className="text-sm text-muted-foreground">
                    Upon termination, your right to use the service ceases immediately. 
                    We may delete your data after 90 days unless required by law to retain it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Disclaimer of Warranties</CardTitle>
              <CardDescription>
                Service provided "as is" without warranties.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                GrowthOS is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, 
                expressed or implied, and hereby disclaim all warranties including, without limitation, 
                implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
              <CardDescription>
                Limits on our liability for damages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                In no event shall GrowthOS, its directors, employees, partners, or agents be liable 
                for any indirect, incidental, special, consequential, or punitive damages, including 
                lost profits, data loss, or other damages arising from your use of the service.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
              <CardDescription>
                Jurisdiction and dispute resolution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These terms shall be governed by and construed in accordance with the laws of the 
                jurisdiction in which GrowthOS operates, without regard to conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How to reach us with questions about these terms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">General Inquiries</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: legal@growthos.com<br />
                    Response time: Within 48 hours
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: support@growthos.com<br />
                    Response time: Within 24 hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="border-muted-foreground/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Changes to Terms:</strong> We reserve the right to modify these terms at any time. 
                Changes will be effective immediately upon posting. Your continued use of the service 
                constitutes acceptance of any modifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
