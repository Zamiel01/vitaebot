"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, GraduationCap, ArrowLeft, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export default function SelectMode() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        router.push("/") // Redirect to home if not logged in
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const handleSelectMode = (mode: string) => {
    setSelectedMode(mode)
  }

  const modes = [
    {
      name: "professional",
      title: "Professional Mode",
      description: "For experienced applicants who want full control and advanced customization options.",
      icon: <Briefcase className="w-10 h-10 text-pink-600" />,
      badge: "Advanced Control",
      disabled: false,
    },
    {
      name: "internship",
      title: "Internship Mode",
      description: "For students and fresh graduates. Focused on education, projects, and internships.",
      icon: <GraduationCap className="w-10 h-10 text-pink-600" />,
      badge: "Student Focused",
      disabled: true, // Mark as disabled
    },
  ]

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[1000]">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-pink-100">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">VitaeBot</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Custom Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="p-0 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="h-9 w-9 rounded-full bg-pink-100 flex items-center justify-center border border-pink-200">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-pink-700">
                      {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                    </span>
                  )}
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.displayName || "User"}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 focus:outline-none"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-pink-600"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Choose Your CV Mode
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Which Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-500">Describes You?</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Select the mode that matches your experience. Our AI will tailor your CV to highlight your strengths and fit your target role.
            </p>
          </motion.div>

          {/* Modes Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {modes.map((mode) => (
              <motion.div
                key={mode.name}
                whileHover={!mode.disabled ? { y: -5 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className={`border-2 ${
                    selectedMode === mode.name
                      ? "border-pink-500 shadow-xl"
                      : mode.disabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : "border-pink-100 hover:border-pink-200"
                  } transition-all duration-300 group ${
                    mode.disabled ? "opacity-60" : "cursor-pointer"
                  }`}
                  onClick={() => !mode.disabled && handleSelectMode(mode.name)}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      selectedMode === mode.name
                        ? "bg-pink-200"
                        : mode.disabled
                        ? "bg-gray-100"
                        : "bg-pink-100"
                    } group-hover:bg-pink-200 transition-colors`}>
                      {mode.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{mode.title}</h3>
                    <p className="text-gray-600 mb-6 min-h-[72px]">{mode.description}</p>
                    <div className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                      selectedMode === mode.name
                        ? "bg-pink-500 text-white"
                        : mode.disabled
                        ? "bg-gray-200 text-gray-500"
                        : "bg-pink-100 text-pink-700"
                    } transition-colors`}>
                      {mode.badge}
                    </div>
                    <Button
                      variant={selectedMode === mode.name ? "default" : "outline"}
                      className={`mt-6 w-full ${
                        selectedMode === mode.name
                          ? "bg-pink-600 hover:bg-pink-700 text-white"
                          : mode.disabled
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "text-pink-600 border-pink-200 hover:bg-pink-50"
                      }`}
                      disabled={mode.disabled}
                    >
                      {mode.disabled ? "Coming Soon" : selectedMode === mode.name ? "Selected" : "Choose This Mode"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Next Step Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: selectedMode ? 1 : 0, y: selectedMode ? 0 : 20 }}
            transition={{ duration: 0.4 }}
            className="mt-16"
          >
            {selectedMode && (
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  if (selectedMode === "professional") {
                    router.push("/build")
                  }
                }}
              >
                Continue to CV Builder
                <GraduationCap className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">VitaeBot</span>
            </div>
            <p className="text-gray-400 text-lg">© 2025 VitaeBot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
