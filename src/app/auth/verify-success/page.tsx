import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified. You can now access all features of GrowthOS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rounded-lg bg-muted/50 p-4">
            <h4 className="font-semibold">What's next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Complete your profile setup</li>
              <li>• Import your first leads</li>
              <li>• Run a website audit</li>
              <li>• Create your first proposal</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/docs">
                Read Documentation
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
