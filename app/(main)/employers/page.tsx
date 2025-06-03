import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Users, 
  Globe, 
  CheckCircle, 
  Target, 
  Clock, 
  Star,
  Building,
  Search,
  MessageSquare
} from "lucide-react"

export default function EmployersPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  For Employers
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Hire Global Talent for Your Remote Team
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Connect with the best digital nomads and remote professionals worldwide. Find qualified candidates who are ready to work from anywhere.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/signup?type=employer">
                    Post Your First Job <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-10" />
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-8">
                  <Card className="p-4 transform -rotate-3 hover:rotate-0 transition-transform">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">Software Engineer</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground">Remote • Full-time</div>
                      <div className="text-sm font-semibold mt-1">$80k - $120k</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 transform rotate-2 hover:rotate-0 transition-transform">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">Product Manager</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground">Remote • Contract</div>
                      <div className="text-sm font-semibold mt-1">$90k - $140k</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 transform rotate-1 hover:rotate-0 transition-transform">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">UX Designer</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground">Remote • Part-time</div>
                      <div className="text-sm font-semibold mt-1">$60k - $100k</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 transform -rotate-1 hover:rotate-0 transition-transform">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted/20 rounded-full flex items-center justify-center">
                          <Building className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">Marketing Lead</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground">Remote • Full-time</div>
                      <div className="text-sm font-semibold mt-1">$70k - $110k</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose NomadJobs?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Access a global talent pool of pre-vetted remote professionals ready to contribute from day one.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Global Talent Pool</CardTitle>
                <CardDescription>
                  Access thousands of qualified professionals from around the world, all experienced in remote work.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Our AI-powered matching system connects you with candidates who fit your specific requirements and company culture.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Fast Hiring</CardTitle>
                <CardDescription>
                  Reduce time-to-hire with streamlined application processes and pre-screened candidates.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-6">
                Benefits for Your Business
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Cost-Effective Hiring</h3>
                    <p className="text-muted-foreground text-sm">
                      Save on office space, equipment, and local salary premiums while accessing top talent.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">24/7 Coverage</h3>
                    <p className="text-muted-foreground text-sm">
                      Build teams across time zones for round-the-clock productivity and customer support.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Diverse Perspectives</h3>
                    <p className="text-muted-foreground text-sm">
                      Gain access to diverse cultural perspectives and innovative approaches to problem-solving.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Scalability</h3>
                    <p className="text-muted-foreground text-sm">
                      Easily scale your team up or down based on project needs without long-term commitments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-first">
              <div className="bg-background rounded-lg p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold">Join 500+ Companies</div>
                    <div className="text-sm text-muted-foreground">Already hiring remotely</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">10k+</div>
                    <div className="text-sm text-muted-foreground">Active Candidates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Hire Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">72h</div>
                    <div className="text-sm text-muted-foreground">Avg. Time to Hire</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.9</div>
                    <div className="text-sm text-muted-foreground">
                      <Star className="inline w-3 h-3 fill-current" /> Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start for free and only pay when you need premium features. No subscriptions, no hidden fees.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl items-start gap-8 lg:grid-cols-2">
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Free Posts
                  <Badge variant="secondary">Free</Badge>
                </CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold">€0<span className="text-sm font-normal">/post</span></div>
                <p className="text-sm text-muted-foreground">Up to 3 posts per account</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>30-day job posting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Unlimited applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Basic job visibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Standard support</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 mt-0.5 flex-shrink-0" />
                    <span>No post editing after publish</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 mt-0.5 flex-shrink-0" />
                    <span>Standard search ranking</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/auth/signup?type=employer">
                    Start Free
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge>Recommended</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Premium Posts
                  <Badge variant="default">€4.88</Badge>
                </CardTitle>
                <CardDescription>Enhanced visibility and features</CardDescription>
                <div className="text-3xl font-bold">€4.88<span className="text-sm font-normal">/post</span></div>
                <p className="text-sm text-muted-foreground">Pay per post, unlimited posts</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>60-day job posting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Unlimited applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span><strong>Edit posts anytime</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span><strong>Priority search ranking</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span><strong>Show your contact details</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Enhanced job visibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/auth/signup?type=employer">
                    Post Premium Job
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-4 py-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>No monthly fees • No long-term contracts • Only pay for what you use</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Build Your Remote Team?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start posting jobs today and connect with top remote talent from around the world.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/auth/signup?type=employer">
                  Post Your First Job Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 