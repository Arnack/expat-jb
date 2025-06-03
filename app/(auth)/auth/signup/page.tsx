"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/types"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<UserRole>("job_seeker")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: data.user.id,
          full_name: fullName,
          role,
        })

        if (profileError) {
          throw profileError
        }

        // Create role-specific profile
        if (role === "job_seeker") {
          const { error: seekerError } = await supabase.from("job_seeker_profiles").insert({
            user_id: data.user.id,
          })

          if (seekerError) {
            throw seekerError
          }
        } else {
          const { error: employerError } = await supabase.from("employer_profiles").insert({
            user_id: data.user.id,
            company_name: "Your Company", // Default value, user will update later
          })

          if (employerError) {
            throw employerError
          }
        }

        // Redirect based on role
        if (role === "employer") {
          router.push("/employer/profile")
        } else {
          router.push("/jobseeker/profile")
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl grid md:grid-cols-2 overflow-hidden rounded-lg shadow-lg">
      {/* Left Column - Welcome Screen */}
      <div className="bg-primary p-8 text-primary-foreground flex flex-col justify-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">Join NomadJobs</h1>
          <p className="mb-6">
            Create an account to start your journey with the best job platform for digital nomads and expats.
          </p>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-primary text-xs">
                ✓
              </div>
              <span>Find remote jobs worldwide</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-primary text-xs">
                ✓
              </div>
              <span>Connect with global employers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-primary text-xs">
                ✓
              </div>
              <span>Discover visa sponsorship opportunities</span>
            </div>
          </div>
        </div>

        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full transform translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="grid grid-cols-8 grid-rows-8 gap-4 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-full border border-white/20 rounded-lg"
                style={{
                  opacity: Math.random() * 0.5 + 0.1,
                  transform: `rotate(${Math.random() * 30 - 15}deg)`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="bg-background p-8 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Create an Account</h2>
            <p className="text-sm text-muted-foreground">Enter your information to create your account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup
                defaultValue="job_seeker"
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="job_seeker" id="job_seeker" />
                  <Label htmlFor="job_seeker" className="cursor-pointer">
                    Job Seeker
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer" className="cursor-pointer">
                    Employer
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
