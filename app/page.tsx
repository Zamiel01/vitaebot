"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  FileText,
  Zap,
  Target,
  Star,
  ArrowRight,
  Sparkles,
  Briefcase,
  GraduationCap,
  Eye,
  Download,
  Globe,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSignInWithEmailAndPassword, useSignInWithGoogle, useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth"
import { auth, googleProvider } from "@/lib/firebase"

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

export default function VitaeBotLanding() {
  const router = useRouter()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  // Firebase auth hooks
  const [signInWithEmailAndPassword, , , emailLoginError] = useSignInWithEmailAndPassword(auth)
  const [signInWithGoogle, googleLoginError] = useSignInWithGoogle(auth)
  const [createUserWithEmailAndPassword, , , emailSignupError] = useCreateUserWithEmailAndPassword(auth)

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Signup form
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  // Login with email/password
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(data.email, data.password)
      router.push("/dashbaord")
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  // Login with Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
      router.push("/dashbaord")
    } catch (err) {
      console.error("Google login error:", err)
    }
  }

  // Signup with email/password
  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      await createUserWithEmailAndPassword(data.email, data.password)
      router.push("/dashboard")
    } catch (err) {
      console.error("Signup error:", err)
    }
  }

  // Signup with Google
  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle()
      router.push("/dashbaord")
    } catch (err) {
      console.error("Google signup error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-pink-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VitaeBot</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-pink-600 transition-colors">
              Features
            </a>
            <a href="#templates" className="text-gray-600 hover:text-pink-600 transition-colors">
              Templates
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-pink-600 transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {/* Login Dialog */}
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-pink-600">
                  Login
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-gray-900">Welcome Back</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-3">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" {...registerLogin("email")} />
                      {loginErrors.email && <p className="text-sm text-red-500 mt-1">{loginErrors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter your password" {...registerLogin("password")} />
                      {loginErrors.password && <p className="text-sm text-red-500 mt-1">{loginErrors.password.message}</p>}
                    </div>
                    {emailLoginError && <p className="text-sm text-red-500 mt-1">{emailLoginError.message}</p>}
                    <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                      Sign In
                    </Button>
                  </form>
                  <div className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginOpen(false)
                        setIsSignupOpen(true)
                      }}
                      className="text-pink-600 hover:underline"
                    >
                      Signup
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Signup Dialog */}
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">Get Started Free</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-gray-900">Create Your Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Button
                    onClick={handleGoogleSignup}
                    className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-3">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter your full name" {...registerSignup("name")} />
                      {signupErrors.name && <p className="text-sm text-red-500 mt-1">{signupErrors.name.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" {...registerSignup("email")} />
                      {signupErrors.email && <p className="text-sm text-red-500 mt-1">{signupErrors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Create a password" {...registerSignup("password")} />
                      {signupErrors.password && <p className="text-sm text-red-500 mt-1">{signupErrors.password.message}</p>}
                    </div>
                    {emailSignupError && <p className="text-sm text-red-500 mt-1">{emailSignupError.message}</p>}
                    <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                      Create Account
                    </Button>
                  </form>
                  <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignupOpen(false)
                        setIsLoginOpen(true)
                      }}
                      className="text-pink-600 hover:underline"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered CV Builder
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Elevate Your Career with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-500">VitaeBot</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Craft a standout CV in minutes with our AI-powered resume builder. Transform your job applications with
              tailored CVs that get you noticed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setIsSignupOpen(true)}
              >
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pink-200 text-pink-700 hover:bg-pink-50 px-8 py-4 text-lg bg-transparent"
              >
                <Eye className="mr-2 w-5 h-5" />
                View Templates
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Join thousands of professionals who trust VitaeBot to showcase their skills
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose VitaeBot?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes creating professional CVs effortless and effective
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-pink-100 hover:border-pink-200 transition-colors group hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-200 transition-colors">
                  <Bot className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Writing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI analyzes your experience and crafts compelling content that highlights your strengths and fits
                  your target role perfectly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-100 hover:border-pink-200 transition-colors group hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-200 transition-colors">
                  <Eye className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h3>
                <p className="text-gray-600 leading-relaxed">
                  See your CV come to life in real-time as you build it. Every section updates instantly with your
                  chosen template style.
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-100 hover:border-pink-200 transition-colors group hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-200 transition-colors">
                  <Target className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Role Targeting</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tailor your CV for specific roles. Our AI optimizes content and keywords to match job requirements and
                  increase your chances.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Modes Section */}
          <div className="bg-pink-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Choose Your Perfect Mode</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-pink-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Easy Mode</h4>
                <p className="text-gray-600 mb-4">
                  Minimal fields with AI-guided writing. Perfect for quick CV creation with smart suggestions.
                </p>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  Beginner Friendly
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-pink-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Professional Mode</h4>
                <p className="text-gray-600 mb-4">
                  Full control with advanced customization options. Ideal for experienced professionals.
                </p>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  Advanced Control
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10 text-pink-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Internship Mode</h4>
                <p className="text-gray-600 mb-4">
                  Education and project-focused for students and recent graduates entering the workforce.
                </p>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  Student Focused
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Templates</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of ATS-friendly templates designed by professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Rachel Marsh",
                role: "Scrum Master",
                image: "/images/template-rachel.png",
                style: "Professional Blue",
                description: "Clean and structured design perfect for project management roles",
              },
              {
                name: "James Watson",
                role: "Customer Success Manager",
                image: "/images/template-james.png",
                style: "Executive Dark",
                description: "Sophisticated two-column layout ideal for senior positions",
              },
              {
                name: "Jeremy Torres",
                role: "Digital Marketing",
                image: "/images/template-jeremy.png",
                style: "Modern Minimal",
                description: "Contemporary design great for creative and marketing roles",
              },
              {
                name: "Steven Edward",
                role: "Training Instructor",
                image: "/images/template-steven.png",
                style: "Nature Green",
                description: "Fresh and approachable design perfect for education and training",
              },
            ].map((template, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-[3/4] bg-white p-4 relative">
                  <img
                    src={template.image || "/placeholder.svg"}
                    alt={`${template.name} CV Template`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white">Use Template</Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.style}</h3>
                  <p className="text-sm text-pink-600 mb-2">{template.role}</p>
                  <p className="text-gray-600 text-sm">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
              onClick={() => setIsSignupOpen(true)}
            >
              Browse All Templates
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Build Your CV in Simple Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our guided process makes CV creation effortless and ensures nothing important is missed
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                {[
                  {
                    icon: FileText,
                    title: "Personal Information",
                    desc: "Start with your basic details and contact information",
                  },
                  {
                    icon: Target,
                    title: "Professional Summary",
                    desc: "AI crafts a compelling summary tailored to your target role",
                  },
                  {
                    icon: Briefcase,
                    title: "Experience & Skills",
                    desc: "Add your work history, education, and key competencies",
                  },
                  {
                    icon: Download,
                    title: "Download & Apply",
                    desc: "Get your polished CV ready for job applications",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/hHtViznI-f0"
                    title="Resume Design Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Watch Tutorial
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Professionals</h2>
            <p className="text-xl text-gray-600">See what our users say about VitaeBot</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                content:
                  "VitaeBot helped me land my dream job! The AI suggestions were spot-on and saved me hours of writing.",
                avatar: "/images/avatar-sarah.png",
              },
              {
                name: "Michael Chen",
                role: "Software Developer",
                content:
                  "The live preview feature is amazing. I could see exactly how my CV would look while building it.",
                avatar: "/images/avatar-michael.png",
              },
              {
                name: "Emily Rodriguez",
                role: "Recent Graduate",
                content:
                  "As a new graduate, the Internship Mode was perfect. It highlighted my projects and education beautifully.",
                avatar: "/images/avatar-emily.png",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white border-pink-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-pink-400 text-pink-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-pink-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have elevated their careers with VitaeBot. Start building your standout
            CV today.
          </p>
          <Button
            size="lg"
            className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => setIsSignupOpen(true)}
          >
            Get Started for Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-pink-100 text-sm mt-4">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VitaeBot</span>
              </div>
              <p className="text-gray-400">AI-powered CV builder helping professionals create standout resumes.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-pink-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#templates" className="hover:text-pink-400 transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-pink-400 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-400 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 VitaeBot. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
