import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Your Privacy Matters
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're committed to protecting your data and being transparent about how we use it.
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

        {/* Privacy Content */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
              <CardDescription>
                We collect information to provide, maintain, and improve our services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Company name and role</li>
                  <li>Authentication credentials</li>
                  <li>Payment information (processed securely by third parties)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Feature usage and interaction patterns</li>
                  <li>Performance metrics and error reports</li>
                  <li>Session duration and frequency</li>
                  <li>IP address and device information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Data</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Lead information and contact details</li>
                  <li>Website audit results and reports</li>
                  <li>Outreach campaigns and communications</li>
                  <li>Proposal content and client information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                How We Use Your Information
              </CardTitle>
              <CardDescription>
                We use your information to provide and improve our services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Service Provision</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Provide core platform functionality</li>
                    <li>• Process your business data</li>
                    <li>• Generate reports and insights</li>
                    <li>• Enable team collaboration</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Communication</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Send transactional emails</li>
                    <li>• Provide customer support</li>
                    <li>• Share product updates</li>
                    <li>• Send security notifications</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Improvement</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve user experience</li>
                    <li>• Develop new features</li>
                    <li>• Optimize performance</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Security</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Detect and prevent fraud</li>
                    <li>• Ensure data integrity</li>
                    <li>• Comply with legal requirements</li>
                    <li>• Maintain system security</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Data Security
              </CardTitle>
              <CardDescription>
                We implement industry-standard security measures to protect your data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Technical Security</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 256-bit SSL encryption</li>
                    <li>• Encrypted database storage</li>
                    <li>• Regular security audits</li>
                    <li>• Secure authentication protocols</li>
                    <li>• Automated security monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Access Control</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Role-based permissions</li>
                    <li>• Multi-factor authentication</li>
                    <li>• Session management</li>
                    <li>• Audit logging</li>
                    <li>• Employee access controls</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Your Rights and Choices
              </CardTitle>
              <CardDescription>
                You have control over your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Access & Correction</h4>
                  <p className="text-sm text-muted-foreground">
                    View, update, or correct your personal information at any time through your account settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Portability</h4>
                  <p className="text-sm text-muted-foreground">
                    Export your data in a structured, machine-readable format at any time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Deletion</h4>
                  <p className="text-sm text-muted-foreground">
                    Request deletion of your account and associated data, subject to legal requirements.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Opt-Out</h4>
                  <p className="text-sm text-muted-foreground">
                    Opt out of marketing communications while maintaining access to essential services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Third-Party Services
              </CardTitle>
              <CardDescription>
                We work with trusted third parties to provide our services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Payment Processors</h4>
                  <p className="text-sm text-muted-foreground">
                    We use Stripe and Razorpay to process payments securely. Your payment information is never stored on our servers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Email Services</h4>
                  <p className="text-sm text-muted-foreground">
                    Transactional emails are sent through secure email providers to ensure reliable delivery.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    We use analytics tools to understand how our service is used and improve it continuously.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                If you have questions about this privacy policy, please contact us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Privacy Questions</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: privacy@growthos.com<br />
                    Response time: Within 48 hours
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: dpo@growthos.com<br />
                    For GDPR and data protection inquiries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card className="border-muted-foreground/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Policy Updates:</strong> We may update this privacy policy from time to time. 
                We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
