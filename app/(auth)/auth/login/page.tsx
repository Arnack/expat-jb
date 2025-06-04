"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Check user role to redirect to appropriate dashboard
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileData) {
          if (profileData.role === "employer") {
            router.push("/employer/dashboard")
          } else {
            router.push("/jobseeker/dashboard")
          }
        } else {
          // If no profile exists yet, redirect to complete profile
          router.push("/auth/complete-profile")
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl grid md:grid-cols-2 overflow-hidden rounded-lg shadow-lg">
      {/* Left Column - Welcome Screen */}
      <div className="bg-primary p-8 text-primary-foreground flex flex-col justify-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="mb-6">Sign in to access your account and continue your job search journey.</p>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-primary text-xs">
                ✓
              </div>
              <span>Access to thousands of remote jobs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-primary text-xs">
                ✓
              </div>
              <span>One-click applications</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-primary text-xs">
                ✓
              </div>
              <span>Visa sponsorship opportunities</span>
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

      {/* Right Column - Login Form */}
      <div className="bg-background p-8 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Sign In</h2>
            <p className="text-sm text-muted-foreground">Enter your email and password to access your account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4 mt-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
