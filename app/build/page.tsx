"use client"
import React, { useState, useRef, useCallback, useEffect } from "react"
import { CVForm } from "@/components/cv-form"
import { CVPreview } from "@/components/cv-preview"
import { TemplateSelector } from "@/components/template-selector"
import type { CVData, Template } from "@/types/cv"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas-pro"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { User, ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { toast } from "sonner"

const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    headline: "",
    profileImage: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  publications: [],
  volunteering: [],
  awards: [],
  interests: [],
}

export default function CVBuilder() {
  const router = useRouter()
  const [cvData, setCVData] = useState<CVData>(initialCVData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("james-watson")
  const [formWidth, setFormWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const resizeRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load saved CV data when user is authenticated
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
          const savedData = docSnap.data()
          setCVData(savedData.cvData || initialCVData)
          setSelectedTemplate(savedData.selectedTemplate || "james-watson")
        }
      } catch (err) {
        console.error("Error loading CV:", err)
        toast.error("Failed to load your saved CV.")
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  // Dropdown close on outside click
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

  // Save CV to Firestore
  const handleSaveCV = async () => {
    if (!user) {
      toast.error("You must be logged in to save your CV.")
      return
    }

    setIsSaving(true)
    try {
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, {
        cvData,
        selectedTemplate,
        lastUpdated: new Date().toISOString(),
      }, { merge: true })

      toast.success("CV saved successfully!", {
        description: "Your changes have been saved to the cloud.",
        duration: 3000,
      })
    } catch (err) {
      console.error("Save error:", err)
      toast.error("Failed to save CV.", {
        description: "Please check your connection and try again.",
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Delete CV from Firestore
  const handleDeleteCV = async () => {
    if (!user) {
      toast.error("You must be logged in to delete your CV.")
      return
    }

    if (!confirm("Are you sure you want to delete your saved CV? This cannot be undone.")) {
      return
    }

    try {
      const userDocRef = doc(db, "users", user.uid)
      await deleteDoc(userDocRef)

      // Reset to initial state
      setCVData(initialCVData)
      setSelectedTemplate("james-watson")

      toast.success("CV deleted successfully!", {
        description: "Your saved CV has been removed.",
        duration: 3000,
      })
    } catch (err) {
      console.error("Delete error:", err)
      toast.error("Failed to delete CV.", {
        description: "Please try again later.",
        duration: 5000,
      })
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = e.clientX
      if (newWidth >= 280 && newWidth <= 600) {
        setFormWidth(newWidth)
      }
    },
    [isResizing],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const downloadPDF = useCallback(() => {
    if (!previewRef.current) return
    const input = previewRef.current
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      pdf.save("cv.pdf")
    })
  }, [cvData, selectedTemplate])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-600">Loading your CV...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/95 backdrop-blur-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
          <p className="text-sm text-gray-600">Create your professional resume in minutes</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSaveCV}
            disabled={isSaving}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm disabled:opacity-70"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save CV"}
          </Button>
          <button
            onClick={downloadPDF}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md shadow-sm"
          >
            Download PDF
          </button>
          {/* Profile Dropdown */}
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
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center"
                  onClick={handleSaveCV}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2 text-purple-500" />
                  Save CV
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 focus:outline-none flex items-center"
                  onClick={handleDeleteCV}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete CV
                </button>
                <div className="border-t border-gray-100 my-1"></div>
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
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Forms */}
        <div
          className="border-r border-pink-100 bg-pink-50/30 overflow-y-auto relative"
          style={{ width: `${formWidth}px` }}
        >
          <CVForm cvData={cvData} setCVData={setCVData} formWidth={formWidth} />
          {/* Resize Handle */}
          <div
            ref={resizeRef}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-pink-300 transition-colors z-10"
            onMouseDown={handleMouseDown}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-0.5 h-8 bg-pink-400 opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto min-w-0">
          <div className="w-full max-w-none flex justify-center">
            <div
              ref={previewRef}
              className="w-[210mm] min-h-[297mm] bg-white shadow-xl"
            >
              <CVPreview cvData={cvData} template={selectedTemplate} />
            </div>
          </div>
        </div>

        {/* Right Panel - Templates */}
        <div className="w-80 border-l border-pink-100 bg-white overflow-y-auto">
          <TemplateSelector selectedTemplate={selectedTemplate} onTemplateSelect={setSelectedTemplate} />
        </div>
      </div>
    </div>
  )
}
