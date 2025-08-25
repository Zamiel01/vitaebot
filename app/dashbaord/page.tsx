"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import {
  User,
  Plus,
  Trash2,
  FileText,
  ArrowLeft,
  File,
  BarChart2,
  Briefcase,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cvData, setCvData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [jobsData, setJobsData] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [isJobsLoading, setIsJobsLoading] = useState(true)
  const [jobCategories, setJobCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [salaryFilter, setSalaryFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(10)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/")
        return
      }

      setUser(user)
      setIsLoading(true)

      try {
        const userDocRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setCvData({
            id: docSnap.id,
            ...data,
            lastUpdated: data.lastUpdated || null,
          })
        }
      } catch (err) {
        console.error("Error loading CV:", err)
        toast.error("Failed to load your CV data.")
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchJobs(true)
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setIsJobsLoading(true)
      }

      const response = await fetch("https://remoteok.com/api")
      const data = await response.json()

      const processedJobs = data.map((job: any) => ({
        id: job.id,
        title: job.position || "Untitled Position",
        company: job.company || "Unknown Company",
        location: job.location || "Remote",
        salary: job.salary,
        tags: Array.isArray(job.tags) ? job.tags : [],
        date: job.date,
        url: job.url,
        description: job.description || "",
      }))

      setJobsData(processedJobs)
      setFilteredJobs(processedJobs)

      const categoryCounts: Record<string, number> = {}

      const categoryMappings: Record<string, string> = {
        developer: "Developer",
        dev: "Developer",
        engineer: "Engineer",
        engineering: "Engineer",
        programmer: "Developer",
        software: "Developer",
        frontend: "Frontend Dev",
        backend: "Backend Dev",
        fullstack: "Full Stack Dev",
        "full-stack": "Full Stack Dev",
        devops: "DevOps",
        data: "Data Science",
        ml: "Data Science",
        ai: "Data Science",
        designer: "Designer",
        design: "Designer",
        ux: "UX/UI Design",
        ui: "UX/UI Design",

        manager: "Management",
        management: "Management",
        director: "Management",
        lead: "Management",
        marketing: "Marketing",
        sales: "Sales",
        business: "Business Dev",
        finance: "Finance",
        accounting: "Finance",
        hr: "Human Resources",
        recruiter: "Human Resources",
        operations: "Operations",
        product: "Product",
        project: "Project Mgmt",

        content: "Content",
        writer: "Content",
        copywriter: "Content",
        support: "Customer Support",
        customer: "Customer Support",
        qa: "Quality Assurance",
        testing: "Quality Assurance",
        analyst: "Analytics",
        consultant: "Consulting",
        legal: "Legal",
        admin: "Administrative",
      }

      data.forEach((job: any) => {
        if (Array.isArray(job.tags)) {
          job.tags.forEach((tag: string) => {
            if (typeof tag === "string") {
              const lowerTag = tag.toLowerCase().trim()

              for (const [key, category] of Object.entries(categoryMappings)) {
                if (lowerTag.includes(key)) {
                  categoryCounts[category] = (categoryCounts[category] || 0) + 1
                  break
                }
              }
            }
          })
        }

        if (job.position && typeof job.position === "string") {
          const lowerTitle = job.position.toLowerCase()
          for (const [key, category] of Object.entries(categoryMappings)) {
            if (lowerTitle.includes(key)) {
              categoryCounts[category] = (categoryCounts[category] || 0) + 1
              break
            }
          }
        }
      })

      const sortedCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)

      setJobCategories(sortedCategories)

      if (isRefresh) {
        toast.success("Jobs data refreshed!")
      }
    } catch (err) {
      console.error("Error fetching jobs:", err)
      toast.error("Failed to load job data.")
    } finally {
      setIsJobsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    let filtered = jobsData

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.tags &&
            Array.isArray(job.tags) &&
            job.tags.some(
              (tag: string) => tag && typeof tag === "string" && tag.toLowerCase().includes(searchTerm.toLowerCase()),
            )),
      )
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter(
        (job) => job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (job) =>
          job.tags &&
          Array.isArray(job.tags) &&
          job.tags.some(
            (tag: string) => tag && typeof tag === "string" && tag.toLowerCase().includes(categoryFilter.toLowerCase()),
          ),
      )
    }

    if (salaryFilter !== "all") {
      if (salaryFilter === "with-salary") {
        filtered = filtered.filter((job) => job.salary)
      } else if (salaryFilter === "no-salary") {
        filtered = filtered.filter((job) => !job.salary)
      }
    }

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [searchTerm, locationFilter, categoryFilter, salaryFilter, jobsData])

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
      toast.error("Failed to logout. Please try again.")
    }
  }

  const handleDeleteCV = async () => {
    if (!user || !cvData) return

    if (!confirm("Are you sure you want to delete this CV? This cannot be undone.")) {
      return
    }

    try {
      const userDocRef = doc(db, "users", user.uid)
      await deleteDoc(userDocRef)
      setCvData(null)
      toast.success("CV deleted successfully!")
    } catch (err) {
      console.error("Delete error:", err)
      toast.error("Failed to delete CV. Please try again.")
    }
  }

  const handleContinueCV = () => {
    router.push("/build")
  }

  const handleCreateNewCV = () => {
    router.push("/option")
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    try {
      return format(new Date(dateString), "MMM dd, yyyy - h:mm a")
    } catch {
      return "Unknown date"
    }
  }

  const chartData =
    jobCategories.length > 0
      ? {
          labels: jobCategories.map((category) => category[0]),
          datasets: [
            {
              label: "Job Postings",
              data: jobCategories.map((category) => category[1]),
              backgroundColor: [
                "linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.7) 100%)",
                "linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.7) 100%)",
                "linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.7) 100%)",
                "linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.7) 100%)",
                "linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.7) 100%)",
                "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.7) 100%)",
              ].map((gradient, index) => {
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d")
                if (ctx) {
                  const chartGradient = ctx.createLinearGradient(0, 0, 0, 400)
                  const colors = [
                    ["rgba(236, 72, 153, 0.9)", "rgba(219, 39, 119, 0.3)"],
                    ["rgba(59, 130, 246, 0.9)", "rgba(37, 99, 235, 0.3)"],
                    ["rgba(16, 185, 129, 0.9)", "rgba(5, 150, 105, 0.3)"],
                    ["rgba(245, 158, 11, 0.9)", "rgba(217, 119, 6, 0.3)"],
                    ["rgba(139, 92, 246, 0.9)", "rgba(124, 58, 237, 0.3)"],
                    ["rgba(239, 68, 68, 0.9)", "rgba(220, 38, 38, 0.3)"],
                  ]
                  chartGradient.addColorStop(0, colors[index % colors.length][0])
                  chartGradient.addColorStop(1, colors[index % colors.length][1])
                  return chartGradient
                }
                return gradient
              }),
              borderColor: [
                "rgba(236, 72, 153, 1)",
                "rgba(59, 130, 246, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(139, 92, 246, 1)",
                "rgba(239, 68, 68, 1)",
              ],
              borderWidth: 3,
              borderRadius: 12,
              borderSkipped: false,
              hoverBackgroundColor: [
                "rgba(236, 72, 153, 1)",
                "rgba(59, 130, 246, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(139, 92, 246, 1)",
                "rgba(239, 68, 68, 1)",
              ],
              hoverBorderWidth: 4,
              hoverBorderRadius: 16,
            },
          ],
        }
      : { labels: [], datasets: [] }

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-white to-pink-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500 mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          ></motion.div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VitaeBot</h1>
                <p className="text-sm text-gray-500">Professional Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>

              <div className="relative" ref={dropdownRef}>
                <button
                  className="p-0 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center border-2 border-pink-300 shadow-md">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL || "/placeholder.svg"}
                        alt={user.displayName || "User"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-pink-700">
                        {user?.displayName ? (
                          user.displayName.charAt(0).toUpperCase()
                        ) : user?.email ? (
                          user.email.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </span>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-pink-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.displayName || "User"}</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                      <button
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 focus:outline-none transition-colors"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">CV Management</h2>
              <p className="text-sm text-gray-600">
                {cvData ? "Manage your existing CV or create a new one" : "Create your first CV to get started and win any job"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Button
                onClick={handleCreateNewCV}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New CV
              </Button>
            </motion.div>

            {cvData && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-pink-50">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {cvData.selectedTemplate === "james-watson" ? "Professional" : "Internship"} CV
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleDeleteCV}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-xs">
                      Last updated: {formatDate(cvData.lastUpdated)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-center h-24 bg-pink-100 rounded-lg mb-4">
                        <File className="w-10 h-10 text-pink-500" />
                      </div>
                      <p className="text-center text-gray-600 text-sm mb-4">
                        {cvData.selectedTemplate === "james-watson"
                          ? "Professional template for experienced applicants"
                          : "Internship template for students and fresh graduates"}
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white"
                        onClick={handleContinueCV}
                      >
                        Continue Editing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Total Jobs</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {jobsData.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Filtered Jobs</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {filteredJobs.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Categories</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {jobCategories.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl">Trending Remote Jobs</CardTitle>
                        <CardDescription className="text-sm">
                          Top job categories based on current RemoteOK listings
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchJobs(true)}
                      disabled={isRefreshing}
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isJobsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : jobCategories.length > 0 ? (
                    <div className="h-80 relative">
                      <Bar
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          interaction: {
                            mode: "index",
                            intersect: false,
                          },
                          animation: {
                            duration: 2000,
                            easing: "easeInOutQuart",
                            delay: (context) => context.dataIndex * 200,
                          },
                          hover: {
                            animationDuration: 300,
                          },
                          onHover: (event, elements) => {
                            const canvas = event.native?.target as HTMLCanvasElement
                            if (canvas) {
                              canvas.style.cursor = elements.length > 0 ? "pointer" : "default"
                            }
                          },
                          onClick: (event, elements) => {
                            if (elements.length > 0) {
                              const index = elements[0].index
                              const category = jobCategories[index][0]
                              setCategoryFilter(category.toLowerCase())
                              toast.success(`Filtered jobs by ${category}`)
                            }
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                            title: {
                              display: false,
                            },
                            tooltip: {
                              enabled: true,
                              backgroundColor: "rgba(0, 0, 0, 0.9)",
                              titleColor: "white",
                              bodyColor: "white",
                              borderColor: "rgba(255, 255, 255, 0.2)",
                              borderWidth: 1,
                              cornerRadius: 12,
                              displayColors: true,
                              padding: 12,
                              titleFont: {
                                size: 14,
                                weight: "bold",
                              },
                              bodyFont: {
                                size: 13,
                              },
                              callbacks: {
                                title: (context) => {
                                  return `${context[0].label} Jobs`
                                },
                                label: (context) => {
                                  const value = context.parsed.y
                                  const total = jobCategories.reduce((sum, cat) => sum + cat[1], 0)
                                  const percentage = ((value / total) * 100).toFixed(1)
                                  return [
                                    `Count: ${value} positions`,
                                    `Share: ${percentage}% of total`,
                                    `Click to filter jobs`,
                                  ]
                                },
                              },
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: "rgba(0, 0, 0, 0.05)",
                                drawBorder: false,
                              },
                              ticks: {
                                color: "rgba(0, 0, 0, 0.6)",
                                font: {
                                  size: 12,
                                  weight: "500",
                                },
                                padding: 8,
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: "rgba(0, 0, 0, 0.7)",
                                font: {
                                  size: 12,
                                  weight: "600",
                                },
                                padding: 8,
                                maxRotation: 45,
                              },
                            },
                          },
                        }}
                      />

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">Total Categories</div>
                        <div className="text-2xl font-bold text-gray-900">{jobCategories.length}</div>
                        <div className="text-xs text-gray-500 mt-1">Click bars to filter</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No job data available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-6 w-6 text-green-600" />
                      <div>
                        <CardTitle className="text-xl">Remote Job Openings</CardTitle>
                        <CardDescription className="text-sm">
                          Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length}{" "}
                          jobs
                          {filteredJobs.length !== jobsData.length && ` (filtered from ${jobsData.length} total)`}
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search jobs, companies, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="border-gray-200">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="worldwide">Worldwide</SelectItem>
                          <SelectItem value="usa">USA</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="border-gray-200">
                          <Filter className="h-4 w-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="engineer">Engineer</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={salaryFilter} onValueChange={setSalaryFilter}>
                        <SelectTrigger className="border-gray-200">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Salary" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Salaries</SelectItem>
                          <SelectItem value="with-salary">With Salary</SelectItem>
                          <SelectItem value="no-salary">No Salary Listed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {isJobsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : currentJobs.length > 0 ? (
                    <>
                      <div className="space-y-4 mb-6">
                        {currentJobs.map((job, index) => (
                          <motion.div
                            key={job.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 mb-1">{job.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {job.location || "Remote"}
                                </Badge>
                                {job.salary && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {job.salary}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.tags &&
                                job.tags.slice(0, 4).map((tag: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                    {tag}
                                  </Badge>
                                ))}
                              {job.tags && job.tags.length > 4 && (
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                                  +{job.tags.length - 4} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{job.date}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent"
                              >
                                <a href={job.url} target="_blank" rel="noopener noreferrer">
                                  View Job
                                </a>
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="border-gray-200 bg-transparent"
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Previous
                            </Button>

                            <div className="flex items-center gap-1">
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 5) {
                                  pageNum = i + 1
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i
                                } else {
                                  pageNum = currentPage - 2 + i
                                }

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-8 h-8 p-0 ${
                                      currentPage === pageNum
                                        ? "bg-pink-600 text-white border-pink-600"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    {pageNum}
                                  </Button>
                                )
                              })}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="border-gray-200 bg-transparent"
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>

                          <div className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No jobs match your filters</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 border-t border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">VitaeBot</span>
                <p className="text-xs text-gray-400">Professional CV Builder</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">© 2025 VitaeBot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
