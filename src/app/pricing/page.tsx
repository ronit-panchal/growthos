import { Check, Star, Zap, Shield, HeadphonesIcon, Rocket } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started and testing the platform",
    price: "$0",
    period: "/month",
    features: [
      "10 leads maximum",
      "1 website audit per month",
      "3 basic outreach templates",
      "1 proposal template",
      "Email support",
      "Single user",
      "Basic analytics"
    ],
    notIncluded: [
      "Custom branding",
      "API access",
      "Priority support",
      "Team collaboration",
      "Advanced reporting"
    ],
    popular: false,
    cta: "Get Started",
    ctaLink: "/register"
  },
  {
    name: "Starter",
    description: "Ideal for freelancers and small agencies",
    price: "$49",
    period: "/month",
    features: [
      "500 leads",
      "25 website audits per month",
      "10 outreach campaigns",
      "5 proposal templates",
      "Basic analytics dashboard",
      "Email + chat support",
      "2 team members",
      "Custom branding options",
      "API access (read-only)"
    ],
    notIncluded: [
      "Advanced analytics",
      "Priority support",
      "White-label options",
      "Custom integrations"
    ],
    popular: true,
    cta: "Start Free Trial",
    ctaLink: "/register?plan=starter"
  },
  {
    name: "Pro",
    description: "For growing agencies and teams",
    price: "$149",
    period: "/month",
    features: [
      "5,000 leads",
      "100 website audits per month",
      "50 outreach campaigns",
      "20 proposal templates",
      "Advanced analytics + reporting",
      "Priority support",
      "5 team members",
      "Custom branding",
      "Full API access",
      "Custom integrations",
      "Advanced workflows"
    ],
    notIncluded: [
      "White-label options",
      "Dedicated account manager",
      "SLA guarantee"
    ],
    popular: false,
    cta: "Start Free Trial",
    ctaLink: "/register?plan=pro"
  },
  {
    name: "Enterprise",
    description: "For large agencies and custom needs",
    price: "$499",
    period: "/month",
    features: [
      "Unlimited leads",
      "500 website audits per month",
      "Unlimited outreach campaigns",
      "Unlimited proposal templates",
      "White-label options",
      "Dedicated account manager",
      "25+ team members",
      "Custom integrations",
      "Advanced security features",
      "SLA guarantee",
      "Priority phone support",
      "Custom training sessions"
    ],
    notIncluded: [],
    popular: false,
    cta: "Contact Sales",
    ctaLink: "/contact?plan=enterprise"
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Choose your growth plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. All plans include our core features with no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm">Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary scale-105 shadow-xl' : 'border-border/50'} hover:shadow-lg transition-all duration-300`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className={`w-full mb-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  asChild
                >
                  <Link href={plan.ctaLink}>
                    {plan.cta}
                  </Link>
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2 opacity-50">
                      <div className="h-4 w-4 border border-muted-foreground rounded-sm mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to grow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="bg-primary/10 rounded-lg p-3 h-fit">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized performance with instant loading times and smooth interactions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 rounded-lg p-3 h-fit">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with 99.9% uptime guarantee.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 rounded-lg p-3 h-fit">
                <HeadphonesIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help whenever you need it with our dedicated support team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens after the trial?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                After 14 days, you'll be prompted to choose a plan. No credit card is required for the trial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Absolutely. We use enterprise-grade encryption and comply with GDPR and SOC 2 standards.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
          <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to accelerate your growth?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of agencies using GrowthOS to streamline their operations and close more deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                Schedule Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
